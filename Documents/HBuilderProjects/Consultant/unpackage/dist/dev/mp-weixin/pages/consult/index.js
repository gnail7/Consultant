"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const utils_request = require("../../utils/request.js");
const store_index = require("../../store/index.js");
const utils_index = require("../../utils/index.js");
if (!Math) {
  (gSelect + loading + pager)();
}
const pager = () => "../../components/pager/pager.js";
const loading = () => "../../components/loading/index.js";
const gSelect = () => "../../components/gSelect/index.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const pageInfo = common_vendor.reactive({
      pageSize: 7,
      currentPage: 1
    });
    const isLoading = common_vendor.ref(true);
    const dataList = common_vendor.ref([]);
    const transferDialog = common_vendor.reactive({
      visible: false
    });
    function backOrNext(val) {
      if (val > 0) {
        pageInfo.currentPage < Math.ceil(dataList.value.length / pageInfo.pageSize) && pageInfo.currentPage++;
      } else {
        pageInfo.currentPage > 1 && pageInfo.currentPage--;
      }
    }
    function backOrNextOfCon(val) {
      if (val > 0) {
        transferPageInfo.currentPage < transferPageInfo.total && (transferPageInfo.currentPage = transferPageInfo.currentPage + 1);
      } else {
        transferPageInfo.currentPage > 1 && (transferPageInfo.currentPage = transferPageInfo.currentPage - 1);
      }
    }
    function computedStatus(item) {
      let obj = {
        statusClass: "consulting",
        label: "\u54A8\u8BE2\u4E2D"
      };
      if (item.hasEnd) {
        obj = {
          statusClass: "end-consult",
          label: "\u7ED3\u675F"
        };
      } else if (!item.hasEnd && item.endTime) {
        obj = {
          statusClass: "wait-feedback",
          label: "\u5BF9\u65B9\u586B\u5199\u53CD\u9988\u540E\u7ED3\u675F"
        };
      }
      return obj;
    }
    function togglePage(value) {
      pageInfo.currentPage = value;
    }
    const consultantList = common_vendor.ref([]);
    const transferPageInfo = common_vendor.reactive({
      pageSize: 7,
      currentPage: 1,
      queryString: "",
      total: 0
    });
    const toggleConsultantListPage = (val) => {
      transferPageInfo.currentPage = val;
    };
    common_vendor.watch(() => transferPageInfo.currentPage, async () => {
      await initTransfer();
    });
    function closeList() {
      transferDialog.visible = false;
    }
    const beginIndex = common_vendor.computed$1(() => (pageInfo.currentPage - 1) * pageInfo.pageSize);
    const currentList = common_vendor.computed$1(() => {
      return dataList.value.slice(beginIndex.value, beginIndex.value + pageInfo.pageSize);
    });
    const columnHead = ["\u5934\u50CF", "\u7528\u6237\u540D", "\u54A8\u8BE2\u72B6\u6001", "\u8054\u7CFB\u65B9\u5F0F", "\u53CD\u9988"];
    const currentConsult = common_vendor.ref({});
    const getSelected = common_vendor.computed$1(() => {
      const arr = selectOption.options.filter((item) => item.selected);
      return arr[0];
    });
    const selectOption = common_vendor.reactive({
      visible: false,
      options: [
        {
          label: "\u54A8\u8BE2\u4E2D",
          id: 1,
          selected: true
        },
        {
          label: "\u5DF2\u7ED3\u675F",
          id: 2,
          selected: false
        }
      ]
    });
    function showTransfer(item) {
      transferDialog.visible = true;
      currentConsult.value = item;
    }
    function expandOption(flag) {
      selectOption.visible = flag;
    }
    function transfer(item) {
      const t = new Date().getTime();
      const time = utils_index.formatDate(t);
      common_vendor.index.showModal({
        content: `\u786E\u8BA4\u5C06"${currentConsult.value.fromUser.userName}"\u8F6C\u63A5\u7ED9${item.consultantName}?`,
        success: async (res) => {
          if (res.confirm) {
            const r2 = await utils_request.request({
              url: "/consultant/updateConsultation",
              method: "post",
              data: {
                ...currentConsult.value,
                wordInfoList: [],
                toUser: item,
                startTime: time
              }
            });
            if (r2.flag) {
              userStore.changeConsultNums(userInfo.value.consultNum--);
              common_vendor.index.setStorageSync("userInfo", userInfo.value);
              common_vendor.index.showToast({
                title: "\u8F6C\u63A5\u6210\u529F",
                icon: "none"
              });
              await utils_api.updateConsultant({ ...userInfo.value, status: 0 });
              userInfo.value = { ...userInfo.value, status: 0 };
              common_vendor.index.setStorageSync("userInfo", userInfo.value);
              transferDialog.visible = false;
            }
          }
        }
      });
    }
    function toChatRoom(item) {
      if (!item.endTime) {
        JSON.stringify({ ...item, personal: false });
        common_vendor.index.switchTab({
          url: `/pages/chatHall/chatHall`
        });
      }
    }
    async function addPersonalChat(item) {
      const flag = await utils_index.showModal(`\u786E\u8BA4\u4E0E"${item.consultantName || item.fromUser.userName}"\u79C1\u804A`);
      if (flag) {
        const r = await utils_api.addChatInfo({ userAId: item.consultantId || item.fromUser.userId, userBId: userInfo.value.consultantId });
        if (r) {
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/chatHall/chatHall"
            });
          }, 1e3);
        }
      }
    }
    function showModal2(data) {
      return new Promise((resolve, reject) => {
        common_vendor.index.showModal({
          content: `\u7ED3\u675F\u54A8\u8BE2,\u786E\u8BA4\u7ED3\u675F${data.fromUser.userName}\u7684\u54A8\u8BE2\u5417?`,
          success: (res) => {
            if (res.confirm) {
              resolve(true);
            }
            resolve(false);
          }
        });
      });
    }
    async function emitEndResult(item) {
      const flag = await showModal2(item);
      if (flag) {
        const t = new Date().getTime();
        const endTime = utils_index.formatDate(t);
        const consultNum = userInfo.value.consultNum + 1;
        const r1 = await utils_request.request({
          url: "/consultant/updateConsultation",
          data: { ...item, endTime, hasEnd: false },
          method: "post"
        });
        if (r1.flag) {
          await utils_api.updateConsultant({ ...userInfo.value, consultNum });
          userInfo.value = { ...userInfo.value };
          common_vendor.index.setStorageSync("userInfo", userInfo.value);
          userStore.changeConsultNums(userInfo.value.consultNum--);
          common_vendor.index.showToast({
            icon: "none",
            title: "\u7ED3\u675F\u54A8\u8BE2"
          });
        }
      }
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
    common_vendor.watch(getSelected, (newValue, oldValue) => {
      isLoading.value = true;
      init(newValue);
    });
    async function init(selected) {
      const { id } = selected;
      switch (id) {
        case 2:
          common_vendor.index.$off("getWordInfoList");
          const r = await utils_request.request({
            url: "/consultant/getConsultDoneList",
            method: "POST",
            data: { ...userInfo.value }
          });
          dataList.value = r;
          isLoading.value = false;
          break;
        case 1:
          common_vendor.index.$on("getWordInfoList", (res) => {
            dataList.value = res;
            isLoading.value = false;
          });
          break;
      }
    }
    const initTransfer = async () => {
      const r = await utils_request.request({ url: "/consultant/getFreeConsultants", method: "POST", data: transferPageInfo });
      if (r) {
        consultantList.value = r.rows;
        transferPageInfo.total = r.total;
      }
    };
    common_vendor.onMounted(async () => {
      await init(getSelected.value);
      await initTransfer();
      setTimeout(() => {
        if (!isLoading.value) {
          isLoading.value = false;
        }
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
          return {
            a: item.fromUser.userAvatar ? item.fromUser.userAvatar : "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
            b: common_vendor.t(item.fromUser.userName),
            c: common_vendor.t(computedStatus(item).label),
            d: common_vendor.n(computedStatus(item).statusClass),
            e: common_vendor.t(item.fromUser.userPhone),
            f: common_vendor.t(item.feedback ? item.feedback : "\u6682\u65E0\u53CD\u9988"),
            g: index1
          };
        }),
        g: common_vendor.f(common_vendor.unref(currentList), (item, k0, i0) => {
          return common_vendor.e({
            a: item.hasEnd
          }, item.hasEnd ? {
            b: common_vendor.o(($event) => addPersonalChat(item), item.id)
          } : {}, {
            c: !item.hasEnd && !item.endTime
          }, !item.hasEnd && !item.endTime ? {
            d: common_vendor.o(($event) => toChatRoom(item), item.id)
          } : {}, {
            e: !item.hasEnd && !item.endTime
          }, !item.hasEnd && !item.endTime ? {
            f: common_vendor.o(($event) => showTransfer(item), item.id)
          } : {}, {
            g: !item.hasEnd && !item.endTime
          }, !item.hasEnd && !item.endTime ? {
            h: common_vendor.o(($event) => emitEndResult(item), item.id)
          } : {}, {
            i: !item.hasEnd && item.endTime
          }, !item.hasEnd && item.endTime ? {} : {}, {
            j: item.id
          });
        }),
        h: common_vendor.p({
          loading: isLoading.value
        }),
        i: common_vendor.o(togglePage),
        j: common_vendor.o(backOrNext),
        k: common_vendor.p({
          total: dataList.value.length,
          currentPage: pageInfo.currentPage,
          pageSize: pageInfo.pageSize
        }),
        l: common_vendor.o(closeList),
        m: common_vendor.f(consultantList.value, (item, k0, i0) => {
          return {
            a: item.consultantAvatar,
            b: common_vendor.t(item.consultantName),
            c: common_vendor.o(($event) => transfer(item), item.id),
            d: common_vendor.o(($event) => addPersonalChat(item), item.id),
            e: item.id
          };
        }),
        n: common_vendor.o(toggleConsultantListPage),
        o: common_vendor.o(backOrNextOfCon),
        p: common_vendor.p({
          total: transferPageInfo.total,
          currentPage: transferPageInfo.currentPage,
          pageSize: transferPageInfo.pageSize
        }),
        q: transferDialog.visible
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7a0095d3"], ["__file", "/Users/apple/Desktop/Consultant/pages/consult/index.vue"]]);
wx.createComponent(Component);
