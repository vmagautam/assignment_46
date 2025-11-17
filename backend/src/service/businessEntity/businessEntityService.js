import db from '../../config/db.js';

export const findAll = async () => {
  return await db('business_entity').select('*');
};

export const findById = async (id) => {
  return await db('business_entity').where({ id }).first();
};
