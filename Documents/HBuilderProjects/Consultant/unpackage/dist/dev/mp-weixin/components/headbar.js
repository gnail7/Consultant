"use strict";
const common_vendor = require("../common/vendor.js");
const store_index = require("../store/index.js");
require("../utils/request.js");
if (!Math) {
  status();
}
const status = () => "./status/status.js";
const _sfc_main = {
  __name: "headbar",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    const userStore = store_index.useUserStore();
    const { showDrawer, currentPage, crumbList } = common_vendor.storeToRefs(commonStore);
    const { userInfo } = common_vendor.storeToRefs(userStore);
    common_vendor.ref(null);
    const hidden = common_vendor.ref(false);
    const statusShow = common_vendor.ref(false);
    const headData = common_vendor.reactive({
      personal: {
        name: "personal",
        meta: {
          label: "\u4E2A\u4EBA\u4E2D\u5FC3",
          icon: "home"
        },
        noShow: true
      }
    });
    function changeDrawer() {
      showDrawer.value = !showDrawer.value;
    }
    function navigateTo() {
      hidden.value = !hidden.value;
      currentPage.value = headData.personal;
      const flag = crumbList.value.find((ele) => ele.name === headData.personal.name);
      if (!flag) {
        crumbList.value.push(headData.personal);
      }
    }
    function changeHidden() {
      hidden.value = !hidden.value;
      if (hidden.value) {
        common_vendor.index.$emit("statusHidden");
      }
    }
    function maskClick() {
      hidden.value = false;
      common_vendor.index.$emit("statusHidden");
    }
    async function logout() {
      await userStore.logoutStatus();
      common_vendor.index.showToast({
        title: "\u9000\u51FA\u767B\u5F55",
        icon: "none"
      });
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    }
    common_vendor.onMounted(() => {
      common_vendor.index.$on("hidden", () => {
        hidden.value = false;
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(maskClick),
        b: common_vendor.o(changeDrawer),
        c: common_vendor.unref(currentPage).meta.path
      }, common_vendor.unref(currentPage).meta.path ? {
        d: common_vendor.t(common_vendor.unref(currentPage).meta.path)
      } : {}, {
        e: common_vendor.p({
          statusShow: statusShow.value
        }),
        f: common_vendor.unref(currentPage).name === "home"
      }, common_vendor.unref(currentPage).name === "home" ? {
        g: common_vendor.unref(userInfo).consultantAvatar,
        h: common_vendor.n(hidden.value ? "icon-xiangxiajiantou" : "icon-xiangshangjiantou"),
        i: common_vendor.o(changeHidden)
      } : {}, {
        j: hidden.value
      }, hidden.value ? {
        k: common_vendor.o(navigateTo),
        l: common_vendor.o(logout)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7131119e"], ["__file", "/Users/apple/Desktop/Consultant/components/headbar.vue"]]);
wx.createComponent(Component);
