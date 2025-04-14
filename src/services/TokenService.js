import axios from 'axios';
import CryptoJS from 'crypto-js';

const getHmacSignature = (timestamp, secret) => {
  return CryptoJS.HmacSHA256(timestamp, secret).toString(CryptoJS.enc.Hex);
};

export const getToken = async () => {
  const timestamp = Date.now().toString();
  const secret = process.env.REACT_APP_API_ID;
  const signature = getHmacSignature(timestamp, secret);

  try {
    const response = await axios.post(`${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}/get-token`, {
      timestamp,
    }, {
      headers: {
        'X-Signature': signature,
      }
    });

    const token = response.data.token;
    localStorage.setItem('apiToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return token;
  } catch (error) {
    console.error("Token fetch failed", error);
    throw error;
  }
};
