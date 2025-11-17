import { verifyGSTIN } from '../../service/gstin/gstinService.js';

export const verifyGstin = async (req, res) => {
  try {
    const { gstin } = req.body;

    if (!gstin) {
      return res.status(400).json({ error: 'GSTIN is required' });
    }

    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstin)) {
      return res.status(400).json({ error: 'Invalid GSTIN format' });
    }

    const result = await verifyGSTIN(gstin);

    if (result.success) {
      return res.json(result);
    }

    return res.status(404).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
