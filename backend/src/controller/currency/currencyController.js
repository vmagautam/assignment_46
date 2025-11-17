import * as currencyService from '../../service/currency/currencyService.js';

export const findAll = async (req, res) => {
  try {
    const currencies = await currencyService.findAll();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findById = async (req, res) => {
  try {
    const currency = await currencyService.findById(req.params.id);
    if (!currency) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    res.json(currency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
