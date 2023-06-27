"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const store_index = require("../../store/index.js");
const utils_request = require("../../utils/request.js");
if (!Math) {
  (loading + drawer + pager)();
}
const loading = () => "../../directives/loading.js";
const pager = () => "../../components/pager/pager.js";
const drawer = () => "./component/drawer.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const dataList = common_vendor.ref([]);
    const isLoading = common_vendor.ref(true);
    const pageInfo = common_vendor.reactive({
      pageSize: 8,
      currentPage: 1,
      queryString: userInfo.value.consultantPhone,
      total: 0
    });
    const columnHead = ["\u5934\u50CF", "\u7528\u6237\u540D", "\u6821\u540D", "\u5E74\u7EA7", "\u4E13\u4E1A", "\u5B66\u53F7", "\u7528\u6237id", "\u8054\u7CFB\u65B9\u5F0F", "\u4E2A\u6027\u7B7E\u540D"];
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
    function changeDrawerVisible(flag) {
      drawerOption.visible = flag;
    }
    async function seeActivity(item) {
      drawerOption.visible = true;
      const r = await utils_request.request({
        url: "/consultant/getUserActiveData",
        data: {
          userId: item.userId
        }
      });
      drawerOption.item = r;
    }
    function filterTd(item) {
      const obj = {
        userAvatar: item.userAvatar,
        userName: item.userName,
        schoolName: item.schoolName,
        gradeName: item.gradeName,
        majorName: item.majorName,
        stuId: item.stuId,
        userId: item.userId,
        userPhone: item.userPhone,
        signature: item.signature
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
    async function getUserListApi(queryString = null) {
      const r = await utils_api.getUserList({ pageSize: pageInfo.pageSize, currentPage: pageInfo.currentPage, queryString });
      if (r.total) {
        pageInfo.total = r.total;
        dataList.value = r.rows;
      } else {
        common_vendor.index.showToast({
          title: "\u672A\u67E5\u627E\u5230\u5BF9\u5E94\u7528\u6237",
          icon: "none"
        });
      }
      isLoading.value = false;
    }
    const keyWord = common_vendor.ref("");
    async function searchKeyWord() {
      for (let i = 1; i <= pageInfo.total; i++) {
        const r = await utils_api.getUserList({
          pageSize: pageInfo.pageSize,
          currentPage: i,
          queryString: keyWord.value
        });
        if (r.total) {
          pageInfo.total = r.total;
          dataList.value = r.rows;
          return;
        } else {
          common_vendor.index.showToast({
            title: "\u672A\u67E5\u627E\u5230\u5BF9\u5E94\u7528\u6237",
            icon: "none"
          });
        }
        isLoading.value = false;
      }
    }
    common_vendor.watch(keyWord, (newValue, oldValue) => {
      if (!newValue) {
        getUserListApi();
      }
    });
    common_vendor.watch(() => pageInfo.currentPage, (newValue, oldValue) => {
      getUserListApi();
    });
    common_vendor.onMounted(() => {
      getUserListApi();
      setTimeout(() => {
        loading.value = false;
      }, 1e3);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o([($event) => keyWord.value = $event.detail.value, (...args) => _ctx.input && _ctx.input(...args)]),
        b: keyWord.value,
        c: common_vendor.o(searchKeyWord),
        d: common_vendor.f(columnHead, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        e: common_vendor.f(dataList.value, (item, index1, i0) => {
          return {
            a: common_vendor.f(filterTd(item), (ele, index2, i1) => {
              return common_vendor.e({
                a: index2 === "userAvatar"
              }, index2 === "userAvatar" ? {
                b: ele
              } : {
                c: common_vendor.t(ele ? ele : "\u8BE5\u7528\u6237\u5F88\u61D2\u4EC0\u4E48\u90FD\u6CA1\u7559\u4E0B")
              }, {
                d: index2 + "column"
              });
            }),
            b: index1 + "row"
          };
        }),
        f: common_vendor.f(dataList.value, (item, k0, i0) => {
          return {
            a: common_vendor.o(($event) => seeActivity(item), "fixed" + item.id),
            b: "fixed" + item.id
          };
        }),
        g: common_vendor.p({
          loading: isLoading.value
        }),
        h: common_vendor.f(drawerOption.props, (item, k0, i0) => {
          return {
            a: common_vendor.n(item.icon),
            b: common_vendor.t(item.label),
            c: common_vendor.t(drawerOption.item[item.prop] ? drawerOption.item[item.prop] : 0),
            d: item.prop
          };
        }),
        i: common_vendor.o(changeDrawerVisible),
        j: common_vendor.p({
          visible: drawerOption.visible
        }),
        k: common_vendor.o(togglePage),
        l: common_vendor.o(backOrNext),
        m: common_vendor.p({
          total: pageInfo.total + 1,
          currentPage: pageInfo.currentPage,
          pageSize: pageInfo.pageSize
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93b1025f"], ["__file", "/Users/apple/Desktop/Consultant/pages/userList/index.vue"]]);
wx.createComponent(Component);
