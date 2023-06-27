"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "gAudio",
  props: {
    src: String
  },
  setup(__props) {
    const props = __props;
    common_vendor.useCssVars((_ctx) => ({
      "2e1560ce-length": common_vendor.unref(length)
    }));
    const { src } = common_vendor.toRefs(props);
    const data = common_vendor.reactive({
      duration: "",
      innerAudioContext: null,
      play: false,
      src: ""
    });
    const length = common_vendor.computed$1(() => {
      let length2 = Math.round(data.duration / 60 * 300) >= 13 ? Math.round(data.duration / 60 * 300) : 13;
      if (length2 > 160)
        length2 = 160;
      return `${length2 * 2}rpx;`;
    });
    common_vendor.onMounted(() => {
      const innerAudioContext = common_vendor.index.createInnerAudioContext();
      innerAudioContext.autoplay = false;
      innerAudioContext.src = src.value;
      data.innerAudioContext = innerAudioContext;
      innerAudioContext.onCanplay(() => {
        let intervalID = setInterval(() => {
          if (innerAudioContext.duration !== 0 && innerAudioContext.duration <= 60) {
            clearInterval(intervalID);
            data.duration = Math.ceil(innerAudioContext.duration);
          }
        }, 500);
      });
      innerAudioContext.onEnded(() => {
      });
      innerAudioContext.onError((e) => {
      });
    });
    common_vendor.onUnmounted(() => {
      data.innerAudioContext.stop();
      data.innerAudioContext.offCanplay();
      data.innerAudioContext.offError();
    });
    function startAudio() {
      data.play = !data.play;
      if (data.play) {
        data.innerAudioContext.play(() => {
        });
        data.innerAudioContext.onEnded(() => {
          data.play = false;
        });
      } else {
        data.innerAudioContext.stop(() => {
        });
        data.innerAudioContext.onError((res) => {
          console.log(res.errMsg);
          console.log(res.errCode);
        });
      }
      data.innerAudioContext.onError((res) => {
        console.log(res.errMsg);
        console.log(res.errCode);
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(data.play ? "show2" : ""),
        b: common_vendor.n(data.play ? "show3" : ""),
        c: common_vendor.t(data.duration),
        d: common_vendor.o(startAudio),
        e: common_vendor.s(_ctx.__cssVars())
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2e1560ce"], ["__file", "/Users/apple/Desktop/Consultant/pages/chatRoom/component/gAudio.vue"]]);
wx.createComponent(Component);
