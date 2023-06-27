"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_request = require("../../utils/request.js");
const _sfc_main = {
  __name: "status",
  setup(__props) {
    const userStore = store_index.useUserStore();
    const { userInfo, consultingNums } = common_vendor.storeToRefs(userStore);
    const { statusMap } = userStore;
    const status = common_vendor.computed$1(() => JSON.parse(JSON.stringify(userInfo.value.status)));
    const classMap = /* @__PURE__ */ new Map([
      [-1, "unonline"],
      [0, "empty"],
      [1, "busy"]
    ]);
    const show = common_vendor.ref(false);
    async function changeStatus(index) {
      const keys = [...statusMap.keys()];
      console.log("max", store_index.MAX_CONSULT_NUMS);
      if (keys[index] * 1 === 0 && consultingNums.value === store_index.MAX_CONSULT_NUMS) {
        common_vendor.index.showToast({
          title: "\u4E13\u5FC3\u4E0E\u773C\u524D",
          icon: "error"
        });
      } else {
        userInfo.value.status = keys[index];
        await utils_request.request({ url: "/consultant/updateConsultant", method: "POST", data: userInfo.value });
        common_vendor.index.setStorageSync("userInfo", userInfo.value);
        show.value = false;
      }
    }
    function toggleShow() {
      show.value = !show.value;
      if (show.value) {
        common_vendor.index.$emit("hidden");
      }
    }
    common_vendor.onMounted(() => {
      common_vendor.index.$on("statusHidden", () => {
        show.value = false;
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(common_vendor.unref(statusMap).get(common_vendor.unref(status))),
        b: common_vendor.n(common_vendor.unref(classMap).get(common_vendor.unref(status))),
        c: common_vendor.o(toggleShow),
        d: common_vendor.n(show.value ? "icon-xiangxiajiantou" : "icon-xiangshangjiantou"),
        e: show.value
      }, show.value ? {
        f: common_vendor.f(common_vendor.unref(statusMap).values(), (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => changeStatus(index), item)
          };
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8e4c3769"], ["__file", "/Users/apple/Desktop/Consultant/components/status/status.vue"]]);
wx.createComponent(Component);
