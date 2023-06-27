"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const utils_index = require("../../utils/index.js");
const utils_request = require("../../utils/request.js");
if (!Math) {
  (loading + pager)();
}
const loading = () => "../../directives/loading.js";
const pager = () => "../../components/pager/pager.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const sucideHotlinesList = common_vendor.ref([]);
    const renderInfo = common_vendor.computed$1(() => {
      const arr = sucideHotlinesList.value.map((item) => {
        const obj = {
          "\u4E0A\u62A5\u65F6\u95F4": item.reportTime,
          "\u4E0A\u62A5\u5BF9\u8C61": item.user.userName,
          "\u4E0A\u62A5\u5BF9\u8C61\u8054\u7CFB\u65B9\u5F0F": item.user.userPhone,
          "\u4E0A\u62A5\u4EBA": item.reporter.consultantName,
          "\u4E0A\u62A5\u4EBA\u8054\u7CFB\u65B9\u5F0F": item.reporter.consultantPhone
        };
        return obj;
      });
      return arr;
    });
    const columnHead = ["\u4E0A\u62A5\u65F6\u95F4", "\u4E0A\u62A5\u5BF9\u8C61", "\u4E0A\u62A5\u5BF9\u8C61\u8054\u7CFB\u65B9\u5F0F", "\u4E0A\u62A5\u4EBA", "\u4E0A\u62A5\u4EBA\u8054\u7CFB\u65B9\u5F0F"];
    const pageInfo = common_vendor.reactive({
      pageSize: 8,
      currentPage: 1
    });
    const isLoading = common_vendor.ref(true);
    const beginIndex = common_vendor.computed$1(() => (pageInfo.currentPage - 1) * pageInfo.pageSize);
    const currentList = common_vendor.computed$1(() => sucideHotlinesList.value.slice(beginIndex.value, beginIndex.value + pageInfo.pageSize));
    function togglePage(value) {
      pageInfo.currentPage = value;
    }
    function backOrNext(val) {
      if (val > 0) {
        pageInfo.currentPage < Math.ceil(sucideHotlinesList.value.length / pageInfo.pageSize) && pageInfo.currentPage++;
      } else {
        pageInfo.currentPage > 1 && pageInfo.currentPage--;
      }
    }
    function filterTd(item) {
      const obj = {
        "reportTime": item.reportTime,
        "userName": item.user.userName,
        "userPhone": item.user.userPhone,
        "consultantName": item.reporter.consultantName,
        "consultantPhone": item.reporter.consultantPhone
      };
      return obj;
    }
    async function handleSucide(item) {
      if (item.hasAddressed) {
        common_vendor.index.showToast({
          title: "\u5DF2\u5904\u7406",
          icon: "none"
        });
      } else {
        const flag = await utils_index.showModal("\u5DF2\u5BF9\u8BE5\u60C5\u51B5\u8FDB\u884C\u5904\u7406?");
        if (flag) {
          await utils_request.request({
            url: "/consultant/updateSuicideHotline",
            data: { ...item, hasAddressed: true }
          });
          item.hasAddressed = true;
        }
      }
    }
    common_vendor.onMounted(async () => {
      const r = await utils_api.getSucideHotlines();
      if (r && r.length) {
        sucideHotlinesList.value = r;
        isLoading.value = false;
        console.log(renderInfo.value);
      }
      setTimeout(() => {
        loading.value = false;
      }, 1e3);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(columnHead, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index
          };
        }),
        b: common_vendor.f(common_vendor.unref(currentList), (item, index1, i0) => {
          return {
            a: common_vendor.f(filterTd(item), (ele, index2, i1) => {
              return {
                a: common_vendor.t(ele.length && ele.length > 20 ? ele.slice(0, 20) + "..." : ele),
                b: index2 + "column"
              };
            }),
            b: index1 + "row"
          };
        }),
        c: common_vendor.f(common_vendor.unref(currentList), (item, k0, i0) => {
          return {
            a: common_vendor.t(item.hasAddressed ? "\u5DF2\u5904\u7406" : "\u5F85\u5904\u7406"),
            b: common_vendor.o(($event) => handleSucide(item), "fixed" + item.id),
            c: common_vendor.n(item.hasAddressed ? "" : "failed"),
            d: "fixed" + item.id
          };
        }),
        d: common_vendor.p({
          loading: isLoading.value
        }),
        e: common_vendor.o(togglePage),
        f: common_vendor.o(backOrNext),
        g: common_vendor.p({
          total: sucideHotlinesList.value.length,
          currentPage: pageInfo.currentPage,
          pageSize: pageInfo.pageSize
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6ddcdd1e"], ["__file", "/Users/apple/Desktop/Consultant/pages/sucide/index.vue"]]);
wx.createComponent(Component);
