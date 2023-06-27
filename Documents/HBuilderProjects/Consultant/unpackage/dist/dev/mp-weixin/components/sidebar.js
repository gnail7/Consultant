"use strict";
const common_vendor = require("../common/vendor.js");
const store_index = require("../store/index.js");
require("../utils/request.js");
if (!Math) {
  item();
}
const item = () => "./item.js";
const _sfc_main = {
  __name: "sidebar",
  setup(__props) {
    const commonStore = store_index.useCommonStore();
    const { showDrawer, routes } = common_vendor.storeToRefs(commonStore);
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const sideBarList = common_vendor.ref([]);
    sideBarList.value = filterRoutes(routes.value);
    function filterRoutes(r) {
      const role = userInfo.value.hasManager;
      const ans = r.filter((item2) => {
        if (item2.meta.roles.includes(role) && !item2.noShow) {
          if (item2.children) {
            item2.children = filterRoutes(item2.children);
          }
          return true;
        }
      });
      return ans;
    }
    function closeDrawer(e) {
      showDrawer.value = false;
    }
    common_vendor.watch(() => userInfo.value.hasManager, (newValue, oldValue) => {
      sideBarList.value = Object.assign([], filterRoutes(routes.value));
      sideBarList.value = filterRoutes(routes.value);
    }, { immediate: true });
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          data: sideBarList.value
        }),
        b: common_vendor.o(closeDrawer)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/apple/Desktop/Consultant/components/sidebar.vue"]]);
wx.createComponent(Component);
