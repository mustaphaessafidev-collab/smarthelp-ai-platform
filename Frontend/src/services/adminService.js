import api from "./api";

export const getUsersOnly = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};
export const getAgentOnly=async()=>{
  const res =await api.get("/admin/agent");
  return res.data;
}
export const AddAgent=async(data)=>{
  const res =await api.post("/admin/agent",data);
  return res.data;
}
