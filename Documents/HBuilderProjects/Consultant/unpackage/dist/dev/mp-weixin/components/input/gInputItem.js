"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
require("../../utils/request.js");
const _sfc_main = {
  __name: "gInputItem",
  props: {
    required: {
      type: Boolean,
      default: false
    },
    labelWidth: {
      type: String,
      default: "auto"
    },
    placeholder: {
      type: String,
      default: "\u8F93\u5165"
    },
    type: {
      type: String,
      default: "text"
    },
    radio: {
      type: Boolean,
      default: false
    }
  },
  emits: ["inputEmit"],
  setup(__props, { emit }) {
    const props = __props;
    const { required, labelWidth, placeholder, type, radio, modelValue, att } = props;
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    function emitEvent(e) {
      emit("inputEmit", {
        att: props.att,
        value: e.detail.value
      });
    }
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(required)
      }, common_vendor.unref(required) ? {} : {}, {
        b: common_vendor.unref(labelWidth),
        c: !common_vendor.unref(radio)
      }, !common_vendor.unref(radio) ? {
        d: common_vendor.unref(userInfo).consultantName,
        e: common_vendor.unref(type),
        f: common_vendor.o(emitEvent)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bb6980e1"], ["__file", "/Users/apple/Desktop/Consultant/components/input/gInputItem.vue"]]);
wx.createComponent(Component);
