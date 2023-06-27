"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_request = require("../../utils/request.js");
const utils_index = require("../../utils/index.js");
const utils_api = require("../../utils/api.js");
if (!Math) {
  (headbar + crumbBar + sidebar + home + consult + personal + sucideHotlines + manageConsultant + letter + userList + feedback + activeManage)();
}
const userList = () => "../userList/index.js";
const headbar = () => "../../components/headbar.js";
const sidebar = () => "../../components/sidebar.js";
const crumbBar = () => "../../components/crumbBar.js";
const consult = () => "../consult/index.js";
const home = () => "../home/index.js";
const personal = () => "../personal/index.js";
const activeManage = () => "../activeManage/index.js";
const sucideHotlines = () => "../sucide/index.js";
const manageConsultant = () => "../manageConsultant/index.js";
const letter = () => "../letter/index.js";
const feedback = () => "../feedback/feedback.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    const { showDrawer, currentPage, routes } = common_vendor.storeToRefs(commonStore);
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    common_vendor.ref(true);
    const data = common_vendor.reactive({
      socketTask: null,
      socketOpen: false,
      consultantionList: [],
      reconnectTimer: null,
      normalCloseFlag: false,
      interval: 5,
      reconnectTime: 0,
      heartTimer: 2,
      timeout: 1,
      timeoutObj: null,
      first: true
    });
    common_vendor.watch(() => currentPage.value, () => {
    });
    common_vendor.onLoad(async (option) => {
      data.normalCloseFlag = false;
      const flag = await utils_index.loginInterceptor(userInfo);
      const localWordInfoList = common_vendor.index.getStorageSync("wordinfolist") || [];
      common_vendor.index.$emit("getWordInfoList", localWordInfoList);
      if (flag) {
        data.socketTask = common_vendor.index.connectSocket({
          url: "wss://zzpbzx.com:8854/consultationOfConsultant/",
          success: (res) => {
            return data.socketTask;
          }
        });
        data.socketTask.onOpen((res) => {
          heartBeatReset();
          data.socketOpen = true;
          data.first = false;
          data.reconnectTime = 1;
          sendSocketMessage(userInfo.value);
          heartBeatStart();
        });
        data.socketTask.onMessage(function(res) {
          res = JSON.parse(res.data) || [];
          userStore.changeConsultNums(res.length);
          common_vendor.index.setStorageSync("wordinfolist", res);
          common_vendor.index.$emit("getWordInfoList", res);
          const handleArr = res.filter((item) => item.endTime && !item.hasEnd);
          handleArr.map(async (item) => {
            const flag2 = utils_index.autoEndConsult(item.endTime);
            if (flag2) {
              await utils_request.request({
                url: "/consultant/updateConsultation",
                data: { ...item, hasEnd: 1, feedback: "\u8BE5\u7528\u6237\u6CA1\u6709\u586B\u5199\u53CD\u9988" }
              });
              await utils_request.request({
                url: "/user/deleteAppointment",
                data: {
                  fromId: item.fromUser.userId,
                  toId: userInfo.value.consultantId
                }
              });
              await utils_api.updateConsultant({ ...userInfo.value, status: 0 });
              userInfo.value = { ...userInfo.value, status: 0 };
              common_vendor.index.setStorageSync("userInfo", userInfo.value);
            }
          });
        });
        data.socketTask.onError(function(res) {
          data.socketOpen = false;
          heartBeatReset();
          console.log("WebSocket error\uFF0C\u8BF7\u68C0\u67E5\uFF01", res);
          common_vendor.index.showModal({
            title: "\u6E29\u99A8\u63D0\u793A",
            content: "\u670D\u52A1\u5668\u5F00\u5C0F\u5DEE\u5566~\u8BF7\u91CD\u65B0\u6253\u5F00\u8BD5\u8BD5",
            showCancel: false,
            confirmText: "\u6211\u77E5\u9053\u4E86",
            success: () => {
              common_vendor.index.navigateBack();
            }
          });
        });
        data.socketTask.onClose((e) => {
          data.socketOpen = false;
          console.log("index \u65AD\u5F00\u539F\u56E0", e);
          onReconnect();
        });
      }
    });
    common_vendor.onUnload(() => {
      data.normalCloseFlag = true;
      data.socketOpen = false;
      heartBeatReset();
      if (data.socketTask) {
        data.socketTask.close();
      }
      data.socketTask = null;
      clearTimeout(data.reconnectTimer);
      data.reconnectTimer = null;
    });
    function heartBeatReset() {
      clearInterval(data.timeoutObj);
    }
    function heartBeatStart() {
      if (data.socketOpen) {
        data.timeoutObj = setInterval(() => {
          sendSocketMessage(userInfo.value);
        }, 500);
      }
    }
    function socketInit() {
      data.socketTask = common_vendor.index.connectSocket({
        url: "wss://zzpbzx.com:8854/consultationOfConsultant/",
        success: (res) => {
          console.log("socket init");
        }
      });
      data.socketTask.onOpen((res) => {
        heartBeatReset();
        clearInterval(data.reconnectTimer);
        data.socketOpen = true;
        if (data.socketOpen) {
          data.reconnectTime = 1;
          sendSocketMessage(userInfo.value);
          heartBeatStart();
        }
      });
      data.socketTask.onMessage(function(res) {
        res = JSON.parse(res.data) || [];
        userStore.changeConsultNums(res.length);
        common_vendor.index.$emit("getWordInfoList", res);
        const handleArr = res.filter((item) => item.endTime && !item.hasEnd);
        handleArr.map(async (item) => {
          const flag = utils_index.autoEndConsult(item.endTime);
          if (flag) {
            await utils_request.request({
              url: "/consultant/updateConsultation",
              data: { ...item, hasEnd: 1, feedback: "\u8BE5\u7528\u6237\u6CA1\u6709\u586B\u5199\u53CD\u9988" }
            });
            await utils_request.request({
              url: "/user/deleteAppointment",
              data: {
                fromId: item.fromUser.userId,
                toId: userInfo.value.consultantId
              }
            });
            await utils_api.updateConsultant({ ...userInfo.value, status: 0 });
            userInfo.value = { ...userInfo.value, status: 0 };
            common_vendor.index.setStorageSync("userInfo", userInfo.value);
          }
        });
      });
    }
    function onReconnect(e) {
      data.socketOpen = false;
      clearInterval(data.reconnectTimer);
      heartBeatReset();
      if (!data.normalCloseFlag) {
        data.reconnectTimer = setInterval(() => {
          if (data.socketTask) {
            data.socketTask.close();
          }
          data.socketTask = null;
          console.log(`\u7B2C\u3010${data.reconnectTime}\u3011\u6B21\u91CD\u65B0\u8FDE\u63A5\u4E2D\u2026\u2026index`, data.socketTask);
          socketInit();
          data.reconnectTime++;
        }, 1e3);
      }
    }
    function sendSocketMessage(msg) {
      const obj = { consultant: msg };
      if (data.socketOpen) {
        data.socketTask.send({
          data: JSON.stringify(obj),
          success: () => {
          },
          fail: () => {
            console.log("send fail");
            onReconnect();
          }
        });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(common_vendor.unref(showDrawer) ? "show" : "hidden"),
        b: common_vendor.unref(currentPage).name === "home"
      }, common_vendor.unref(currentPage).name === "home" ? {} : {}, {
        c: common_vendor.unref(currentPage).name === "consult"
      }, common_vendor.unref(currentPage).name === "consult" ? {} : {}, {
        d: common_vendor.unref(currentPage).name === "personal"
      }, common_vendor.unref(currentPage).name === "personal" ? {} : {}, {
        e: common_vendor.unref(currentPage).name === "sucideHotlines"
      }, common_vendor.unref(currentPage).name === "sucideHotlines" ? {} : {}, {
        f: common_vendor.unref(currentPage).name === "manageConsultant"
      }, common_vendor.unref(currentPage).name === "manageConsultant" ? {} : {}, {
        g: common_vendor.unref(currentPage).name === "letter"
      }, common_vendor.unref(currentPage).name === "letter" ? {} : {}, {
        h: common_vendor.unref(currentPage).name === "userList"
      }, common_vendor.unref(currentPage).name === "userList" ? {} : {}, {
        i: common_vendor.unref(currentPage).name === "feedbackManage"
      }, common_vendor.unref(currentPage).name === "feedbackManage" ? {} : {}, {
        j: common_vendor.unref(currentPage).name == "activityManage"
      }, common_vendor.unref(currentPage).name == "activityManage" ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"], ["__file", "/Users/apple/Desktop/Consultant/pages/index/index.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
