"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "gImage",
  props: {
    src: String
  },
  setup(__props) {
    const props = __props;
    const { src } = common_vendor.toRefs(props);
    common_vendor.onMounted(() => {
    });
    function previewImage() {
      common_vendor.index.previewImage({
        urls: [src.value],
        longPressActions: {
          itemList: ["\u53D1\u9001\u7ED9\u670B\u53CB", "\u4FDD\u5B58\u56FE\u7247", "\u6536\u85CF"],
          success: function(data) {
          },
          fail: function(err) {
            console.log(err.errMsg);
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(src),
        b: common_vendor.o(previewImage)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fce18257"], ["__file", "/Users/apple/Desktop/Consultant/pages/chatRoom/component/gImage.vue"]]);
wx.createComponent(Component);
