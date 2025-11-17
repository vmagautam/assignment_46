import currencyData from '../../data/currency.json' assert { type: 'json' };

export const seed = async function(knex) {
  for (const currency of currencyData) {
    await knex('currency')
      .insert(currency)
      .onConflict('id')
      .merge();
  }
};
