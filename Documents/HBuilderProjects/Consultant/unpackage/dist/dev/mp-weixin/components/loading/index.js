"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  props: {
    loading: Boolean
  },
  setup(__props) {
    const props = __props;
    const { loading } = common_vendor.toRefs(props);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(loading)
      }, common_vendor.unref(loading) ? {} : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/apple/Desktop/Consultant/components/loading/index.vue"]]);
wx.createComponent(Component);
