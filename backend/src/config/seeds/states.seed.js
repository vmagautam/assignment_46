import statesData from '../../data/states.json' assert { type: 'json' };

export const seed = async function(knex) {
  const indianStates = statesData
    .filter(state => state.country_id === 101)
    .map(state => ({
      id: state.id,
      name: state.state_name
    }));
  
  for (const state of indianStates) {
    await knex('states')
      .insert(state)
      .onConflict('id')
      .merge();
  }
};
