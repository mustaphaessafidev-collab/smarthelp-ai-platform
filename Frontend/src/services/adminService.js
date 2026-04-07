import api from "./api";


export const getUsersOnly = async () => {
  const res = await api.get("/agents/users");
  return res.data;
};

// Agents
export const getAgentOnly = async () => {
  const res = await api.get("/agents/agent");
  return res.data;
};

export const AddAgent = async (data) => {
  const res = await api.post("/agents/agent", data);
  return res.data;
};

export const deleteAgent = async (id) => {
  const res = await api.delete(`/agents/agent/${id}`);
  return res.data;
};

export const updateAgent = async (id, data) => {
  const res = await api.put(`/agents/agents/${id}`, data);
  return res.data;
};