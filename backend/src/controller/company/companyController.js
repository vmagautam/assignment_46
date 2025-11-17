import { createCompanyWithGST, getAllCompanies, getCompanyById, updateCompanyById, deleteCompanyById } from "../../service/company/companyService.js";

export const createCompany = async (req, res) => {
  try {
    const { client, gst_details } = req.body;

    if (!client?.business_entity || !client?.business_name || !client?.contact_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await createCompanyWithGST(client, gst_details);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json({ success: true, data: "New client saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await getCompanyById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { client, gst_details } = req.body;
    const result = await updateCompanyById(id, client, gst_details);
    if (!result) {
      return res.status(404).json({ error: 'Company not found' });
    }
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCompany = await deleteCompanyById(id);
    if (!deletedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getAllCompanies(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};