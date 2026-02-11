import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const addDish =  async (data: any) => {
  try {
    const url = `${BASE_URL}/dishes/adddish`
    const res = await axios.post(url, data);
    console.log(data)
    return res.data;
  } catch (error) {
    console.error("Error in adding dish:", error);
    throw error;
  }
}

export const fetchDishes = async ({page, limit, sellerId}: any)=>{
  try {
    const res = await axios.get(`${BASE_URL}/dishes`, {
      params: {
        page,
        limit,
        sellerId
      },
    })
    return res.data;
  } catch (err: any) {
    console.error('Error fetching dishes:', err);
    throw err?.response?.data || err.message;
  }
}

export const fetchDishUser = async ({page, limit, sellerId, searchValue}: any)=>{
  try {
    const res = await axios.get(`${BASE_URL}/dishes/getAll`, {
      params: {
        page,
        limit,
        sellerId,
        searchValue
      },
    })
    return res.data;
  } catch (err: any) {
    console.error('Error fetching dishes:', err);
    throw err?.response?.data || err.message;
  }
}


export const banDish = async (productId: number) => {
  const res = await axios.patch(`${BASE_URL}/dishes/ban/${productId}`);
  return res.data;
};

export const unbanDish = async (productId: number) => {
  const res = await axios.patch(`${BASE_URL}/dishes/unban/${productId}`);
  return res.data;
};

export const updateDish = async(id: any, updateData: any) => {
  console.log(id, updateData)
  const res = await axios.patch(`${BASE_URL}/dishes/update/${id}`, updateData);
  return res.data;
}