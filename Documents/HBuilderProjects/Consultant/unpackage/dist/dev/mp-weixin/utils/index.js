"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("./request.js");
function utf16toEntities(str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g;
  return str.replace(patt, function(char) {
    var H, L, code;
    if (char.length === 2) {
      H = char.charCodeAt(0);
      L = char.charCodeAt(1);
      code = (H - 55296) * 1024 + 65536 + L - 56320;
      return "&#" + code + ";";
    } else {
      return char;
    }
  });
}
const validator = (str, pattern2) => {
  return new Promise((resolve, reject) => {
    const flag = pattern2.test(str);
    flag && resolve(true);
    !flag && resolve(false);
  });
};
const pattern = {
  phonePattern: /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/,
  emailPattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
  namePattern: /\S/
};
function showModal(content) {
  return new Promise((resolve, reject) => {
    common_vendor.index.showModal({
      content,
      success: (res) => {
        if (res.confirm) {
          resolve(true);
        }
        resolve(false);
      }
    });
  });
}
const showInfo = (title = "\u6807\u9898", icon = "none") => {
  return new Promise((resolve, reject) => {
    common_vendor.index.showToast({
      title,
      icon
    });
  });
};
const autoEndConsult = (times) => {
  const t = times.slice(0, 10);
  let currentDate = new Date().getTime();
  const time = formatDate(currentDate);
  const t2 = time.slice(0, 10);
  if (t2 !== t) {
    console.log("unequal");
    return true;
  } else {
    const consultHour = times.slice(11, 13);
    const consultMin = times.slice(14, 16);
    const nowHour = time.slice(11, 13);
    const nowMin = time.slice(14, 16);
    const hGap = nowHour - consultHour;
    switch (hGap) {
      case 0:
        const mGap1 = nowMin - consultMin;
        if (mGap1 >= 9) {
          return true;
        }
        return false;
      case 1:
        const mGap = nowMin + 60 - consultMin;
        if (mGap >= 9) {
          return true;
        }
        return false;
      default:
        return true;
    }
  }
};
function formatDate(timestamp) {
  let time = new Date(Number(timestamp));
  let year = time.getFullYear();
  let month = Number(time.getMonth()) + 1;
  let date = time.getDate();
  let hours = time.getHours();
  let minute = Number(time.getMinutes());
  let second = time.getSeconds();
  if (month < 10) {
    month = "0" + month;
  }
  if (date < 10) {
    date = "0" + date;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  if (second < 10) {
    second = "0" + second;
  }
  return `${year}-${month}-${date} ${hours}:${minute}:${second}`;
}
const map = /* @__PURE__ */ new Map();
map.set(0, "\u7537");
map.set(1, "\u5973");
const userInfoMap = /* @__PURE__ */ new Map([
  ["consultantName", "\u54A8\u8BE2\u7528\u540D"],
  ["consultantPhone", "\u624B\u673A\u53F7\u7801"],
  ["gender", "\u6027\u522B"],
  ["createTime", "\u521B\u5EFA\u65E5\u671F"],
  ["followedNum", "\u7C89\u4E1D\u6570\u91CF"],
  ["hasManager", "\u8EAB\u4EFD"]
]);
function getTopBarHeight() {
  let menuButtonObject = common_vendor.index.getMenuButtonBoundingClientRect();
  return new Promise((resolve, reject) => {
    common_vendor.index.getSystemInfo({
      success: (res) => {
        let navHeight = menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight) * 2;
        const titleBarHeight = navHeight;
        const statusBarHeight = res.statusBarHeight;
        const topBarHeight = titleBarHeight + statusBarHeight;
        resolve(topBarHeight);
      },
      fail(err) {
        console.log(err);
      }
    });
  });
}
function getTopBarHeightSync() {
  let menuButtonObject = common_vendor.index.getMenuButtonBoundingClientRect();
  const res = common_vendor.index.getSystemInfoSync();
  let navHeight = menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight) * 2;
  const titleBarHeight = navHeight;
  const statusBarHeight = res.statusBarHeight;
  const topBarHeight = titleBarHeight + statusBarHeight;
  return topBarHeight;
}
function getNavigationBarSync() {
  let menuButtonObject = common_vendor.index.getMenuButtonBoundingClientRect();
  const res = common_vendor.index.getSystemInfoSync();
  const navHeight = menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight) * 2;
  return navHeight;
}
function loginInterceptor(userInfo) {
  return new Promise((resolve, reject) => {
    if (userInfo.value.consultantPhone) {
      const { consultantPhone } = userInfo.value;
      utils_request.request({
        url: "/login/consultant",
        method: "POST",
        data: { consultantPhone }
      }).then((r) => {
        if (r.id) {
          userInfo.value = r;
          common_vendor.index.removeStorageSync("userInfo");
          common_vendor.index.setStorageSync("userInfo", r);
          resolve(true);
        } else {
          common_vendor.index.removeStorageSync("userInfo");
          common_vendor.index.showToast({
            title: "\u8BF7\u5148\u767B\u5F55"
          });
          common_vendor.index.reLaunch({
            url: "/pages/login/login"
          });
          resolve(false);
        }
      });
    } else {
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    }
  });
}
exports.autoEndConsult = autoEndConsult;
exports.formatDate = formatDate;
exports.getNavigationBarSync = getNavigationBarSync;
exports.getTopBarHeight = getTopBarHeight;
exports.getTopBarHeightSync = getTopBarHeightSync;
exports.loginInterceptor = loginInterceptor;
exports.map = map;
exports.pattern = pattern;
exports.showInfo = showInfo;
exports.showModal = showModal;
exports.userInfoMap = userInfoMap;
exports.utf16toEntities = utf16toEntities;
exports.validator = validator;
