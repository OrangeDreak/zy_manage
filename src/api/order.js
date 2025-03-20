import request from '@/utils/request'

// 搜索列表
export const getForwardingList = (data) => {
  return request({
    url: "/admin/tp/order",
    method: "post",
    data,
  });
};

