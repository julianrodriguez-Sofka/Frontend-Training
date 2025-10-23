import api from "../api/axiosConfig";

export const getAccountById = async (accountId) => {
  const response = await api.get(`/accounts/${accountId}`);
  return response.data;
};

export const depositMoney = async (data) => {
  const response = await api.put("/accounts/deposit", data);
  return response.data;
};

export const withdrawMoney = async (data) => {
  const response = await api.put("/accounts/withdraw", data);
  return response.data;
};


