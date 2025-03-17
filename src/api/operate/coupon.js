import { request } from "@/router/axios";

// 获取国家列表
export const getCountry = (params) => {
  return request({
    url: "/backstage/areaLibrary/listByLevel?areaLevel=1",
    method: "get",
    params,
  });
};

// 单列表详情
export const getDetailApi = (params) => {
  return request({
    url: "/coupon/detail",
    method: "get",
    params,
  });
};

// 列表数据
export const listData = (data) => {
  return request({
    url: "/coupon/list",
    method: "post",
    data,
  });
};

// 添加优惠券
export const addCouponApi = (data) => {
  return request({
    url: "/coupon/add",
    method: "post",
    data,
  });
};
// 编辑优惠券
export const editCouponApi = (data) => {
  return request({
    url: "/coupon/update",
    method: "post",
    data,
  });
};

// 更新优惠券
export const updateCouponApi = (data) => {
  return request({
    url: "/coupon/update",
    method: "post",
    data,
  });
};

// 语言配置列表
export const couponLanguageListApi = (data) => {
  return request({
    url: "/couponLanguage/list",
    method: "post",
    data,
  });
};
// 添加语言配置
export const couponLanguageAddApi = (data) => {
  return request({
    url: "/couponLanguage/add",
    method: "post",
    data,
  });
};

// 更新语言配列
export const couponLanguageUpdateApi = (data) => {
  return request({
    url: "/couponLanguage/update",
    method: "post",
    data,
  });
};

// 删除
export const couponLanguageDeleteApi = (data) => {
  return request({
    url: "/couponLanguage/delete",
    method: "post",
    data,
  });
};

// 详情
export const couponLanguageDetailApi = (params) => {
  return request({
    url: "/couponLanguage/detail",
    method: "get",
    params,
  });
};

// 修改状态
export const changeStatusApi = (data) => {
  return request({
    url: "/coupon/changeStatus",
    method: "post",
    data,
  });
};
