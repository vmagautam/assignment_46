import * as statesService from '../../service/states/statesService.js';

export const findAll = async (req, res) => {
  try {
    const states = await statesService.findAll();
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findById = async (req, res) => {
  try {
    const state = await statesService.findById(req.params.id);
    if (!state) {
      return res.status(404).json({ error: 'State not found' });
    }
    res.json(state);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
