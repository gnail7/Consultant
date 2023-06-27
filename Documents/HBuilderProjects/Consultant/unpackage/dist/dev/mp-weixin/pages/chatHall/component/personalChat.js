"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_index = require("../../../store/index.js");
require("../../../utils/request.js");
const _sfc_main = {
  __name: "personalChat",
  props: {
    wordInfoList: {
      type: Array,
      default: []
    },
    item: Object,
    userA: Object,
    startTime: {
      type: String,
      default: ""
    },
    endTime: {
      type: String,
      default: ""
    },
    hasEnd: {
      type: Boolean,
      default: false
    },
    id: String
  },
  setup(__props) {
    const props = __props;
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const { userA, wordInfoList, id, startTime, endTime, hasEnd, item } = common_vendor.toRefs(props);
    const anotherUser = common_vendor.computed$1(() => {
      if (item.value.userA.consultantId && item.value.userA.consultantId === userInfo.value.consultantId) {
        return item.value.userB;
      }
      return item.value.userA;
    });
    const lastWordInfo = common_vendor.computed$1(() => {
      if (wordInfoList.value === [] || !wordInfoList.value) {
        return null;
      }
      return wordInfoList.value[wordInfoList.value.length - 1];
    });
    const unread = common_vendor.computed$1(() => wordInfoList.value.filter((ele) => !ele.hasRead && ele.sendId !== userInfo.value.consultantId).length);
    function toChatRoom() {
      const obj = { fromUser: userA.value, wordInfoList: [], id: id.value, personal: true, userA: anotherUser.value };
      const i = JSON.stringify(obj);
      common_vendor.index.navigateTo({
        url: `/pages/chatRoom/chatRoom?item=${encodeURIComponent(i)}`
      });
    }
    common_vendor.watch(wordInfoList, (newValue, oldValue) => {
      common_vendor.index.$emit(`updateWordInfoList${id.value}`, newValue);
    });
    function operate() {
    }
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(userA).userAvatar || common_vendor.unref(userA).consultantAvatar
      }, common_vendor.unref(userA).userAvatar || common_vendor.unref(userA).consultantAvatar ? {
        b: common_vendor.unref(userA).type ? common_vendor.unref(userA).userAvatar : common_vendor.unref(userA).consultantAvatar
      } : {}, {
        c: common_vendor.unref(unread)
      }, common_vendor.unref(unread) ? {
        d: common_vendor.t(common_vendor.unref(unread))
      } : {}, {
        e: common_vendor.t(common_vendor.unref(userA).type ? common_vendor.unref(userA).userName : common_vendor.unref(userA).consultantName),
        f: common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "text"
      }, common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "text" ? {
        g: common_vendor.unref(lastWordInfo).wordText
      } : common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "image" ? {} : common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "video" ? {} : common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "voice" ? {} : {
        k: common_vendor.t(`\u60A8\u4E0E"${common_vendor.unref(userA).type ? common_vendor.unref(userA).userName : common_vendor.unref(userA).consultantName}"\u53EF\u4EE5\u5F00\u59CB\u79C1\u804A\u5566\uFF01`)
      }, {
        h: common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "image",
        i: common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "video",
        j: common_vendor.unref(lastWordInfo) && common_vendor.unref(lastWordInfo).type === "voice",
        l: !common_vendor.unref(endTime)
      }, !common_vendor.unref(endTime) ? {
        m: common_vendor.t(common_vendor.unref(lastWordInfo) ? common_vendor.unref(lastWordInfo).wordTime.slice(0, -3) : common_vendor.unref(startTime).slice(0, -3))
      } : {}, {
        n: common_vendor.o(toChatRoom),
        o: common_vendor.o(operate)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-135b3a8d"], ["__file", "/Users/apple/Desktop/Consultant/pages/chatHall/component/personalChat.vue"]]);
wx.createComponent(Component);
