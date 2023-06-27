"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_request = require("../../../utils/request.js");
if (!Math) {
  loading();
}
const loading = () => "../../../directives/loading.js";
const _sfc_main = {
  __name: "index",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tweetId: {
      type: String,
      default: ""
    }
  },
  emits: ["changeDrawerVisible"],
  setup(__props, { emit }) {
    const props = __props;
    const isLoading = common_vendor.ref(true);
    const replyList = common_vendor.ref([]);
    function closeDrawer() {
      emit("changeDrawerVisible", false);
    }
    const { visible, tweetId } = common_vendor.toRefs(props);
    const init = async () => {
      try {
        const r = await utils_request.request({ url: "/tweet/findTweetById", data: { tweetId: tweetId.value } });
        replyList.value = r;
        isLoading.value = false;
      } catch (e) {
        isLoading.value = false;
      }
    };
    common_vendor.watch(visible, async () => {
      if (visible.value && tweetId.value) {
        await init();
      } else {
        isLoading.value = true;
      }
    }, { immediate: true });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(closeDrawer),
        b: common_vendor.unref(visible)
      }, common_vendor.unref(visible) ? {
        c: common_vendor.p({
          bgColor: "#fffbe5",
          loading: isLoading.value
        }),
        d: common_vendor.f(replyList.value.replyDtoList, (item, k0, i0) => {
          var _a, _b;
          return common_vendor.e({
            a: ((_a = item.replyUser) == null ? void 0 : _a.userAvatar) || "../../../static/image/logo.jpg",
            b: common_vendor.t(((_b = item.replyUser) == null ? void 0 : _b.userName) || "\u5FAE\u4FE1\u7528\u6237"),
            c: common_vendor.t(item.replyTime),
            d: common_vendor.t(item.textInfo),
            e: item.subReplyDtoList
          }, item.subReplyDtoList ? {
            f: common_vendor.f(item.subReplyDtoList, (ele, k1, i1) => {
              return {
                a: common_vendor.t(ele.postUser.userName),
                b: common_vendor.t(ele.toUser.userName),
                c: common_vendor.t(ele.textInfo),
                d: common_vendor.t(ele.createTime),
                e: ele.id
              };
            })
          } : {}, {
            g: item.id
          });
        })
      } : {}, {
        e: common_vendor.n(common_vendor.unref(visible) ? "visible" : "hidden")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-567a27b9"], ["__file", "/Users/apple/Desktop/Consultant/pages/activeManage/drawer/index.vue"]]);
wx.createComponent(Component);
