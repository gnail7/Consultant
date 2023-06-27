"use strict";
const common_vendor = require("../common/vendor.js");
const store_index = require("../store/index.js");
require("../utils/request.js");
const _sfc_main = {
  __name: "crumbBar",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    const { crumbList, currentPage } = common_vendor.storeToRefs(commonStore);
    function closeTag(item) {
      const index = crumbList.value.findIndex((ele) => ele.name === item.name);
      console.log(index);
      crumbList.value.splice(index, 1);
      console.log(crumbList.value);
    }
    function toPage(item) {
      currentPage.value = item;
      common_vendor.index.$emit("hidden");
      common_vendor.index.$emit("statusHidden");
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(crumbList), (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.meta.label),
            b: item.name !== "home"
          }, item.name !== "home" ? {
            c: common_vendor.o(($event) => closeTag(item), item.name)
          } : {}, {
            d: common_vendor.n(item.name === common_vendor.unref(currentPage).name ? "active" : ""),
            e: item.name,
            f: common_vendor.o(($event) => toPage(item), item.name)
          });
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0ad77efb"], ["__file", "/Users/apple/Desktop/Consultant/components/crumbBar.vue"]]);
wx.createComponent(Component);
