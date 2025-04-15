import request from '@/utils/request'

export const listTicket = (data) => {
  return request({
    url: "/admin/ticket/list",
    method: "post",
    data,
  });
}

export const completedTicket = (data) => {
  return request({
    url: "/admin/ticket/completed",
    method: "post",
    data,
  });
}

export const replyTicket = (data) => {
  return request({
    url: "/admin/ticket/reply",
    method: "post",
    data,
  });
}

export const getRecords = (id) => {
  return request({
    url: "/admin/ticket/records?ticketId=" + id,
    method: "get",
  });
}