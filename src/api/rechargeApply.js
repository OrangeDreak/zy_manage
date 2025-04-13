import request from '@/utils/request'

// 余额充值申请列表
export const applyList = (data) => {
  return request({
    url: "/admin/balance/apply/list",
    method: "post",
    data,
  });
};

//  创建余额充值申请
export const saveApply = (data) => {
  return request({
    url: "/admin/balance/apply/save",
    method: "post",
    data,
  });
};
//  余额充值审核
export const balanceApply = (data) => {
  return request({
    url: "/admin/balance/apply/apply",
    method: "post",
    data,
  });
};


