"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
require("../../../utils/request.js");
const _sfc_main = {
  __name: "reply",
  props: {
    item: Object,
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ["changeReplyVisible", "replyInput", "replyTo"],
  setup(__props, { emit }) {
    const props = __props;
    const { item, visible } = common_vendor.toRefs(props);
    function clickMask() {
      console.log("clickMask");
      emit("changeReplyVisible", false);
    }
    function inputEmit(e) {
      emit("replyInput", e.detail.value);
    }
    async function replyTo() {
      console.log("item", item.value);
      const flag = await utils_index.showModal(`\u786E\u8BA4\u56DE\u590D"${item.value.postUser.userName}"\u5199\u7684\u4FE1\u5C01?`);
      if (flag) {
        emit("replyTo", item);
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(visible)
      }, common_vendor.unref(visible) ? {
        b: common_vendor.o(clickMask),
        c: common_vendor.t(common_vendor.unref(item).postUser.userName),
        d: common_vendor.o(inputEmit),
        e: common_vendor.o(replyTo)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3f195d57"], ["__file", "/Users/apple/Desktop/Consultant/pages/letter/component/reply.vue"]]);
wx.createComponent(Component);
