"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_index = require("../../../store/index.js");
require("../../../utils/request.js");
const _sfc_main = {
  __name: "userItem",
  props: {
    item: Object,
    id: String
  },
  setup(__props) {
    const props = __props;
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const { item, id } = common_vendor.toRefs(props);
    const lastWordInfo = common_vendor.computed$1(() => {
      if (item.value.wordInfoList === [] || !item.value.wordInfoList) {
        return null;
      }
      return item.value.wordInfoList[item.value.wordInfoList.length - 1];
    });
    const unread = common_vendor.computed$1(() => item.value.wordInfoList.filter((ele) => !ele.hasRead && ele.sendId !== userInfo.value.consultantId).length);
    function toChatRoom() {
      if (!item.value.endTime) {
        const i = JSON.stringify({ ...item.value, personal: false, wordInfoList: [] });
        common_vendor.index.navigateTo({
          url: `/pages/chatRoom/chatRoom?item=${encodeURIComponent(i)}`
        });
      }
    }
    common_vendor.onUnmounted(() => {
      common_vendor.index.$emit(`consultHasEnd${item.value.id}`, true);
    });
    common_vendor.watch(() => item.value.wordInfoList, (newValue, oldValue) => {
      common_vendor.index.$emit(`updateWordInfoList${item.value.id}`, newValue);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(item).fromUser.userAvatar
      }, common_vendor.unref(item).fromUser.userAvatar ? {
        b: common_vendor.unref(item).fromUser.userAvatar
      } : {}, {
        c: common_vendor.unref(unread)
      }, common_vendor.unref(unread) ? {
        d: common_vendor.t(common_vendor.unref(unread))
      } : {}, {
        e: common_vendor.t(common_vendor.unref(item).fromUser.userName),
        f: common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "text"
      }, common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "text" ? {
        g: common_vendor.unref(lastWordInfo).wordText
      } : common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "image" ? {} : common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "video" ? {} : common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "voice" ? {} : {
        k: common_vendor.t(`\u60A8\u4E0E"${common_vendor.unref(item).fromUser.userName}"\u53EF\u4EE5\u5F00\u59CB\u804A\u5929\u5566\uFF01`)
      }, {
        h: common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "image",
        i: common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "video",
        j: common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "voice",
        l: !common_vendor.unref(item).endTime
      }, !common_vendor.unref(item).endTime ? {
        m: common_vendor.t(common_vendor.unref(lastWordInfo) ? common_vendor.unref(lastWordInfo).wordTime.slice(0, -3) : common_vendor.unref(item).startTime.slice(0, -3))
      } : common_vendor.unref(item).endTime && !common_vendor.unref(item).hasEnd ? {
        o: common_vendor.t(common_vendor.unref(item).endTime)
      } : {}, {
        n: common_vendor.unref(item).endTime && !common_vendor.unref(item).hasEnd,
        p: common_vendor.o(toChatRoom),
        q: common_vendor.o((...args) => _ctx.operate && _ctx.operate(...args))
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-84068f9d"], ["__file", "/Users/apple/Desktop/Consultant/pages/chatHall/component/userItem.vue"]]);
wx.createComponent(Component);
