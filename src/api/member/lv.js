import { request } from "@/router/axios";

// 普通会员
export const getMemberGradeList = (data) => {
  return request({
    url: "/member/memberGrade/list",
    method: "post",
    data,
  });
};
export const addMemberGrade = (data) => {
  return request({
    url: "/member/memberGrade/add",
    method: "post",
    data,
  });
};
export const updateMemberGrade = (data) => {
  return request({
    url: "/member/memberGrade/update",
    method: "post",
    data,
  });
};
export const deleteMemberGrade = (data) => {
  return request({
    url: "/member/memberGrade/delete",
    method: "post",
    data,
  });
};
export const getMemberGradeDetail = (params) => {
  return request({
    url: "/member/memberGrade/detail",
    method: "get",
    params,
  });
};
// 推广会员
export const getPromotionGradeList = (data) => {
  return request({
    url: "/member/promotionGrade/list",
    method: "post",
    data,
  });
};
export const addPromotionGrade = (data) => {
  return request({
    url: "/member/promotionGrade/add",
    method: "post",
    data,
  });
};
export const updatePromotionGrade = (data) => {
  return request({
    url: "/member/promotionGrade/update",
    method: "post",
    data,
  });
};
export const deletePromotionGrade = (data) => {
  return request({
    url: "/member/promotionGrade/delete",
    method: "post",
    data,
  });
};
export const getPromotionGradeDetail = (params) => {
  return request({
    url: "/member/promotionGrade/detail",
    method: "get",
    params,
  });
};
