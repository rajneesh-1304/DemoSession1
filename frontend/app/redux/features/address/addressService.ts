import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const addAddress =  async (data: any) => {
  try {
    const url = `${BASE_URL}/address`
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error("Error in adding address", error);
    throw error;
  }
}

export const getAddress =  async (userData: any) => {
  try {
    const id=userData;
    const url = `${BASE_URL}/address?sellerId=${id}`
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Error in getting address:", error);
    throw error;
  }
}

export const getAllAddress =  async () => {
  try {
    const url = `${BASE_URL}/address`
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Error in getting address:", error);
    throw error;
  }
}
