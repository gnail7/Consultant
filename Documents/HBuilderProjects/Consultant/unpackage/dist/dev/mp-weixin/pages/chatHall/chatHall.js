"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_index = require("../../utils/index.js");
require("../../utils/request.js");
if (!Math) {
  (loading + userItem + personalChat)();
}
const loading = () => "../../directives/loading.js";
const userItem = () => "./component/userItem.js";
const personalChat = () => "./component/personalChat.js";
const _sfc_main = {
  __name: "chatHall",
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "06e842bb-topBarHeight": common_vendor.unref(topBarHeight),
      "06e842bb-statusHeight": common_vendor.unref(statusHeight)
    }));
    const data = common_vendor.reactive({
      consultantionList: [],
      personalChatList: []
    });
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const isLoading = common_vendor.computed$1(() => {
      if (!loading1.value && !loading2.value) {
        return false;
      }
      return true;
    });
    function computedUserA(item) {
      if (item.userA.consultantId && item.userA.consultantId === userInfo.value.consultantId) {
        return item.userB;
      }
      return item.userA;
    }
    const loading1 = common_vendor.ref(true);
    const loading2 = common_vendor.ref(true);
    common_vendor.computed$1(() => utils_index.getNavigationBarSync() + "px");
    const topBarHeight = common_vendor.computed$1(() => utils_index.getTopBarHeightSync() + "px");
    const statusHeight = common_vendor.computed$1(() => utils_index.getTopBarHeightSync() - utils_index.getNavigationBarSync() + "px");
    common_vendor.onUnload(() => {
      common_vendor.index.$off("getWordInfoList");
      socket.normalCloseFlag = true;
      heartBeatReset();
      socket.socketTask.close();
      socket.socketTask = null;
    });
    function backToHome() {
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
    }
    const socket = common_vendor.reactive({
      socketTask: null,
      socketOpen: false,
      reconnectTimer: null,
      normalCloseFlag: false,
      maxReconnectMaxTime: 20,
      reconnectTime: 0,
      timeoutObj: null,
      first: true
    });
    common_vendor.onLoad(async (option) => {
      data.consultantionList = common_vendor.index.getStorageSync("wordinfolist") || [];
      common_vendor.index.$on("getWordInfoList", (res) => {
        data.consultantionList = res || [];
        userStore.changeConsultNums(data.consultantionList.length);
        loading1.value = false;
      });
      socket.socketTask = common_vendor.index.connectSocket({
        url: "wss://zzpbzx.com:8854/getConsultantChatList",
        success: () => {
        }
      });
      socket.socketTask.onOpen((res) => {
        clearInterval(socket.reconnectTimer);
        socket.first = false;
        heartBeatReset();
        socket.socketOpen = true;
        socket.reconnectTime = 1;
        sendSocketMessage();
        heartBeatStart();
      });
      socket.socketTask.onMessage((res) => {
        res = JSON.parse(res.data) || [];
        data.personalChatList = res;
        loading2.value = false;
        common_vendor.index.setStorageSync("personalList", res);
      });
      socket.socketTask.onError((e) => {
      });
      socket.socketTask.onClose((e) => {
        socket.socketOpen = false;
        onReconnect();
      });
    });
    common_vendor.onMounted(() => {
      setTimeout(() => {
        if (!loading1.value || !loading2.value) {
          loading2.value = false;
          loading1.value = false;
        }
      }, 2e3);
    });
    function sendSocketMessage() {
      const obj = { personId: userInfo.value.consultantId };
      if (socket.socketOpen) {
        socket.socketTask.send({
          data: JSON.stringify(obj)
        });
      }
    }
    function heartBeatReset() {
      clearInterval(socket.timeoutObj);
      clearTimeout(socket.serverTimeoutObj);
    }
    function onReconnect(e) {
      socket.socketOpen = false;
      heartBeatReset();
      clearInterval(socket.reconnectTimer);
      if (!socket.normalCloseFlag) {
        socket.reconnectTimer = setInterval(() => {
          if (socket.socketTask) {
            socket.socketTask.close();
          }
          console.log(`\u7B2C\u3010${socket.reconnectTime}\u3011\u6B21\u91CD\u65B0\u8FDE\u63A5\u4E2D\u2026\u2026`);
          socket.socketTask = null;
          socketInit();
        }, 2e3);
      }
    }
    function heartBeatStart() {
      if (socket.socketOpen) {
        socket.timeoutObj = setInterval(() => {
          sendSocketMessage();
        }, 200);
      }
    }
    function socketInit() {
      socket.socketTask = common_vendor.index.connectSocket({
        url: "wss://zzpbzx.com:8854/getConsultantChatList",
        success: () => {
        }
      });
      socket.socketTask.onOpen((res) => {
        clearInterval(socket.reconnectTimer);
        heartBeatReset();
        socket.socketOpen = true;
        socket.reconnectTime = 1;
        sendSocketMessage();
        heartBeatStart();
      });
      socket.socketTask.onMessage((res) => {
        res = JSON.parse(res.data) || [];
        data.personalChatList = res;
        loading2.value = false;
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(backToHome),
        b: common_vendor.p({
          loading: common_vendor.unref(isLoading)
        }),
        c: common_vendor.f(data.consultantionList, (item, index, i0) => {
          return {
            a: item.id,
            b: "06e842bb-1-" + i0,
            c: common_vendor.p({
              item
            })
          };
        }),
        d: common_vendor.f(data.personalChatList, (item, index2, i0) => {
          return {
            a: item.id,
            b: index2 + "x",
            c: "06e842bb-2-" + i0,
            d: common_vendor.p({
              wordInfoList: item.chatRecords,
              userA: computedUserA(item),
              id: index2 + "x",
              item
            })
          };
        }),
        e: !data.consultantionList || data.consultantionList.length === 0 && data.personalChatList.length === 0
      }, !data.consultantionList || data.consultantionList.length === 0 && data.personalChatList.length === 0 ? {} : {}, {
        f: common_vendor.s(_ctx.__cssVars())
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-06e842bb"], ["__file", "/Users/apple/Desktop/Consultant/pages/chatHall/chatHall.vue"]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
