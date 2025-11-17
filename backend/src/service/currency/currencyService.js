import db from '../../config/db.js';

export const findAll = async () => {
  return await db('currency').select('*');
};

export const findById = async (id) => {
  return await db('currency').where({ id }).first();
};
