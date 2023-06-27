"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "loading",
  props: {
    loading: Boolean,
    bgColor: {
      type: String,
      default: "#ffffff"
    }
  },
  setup(__props) {
    const props = __props;
    common_vendor.useCssVars((_ctx) => ({
      "23615937-bgColor": common_vendor.unref(bgColor)
    }));
    const { loading } = common_vendor.toRefs(props);
    const { bgColor } = props;
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {
        b: common_vendor.s(_ctx.__cssVars())
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/apple/Desktop/Consultant/directives/loading.vue"]]);
wx.createComponent(Component);
