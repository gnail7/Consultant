"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
require("../../utils/request.js");
const _sfc_main = {
  __name: "gEmoji",
  props: {
    visible: Boolean,
    bottomHeight: String
  },
  emits: ["insertEmoji"],
  setup(__props, { emit }) {
    const props = __props;
    const emojiStore = store_index.useEmojiStore();
    const { expressions } = emojiStore;
    const { visible, bottomHeight } = common_vendor.toRefs(props);
    common_vendor.computed$1(() => {
      return bottomHeight.value ? bottomHeight.value : 0;
    });
    function insertEmoji(item) {
      emit("insertEmoji", item);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(visible)
      }, common_vendor.unref(visible) ? {
        b: common_vendor.f(common_vendor.unref(expressions), (item, k0, i0) => {
          return {
            a: item.icon,
            b: item.icon,
            c: common_vendor.o(($event) => insertEmoji(item), item.icon)
          };
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b0be6281"], ["__file", "/Users/apple/Desktop/Consultant/components/emoji/gEmoji.vue"]]);
wx.createComponent(Component);
