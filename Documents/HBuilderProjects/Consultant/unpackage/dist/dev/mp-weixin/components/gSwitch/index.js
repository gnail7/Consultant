"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  props: {
    checked: Boolean,
    item: Object
  },
  emits: ["switchStatus"],
  setup(__props, { emit }) {
    const props = __props;
    const { item } = common_vendor.toRefs(props);
    const circleClass = common_vendor.computed$1(() => item.value.hasManager ? "switch-circle-check" : "");
    const containerClass = common_vendor.computed$1(() => item.value.hasManager ? "switch-container-check" : "");
    function changeSwitch() {
      emit("switchStatus");
    }
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(common_vendor.unref(circleClass)),
        b: common_vendor.n(common_vendor.unref(containerClass)),
        c: common_vendor.o(changeSwitch)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a9bf3ea1"], ["__file", "/Users/apple/Desktop/Consultant/components/gSwitch/index.vue"]]);
wx.createComponent(Component);
