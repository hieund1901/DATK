import axiosClient from "./axios.client";

function getApiHistory(data: {}) {
  const response = axiosClient.get(`admin/api/history`, { params: data });
  return response;
}

function getHistoryDetail(id: string) {
  const response = axiosClient.get(`admin/api/history/${id}`);
  return response;
}
function getApiList() {
  const response = axiosClient.get(`api?isPaging=false`);
  return response;
}

export { getApiHistory, getHistoryDetail, getApiList };
