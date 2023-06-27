"use strict";
const common_vendor = require("../common/vendor.js");
let BASEURL = "https://zzpbzx.com:8854";
const request = (option) => {
  const { url, data, method } = option;
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: BASEURL + url,
      data,
      method: method || "POST",
      success: (res) => {
        resolve(res.data);
      },
      fail: (e) => {
        resolve(e);
      }
    });
  });
};
exports.BASEURL = BASEURL;
exports.request = request;
