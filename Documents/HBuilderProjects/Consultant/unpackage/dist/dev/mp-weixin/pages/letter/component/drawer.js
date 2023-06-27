"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_index = require("../../../utils/index.js");
const store_index = require("../../../store/index.js");
const utils_request = require("../../../utils/request.js");
if (!Math) {
  loading();
}
const loading = () => "../../chatRoom/component/chatLoading.js";
const _sfc_main = {
  __name: "drawer",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    item: Object,
    selectedId: Number
  },
  emits: ["changeDrawerVisible", "successToOpen", "addToGoodArticle", "closeHasOpen", "toReply", "cancleOpen"],
  setup(__props, { emit }) {
    const props = __props;
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const { visible, item, selectedId } = common_vendor.toRefs(props);
    const pageInfo = common_vendor.reactive({
      pageSize: 5,
      currentPage: 1,
      isLoading: false
    });
    const beginIndex = common_vendor.ref(0);
    const currentList = common_vendor.computed$1(() => {
      const newArr = item.value.letterReplyDtos;
      let end = (beginIndex.value + pageInfo.pageSize - 1) * pageInfo.currentPage;
      if (end >= item.value.letterReplyDtos.length) {
        end = item.value.letterReplyDtos.length;
      }
      return newArr.slice(beginIndex.value, end);
    });
    function changeVisible() {
      emit("changeDrawerVisible");
    }
    async function emitCancelOpen() {
      const txt = "\u786E\u8BA4\u53D6\u6D88\u516C\u5F00?";
      const flag = await utils_index.showModal(txt);
      if (flag) {
        emit("cancleOpen", item.value);
      }
    }
    function scrollToBottom() {
      if (currentList.value.length < item.value.letterReplyDtos.length) {
        pageInfo.isLoading = true;
        setTimeout(() => {
          pageInfo.currentPage++;
          pageInfo.isLoading = false;
        }, 1e3);
      }
    }
    async function changeHasOpen() {
      const txt = "\u786E\u8BA4\u516C\u5F00?";
      const flag = await utils_index.showModal(txt);
      if (flag) {
        emit("successOpen", item.value);
      }
    }
    async function addToGoodArticle(flag) {
      const txt1 = flag ? "\u786E\u8BA4\u5C06\u8BE5\u4FE1\u5C01\u9009\u4E3A\u7B54\u6848\u4E4B\u4E66?" : "\u786E\u8BA4\u53D6\u6D88\u8BE5\u4FE1\u5C01\u7B54\u6848\u4E4B\u4E66\u7684\u8D44\u683C?";
      const f1 = await utils_index.showModal(txt1);
      if (f1) {
        emit("addToGoodArticle", { item: item.value, flag });
      }
    }
    function toReply(item2) {
      emit("toReply", item2);
    }
    const init = common_vendor.inject("init");
    async function deleteArticle() {
      const confirm = await utils_index.showModal("\u786E\u8BA4\u5220\u9664\u8FD9\u7BC7\u6587\u7AE0\u5417?");
      if (confirm) {
        await utils_request.request({
          url: "/consultant/deleteLetter",
          data: { letterId: item.value.letterId }
        });
        emit("changeDrawerVisible");
        common_vendor.index.showToast({
          title: "\u5220\u9664\u6210\u529F",
          icon: "none"
        });
        init({ id: selectedId.value });
      }
    }
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(visible)
      }, common_vendor.unref(visible) ? common_vendor.e({
        b: common_vendor.o(changeVisible),
        c: common_vendor.o(changeVisible),
        d: common_vendor.o(deleteArticle),
        e: common_vendor.unref(item).hasOpen
      }, common_vendor.unref(item).hasOpen ? {
        f: common_vendor.o(emitCancelOpen)
      } : {}, {
        g: common_vendor.t(common_vendor.unref(item).postUser.userName),
        h: common_vendor.t(common_vendor.unref(item).createTime),
        i: common_vendor.t(common_vendor.unref(item).letterInfo),
        j: common_vendor.f(common_vendor.unref(currentList), (ele, index, i0) => {
          return common_vendor.e({
            a: ele.postUser.consultantAvatar || ele.postUser.userAvatar,
            b: common_vendor.t(ele.postUser.userName || ele.postUser.consultantName),
            c: ele.postUser.consultantId && ele.postUser.consultantId === common_vendor.unref(userInfo).consultantId
          }, ele.postUser.consultantId && ele.postUser.consultantId === common_vendor.unref(userInfo).consultantId ? {} : {}, {
            d: common_vendor.t(ele.replyInfo),
            e: common_vendor.t(ele.createTime.slice(0, -3)),
            f: index
          });
        }),
        k: common_vendor.unref(currentList).length === common_vendor.unref(item).letterReplyDtos.length
      }, common_vendor.unref(currentList).length === common_vendor.unref(item).letterReplyDtos.length ? {} : {
        l: common_vendor.p({
          loading: pageInfo.isLoading
        })
      }, {
        m: common_vendor.o(scrollToBottom),
        n: common_vendor.unref(userInfo).hasManager
      }, common_vendor.unref(userInfo).hasManager ? common_vendor.e({
        o: common_vendor.o(($event) => toReply(common_vendor.unref(item))),
        p: !common_vendor.unref(item).hasOpen
      }, !common_vendor.unref(item).hasOpen ? {
        q: common_vendor.o(changeHasOpen)
      } : common_vendor.unref(item).hasOpen && !common_vendor.unref(item).hasGood ? {
        s: common_vendor.o(($event) => addToGoodArticle(true))
      } : {
        t: common_vendor.o(($event) => addToGoodArticle(false))
      }, {
        r: common_vendor.unref(item).hasOpen && !common_vendor.unref(item).hasGood
      }) : {
        v: common_vendor.o(($event) => toReply(common_vendor.unref(item)))
      }) : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a705b827"], ["__file", "/Users/apple/Desktop/Consultant/pages/letter/component/drawer.vue"]]);
wx.createComponent(Component);
