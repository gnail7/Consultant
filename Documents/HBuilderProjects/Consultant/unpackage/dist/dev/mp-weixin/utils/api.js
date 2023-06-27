"use strict";
const utils_request = require("./request.js");
const addChatInfo = (obj) => {
  return utils_request.request({
    url: "/user/addChatInfo",
    method: "POST",
    data: obj
  });
};
const updateConsultant = (obj) => {
  return utils_request.request({
    url: "/consultant/updateConsultant",
    data: obj
  });
};
const getFansUser = (obj) => {
  return utils_request.request({
    url: "/consultant/getFansUser",
    method: "POST",
    data: obj
  });
};
const getAllConsultants = () => {
  return utils_request.request({
    url: "/consultant/getAllConsultants"
  });
};
const addSucideHotline = (obj) => {
  return utils_request.request({
    url: "/consultant/addSuicideHotline",
    data: obj
  });
};
const replayLetter = (obj) => {
  return utils_request.request({
    url: "/user/replyLetter",
    data: obj
  });
};
const getUserLetterList = (obj) => {
  return utils_request.request({
    url: "/consultant/getAllLetters",
    data: obj
  });
};
const getGoodLetters = () => {
  return utils_request.request({
    url: "/consultant/getGoodLetters"
  });
};
const updateLetter = (obj) => {
  return utils_request.request({
    url: "/consultant/updateLetter",
    data: obj
  });
};
const getUserList = (obj) => {
  return utils_request.request({
    url: "/consultant/getUserList",
    data: obj
  });
};
const getSucideHotlines = () => {
  return utils_request.request({
    url: "/consultant/getSuicideHotlines"
  });
};
const suscribeApi = (params) => {
  return utils_request.request({
    url: "/consultant/subscribe",
    data: params
  });
};
exports.addChatInfo = addChatInfo;
exports.addSucideHotline = addSucideHotline;
exports.getAllConsultants = getAllConsultants;
exports.getFansUser = getFansUser;
exports.getGoodLetters = getGoodLetters;
exports.getSucideHotlines = getSucideHotlines;
exports.getUserLetterList = getUserLetterList;
exports.getUserList = getUserList;
exports.replayLetter = replayLetter;
exports.suscribeApi = suscribeApi;
exports.updateConsultant = updateConsultant;
exports.updateLetter = updateLetter;
