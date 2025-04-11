import axios from 'axios';

export const getToken = async () => {
  const apiId = process.env.REACT_APP_API_ID;
  const apiKey = process.env.REACT_APP_API_KEY;

  console.log('apiId:', apiId);  // ✅ should show correct values
  console.log('apiKey:', apiKey);

  try {
    const res = await axios.post(`${process.env.REACT_APP_ATTENDANCE_TRACKER_API_URL}/get-token`, {
      apiId: apiId,
      apiKey: apiKey
    });

    const token = res.data.token;

    if (token) {
      localStorage.setItem('apiToken', token);
       if (token) {
              axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
            } else {
              delete axios.defaults.headers.common["Authorization"]
            }
    }

    return token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
};

export const fetchSecureData = async () => {
  const token = localStorage.getItem('apiToken');

  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/secure-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error('Error fetching secure data:', error);
    throw error;
  }
};
