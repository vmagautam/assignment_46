import db from '../../config/db.js';

export const findAll = async () => {
  return await db('states').select('*');
};

export const findById = async (id) => {
  return await db('states').where({ id }).first();
};
