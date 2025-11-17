/**
 * Generate custom client ID based on business entity
 * Format: PREFIX-YYYYMMDD-RANDOM
 * @param {string} businessEntity - Type of business entity
 * @returns {string} Generated client ID
 */
export const generateClientId = (businessEntity) => {
  const prefixMap = {
    individual: 'IND',
    company: 'COM',
    partnership: 'PAR',
    llp: 'LLP'
  };

  const prefix = prefixMap[businessEntity] || 'CLI';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${prefix}-${date}-${random}`;
};
