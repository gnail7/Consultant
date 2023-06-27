"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const store_index = require("../../store/index.js");
if (!Array) {
  const _easycom_ksp_cropper2 = common_vendor.resolveComponent("ksp-cropper");
  _easycom_ksp_cropper2();
}
const _easycom_ksp_cropper = () => "../../uni_modules/ksp-cropper/components/ksp-cropper/ksp-cropper.js";
if (!Math) {
  _easycom_ksp_cropper();
}
const _sfc_main = {
  __name: "avatarPreview",
  setup(__props) {
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const fileUrl = common_vendor.ref("");
    common_vendor.ref("");
    common_vendor.reactive({
      w: 0,
      h: 0
    });
    async function updatePeronalInfo() {
      const r = await utils_request.request({
        url: "/consultant/updateConsultant",
        method: "POST",
        data: userInfo.value
      });
      return r;
    }
    function cancel() {
      common_vendor.index.navigateBack();
    }
    function onok(ev) {
      console.log("ev", ev.path);
      userInfo.value.consultantAvatar = ev.path;
      common_vendor.index.uploadFile({
        filePath: ev.path,
        url: utils_request.BASEURL + "/user/upload",
        name: "file",
        formData: {
          "consultant": "test"
        },
        success: async (r) => {
          if (r.statusCode === 200) {
            userInfo.value.consultantAvatar = r.data;
            common_vendor.index.setStorageSync("userInfo", userInfo.value);
            await updatePeronalInfo();
            common_vendor.index.navigateBack();
          }
        },
        fail: () => {
          console.log("\u5931\u8D25...");
        }
      });
    }
    common_vendor.reactive({
      w: 0,
      h: 0,
      l: 0,
      t: 0
    });
    const system = common_vendor.ref({});
    common_vendor.onLoad((event) => {
      fileUrl.value = event.fileUrl;
    });
    common_vendor.onMounted(() => {
      system.value = common_vendor.index.getSystemInfoSync();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(cancel),
        b: common_vendor.o(onok),
        c: common_vendor.p({
          mode: "fixed",
          width: 160,
          height: 160,
          maxWidth: 1024,
          maxHeight: 1024,
          url: fileUrl.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c8a21ff2"], ["__file", "/Users/apple/Desktop/Consultant/pages/avatarPreview/avatarPreview.vue"]]);
wx.createPage(MiniProgramPage);
