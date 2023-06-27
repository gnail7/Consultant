"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    options: Array
  },
  emits: ["expandOption", "selectedOption"],
  setup(__props, { emit }) {
    const props = __props;
    const { visible, options } = common_vendor.toRefs(props);
    const selected = common_vendor.computed$1(() => {
      const arr = options.value.filter((item) => item.selected);
      return arr[0].label;
    });
    function expandOption() {
      emit("expandOption", !visible.value);
    }
    function selectedOption(item) {
      emit("selectedOption", item);
    }
    function clickMask() {
      emit("expandOption", false);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(selected)),
        b: common_vendor.n(common_vendor.unref(visible) ? "icon-xiangshangjiantou" : "icon-xiangxiajiantou"),
        c: common_vendor.n(common_vendor.unref(visible) ? "top" : ""),
        d: common_vendor.o(expandOption),
        e: common_vendor.f(common_vendor.unref(options), (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: common_vendor.o(($event) => selectedOption(item), item.value),
            c: item.value,
            d: common_vendor.n(item.selected ? "active-option-item" : "")
          };
        }),
        f: common_vendor.n(common_vendor.unref(visible) ? "active-select-option" : ""),
        g: common_vendor.unref(visible)
      }, common_vendor.unref(visible) ? {
        h: common_vendor.o(clickMask)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6913d47f"], ["__file", "/Users/apple/Desktop/Consultant/components/gSelect/index.vue"]]);
wx.createComponent(Component);
