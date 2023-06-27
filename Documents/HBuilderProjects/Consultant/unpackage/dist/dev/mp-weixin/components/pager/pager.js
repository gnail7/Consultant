"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "pager",
  props: {
    total: {
      type: Number
    },
    pageSize: {
      type: Number,
      default: 5
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  emits: ["pageChange", "iconClick"],
  setup(__props, { emit }) {
    const props = __props;
    const copy = common_vendor.ref(props.currentPage);
    const pagerSetting = {
      range: 1
    };
    const { total, pageSize, currentPage } = common_vendor.toRefs(props);
    const pages = common_vendor.computed$1(() => Math.ceil(total.value / pageSize.value));
    const computedPage = common_vendor.computed$1(() => {
      const start = Math.max(1, currentPage.value - 2);
      const end = Math.min(pages.value, start + 4);
      return Array(end - start + 1).fill().map((_, idx) => start + idx);
    });
    common_vendor.computed$1(() => {
      const length = pages.value;
      const arr = Array.from({ length }, (_, i) => i);
      return arr;
    });
    function clickHintIcon(val) {
      emit("iconClick", val);
      common_vendor.nextTick(() => {
        if (val > 0) {
          if (copy.value >= total.value) {
            return;
          }
          copy.value += val;
        } else {
          if (copy.value == 1) {
            return;
          }
          copy.value += val;
        }
      });
    }
    function togglePage(item) {
      emit("pageChange", item);
      common_vendor.nextTick(() => {
        copy.value = item;
      });
    }
    common_vendor.computed$1(() => {
      const c = currentPage.value;
      const { range } = pagerSetting;
      let startPos = c - range;
      startPos < 1 && (startPos = 1);
      let endPos = c + range;
      endPos > pages.value && (endPos = pages.value);
      return pages.value.slice(startPos, endPos);
    });
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => clickHintIcon(-1)),
        b: common_vendor.f(common_vendor.unref(computedPage), (item, k0, i0) => {
          return {
            a: common_vendor.t(item ? item : 0),
            b: item,
            c: common_vendor.n(item == copy.value ? "active" : ""),
            d: common_vendor.o(($event) => togglePage(item), item)
          };
        }),
        c: common_vendor.o(($event) => clickHintIcon(1))
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7685a802"], ["__file", "/Users/apple/Desktop/Consultant/components/pager/pager.vue"]]);
wx.createComponent(Component);
