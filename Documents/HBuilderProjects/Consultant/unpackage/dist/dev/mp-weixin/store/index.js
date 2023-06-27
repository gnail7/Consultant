"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const MAX_CONSULT_NUMS = 2;
const useUserStore = common_vendor.defineStore("useUserStore", () => {
  const userInfo = common_vendor.ref({});
  const consultingNums = common_vendor.ref(0);
  function setUserData(data) {
    userInfo.value = data;
    common_vendor.index.setStorageSync("userInfo", data);
  }
  const statusMap = /* @__PURE__ */ new Map([
    [-1, "\u4E0B\u7EBF"],
    [0, "\u7A7A\u95F2"],
    [1, "\u54A8\u8BE2\u4E2D"]
  ]);
  async function changeConsultNums(len) {
    consultingNums.value = len;
    if (len === MAX_CONSULT_NUMS) {
      try {
        const r = await utils_request.request({
          url: "/consultant/updateConsultant",
          method: "POST",
          data: { ...userInfo.value, status: 1 }
        });
        userInfo.value = { ...userInfo.value, status: 1 };
        if (r.flag) {
          common_vendor.index.setStorageSync("userInfo", userInfo.value);
        }
      } catch (e) {
      }
    }
  }
  async function logoutStatus() {
    await utils_request.request({
      url: "/consultant/updateConsultant",
      method: "POST",
      data: { ...userInfo.value, status: -1 }
    });
    common_vendor.index.removeStorageSync("userInfo");
  }
  return {
    userInfo,
    setUserData,
    statusMap,
    changeConsultNums,
    logoutStatus,
    consultingNums
  };
});
const useCommonStore = common_vendor.defineStore("commonStore", () => {
  const showDrawer = common_vendor.ref(false);
  const currentPage = common_vendor.ref({
    name: "home",
    meta: {
      icon: "home",
      label: "\u4E3B\u9875",
      roles: [0, 1]
    }
  });
  const crumbList = common_vendor.ref([
    {
      name: "home",
      meta: {
        icon: "home",
        label: "\u4E3B\u9875",
        roles: [0, 1]
      }
    }
  ]);
  const routes = common_vendor.ref([
    {
      name: "home",
      meta: {
        label: "\u9996\u9875",
        icon: "home",
        roles: [0, 1]
      }
    },
    {
      name: "personal",
      meta: {
        label: "\u4E2A\u4EBA\u4E2D\u5FC3",
        icon: "yonghuziliao",
        roles: [0, 1]
      }
    },
    {
      name: "consult",
      meta: {
        label: "\u6211\u7684\u54A8\u8BE2",
        icon: "zixun",
        path: " / \u54A8\u8BE2\u7BA1\u7406 / \u6211\u7684\u54A8\u8BE2",
        roles: [0, 1]
      }
    },
    {
      name: "activityManage",
      meta: {
        label: "\u52A8\u6001\u7BA1\u7406",
        icon: "shebeiguanli",
        roles: [1]
      }
    },
    {
      name: "letterManage",
      meta: {
        label: "\u4FE1\u7BB1\u7BA1\u7406",
        icon: "xinxiang-xiankuang",
        hidden: true,
        roles: [0, 1]
      },
      children: [
        {
          name: "letter",
          meta: {
            label: "\u7B54\u6848\u4E4B\u4E66\u7BA1\u7406",
            icon: "youxiang",
            hidden: true,
            roles: [0, 1],
            path: " / \u4FE1\u7BB1\u7BA1\u7406 / \u7B54\u6848\u4E4B\u4E66\u7BA1\u7406"
          }
        }
      ]
    },
    {
      name: "userManage",
      meta: {
        label: "\u7528\u6237\u7BA1\u7406",
        icon: "shebeiguanli",
        hidden: false,
        roles: [1]
      },
      children: [
        {
          name: "manageConsultant",
          meta: {
            label: "\u54A8\u8BE2\u5E08\u7BA1\u7406",
            icon: "zixunguwen",
            path: " / \u7528\u6237\u7BA1\u7406 / \u54A8\u8BE2\u5E08\u7BA1\u7406",
            roles: [1]
          }
        },
        {
          name: "userList",
          meta: {
            label: "\u7528\u6237\u5217\u8868",
            icon: "yingyongguanliyuanguanli",
            path: " / \u7528\u6237\u7BA1\u7406 / \u7528\u6237\u5217\u8868",
            roles: [1]
          }
        },
        {
          name: "sucideHotlines",
          meta: {
            label: "\u81EA\u6740\u70ED\u7EBF",
            icon: "kefurexianxianxing",
            path: " / \u7528\u6237\u7BA1\u7406 / \u81EA\u6740\u70ED\u7EBF",
            roles: [1]
          }
        }
      ]
    },
    ,
    {
      name: "feedbackManage",
      meta: {
        label: "\u53CD\u9988\u5217\u8868",
        icon: "liuyan",
        hidden: true,
        roles: [1],
        path: " / \u53CD\u9988\u5217\u8868 "
      }
    }
  ]);
  return {
    showDrawer,
    currentPage,
    routes,
    crumbList
  };
});
common_vendor.defineStore("patternStore", () => {
  const phonePattern = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/;
  const emailPattern = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
  const requiredPattern = /\S/;
  return {
    phonePattern,
    emailPattern,
    requiredPattern
  };
});
const useEmojiStore = common_vendor.defineStore("emojiStore", () => {
  const expressions = [
    {
      "title": "[\u95ED\u5634]",
      "icon": "https://howcode.online/emo/\u95ED\u5634.png"
    },
    {
      "title": "[\u5C2C\u7B11]",
      "icon": "https://howcode.online/emo/\u5C2C\u7B11.png"
    },
    {
      "title": "[\u5BB3\u6015]",
      "icon": "https://howcode.online/emo/\u5BB3\u6015.png"
    },
    {
      "title": "[\u5978\u7B11]",
      "icon": "https://howcode.online/emo/\u5978\u7B11.png"
    },
    {
      "title": "[\u9759\u97F3]",
      "icon": "https://howcode.online/emo/\u9759\u97F3.png"
    },
    {
      "title": "[\u5F00\u5FC3]",
      "icon": "https://howcode.online/emo/\u5F00\u5FC3.png"
    },
    {
      "title": "[\u53E3\u7F69]",
      "icon": "https://howcode.online/emo/\u53E3\u7F69.png"
    },
    {
      "title": "[\u54ED]",
      "icon": "https://howcode.online/emo/\u54ED.png"
    },
    {
      "title": "[\u9177]",
      "icon": "https://howcode.online/emo/\u9177.png"
    },
    {
      "title": "[\u6D41\u6C57]",
      "icon": "https://howcode.online/emo/\u6D41\u6C57.png"
    },
    {
      "title": "[\u61F5B]",
      "icon": "https://howcode.online/emo/\u61F5B.png"
    },
    {
      "title": "[\u8FF7\u832B]",
      "icon": "https://howcode.online/emo/\u8FF7\u832B.png"
    },
    {
      "title": "[\u9762\u65E0\u8868\u60C5]",
      "icon": "https://howcode.online/emo/\u9762\u65E0\u8868\u60C5.png"
    },
    {
      "title": "[\u9B54\u9B3C]",
      "icon": "https://howcode.online/emo/\u9B54\u9B3C.png"
    },
    {
      "title": "[\u96BE\u8FC7]",
      "icon": "https://howcode.online/emo/\u96BE\u8FC7.png"
    },
    {
      "title": "[\u5455\u5410]",
      "icon": "https://howcode.online/emo/\u5455\u5410.png"
    },
    {
      "title": "[\u75B2\u60EB]",
      "icon": "https://howcode.online/emo/\u75B2\u60EB.png"
    },
    {
      "title": "[\u4EB2\u543B]",
      "icon": "https://howcode.online/emo/\u4EB2\u543B.png"
    },
    {
      "title": "[\u70ED\u604B]",
      "icon": "https://howcode.online/emo/\u70ED\u604B.png"
    },
    {
      "title": "[\u751F\u75C5]",
      "icon": "https://howcode.online/emo/\u751F\u75C5.png"
    },
    {
      "title": "[\u751F\u6C14]",
      "icon": "https://howcode.online/emo/\u751F\u6C14.png"
    },
    {
      "title": "[\u53D7\u4F24]",
      "icon": "https://howcode.online/emo/\u53D7\u4F24.png"
    },
    {
      "title": "[\u7761\u89C9]",
      "icon": "https://howcode.online/emo/\u7761\u89C9.png"
    },
    {
      "title": "[\u601D\u8003]",
      "icon": "https://howcode.online/emo/\u601D\u8003.png"
    },
    {
      "title": "[\u5929\u4F7F]",
      "icon": "https://howcode.online/emo/\u5929\u4F7F.png"
    },
    {
      "title": "[\u5934\u6655]",
      "icon": "https://howcode.online/emo/\u5934\u6655.png"
    },
    {
      "title": "[\u5410\u820C]",
      "icon": "https://howcode.online/emo/\u5410\u820C.png"
    },
    {
      "title": "[\u7B11\u54ED]",
      "icon": "https://howcode.online/emo/\u7B11\u54ED.png"
    },
    {
      "title": "[\u659C\u773C]",
      "icon": "https://howcode.online/emo/\u659C\u773C.png"
    },
    {
      "title": "[\u773C\u7EA2]",
      "icon": "https://howcode.online/emo/\u773C\u7EA2.png"
    },
    {
      "title": "[\u7728\u773C]",
      "icon": "https://howcode.online/emo/\u7728\u773C.png"
    },
    {
      "title": "[\u9707\u60CA]",
      "icon": "https://howcode.online/emo/\u9707\u60CA.png"
    },
    {
      "title": "[\u4E2D\u6BD2]",
      "icon": "https://howcode.online/emo/\u4E2D\u6BD2.png"
    }
  ];
  return {
    expressions
  };
});
const useAppStore = common_vendor.defineStore("useAppStore", () => {
  const AppId = "wx712d7eb0b873518e";
  const AppSecret = "6b09ce828fbf579ca99babefc37c0d71";
  return {
    AppId,
    AppSecret
  };
});
exports.MAX_CONSULT_NUMS = MAX_CONSULT_NUMS;
exports.useAppStore = useAppStore;
exports.useCommonStore = useCommonStore;
exports.useEmojiStore = useEmojiStore;
exports.useUserStore = useUserStore;
