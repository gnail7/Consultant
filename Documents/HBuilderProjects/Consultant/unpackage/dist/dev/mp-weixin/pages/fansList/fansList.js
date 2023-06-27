"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_api = require("../../utils/api.js");
require("../../utils/request.js");
const _sfc_main = {
  __name: "fansList",
  setup(__props) {
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const data = common_vendor.reactive({
      fansList: []
    });
    common_vendor.onMounted(async () => {
      const r = await utils_api.getFansUser(userInfo.value);
      if (r) {
        data.fansList = r;
      }
    });
    async function addPersonalChat(item) {
      console.log("item", item);
      const r = await utils_api.addChatInfo({ userAId: item.userId, userBId: userInfo.value.consultantId });
      if (r) {
        common_vendor.index.showToast({
          title: "\u79C1\u804A\u6210\u529F"
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/chatHall/chatHall"
          });
        }, 1e3);
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(data.fansList, (item, k0, i0) => {
          return {
            a: item.userAvatar,
            b: common_vendor.t(item.userName),
            c: common_vendor.n(item.gender === "\u7537" ? "icon-nan" : "icon-xingbienv"),
            d: common_vendor.t(item.signature ? item.signature : "\u8FD9\u4E2A\u4EBA\u5F88\u61D2\u4EC0\u4E48\u90FD\u6CA1\u6709\u7559\u4E0B\uFF5E"),
            e: common_vendor.o(($event) => addPersonalChat(item), item.id),
            f: item.id
          };
        }),
        b: data.fansList.length === 0
      }, data.fansList.length === 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-961cd673"], ["__file", "/Users/apple/Desktop/Consultant/pages/fansList/fansList.vue"]]);
wx.createPage(MiniProgramPage);
