import businessEntityData from '../../data/businessEntity.json' assert { type: 'json' };

export const seed = async function(knex) {
  for (const entity of businessEntityData) {
    await knex('business_entity')
      .insert(entity)
      .onConflict('id')
      .merge();
  }
};
