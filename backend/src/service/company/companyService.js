import db from "../../config/db.js";
// import { generateClientId } from "../../utils/clientIdGenerator.js";

const ENTITY_ENUM_MAP = {
  'Proprietorship': 'individual',
  'Partnership Firm': 'partnership',
  'LLP (Limited Liability Partnership)': 'llp',
  'Private Limited Company': 'company',
  'Public Limited Company': 'company',
  'One Person Company (OPC)': 'company'
};

export const createCompanyWithGST = async (clientData, gstDetails) => {
  // Check for duplicate GSTIN
  if (gstDetails?.length) {
    const gstins = gstDetails.map(g => g.gstin).filter(Boolean);
    if (gstins.length) {
      const existing = await db('client_gst_details').whereIn('gstin', gstins).first();
      if (existing) {
        return { error: `GSTIN ${existing.gstin} already exists` };
      }
    }
  }

  const businessEntity = await db('business_entity').where('id', clientData.business_entity).first();
  const mappedEntity = ENTITY_ENUM_MAP[businessEntity?.name];
  if (!mappedEntity) {
    return { error: `Invalid business entity: ${businessEntity?.name}` };
  }

  const trx = await db.transaction();
  try {
    const currency = await trx('currency').where('id', clientData.currency).first();

    const normalizedClient = {
      ...clientData,
      business_entity: mappedEntity,
      currency: currency?.code || 'INR'
    };

    const client_id = clientData.client_id;

    const [result] = await trx('company').insert({
      ...normalizedClient,
    }).returning('id');
    
    const companyId = result.id;

    if (gstDetails?.length) {
      const gstRecords = await Promise.all(gstDetails.map(async (gst) => {
        const gstState = await trx('states').where('id', gst.state).first();
        return {
          ...gst,
          state: gstState?.name,
          company_id: companyId,
          client_id: client_id
        };
      }));
      await trx('client_gst_details').insert(gstRecords);
    }

    const company = await trx('company').where('id', companyId).first();
    const gstData = await trx('client_gst_details').where('company_id', companyId);

    await trx.commit();
    return { client: company, gst_details: gstData };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

export const getAllCompanies = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const [companies, totalCount] = await Promise.all([
    db('company').where('is_active', true).limit(limit).offset(offset).select('*'),
    db('company').where('is_active', true).count('* as count').first()
  ]);
  
  const enrichedCompanies = await Promise.all(
    companies.map(async (company) => {
      const gstDetail = await db('client_gst_details')
        .where('company_id', company.id)
        .first();
      return {
        ...company,
        gstin: gstDetail?.gstin || null,
        state: gstDetail?.state || null
      };
    })
  );
  
  return {
    data: enrichedCompanies,
    pagination: {
      page,
      limit,
      total: parseInt(totalCount.count),
      totalPages: Math.ceil(totalCount.count / limit)
    }
  };
};

export const getCompanyById = async (id) => {
  const company = await db('company').where({ id, is_active: true }).first();
  if (!company) return null;
  
  const gstDetails = await db('client_gst_details').where('company_id', id);
  
  // Get business entity ID from name
  const businessEntity = await db('business_entity')
    .whereRaw('LOWER(name) LIKE ?', [`%${company.business_entity}%`])
    .first();
  
  // Get currency ID from code
  const currency = await db('currency').where('code', company.currency).first();
  
  // Enrich client data with IDs
  const enrichedClient = {
    ...company,
    business_entity_id: businessEntity?.id,
    currency_id: currency?.id
  };
  
  // Enrich GST details with state IDs
  const enrichedGstDetails = await Promise.all(
    gstDetails.map(async (gst) => {
      const state = await db('states').where('name', gst.state).first();
      return {
        ...gst,
        state_id: state?.id
      };
    })
  );
  
  return { client: enrichedClient, gst_details: enrichedGstDetails };
};

export const updateCompanyById = async (id, clientData, gstDetails) => {
  const company = await db('company').where({ id, is_active: true }).first();
  if (!company) return null;

  const trx = await db.transaction();
  try {
    const businessEntity = await trx('business_entity').where('id', clientData.business_entity).first();
    const mappedEntity = ENTITY_ENUM_MAP[businessEntity?.name];
    if (!mappedEntity) {
      await trx.rollback();
      return { error: `Invalid business entity: ${businessEntity?.name}` };
    }

    const currency = await trx('currency').where('id', clientData.currency).first();

    const normalizedClient = {
      ...clientData,
      business_entity: mappedEntity,
      currency: currency?.code || clientData.currency
    };

    await trx('company').where('id', id).update(normalizedClient);
    
    if (gstDetails?.length) {
      await trx('client_gst_details').where('company_id', id).del();
      const gstRecords = await Promise.all(gstDetails.map(async (gst) => {
        const gstState = await trx('states').where('id', gst.state).first();
        return {
          ...gst,
          state: gstState?.name || gst.state,
          company_id: id,
          client_id: normalizedClient.client_id
        };
      }));
      await trx('client_gst_details').insert(gstRecords);
    }
    
    await trx.commit();
    const updatedCompany = await db('company').where('id', id).first();
    const gstData = await db('client_gst_details').where('company_id', id);
    return { client: updatedCompany, gst_details: gstData };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

export const deleteCompanyById = async (id) => {
  const company = await db('company').where({ id, is_active: true }).first();
  if (!company) return null;

  await db('company').where('id', id).update({ is_active: false });
  return company;
};
