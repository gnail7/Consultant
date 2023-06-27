"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/index.js");
const store_index = require("../../store/index.js");
require("../../utils/request.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userStore = store_index.useUserStore();
    common_vendor.storeToRefs(userStore);
    const visible = common_vendor.ref(false);
    common_vendor.ref(false);
    function navigate() {
      const tmplIds = ["IK18Knq0P-rDharivgecSmnaSIFkDUYXNEksOWDOjL0"];
      common_vendor.index.requestSubscribeMessage({
        desc: "",
        tmplIds,
        success: (res) => {
          res["IK18Knq0P-rDharivgecSmnaSIFkDUYXNEksOWDOjL0"];
        },
        complete: (res) => {
        }
      });
      common_vendor.index.switchTab({
        url: "/pages/chatHall/chatHall"
      });
      visible.value = false;
    }
    function comfirmValidator() {
      visible.value = true;
      common_vendor.index.hideTabBar();
    }
    common_vendor.onLoad(() => {
      common_vendor.index.hideTabBar();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(comfirmValidator),
        b: visible.value
      }, visible.value ? {
        c: common_vendor.o(navigate)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4978fed5"], ["__file", "/Users/apple/Desktop/Consultant/pages/home/index.vue"]]);
wx.createComponent(Component);
