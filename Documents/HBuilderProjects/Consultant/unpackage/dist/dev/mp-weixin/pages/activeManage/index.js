"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const utils_index = require("../../utils/index.js");
if (!Math) {
  (loading + gImage + drawer + pager)();
}
const loading = () => "../../directives/loading.js";
const pager = () => "../../components/pager/pager.js";
const drawer = () => "./drawer/index.js";
const gImage = () => "../chatRoom/component/gImage.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const activityList = common_vendor.ref([]);
    const pageInfo = common_vendor.reactive({
      pageSize: 10,
      currentPage: 1,
      queryString: null,
      total: 0
    });
    const drawerOption = common_vendor.reactive({
      visible: false,
      item: {}
    });
    const isLoading = common_vendor.ref(true);
    const columnHead = ["\u7528\u6237", "\u8054\u7CFB\u65B9\u5F0F", "\u53D1\u8868\u5185\u5BB9", "\u83B7\u8D5E\u6570", "\u8BC4\u8BBA\u6570", "\u53D1\u8868\u65F6\u95F4"];
    const init = async () => {
      const r = await utils_request.request({ url: "/user/getTweetList", data: pageInfo });
      activityList.value = r.rows;
      isLoading.value = false;
      pageInfo.total = r.total;
    };
    function filterTd(item) {
      var _a, _b;
      const obj = {
        name: (_a = item.post_user) == null ? void 0 : _a.userName,
        userPhone: (_b = item.post_user) == null ? void 0 : _b.userPhone,
        wordText: item == null ? void 0 : item.wordText,
        likeNum: item.likeNum,
        commentNum: item.commentNum,
        tweetTime: item.tweetTime
      };
      return obj;
    }
    async function togglePage(value) {
      pageInfo.currentPage = value;
      isLoading.value = true;
      await init();
    }
    async function backOrNext(val) {
      if (val > 0) {
        if (pageInfo.currentPage < Math.ceil(pageInfo.total / pageInfo.pageSize)) {
          pageInfo.currentPage = pageInfo.currentPage + 1;
        }
      } else {
        if (pageInfo.currentPage > 1) {
          pageInfo.currentPage = pageInfo.currentPage - 1;
        }
      }
      isLoading.value = true;
      init();
    }
    const seeActivity = (item) => {
      drawerOption.item = item;
      drawerOption.visible = true;
    };
    function changeDrawerVisible(flag) {
      drawerOption.visible = flag;
    }
    const deleteTweet = async (id) => {
      const confirm = await utils_index.showModal("\u786E\u8BA4\u5220\u9664\u8FD9\u4E2A\u52A8\u6001\u5417?");
      switch (confirm) {
        case true:
          const r = await utils_request.request({ url: "/tweet/deleteTweet", data: id });
          if (r) {
            common_vendor.index.showToast({
              title: "\u5220\u9664\u6210\u529F"
            });
            await init();
          }
          drawerOption.visible = false;
          break;
      }
    };
    common_vendor.onMounted(async () => {
      await init();
    });
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: common_vendor.f(columnHead, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        b: common_vendor.f(activityList.value, (item, index1, i0) => {
          return {
            a: common_vendor.f(filterTd(item), (ele, index2, i1) => {
              return common_vendor.e({
                a: index2 === "wordText"
              }, index2 === "wordText" ? {
                b: common_vendor.t(ele)
              } : {
                c: common_vendor.t(ele)
              }, {
                d: index2 + "column"
              });
            }),
            b: index1 + "row"
          };
        }),
        c: common_vendor.f(activityList.value, (item, k0, i0) => {
          return {
            a: common_vendor.o(($event) => seeActivity(item), "fixed" + item.id),
            b: "fixed" + item.id
          };
        }),
        d: common_vendor.p({
          loading: isLoading.value
        }),
        e: common_vendor.o(($event) => deleteTweet(drawerOption.item.id)),
        f: (_a = drawerOption.item.post_user) == null ? void 0 : _a.userAvatar,
        g: common_vendor.t(((_b = drawerOption.item.post_user) == null ? void 0 : _b.userName) || "\u5FAE\u4FE1\u7528\u6237"),
        h: drawerOption.item.imglist
      }, drawerOption.item.imglist ? {
        i: common_vendor.f((_c = drawerOption.item.imglist) == null ? void 0 : _c.split(","), (item, k0, i0) => {
          return {
            a: item,
            b: "11d4d290-2-" + i0 + ",11d4d290-1",
            c: common_vendor.p({
              mode: "widthFix",
              src: item
            })
          };
        })
      } : {}, {
        j: drawerOption.item.wordText,
        k: common_vendor.t(drawerOption.item.tweetTime),
        l: common_vendor.o(changeDrawerVisible),
        m: common_vendor.p({
          tweetId: drawerOption.item.id,
          visible: drawerOption.visible
        }),
        n: common_vendor.o(togglePage),
        o: common_vendor.o(backOrNext),
        p: common_vendor.p({
          total: pageInfo.total + 1,
          currentPage: pageInfo.currentPage,
          pageSize: pageInfo.pageSize
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-11d4d290"], ["__file", "/Users/apple/Desktop/Consultant/pages/activeManage/index.vue"]]);
wx.createComponent(Component);
