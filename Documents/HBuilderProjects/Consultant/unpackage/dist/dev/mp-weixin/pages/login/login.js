"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_request = require("../../utils/request.js");
const utils_index = require("../../utils/index.js");
if (!Math) {
  gDialog();
}
const gDialog = () => "../../components/dialog/gDialog.js";
const _sfc_main = {
  __name: "login",
  setup(__props) {
    store_index.useAppStore();
    const userStore = store_index.useUserStore();
    const commonStore = store_index.useCommonStore();
    common_vendor.storeToRefs(commonStore);
    const { userInfo, setUserData } = common_vendor.storeToRefs(userStore);
    const form = common_vendor.ref({
      phoneNumber: ""
    });
    const secretKey = "wKn5=xj^xL7+";
    const modelKey = common_vendor.ref("");
    const secretVisible = common_vendor.ref(true);
    const realNameBox = common_vendor.reactive({
      visible: false,
      realName: ""
    });
    common_vendor.ref("");
    const show = common_vendor.ref(false);
    const agree = common_vendor.ref(false);
    function confirmCert() {
      if (modelKey.value === secretKey) {
        secretVisible.value = false;
        common_vendor.index.showToast({
          title: "\u9080\u8BF7\u7801\u6B63\u786E",
          icon: "none"
        });
      } else {
        common_vendor.index.showToast({
          title: "\u9080\u8BF7\u7801\u9519\u8BEF",
          icon: "error"
        });
      }
    }
    async function registerDialog(e) {
      if (e.detail.errMsg == "getPhoneNumber:fail:user deny" || e.detail.errMsg == "getPhoneNumber:fail user deny")
        ;
      else {
        if (agree.value) {
          const { code } = e.detail;
          const res = await getPhoneNumber(code);
          const { phoneNumber } = res;
          form.value = { phoneNumber };
          show.value = true;
        } else {
          await utils_index.showInfo("\u8BF7\u52FE\u9009\u5E76\u9605\u8BFB\u5E95\u90E8\u534F\u8BAE");
        }
      }
    }
    async function getPhoneNumber(code) {
      const res = await utils_request.request({
        url: "/consultant/getPhoneNumber",
        method: "POST",
        data: { code }
      });
      return res;
    }
    function getUserInfo() {
      return new Promise((resolve, reject) => {
        common_vendor.index.getUserProfile({
          desc: "\u5B9E\u73B0\u767B\u5F55\u529F\u80FD,\u7EDF\u8BA1\u533A\u5206\u7528\u6237\u4FE1\u606F",
          success: (userInfo2) => {
            userInfo2.value = userInfo2;
            resolve(userInfo2);
          },
          fail: () => {
            resolve(false);
          }
        });
      });
    }
    function getLoginCode() {
      return new Promise((resolve, reject) => {
        common_vendor.index.login({
          success: (res) => {
            const { code } = res;
            resolve(code);
          },
          fail: () => {
            reject(0);
          }
        });
      });
    }
    async function weixinLogin() {
      const user = await getUserInfo();
      const code = await getLoginCode();
      const t = new Date().getTime();
      const consultantId = "consultant_" + form.value.phoneNumber;
      const createTime = utils_index.formatDate(t);
      if (user) {
        show.value = false;
        const res = await utils_request.request({
          url: "/consultant/getOpenId",
          method: "POST",
          data: { code }
        });
        const { gender, nickName, avatarUrl } = user.userInfo;
        const { phoneNumber } = form.value;
        const { openId } = res;
        form.value = {
          consultantName: nickName,
          consultantPhone: phoneNumber,
          consultantAvatar: avatarUrl,
          gender: utils_index.map.get(gender),
          createTime,
          consultantId,
          followedNum: 0,
          consultNum: 0,
          phoneNumber,
          openid: openId
        };
        const response = await utils_request.request({
          url: "/login/consultant",
          method: "POST",
          data: {
            consultantPhone: phoneNumber
          }
        });
        if (!response) {
          realNameBox.visible = true;
        } else {
          userInfo.value = response;
          common_vendor.index.setStorageSync("userInfo", userInfo.value);
          common_vendor.index.switchTab({
            url: `/pages/index/index?first=${false}`
          });
        }
      }
    }
    async function realNameLogin() {
      const realName = realNameBox.realName;
      const { phoneNumber } = form.value;
      if (realName !== "") {
        await utils_request.request({
          url: "/register/consultant",
          method: "POST",
          data: { ...form.value, hasManager: 0, realName }
        });
        const rLogin = await utils_request.request({
          url: "/login/consultant",
          method: "POST",
          data: {
            consultantPhone: phoneNumber
          }
        });
        userInfo.value = rLogin;
        common_vendor.index.setStorageSync("userInfo", rLogin);
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      } else {
        common_vendor.index.showToast({
          title: "\u8BF7\u586B\u5199\u60A8\u7684\u771F\u5B9E\u59D3\u540D"
        });
      }
    }
    function changeAgree(e) {
      agree.value = e.detail.value[0];
    }
    common_vendor.onLoad(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(registerDialog),
        b: common_vendor.o(weixinLogin),
        c: show.value,
        d: realNameBox.visible
      }, realNameBox.visible ? {
        e: realNameBox.realName,
        f: common_vendor.o(($event) => realNameBox.realName = $event.detail.value),
        g: common_vendor.o(($event) => realNameLogin())
      } : {}, {
        h: common_vendor.t(common_vendor.unref(userInfo).value),
        i: common_vendor.o(changeAgree),
        j: secretVisible.value
      }, secretVisible.value ? {
        k: modelKey.value,
        l: common_vendor.o(($event) => modelKey.value = $event.detail.value),
        m: common_vendor.o(confirmCert)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"], ["__file", "/Users/apple/Desktop/Consultant/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
