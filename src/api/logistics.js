import request from '@/utils/request'

// 搜索列表
export const getList = (data) => {
  return request({
    url: "/admin/logisticsLine/list",
    method: "post",
    data,
  });
};
// 查询外部物流干线列表
export const getLineCodeList = () => {
  return request({
    url: "/admin/logisticsLine/getLineCodeList",
    method: "get",
  });
};
// 查看详情
export const detail = (params) => {
  return request({
    url: "/admin/logisticsLine/detail",
    method: "get",
    params,
  });
};
// 新增/编辑
export const save = (data) => {
  return request({
    url: "/admin/logisticsLine/save",
    method: "post",
    data,
  });
};
// 绑定外部干线
export const bindOutLine = (data) => {
  return request({
    url: "/admin/logisticsLine/bindOutLine",
    method: "post",
    data,
  });
};
// 修改物流状态
export const updateStatus = (data) => {
  return request({
    url: "/admin/logisticsLine/updateStatus",
    method: "post",
    data,
  });
};
// 删除
export const remove = (data) => {
  return request({
    url: "/admin/logisticsLine/delete",
    method: "post",
    data,
  });
};
// 物流干线运费测算
export const calculate = (data) => {
  return request({
    url: "/admin/logisticsCostLine/calculate",
    method: "post",
    data,
  });
};

// 查询物流干线费用详情
export const getLogisticsCost = (params) => {
  return request({
    url: "/admin/logisticsCostLine/detail",
    method: "get",
    params,
  });
};
// 保存物流干线费用
export const saveLogisticsCost = (data) => {
  return request({
    url: "/admin/logisticsCostLine/save",
    method: "post",
    data,
  });
};
// 查询地址库
export const getAreaLibrary = (params) => {
  return request({
    url: "/admin/areaLibrary/listAll",
    method: "get",
    params,
  });
};
// 查询行政区地址
export const getRegion = (params) => {
  return request({
    url: "/admin/region/listAll",
    method: "get",
    params,
  });
};
// 查询物流干线绑定的地区
export const getListArea = (params) => {
  return request({
    url: "/admin/logisticsCostLine/listArea",
    method: "get",
    params,
  });
};
// 查询商品类型标签树
export const getProductTypeLabel = (params) => {
  return request({
    url: "/admin/productTypeLabel/listAll",
    method: "get",
    params,
  });
};
// 查询商品类型标签树
export const delLogisticsCostItem = (params) => {
  return request({
    url: "/admin/logisticsCostLine/delCost",
    method: "get",
    params,
  });
};
