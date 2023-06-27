"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
const _sfc_main = {
  __name: "recordDialog",
  setup(__props) {
    const openPopOver = common_vendor.inject("openPopOver");
    const addAudioRecord = common_vendor.inject("addAudioRecord");
    const recorderManager = common_vendor.ref({
      manager: "",
      voicePath: "",
      status: -1,
      playing: false,
      innerAudioContext: {}
    });
    const innerAudioContext = common_vendor.ref({});
    const changeRecorderStatus = (e) => {
      if (recorderManager.value.status != 1) {
        recorderMapEvent(recorderManager.value.status);
        recorderManager.value.status++;
      } else {
        recorderMapEvent(recorderManager.value.status);
      }
    };
    const recorderMapEvent = (status) => {
      switch (status) {
        case 1:
          recorderPlay();
          break;
        case 0:
          recorderEnd();
          break;
        case -1:
          recorderStart();
          break;
      }
    };
    const recorderStart = () => {
      recorderManager.value.manager.start();
    };
    const recorderEnd = () => {
      recorderManager.value.manager.stop();
    };
    const recorderPlay = () => {
      recorderManager.value.playing = true;
      innerAudioContext.value.play();
      innerAudioContext.value.onPlay(() => {
        console.log("play");
      });
    };
    const sendAudioRecord = async () => {
      openPopOver("recoderVisible", false);
      common_vendor.index.uploadFile({
        filePath: recorderManager.value.voicePath,
        url: utils_request.BASEURL + "/user/upload",
        name: "file",
        formData: {
          "consultant": "test"
        },
        success: (r) => {
          if (r.statusCode === 200) {
            addAudioRecord("voice", r.data);
            openPopOver("recoderVisible", false);
          }
        },
        fail: () => {
          console.log("\u5931\u8D25...");
        }
      });
    };
    common_vendor.onMounted(() => {
      recorderManager.value.manager = common_vendor.index.getRecorderManager();
      const audioContext = common_vendor.index.createInnerAudioContext();
      audioContext.autoplay = false;
      recorderManager.value.manager.onStop(function(res) {
        recorderManager.value.voicePath = res.tempFilePath;
        audioContext.src = recorderManager.value.voicePath;
        innerAudioContext.value = audioContext;
      });
      audioContext.onEnded(() => {
        recorderManager.value.playing = false;
      });
      audioContext.onError((e) => {
        console.log("e", e);
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: recorderManager.value.status === -1 && !recorderManager.value.playing
      }, recorderManager.value.status === -1 && !recorderManager.value.playing ? {} : recorderManager.value.status === 0 && !recorderManager.value.playing ? {} : recorderManager.value.status === 1 && !recorderManager.value.playing ? {} : {
        d: common_vendor.f(15, (item, index, i0) => {
          return {
            a: index
          };
        })
      }, {
        b: recorderManager.value.status === 0 && !recorderManager.value.playing,
        c: recorderManager.value.status === 1 && !recorderManager.value.playing,
        e: common_vendor.o(changeRecorderStatus),
        f: recorderManager.value.status === -1
      }, recorderManager.value.status === -1 ? {} : recorderManager.value.status === 0 ? {} : {
        h: common_vendor.o(($event) => common_vendor.unref(openPopOver)("recoderVisible", false)),
        i: common_vendor.o(sendAudioRecord)
      }, {
        g: recorderManager.value.status === 0
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7ee16123"], ["__file", "/Users/apple/Desktop/Consultant/pages/chatRoom/component/recordDialog.vue"]]);
wx.createComponent(Component);
