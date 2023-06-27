"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const common_vendor = require("./common/vendor.js");
const store_index = require("./store/index.js");
require("./utils/request.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/chatHall/chatHall.js";
  "./pages/chatRoom/chatRoom.js";
  "./pages/fansList/fansList.js";
  "./pages/avatarPreview/avatarPreview.js";
  "./pages/memo/memo.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    common_vendor.onLaunch(() => {
      common_vendor.index.hideTabBar();
      const u = common_vendor.index.getStorageSync("userInfo");
      if (u) {
        userInfo.value = u;
      } else {
        common_vendor.index.removeStorageSync("userInfo");
      }
    });
    common_vendor.onLoad(() => {
      common_vendor.index.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
    });
    return () => {
    };
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/apple/Desktop/Consultant/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  return {
    app,
    pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
