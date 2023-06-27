"use strict";
const common_vendor = require("../common/vendor.js");
const store_index = require("../store/index.js");
require("../utils/request.js");
if (!Math) {
  item();
}
const item = () => Promise.resolve().then(() => L1VzZXJzL2FwcGxlL0Rlc2t0b3AvQ29uc3VsdGFudC9jb21wb25lbnRzL2l0ZW0udnVl);
const _sfc_main = {
  __name: "item",
  props: ["data"],
  setup(__props) {
    const props = __props;
    const commonStore = store_index.useCommonStore();
    const { currentPage, routes, crumbList } = common_vendor.storeToRefs(commonStore);
    const { data } = common_vendor.toRefs(props);
    function togglePage(item2) {
      if (!item2.children) {
        currentPage.value = item2;
        const flag = crumbList.value.find((ele) => ele.name === item2.name);
        if (!flag) {
          crumbList.value.push(item2);
        }
      }
    }
    function changeSubMenu(item2) {
      item2.meta.hidden = !item2.meta.hidden;
      if (!item2.meta.sub) {
        routes.value = routes.value.map((ele) => {
          if (ele.name !== item2.name) {
            ele.meta.hidden = true;
          }
          return ele;
        });
      }
    }
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(data), (item2, k0, i0) => {
          return common_vendor.e({
            a: item2.children === void 0
          }, item2.children === void 0 ? {
            b: common_vendor.n("icon-" + item2.meta.icon),
            c: common_vendor.t(item2.meta.label),
            d: common_vendor.n(common_vendor.unref(currentPage).name === item2.name ? "active" : "")
          } : common_vendor.e({
            e: common_vendor.n("icon-" + item2.meta.icon),
            f: common_vendor.t(item2.meta.label),
            g: common_vendor.n(item2.meta.hidden ? "icon-xiangshangjiantou" : "icon-xiangxiajiantou"),
            h: common_vendor.o(($event) => changeSubMenu(item2), item2.name),
            i: !item2.meta.hidden
          }, !item2.meta.hidden ? {
            j: "0b2eeb19-0-" + i0,
            k: common_vendor.p({
              data: item2.children
            })
          } : {}), {
            l: item2.name,
            m: common_vendor.o(($event) => togglePage(item2), item2.name)
          });
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0b2eeb19"], ["__file", "/Users/apple/Desktop/Consultant/components/item.vue"]]);
wx.createComponent(Component);
const L1VzZXJzL2FwcGxlL0Rlc2t0b3AvQ29uc3VsdGFudC9jb21wb25lbnRzL2l0ZW0udnVl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
