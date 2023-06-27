"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "drawer",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ["changeDrawerVisible"],
  setup(__props, { emit }) {
    const props = __props;
    function closeDrawer() {
      console.log("mask");
      emit("changeDrawerVisible", false);
    }
    const { visible } = common_vendor.toRefs(props);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(closeDrawer),
        b: common_vendor.n(common_vendor.unref(visible) ? "visible" : "hidden")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0ee01408"], ["__file", "/Users/apple/Desktop/Consultant/pages/userList/component/drawer.vue"]]);
wx.createComponent(Component);
