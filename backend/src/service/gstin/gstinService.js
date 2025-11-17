import axios from 'axios';

const MASTERGST_BASE_URL = process.env.MASTERGST_BASE_URL || 'https://api.mastergst.com';
const MASTERGST_EMAIL = process.env.MASTERGST_EMAIL;
const MASTERGST_CLIENT_ID = process.env.MASTERGST_CLIENT_ID;
const MASTERGST_CLIENT_SECRET = process.env.MASTERGST_CLIENT_SECRET;

export const verifyGSTIN = async (gstin) => {
  try {
    const response = await axios.get(`${MASTERGST_BASE_URL}/public/search`, {
      params: { 
        email: MASTERGST_EMAIL,
        gstin 
      },
      headers: {
        'client_id': MASTERGST_CLIENT_ID,
        'client_secret': MASTERGST_CLIENT_SECRET
      },
      timeout: 10000
    });

    if (response.data && response.data.status_cd === '1') {
      return {
        success: true,
        data: response.data.data
      };
    }

    return { 
      success: false, 
      error: response.data?.error?.message || 'GSTIN not found or invalid' 
    };
  } catch (error) {
    console.error('GSTIN verification error:', error.message);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      return { 
        success: false, 
        error: 'GST verification service is currently unavailable' 
      };
    }
    
    return { 
      success: false, 
      error: error.response?.data?.error?.message || 'Failed to verify GSTIN' 
    };
  }
};
