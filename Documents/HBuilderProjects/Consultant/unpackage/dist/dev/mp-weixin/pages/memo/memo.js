"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_request = require("../../utils/request.js");
const utils_index = require("../../utils/index.js");
const _sfc_main = {
  __name: "memo",
  setup(__props) {
    const userStore = store_index.useUserStore();
    common_vendor.storeToRefs(userStore);
    const memoSetting = common_vendor.ref({
      memoText: "",
      userId: ""
    });
    async function saveMemo() {
      const t = new Date().getTime();
      const currentModifyTime = utils_index.formatDate(t);
      if (memoSetting.value.memoText) {
        const r = await utils_request.request({
          url: "/consultant/updateMemo",
          data: {
            ...memoSetting.value,
            currentModifyTime
          }
        });
        if (r) {
          common_vendor.index.showToast({
            title: "\u5907\u5FD8\u5F55\u66F4\u65B0\u6210\u529F",
            icon: "success"
          });
        }
      } else {
        common_vendor.index.showToast({
          title: "\u4E0D\u80FD\u4E3A\u7A7A",
          icon: "none"
        });
      }
    }
    common_vendor.onLoad(async (option) => {
      try {
        memoSetting.value.userId = option.userId;
        const r = await utils_request.request({
          url: "/consultant/findMemoById",
          data: {
            userId: memoSetting.value.userId
          }
        });
        memoSetting.value = r;
      } catch (e) {
      }
    });
    return (_ctx, _cache) => {
      return {
        a: memoSetting.value.memoText,
        b: common_vendor.o(($event) => memoSetting.value.memoText = $event.detail.value),
        c: common_vendor.o(saveMemo)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c0e26b37"], ["__file", "/Users/apple/Desktop/Consultant/pages/memo/memo.vue"]]);
wx.createPage(MiniProgramPage);
