import axios, { AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || (import.meta as any).env?.VITE_TOKEN;
  if (token) {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` } as any;
  }
  return config;
});

export const getAdhoc = async (query: string, size: number = 2000): Promise<any> => {
  const body = { type: "TIDB", definition: query };
  const res: AxiosResponse = await instance.post(
    `/pi-cohorts-service-dbaas/v1.0/cohorts/adhoc?size=${size}`,
    body
  );
  return res.data;
};

export const getInstance = async (schemaId: string, filter: any = {}): Promise<any> => {
  const body = { dbType: "TIDB", filter };
  const res: AxiosResponse = await instance.post(
    `/pi-entity-instances-service/v2.0/schemas/${schemaId}/instances/list?size=1000`,
    body
  );
  return res.data;
};

export const getJoinInstance = async (schemaId: string, filter: any = {}): Promise<any> => {
  const body = { dbType: "TIDB", filter };
  const res: AxiosResponse = await instance.post(
    `/pi-entity-instances-service/v2.0/schemas/${schemaId}/instances/list?showDBaaSReservedKeywords=true&showReferencedData=true&showPageableMetaData=true&size=3000`,
    body
  );
  return res.data;
};
