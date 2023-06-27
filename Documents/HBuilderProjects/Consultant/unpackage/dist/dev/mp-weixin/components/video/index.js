"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  props: {
    src: String
  },
  setup(__props) {
    const props = __props;
    const { src } = props;
    function play(index) {
      console.log("play");
      let videoContext = common_vendor.index.createVideoContext("videoId");
      videoContext.requestFullScreen();
      console.log(videoContext.requestFullScreen());
    }
    function fullscreenchange(e) {
      console.log("full");
      let videoContext = common_vendor.index.createVideoContext("videoId");
      if (!e.detail.fullScreen) {
        videoContext.stop();
      } else {
        videoContext.play();
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(src),
        b: common_vendor.o(play),
        c: common_vendor.o(fullscreenchange)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0584f374"], ["__file", "/Users/apple/Desktop/Consultant/components/video/index.vue"]]);
wx.createComponent(Component);
