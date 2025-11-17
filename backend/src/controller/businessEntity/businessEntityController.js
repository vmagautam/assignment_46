import * as businessEntityService from '../../service/businessEntity/businessEntityService.js';

export const findAll = async (req, res) => {
  try {
    const entities = await businessEntityService.findAll();
    res.json(entities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findById = async (req, res) => {
  try {
    const entity = await businessEntityService.findById(req.params.id);
    if (!entity) {
      return res.status(404).json({ error: 'Business entity not found' });
    }
    res.json(entity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
