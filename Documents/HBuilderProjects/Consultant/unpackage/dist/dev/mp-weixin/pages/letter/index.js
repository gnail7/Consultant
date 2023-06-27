"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const store_index = require("../../store/index.js");
const utils_index = require("../../utils/index.js");
require("../../utils/request.js");
if (!Math) {
  (gSelect + loading + drawer + reply + pager)();
}
const pager = () => "../../components/pager/pager.js";
const loading = () => "../../directives/loading.js";
const drawer = () => "./component/drawer.js";
const gSelect = () => "../../components/gSelect/index.js";
const reply = () => "./component/reply.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const dataList = common_vendor.ref([]);
    const isLoading = common_vendor.ref(true);
    const pageInfo = common_vendor.reactive({
      pageSize: 7,
      currentPage: 1,
      sortArr: ["createTime", "likeNum"],
      sorted: "createTime"
    });
    const beginIndex = common_vendor.computed$1(() => (pageInfo.currentPage - 1) * pageInfo.pageSize);
    const currentList = common_vendor.computed$1(() => dataList.value.slice(beginIndex.value, beginIndex.value + pageInfo.pageSize));
    function togglePage(value) {
      pageInfo.currentPage = value;
    }
    function backOrNext(val) {
      if (val > 0) {
        pageInfo.currentPage < Math.ceil(dataList.value.length / pageInfo.pageSize) && pageInfo.currentPage++;
      } else {
        pageInfo.currentPage > 1 && pageInfo.currentPage--;
      }
    }
    const columnHead = [
      "\u5BA1\u6838\u72B6\u6001",
      "\u53D1\u8868\u4EBA",
      "\u4FE1\u5C01\u7C7B\u522B",
      "\u5185\u5BB9",
      "\u70B9\u8D5E",
      "\u53D1\u8868\u65F6\u95F4"
    ];
    function seeDetails(item) {
      drawerOption.item = item;
      drawerOption.visible = true;
    }
    const drawerOption = common_vendor.reactive({
      item: {},
      visible: false
    });
    const selectOption = common_vendor.reactive({
      visible: false,
      options: [
        {
          label: "\u5DF2\u516C\u5F00(\u542B\u4F18\u8D28)",
          id: 1,
          selected: true
        },
        {
          label: "\u4F18\u8D28",
          id: 2,
          selected: false
        },
        {
          label: "\u672A\u516C\u5F00",
          id: 3,
          selected: false
        }
      ]
    });
    const replyOption = common_vendor.reactive({
      visible: false,
      item: {}
    });
    const getSelected = common_vendor.computed$1(() => {
      const arr = selectOption.options.filter((item) => item.selected);
      return arr[0];
    });
    function changeDrawerVisible() {
      drawerOption.visible = false;
    }
    function expandOption(flag) {
      selectOption.visible = flag;
    }
    function selectedOption(item) {
      selectOption.options = selectOption.options.map((ele) => {
        if (ele.id === item.id)
          ele.selected = true;
        else {
          ele.selected = false;
        }
        selectOption.visible = false;
        return ele;
      });
    }
    async function successOpen(ele) {
      const r = await utils_api.updateLetter({ ...ele, hasOpen: true });
      if (r) {
        ele.hasOpen = true;
        common_vendor.index.showToast({
          title: "\u6210\u529F\u516C\u5F00",
          icon: "none"
        });
      }
      const a = selectOption.options.find((item) => item.selected);
      await init(a);
      drawerOption.visible = false;
    }
    async function cancleOpen(ele) {
      await utils_api.updateLetter({ ...ele, hasOpen: false });
      ele.hasOpen = false;
      common_vendor.index.showToast({
        title: "\u53D6\u6D88\u516C\u5F00",
        icon: "none"
      });
      const a = selectOption.options.find((item) => item.selected);
      await init(a);
      drawerOption.visible = false;
    }
    function replyStatus(item) {
      userInfo.value.consultantId;
      const flag = item.letterReplyDtos.find((ele) => ele.postUser.consultantId);
      if (flag) {
        return true;
      }
      return false;
    }
    function toReply(item) {
      replyOption.item = item;
      replyOption.visible = true;
    }
    function changeReplyVisible(flag) {
      replyOption.visible = flag;
    }
    function replyInput(info) {
      replyOption.item.replyInfo = info;
    }
    async function replyTo() {
      const required = utils_index.pattern.namePattern;
      const t = new Date().getTime();
      const time = utils_index.formatDate(t);
      const flag = await utils_index.validator(replyOption.item.replyInfo, required);
      const { postUser, replyInfo, createTime, letterId } = replyOption.item;
      if (flag) {
        const r = await utils_api.replayLetter({ postUser: userInfo.value, replyInfo, createTime: time, letterId });
        if (r.flag) {
          replyOption.visible = false;
          replyOption.item.letterReplyDtos.unshift({ replyInfo, postUser: userInfo.value, createTime: time });
          replyOption.item = {};
          common_vendor.index.showToast({
            title: "\u56DE\u590D\u6210\u529F"
          });
        }
      }
    }
    async function addToGoodArticle(obj) {
      const { item, flag } = obj;
      item.hasGood = flag;
      console.log({ ...item, hasGood: flag, id: BigInt(item.id) });
      await utils_api.updateLetter({ ...item, hasGood: flag });
    }
    async function closeHasOpen(ele) {
      const r = await utils_api.updateLetter({ ...ele, hasOpen: false });
      if (r) {
        ele.hasOpen = false;
        common_vendor.index.showToast({
          title: "cancel"
        });
      }
    }
    async function init(selected) {
      const id = selected == null ? void 0 : selected.id;
      switch (id) {
        case 1:
          const r1 = await utils_api.getUserLetterList({});
          if (Object.prototype.toString.call(r1) === "[object Array]") {
            isLoading.value = false;
            dataList.value = r1.filter((item) => item.hasOpen);
            dataList.value.sort((a, b) => b.id - a.id);
            isLoading.value = false;
          }
          break;
        case 2:
          const r2 = await utils_api.getGoodLetters();
          if (Object.prototype.toString.call(r2) === "[object Array]") {
            dataList.value = r2;
            isLoading.value = false;
            dataList.value.sort((a, b) => b.id - a.id);
            console.log(dataList.value);
          }
          break;
        case 3:
          const r3 = await utils_api.getUserLetterList({});
          if (Object.prototype.toString.call(r3) === "[object Array]") {
            isLoading.value = false;
            dataList.value = r3.filter((ele) => !ele.hasOpen);
            dataList.value.sort((a, b) => b.id - a.id);
            isLoading.value = false;
          }
          break;
        default:
          await utils_api.getUserLetterList({});
          if (Object.prototype.toString.call(r1) === "[object Array]") {
            isLoading.value = false;
            dataList.value = r1.filter((item) => item.hasOpen);
            dataList.value.sort((a, b) => b.id - a.id);
            isLoading.value = false;
          }
          break;
      }
    }
    common_vendor.provide("init", init);
    common_vendor.watch(getSelected, (newValue, oldValue) => {
      isLoading.value = true;
      init(newValue);
      dataList.value.sort((a, b) => {
        return b.id - a.id;
      });
    });
    common_vendor.onMounted(async () => {
      await init(getSelected.value);
      dataList.value.sort((a, b) => b.id - a.id);
      setTimeout(() => {
        loading.value = false;
      }, 1e3);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(expandOption),
        b: common_vendor.o(selectedOption),
        c: common_vendor.p({
          options: selectOption.options,
          visible: selectOption.visible
        }),
        d: common_vendor.f(columnHead, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        e: dataList.value.length === 0
      }, dataList.value.length === 0 ? {} : {}, {
        f: common_vendor.f(common_vendor.unref(currentList), (item, index1, i0) => {
          return common_vendor.e({
            a: item.hasGood
          }, item.hasGood ? {} : {}, {
            b: common_vendor.t(item.hasOpen ? "\u5DF2\u516C\u5F00" : "\u672A\u516C\u5F00"),
            c: common_vendor.n(item.hasOpen ? "success" : "failed"),
            d: common_vendor.t(item.postUser.userName),
            e: common_vendor.t(item.letterType),
            f: common_vendor.t(item.letterInfo),
            g: common_vendor.t(item.likeNum),
            h: common_vendor.t(item.createTime),
            i: index1
          });
        }),
        g: common_vendor.f(common_vendor.unref(currentList), (item, k0, i0) => {
          return {
            a: common_vendor.o(($event) => seeDetails(item), item.id),
            b: common_vendor.t(replyStatus(item) ? "\u5DF2\u56DE\u590D" : "\u672A\u56DE\u590D"),
            c: common_vendor.o(($event) => toReply(item), item.id),
            d: common_vendor.n(replyStatus(item) ? "has" : ""),
            e: item.id
          };
        }),
        h: common_vendor.p({
          loading: isLoading.value
        }),
        i: common_vendor.o(toReply),
        j: common_vendor.o(closeHasOpen),
        k: common_vendor.o(successOpen),
        l: common_vendor.o(addToGoodArticle),
        m: common_vendor.o(cancleOpen),
        n: common_vendor.o(changeDrawerVisible),
        o: common_vendor.p({
          visible: drawerOption.visible,
          item: drawerOption.item,
          selectedId: common_vendor.unref(getSelected).id
        }),
        p: common_vendor.o(replyTo),
        q: common_vendor.o(replyInput),
        r: common_vendor.o(changeReplyVisible),
        s: common_vendor.p({
          visible: replyOption.visible,
          item: replyOption.item
        }),
        t: common_vendor.o(togglePage),
        v: common_vendor.o(backOrNext),
        w: common_vendor.p({
          total: dataList.value.length,
          currentPage: pageInfo.currentPage,
          pageSize: pageInfo.pageSize
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3dd0d5f8"], ["__file", "/Users/apple/Desktop/Consultant/pages/letter/index.vue"]]);
wx.createComponent(Component);
