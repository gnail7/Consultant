"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const store_index = require("../../store/index.js");
const utils_index = require("../../utils/index.js");
require("../../utils/request.js");
if (!Math) {
  (loading + gSwitch + pager)();
}
const pager = () => "../../components/pager/pager.js";
const gSwitch = () => "../../components/gSwitch/index.js";
const loading = () => "../../directives/loading.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "21527622-operateWidth": _ctx.operateWidth
    }));
    const userStore = store_index.useUserStore();
    const dataList = common_vendor.ref([]);
    const isLoading = common_vendor.ref(true);
    common_vendor.computed$1(() => {
      const arr = dataList.value.map((item) => {
        const obj = {
          "\u59D3\u540D": item.realName,
          "\u54A8\u8BE2\u7528\u540D": item.consultantName,
          "\u54A8\u8BE2\u5E08\u8054\u7CFB\u7535\u8BDD": item.consultantPhone,
          "\u54A8\u8BE2\u5E08\u521B\u5EFA\u65F6\u95F4": item.createTime,
          "\u54A8\u8BE2\u5E08\u72B6\u6001": userStore.statusMap.get(item.status),
          "\u54A8\u8BE2\u5E08\u7C89\u4E1D\u6570\u91CF": item.followedNum
        };
        return obj;
      });
      return arr;
    });
    function filterTd(item) {
      const obj = {
        realName: item.realName,
        consultantName: item.consultantName,
        consultantPhone: item.consultantPhone,
        createTime: item.createTime,
        status: userStore.statusMap.get(item.status),
        followedNum: item.followedNum
      };
      return obj;
    }
    const columnHead = ["\u59D3\u540D", "\u54A8\u8BE2\u7528\u540D", "\u54A8\u8BE2\u5E08\u8054\u7CFB\u7535\u8BDD", "\u54A8\u8BE2\u5E08\u521B\u5EFA\u65F6\u95F4", "\u54A8\u8BE2\u5E08\u72B6\u6001", "\u54A8\u8BE2\u5E08\u7C89\u4E1D\u6570\u91CF"];
    common_vendor.computed$1(() => {
      const arr = dataList.value.map((item) => {
        const obj = {
          hasManager: item.hasManager === 1 ? true : false,
          userInfo: item
        };
        return obj;
      });
      return common_vendor.reactive(arr);
    });
    const pageInfo = common_vendor.reactive({
      pageSize: 8,
      currentPage: 1
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
    async function managerChange(item) {
      console.log("item", item);
      const name = item.consultantName;
      const sf = !item.hasManager === 1 ? "\u7BA1\u7406\u5458" : "\u54A8\u8BE2\u5E08";
      const flag = await utils_index.showModal(`\u786E\u8BA4\u66F4\u6539"${name}"\u8EAB\u4EFD\u4E3A${sf}\u5417?`);
      if (flag) {
        item.hasManager = !item.hasManager ? 1 : 0;
        const r = await utils_api.updateConsultant({ ...item, hasManager: item.hasManager });
        if (r.flag) {
          common_vendor.index.showToast({
            title: "\u66F4\u6539\u6210\u529F"
          });
        }
      }
    }
    common_vendor.onMounted(async () => {
      const r = await utils_api.getAllConsultants();
      if (r && r.length) {
        dataList.value = r;
        isLoading.value = false;
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          loading: isLoading.value
        }),
        b: common_vendor.f(columnHead, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        c: common_vendor.f(common_vendor.unref(currentList), (item, index1, i0) => {
          return {
            a: common_vendor.f(filterTd(item), (ele, index2, i1) => {
              return {
                a: common_vendor.t(ele),
                b: index2
              };
            }),
            b: index1
          };
        }),
        d: common_vendor.f(common_vendor.unref(currentList), (item, k0, i0) => {
          return {
            a: common_vendor.o(($event) => managerChange(item), item.id),
            b: "21527622-1-" + i0,
            c: common_vendor.p({
              item
            }),
            d: common_vendor.t(item.hasManager ? "\u7BA1\u7406\u5458" : "\u54A8\u8BE2\u5E08"),
            e: item.id
          };
        }),
        e: common_vendor.o(togglePage),
        f: common_vendor.o(backOrNext),
        g: common_vendor.p({
          total: dataList.value.length,
          currentPage: pageInfo.currentPage,
          pageSize: pageInfo.pageSize
        }),
        h: common_vendor.s(_ctx.__cssVars())
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-21527622"], ["__file", "/Users/apple/Desktop/Consultant/pages/manageConsultant/index.vue"]]);
wx.createComponent(Component);
