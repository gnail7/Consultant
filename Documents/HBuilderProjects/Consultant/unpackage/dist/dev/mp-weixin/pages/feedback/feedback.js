"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
if (!Math) {
  (loading + drawer + pager)();
}
const drawer = () => "../userList/component/drawer.js";
const loading = () => "../../directives/loading.js";
const pager = () => "../../components/pager/pager.js";
const _sfc_main = {
  __name: "feedback",
  setup(__props) {
    const dataList = common_vendor.ref([]);
    const pageInfo = common_vendor.reactive({
      pageSize: 5,
      currentPage: 1,
      total: 0
    });
    const drawerOption = common_vendor.reactive({
      visible: false,
      item: {},
      props: [
        {
          prop: "postNum",
          icon: "icon-fatie",
          label: "\u53D1\u5E16\u6B21\u6570"
        },
        {
          prop: "replyNum",
          icon: "icon-huifu",
          label: "\u56DE\u590D\u6B21\u6570"
        },
        {
          prop: "letterNum",
          icon: "icon-xinfengxinjianyouxiangxianhuaxinfeng",
          label: "\u4FE1\u5C01\u6B21\u6570"
        },
        {
          prop: "roomNum",
          icon: "icon-cha",
          label: "\u8336\u8BDD\u4F1A\u6B21\u6570"
        },
        {
          prop: "consultNum",
          icon: "icon-zixun-tousu",
          label: "\u54A8\u8BE2\u6B21\u6570"
        }
      ]
    });
    const columnHead = ["\u5934\u50CF", "\u53CD\u9988\u4EBAid", "\u53CD\u9988\u4EBA", "\u53CD\u9988\u5185\u5BB9", "\u53CD\u9988\u65F6\u95F4"];
    const isLoading = common_vendor.ref(true);
    function filterTd(item) {
      const obj = {
        userAvatar: item.user.userAvatar,
        userId: item.user.userId,
        userName: item.user.userName,
        feedbackInfo: item.feedbackInfo,
        feedbackTime: item.feedbackTime
      };
      return obj;
    }
    function togglePage(value) {
      pageInfo.currentPage = value;
    }
    function backOrNext(val) {
      if (val > 0) {
        if (pageInfo.currentPage < Math.ceil(pageInfo.total / pageInfo.pageSize)) {
          pageInfo.currentPage = pageInfo.currentPage + 1;
        }
      } else {
        if (pageInfo.currentPage > 1) {
          pageInfo.currentPage = pageInfo.currentPage - 1;
        }
      }
    }
    function changeDrawerVisible(flag) {
      drawerOption.visible = flag;
    }
    function seeDetail(item) {
      drawerOption.item = item;
      drawerOption.visible = true;
    }
    async function getFeedbackListApi(queryString = null) {
      const r = await utils_request.request({
        url: "/consultant/getFeedbackList",
        data: { ...pageInfo, queryString }
      });
      pageInfo.total = r.total;
      dataList.value = r.rows;
      isLoading.value = false;
    }
    common_vendor.watch(() => pageInfo.currentPage, (newValue, oldValue) => {
      isLoading.value = true;
      getFeedbackListApi();
    });
    common_vendor.onMounted(async () => {
      await getFeedbackListApi();
      setTimeout(() => {
        loading.value = false;
      }, 1e3);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          loading: isLoading.value
        }),
        b: common_vendor.f(columnHead, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        c: common_vendor.f(dataList.value, (item, index1, i0) => {
          return {
            a: common_vendor.f(filterTd(item), (ele, index2, i1) => {
              return common_vendor.e({
                a: index2 === "userAvatar"
              }, index2 === "userAvatar" ? {
                b: ele
              } : {
                c: common_vendor.t(ele.length && ele.length > 20 ? ele.slice(0, 20) + "..." : ele)
              }, {
                d: index2
              });
            }),
            b: index1
          };
        }),
        d: common_vendor.f(dataList.value, (item, k0, i0) => {
          return {
            a: common_vendor.o(($event) => seeDetail(item), item.id),
            b: item.id
          };
        }),
        e: common_vendor.p({
          loading: isLoading.value
        }),
        f: drawerOption.visible
      }, drawerOption.visible ? {
        g: common_vendor.o(($event) => changeDrawerVisible(false)),
        h: common_vendor.t(drawerOption.item.user.userName ? drawerOption.item.user.userName : ""),
        i: common_vendor.t(drawerOption.item.feedbackTime ? drawerOption.item.feedbackTime : ""),
        j: common_vendor.t(drawerOption.item.feedbackInfo ? drawerOption.item.feedbackInfo : ""),
        k: common_vendor.o(changeDrawerVisible),
        l: common_vendor.p({
          visible: drawerOption.visible
        })
      } : {}, {
        m: common_vendor.o(togglePage),
        n: common_vendor.o(backOrNext),
        o: common_vendor.p({
          total: pageInfo.total,
          currentPage: pageInfo.currentPage,
          pageSize: pageInfo.pageSize
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a24b82f2"], ["__file", "/Users/apple/Desktop/Consultant/pages/feedback/feedback.vue"]]);
wx.createComponent(Component);
