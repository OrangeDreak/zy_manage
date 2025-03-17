import { request } from "@/router/axios";

// // 获取国家列表

// 当前会话
export const myDialogueListApi = (data) => {
  return request({
    url: "/staff/myDialogueList",
    method: "post",
    data,
  });
};

// 客户信息
export const getCustomerInfoApi = (params) => {
  return request({
    url: "/staff/customerInfo",
    method: "get",
    params,
  });
};

// 发起会话
export const staffOpenApi = (data) => {
  return request({
    url: "/staff/open",
    method: "post",
    data,
  });
};

// 结束会话
export const staffCloseApi = (data) => {
  return request({
    url: "/staff/close",
    method: "post",
    data,
  });
};

// 当前聊天记录
export const nowMessageListApi = (data) => {
  return request({
    url: "/staff/nowMessageList",
    method: "post",
    data,
  });
};

// openIM登陆接口
export const openIMLoginApi = (data) => {
  return request({
    url: "/staff/login",
    method: "post",
    data,
  });
};

// 未读留言数
export const getUnreadMsgNum = (params) => {
  return request({
    url: "/suborder/message/getMessageUnReadNum",
    method: "get",
    params,
  });
};

// 留言列表
export const getMessageList = (data) => {
  return request({
    url: "/suborder/message/pageList",
    method: "post",
    data,
  });
};
