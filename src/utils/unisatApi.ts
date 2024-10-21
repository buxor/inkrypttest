import axios from 'axios';

const API_BASE_URL = 'https://open-api.unisat.io/v1';
const API_KEY = '1e99b7f91b8f082ece273c187a1784519f90c3ad554cc4c4b9c4bbd1b30d7485';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const createInscriptionOrder = async (content: string, contentType: string, receiveAddress: string) => {
  try {
    const response = await axiosInstance.post('/inscribe/create', {
      content,
      contentType,
      receiveAddress,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating inscription order:', error);
    throw error;
  }
};

export const getOrderStatus = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(`/inscribe/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting order status:', error);
    throw error;
  }
};

export const refundOrder = async (orderId: string) => {
  try {
    const response = await axiosInstance.post('/inscribe/refund', { orderId });
    return response.data;
  } catch (error) {
    console.error('Error refunding order:', error);
    throw error;
  }
};