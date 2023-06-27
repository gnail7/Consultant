"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
const store_index = require("../../../store/index.js");
require("../../../utils/request.js");
const _sfc_main = {
  __name: "topnav",
  props: {
    fromUser: Object,
    personal: Boolean
  },
  setup(__props) {
    const props = __props;
    common_vendor.useCssVars((_ctx) => ({
      "56acf62c-topBarHeightSync": topBarHeightSync,
      "56acf62c-topBarHeight": topBarHeight.value
    }));
    const userStore = store_index.useUserStore();
    common_vendor.storeToRefs(userStore);
    utils_index.getNavigationBarSync();
    common_vendor.ref(null);
    const { fromUser, personal, id } = common_vendor.toRefs(props);
    const topBarHeight = common_vendor.ref(0);
    const topBarHeightSync = utils_index.getTopBarHeightSync() + "px";
    function backPage() {
      common_vendor.index.navigateBack();
    }
    common_vendor.onMounted(async () => {
      const top = await utils_index.getTopBarHeight();
      topBarHeight.value = top + "px";
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(backPage),
        b: common_vendor.t(common_vendor.unref(fromUser).userName ? common_vendor.unref(fromUser).userName : common_vendor.unref(fromUser).consultantName),
        c: common_vendor.s(_ctx.__cssVars()),
        d: common_vendor.s(_ctx.__cssVars())
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-56acf62c"], ["__file", "/Users/apple/Desktop/Consultant/pages/chatRoom/component/topnav.vue"]]);
wx.createComponent(Component);
