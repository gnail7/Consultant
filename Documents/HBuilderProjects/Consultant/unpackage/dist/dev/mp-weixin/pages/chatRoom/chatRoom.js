"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_request = require("../../utils/request.js");
const utils_index = require("../../utils/index.js");
const store_index = require("../../store/index.js");
const utils_api = require("../../utils/api.js");
if (!Array) {
  const _easycom_pager2 = common_vendor.resolveComponent("pager");
  _easycom_pager2();
}
const _easycom_pager = () => "../../components/pager/pager.js";
if (!Math) {
  (topnav + loading + gImage + gVideo + gAudio + gEmoji + _easycom_pager + recordDialog)();
}
const topnav = () => "./component/topnav.js";
const gVideo = () => "../../components/video/index.js";
const gImage = () => "./component/gImage.js";
const gAudio = () => "./component/gAudio.js";
const loading = () => "./component/loading.js";
const recordDialog = () => "./component/recordDialog.js";
const gEmoji = () => "../../components/emoji/gEmoji.js";
const _sfc_main = {
  __name: "chatRoom",
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "9b186cfb-mainChatHeight": common_vendor.unref(mainChatHeight)
    }));
    const personal = common_vendor.ref(false);
    const bottomHeight = common_vendor.ref(0);
    const focusPos = common_vendor.ref(false);
    common_vendor.computed$1(() => bottomHeight.value + "px");
    const footerHeight = common_vendor.ref(0);
    const footerInit = common_vendor.ref(0);
    const scrollTop = common_vendor.ref(0);
    const scrollViewId = common_vendor.ref("g0");
    const autoHeight = common_vendor.ref(false);
    common_vendor.ref(null);
    common_vendor.computed$1(() => data.value.wordInfoList.length);
    const mainChatHeight = common_vendor.computed$1(() => {
      const page = common_vendor.index.getSystemInfoSync();
      let fHeight = JSON.parse(JSON.stringify(footerHeight.value));
      if (bottomHeight.value) {
        fHeight = JSON.parse(JSON.stringify(footerInit.value));
      }
      const pageHeight = page.screenHeight;
      const topBarHeight = utils_index.getTopBarHeightSync();
      return pageHeight - fHeight - topBarHeight - bottomHeight.value + "px";
    });
    const userStore = store_index.useUserStore();
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const tools = common_vendor.reactive({
      visible: false
    });
    const data = common_vendor.ref({
      id: null,
      fromUser: {},
      toUser: {},
      wordInfoList: []
    });
    const pageInfo = common_vendor.reactive({
      pageSize: 20,
      currentPage: 1,
      triggered: false,
      isLoading: false,
      cPageSize: 4,
      cCurrentPage: 1
    });
    const hide = common_vendor.ref(false);
    const consultantHasManager = common_vendor.ref([]);
    const consultantList = common_vendor.ref([]);
    const beginIndex = common_vendor.computed$1(() => {
      if (data.value.wordInfoList.length - pageInfo.currentPage * pageInfo.pageSize <= 0) {
        return 0;
      }
      return Math.floor(data.value.wordInfoList.length - pageInfo.currentPage * pageInfo.pageSize);
    });
    const computedWordInfoList = common_vendor.computed$1(() => {
      return data.value.wordInfoList.slice(beginIndex.value, data.value.wordInfoList.length);
    });
    const subControler = common_vendor.reactive({
      visible: false,
      start: 0,
      end: 0,
      dialogVisible: false,
      userInfoVisible: false,
      remberVisible: false,
      recoderVisible: false,
      imageVisible: false
    });
    const form = common_vendor.ref(resetForm());
    function resetForm() {
      return {
        wordText: "",
        type: "text",
        fromUser: data.value.fromUser,
        toUser: data.value.toUser,
        wordTime: null,
        sendId: userInfo.value.consultantId
      };
    }
    common_vendor.computed$1(() => {
      if (form.value.wordText) {
        return "btn";
      }
      return "";
    });
    common_vendor.computed$1(() => {
      return "hideEndBtn";
    });
    common_vendor.onLoad(async (option) => {
      const item = option.item;
      const r = JSON.parse(decodeURIComponent(item));
      const { fromUser } = r;
      personal.value = r.personal;
      Object.assign(data.value, r);
      try {
        if (personal.value) {
          const word = common_vendor.index.getStorageSync("personalList");
          const fromId = fromUser.consultantId || fromUser.userId;
          const thisWordInfo = word.filter((item2) => (item2.userA.userId || item2.userA.consultantId) === fromId || (item2.userB.userId || item2.userB.consultantId) === fromId);
          data.value.wordInfoList = thisWordInfo[0].chatRecords || [];
          const length = data.value.wordInfoList.length;
          common_vendor.nextTick(() => {
            var _a;
            scrollViewId.value = "g" + ((_a = data.value.wordInfoList[length - 1]) == null ? void 0 : _a.id);
          });
        } else {
          const word = common_vendor.index.getStorageSync("wordinfolist");
          const thisWordInfo = word.filter((item2) => item2.id === r.id);
          data.value.wordInfoList = thisWordInfo[0].wordInfoList || [];
          const length = data.value.wordInfoList.length;
          common_vendor.nextTick(() => {
            var _a;
            scrollViewId.value = "g" + ((_a = data.value.wordInfoList[length - 1]) == null ? void 0 : _a.id);
          });
        }
      } catch (e) {
        data.value.wordInfoList = [];
      }
      data.value.toUser = userInfo.value;
      form.value = { ...form.value, toUser: userInfo.value, fromUser: data.value.fromUser };
      common_vendor.index.$on(`updateWordInfoList${r.id}`, async (res) => {
        var _a;
        if (data.value.wordInfoList <= res) {
          data.value.wordInfoList = res;
          const noReadList = res.filter((item2) => !item2.hasRead);
          const noMySend = noReadList.filter((item2) => item2.sendId !== userInfo.value.consultantId);
          if (noMySend.length > 0 && !personal.value) {
            const handleReadList = noMySend.map((item2) => {
              item2.hasRead = true;
              return item2;
            });
            await utils_request.request({
              url: "/user/updateRecords",
              data: handleReadList,
              method: "POST"
            });
          } else if (noMySend.length > 0 && personal.value) {
            const newHandleReadList = noMySend.map((item2) => {
              item2.hasRead = true;
              item2.userB = userInfo.value;
              item2.userA = data.value.userA;
              return item2;
            });
            await utils_request.request({
              url: "/consultant/updateChatRecords",
              data: newHandleReadList
            });
          }
          if (!hide.value) {
            if (data.value.wordInfoList.length > 0) {
              scrollViewId.value = "g" + ((_a = data.value.wordInfoList[data.value.wordInfoList.length - 1]) == null ? void 0 : _a.id);
            }
          }
        }
      });
      common_vendor.index.$on(`consultHasEnd${r.id}`, async (hasEnd) => {
        await utils_api.updateConsultant({ ...userInfo.value, consultNum });
        userInfo.value = { ...userInfo.value };
        common_vendor.index.setStorageSync("userInfo", userInfo.value);
        userStore.changeConsultNums(userInfo.value.consultNum - 1);
        common_vendor.index.showToast({
          title: "\u5BF9\u65B9\u5DF2\u7ED3\u675F\u54A8\u8BE2",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/chatHall/chatHall"
          });
        }, 1e3);
      });
    });
    common_vendor.onShow(() => {
      hide.value = false;
    });
    common_vendor.onHide(() => {
      hide.value = true;
    });
    common_vendor.onUnload(() => {
      common_vendor.index.$off(`updateWordInfoList${data.value.id}`);
      common_vendor.index.$off(`consultHasEnd${data.value.id}`);
      common_vendor.index.$off(`consultHasEnd${data.value.id}`);
    });
    function scrollIntoBottom() {
      scrollViewId.value = "g1";
      common_vendor.nextTick(() => {
        setTimeout(() => {
          scrollViewId.value = "g" + data.value.wordInfoList[data.value.wordInfoList.length - 1].id;
        }, 100);
      });
    }
    function getFooterHeight() {
      common_vendor.nextTick(() => {
        const footer = common_vendor.index.createSelectorQuery().select("#footer");
        footer.boundingClientRect((data2) => {
          const { height } = data2;
          footerHeight.value = height;
        }).exec();
      });
    }
    function keyboardChange(e) {
      if (e.detail.height > 0) {
        subControler.visible = false;
        tools.visible = false;
      }
      bottomHeight.value = e.detail.height;
      console.log("bottomHeight", bottomHeight.value);
    }
    function nextPage() {
      pageInfo.isLoading = true;
      setTimeout(() => {
        pageInfo.currentPage++;
        pageInfo.isLoading = false;
      }, 1e3);
    }
    function navigateToUserPage() {
      const i = JSON.stringify(data.value);
      common_vendor.index.navigateTo({
        url: `/pages/userPage/userPage?allData=${encodeURIComponent(i)}`
      });
    }
    async function emitEndResult() {
      if (!personal.value) {
        const flag = await utils_index.showModal(`\u7ED3\u675F\u54A8\u8BE2,\u786E\u8BA4\u7ED3\u675F"${data.value.fromUser.userName}"\u7684\u54A8\u8BE2\u5417?`);
        if (flag) {
          const t = new Date().getTime();
          const endTime = utils_index.formatDate(t);
          const consultNum2 = userInfo.value.consultNum + 1;
          const r1 = await utils_request.request({
            url: "/consultant/updateConsultation",
            data: { ...data.value, endTime, hasEnd: false },
            method: "post"
          });
          if (r1.flag) {
            userStore.changeConsultNums(userInfo.value.consultNum - 1);
            userInfo.value = { ...userInfo.value, consultNum: consultNum2 };
            common_vendor.index.setStorageSync("userInfo", userInfo.value);
            common_vendor.index.showToast({
              icon: "none",
              title: "\u7ED3\u675F\u54A8\u8BE2"
            });
            setTimeout(() => {
              common_vendor.index.hideToast();
              common_vendor.index.switchTab({
                url: "/pages/chatHall/chatHall"
              });
            }, 1e3);
          }
        }
      }
    }
    const endPersonal = async () => {
      const flag = await utils_index.showModal(`\u7ED3\u675F\u54A8\u8BE2,\u786E\u8BA4\u7ED3\u675F"${data.value.fromUser.userName || data.value.fromUser.consultantName}"\u7684\u79C1\u804A\u5417?`);
      if (flag) {
        await utils_request.request({
          url: "/user/deleteChatInfo",
          method: "post",
          data: {
            userAId: data.value.fromUser.userId || data.value.fromUser.consultantId,
            userBId: userInfo.value.consultantId
          }
        });
        common_vendor.index.showToast({
          icon: "none",
          title: "\u7ED3\u675F\u79C1\u804A"
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/chatHall/chatHall"
          });
        }, 1e3);
      }
    };
    async function addRecord() {
      setTimeout(async () => {
        focusPos.value = false;
        const t = new Date().getTime();
        form.value.wordTime = utils_index.formatDate(t);
        data.value;
        form.value.isUserConsult = false;
        let replaceWordText = form.value.wordText;
        form.value.sendId = userInfo.value.consultantId;
        form.value.fromUser = data.value.fromUser;
        form.value.toUser = userInfo.value;
        if (form.value.wordText && !data.value.endTime) {
          let pattern = /\[.*?\]/g;
          let matchResult = form.value.wordText.match(pattern);
          if (matchResult != null) {
            matchResult.map((x) => {
              let name = x.substr(0, x.length - 1).substr(1);
              let url = `<img src="https://howcode.online/emo/${name}.png" class="emo-image"/>`;
              replaceWordText = replaceWordText.replace(x, url);
            });
          }
          replaceWordText = "<p>" + replaceWordText + "</p>";
          const URL = personal.value ? "/consultant/addChatRecord" : "/consultant/addConsultRecord";
          const r = await utils_request.request({
            url: `${URL}`,
            method: "POST",
            data: {
              hasRead: 0,
              sendId: userInfo.value.consultantId,
              type: "text",
              userAId: form.value.fromUser.userId || form.value.fromUser.consultantId,
              userBId: userInfo.value.consultantId,
              wordText: utils_index.utf16toEntities(replaceWordText),
              wordTime: form.value.wordTime,
              isUserConsult: false,
              fromUser: form.value.fromUser,
              toUser: userInfo.value
            }
          });
          if (r.flag) {
            data.value.wordInfoList.push({ ...form.value, wordText: utils_index.utf16toEntities(replaceWordText), loading: true });
            common_vendor.index.$emit(`updateWordInfoList${data.value.id}`, data.value.wordInfoList);
            form.value.wordText = "";
          }
          scrollIntoBottom();
        } else if (data.endTime) {
          common_vendor.index.showToast({
            title: "\u5F53\u524D\u54A8\u8BE2\u5DF2\u7ED3\u675F"
          });
        }
      }, 100);
    }
    async function addAudioRecord(type, wordText) {
      const t = new Date().getTime();
      form.value.wordTime = utils_index.formatDate(t);
      data.value;
      const URL = personal.value ? "/consultant/addChatRecord" : "/consultant/addConsultRecord";
      const r = await utils_request.request({
        url: `${URL}`,
        method: "POST",
        data: {
          hasRead: 0,
          sendId: userInfo.value.consultantId,
          type,
          userAId: form.value.fromUser.userId || form.value.fromUser.consultantId,
          userBId: userInfo.value.consultantId,
          wordText,
          wordTime: form.value.wordTime,
          isUserConsult: false,
          fromUser: form.value.fromUser,
          toUser: userInfo.value
        }
      });
      if (r.flag) {
        data.value.wordInfoList.push({ ...form.value, wordText, type });
        common_vendor.index.$emit(`updateWordInfoList${data.value.id}`, data.value.wordInfoList);
        form.value.wordText = "";
      }
      scrollIntoBottom();
      subControler.recoderVisible = false;
    }
    common_vendor.provide("addAudioRecord", addAudioRecord);
    function changeEmojiVisible(event) {
      subControler.visible = !subControler.visible;
      bottomHeight.value = 0;
      if (subControler.visible) {
        tools.visible = false;
        common_vendor.nextTick(() => {
          scrollIntoBottom();
        });
      }
      getFooterHeight();
    }
    function changeToolVisible() {
      tools.visible = !tools.visible;
      bottomHeight.value = 0;
      if (tools.visible) {
        subControler.visible = false;
        common_vendor.nextTick(() => {
          scrollIntoBottom();
        });
      }
      getFooterHeight();
    }
    async function openPopOver(att, flag) {
      subControler[att] = flag;
      if (att == "remberVisible") {
        const userId = data.value.fromUser.userId;
        common_vendor.index.navigateTo({
          url: `/pages/memo/memo?userId=${userId}`
        });
      }
    }
    common_vendor.provide("openPopOver", openPopOver);
    function insertEmoji(data2) {
      const { start, end } = subControler;
      const { title } = data2;
      if (form.value.wordText) {
        form.value.wordText = form.value.wordText.slice(0, start) + title + form.value.wordText.slice(end);
      } else {
        form.value.wordText = form.value.wordText + title;
      }
      subControler.start = subControler.start + 4;
      subControler.end = subControler.end + 4;
    }
    function focus(e) {
      subControler.visible = false;
      tools.visible = false;
      getFooterHeight();
      scrollIntoBottom();
      savePos();
    }
    function onBlur(e) {
      focusPos.value = false;
      form.value.wordText = e.detail.value;
      autoHeight.value = false;
      savePos();
    }
    function savePosition(e) {
      form.value.wordText = e.detail.value;
      common_vendor.index.getSelectedTextRange({
        success: (res) => {
          subControler.start = res.start;
          subControler.end = res.end;
        },
        fail: (e2) => {
        }
      });
    }
    function savePos(e) {
      common_vendor.index.getSelectedTextRange({
        success: (res) => {
          subControler.start = res.start;
          subControler.end = res.end;
        },
        fail: (e2) => {
        }
      });
    }
    async function privateChat(item) {
      const flag = await utils_index.showModal(`\u786E\u5B9A\u79C1\u804A${item.consultantName}`);
      if (flag) {
        await utils_api.addChatInfo({ userAId: item.consultantId, userBId: userInfo.value.consultantId });
        common_vendor.index.showToast({
          title: "\u79C1\u804A\u804A\u5929\u5BA4\u5DF2\u7ECF\u5EFA\u7ACB",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.switchTab({
            url: "/pages/chatHall/chatHall"
          });
        }, 800);
      }
    }
    async function addSucide() {
      const flag = await utils_index.showModal("\u786E\u5B9A\u5F53\u524D\u7528\u6237\u5177\u6709\u81EA\u6740\u503E\u5411?");
      const { fromUser } = data.value;
      const templateData = {
        "touser": userInfo.value.openid,
        "template_id": "IK18Knq0P-rDharivgecSmnaSIFkDUYXNEksOWDOjL0",
        "page": "pages/index/index",
        "miniprogram_state": "formal",
        "lang": "zh_CN",
        "data": {
          "thing1": {
            "value": "\u7D27\u6025\u81EA\u6740\u70ED\u7EBF\u4E0A\u62A5"
          },
          "thing3": {
            "value": "\u8BF7\u5C3D\u5FEB\u5904\u7406!"
          }
        }
      };
      if (flag && userInfo.value.hasManager) {
        try {
          const t = new Date().getTime();
          const reportTime = utils_index.formatDate(t);
          const r = await utils_api.addSucideHotline({
            reportTime,
            user: fromUser,
            reporter: userInfo.value
          });
          if (r.flag) {
            for (let item of consultantHasManager.value) {
              await utils_api.suscribeApi(JSON.stringify({ ...templateData, touser: item.openid }));
            }
            common_vendor.index.showToast({
              title: "\u4E0A\u62A5\u6210\u529F"
            });
          }
        } catch (e) {
          common_vendor.index.showToast({
            title: "\u4E0A\u62A5\u5931\u8D25"
          });
        }
      }
    }
    function transfer(item) {
      const { fromUser } = data.value;
      utils_api.suscribeApi();
      common_vendor.index.showModal({
        content: `\u786E\u8BA4\u5C06"${fromUser.userName}"\u8F6C\u63A5\u7ED9${item.consultantName}?`,
        success: async (res) => {
          if (res.confirm) {
            const t = new Date().getTime();
            const time = utils_index.formatDate(t);
            const r2 = await utils_request.request({
              url: "/consultant/updateConsultation",
              method: "POST",
              data: {
                id: data.value.id,
                fromUser,
                feedback: "",
                toUser: item,
                wordInfoList: [],
                startTime: time,
                hasEnd: false,
                endTime: ""
              }
            });
            if (r2.flag) {
              userStore.changeConsultNums(userInfo.value.consultNum--);
              common_vendor.index.showToast({
                title: "\u8F6C\u63A5\u6210\u529F",
                icon: "none"
              });
              await utils_api.updateConsultant({ ...userInfo.value, status: 0 });
              userInfo.value = { ...userInfo.value, status: 0 };
              common_vendor.index.setStorageSync("userInfo", userInfo.value);
              setTimeout(() => {
                common_vendor.index.switchTab({
                  url: "/pages/chatHall/chatHall"
                });
              }, 1e3);
            }
          }
        }
      });
    }
    function backOrNextOfCon(val) {
      if (val > 0) {
        transferPageInfo.currentPage < transferPageInfo.total && (transferPageInfo.currentPage = transferPageInfo.currentPage + 1);
      } else {
        transferPageInfo.currentPage > 1 && (transferPageInfo.currentPage = transferPageInfo.currentPage - 1);
      }
    }
    const transferPageInfo = common_vendor.reactive({
      pageSize: 7,
      currentPage: 1,
      queryString: null,
      total: 0
    });
    const toggleConsultantListPage = (val) => {
      transferPageInfo.currentPage = val;
    };
    common_vendor.watch(() => transferPageInfo.currentPage, async () => {
      await initTransfer();
    });
    const initTransfer = async () => {
      const r = await utils_request.request({ url: "/consultant/getFreeConsultants", method: "POST", data: transferPageInfo });
      if (r) {
        consultantList.value = r.rows;
        transferPageInfo.total = r.total;
      }
    };
    common_vendor.onMounted(async () => {
      try {
        await initTransfer();
        const r = await utils_request.request({ url: "/consultant/getAllConsultants", method: "POST" });
        if (r) {
          consultantHasManager.value = r.filter((item) => item.hasManager);
        }
      } catch (e) {
      }
      getFooterHeight();
    });
    common_vendor.onBeforeUnmount(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: data.value.id,
        b: common_vendor.p({
          fromUser: data.value.fromUser,
          personal: personal.value,
          id: data.value.id
        }),
        c: common_vendor.unref(beginIndex) === 0
      }, common_vendor.unref(beginIndex) === 0 ? {
        d: common_vendor.t(data.value.startTime),
        e: common_vendor.o(navigateToUserPage)
      } : {
        f: common_vendor.p({
          loading: pageInfo.isLoading
        })
      }, {
        g: common_vendor.f(common_vendor.unref(computedWordInfoList), (item, k0, i0) => {
          return common_vendor.e({
            a: item.sendId === common_vendor.unref(userInfo).consultantId
          }, item.sendId === common_vendor.unref(userInfo).consultantId ? common_vendor.e({
            b: common_vendor.unref(userInfo).consultantAvatar,
            c: item.type == "text" || !item.type
          }, item.type == "text" || !item.type ? {
            d: item.wordText
          } : item.type == "image" ? {
            f: "9b186cfb-2-" + i0,
            g: common_vendor.p({
              src: item.wordText
            })
          } : item.type == "video" ? {
            i: "9b186cfb-3-" + i0,
            j: common_vendor.p({
              src: item.wordText
            })
          } : item.type == "voice" ? {
            l: "9b186cfb-4-" + i0,
            m: common_vendor.p({
              src: item.wordText
            })
          } : {}, {
            e: item.type == "image",
            h: item.type == "video",
            k: item.type == "voice"
          }) : common_vendor.e({
            n: data.value.fromUser.userAvatar || data.value.fromUser.consultantAvatar,
            o: common_vendor.o(navigateToUserPage, item.id),
            p: item.type == "text" || !item.type
          }, item.type == "text" || !item.type ? {
            q: item.wordText
          } : item.type == "image" ? {
            s: "9b186cfb-5-" + i0,
            t: common_vendor.p({
              src: item.wordText
            })
          } : item.type == "video" ? {
            w: "9b186cfb-6-" + i0,
            x: common_vendor.p({
              src: item.wordText
            })
          } : item.type == "voice" ? {
            z: "9b186cfb-7-" + i0,
            A: common_vendor.p({
              src: item.wordText
            })
          } : {}, {
            r: item.type == "image",
            v: item.type == "video",
            y: item.type == "voice"
          }), {
            B: item.id,
            C: "g" + item.id
          });
        }),
        h: scrollTop.value,
        i: common_vendor.o(nextPage),
        j: scrollViewId.value,
        k: common_vendor.o(focus),
        l: common_vendor.o(onBlur),
        m: common_vendor.o([($event) => form.value.wordText = $event.detail.value, savePosition]),
        n: common_vendor.o(savePos),
        o: common_vendor.o(savePos),
        p: common_vendor.o(keyboardChange),
        q: form.value.wordText,
        r: common_vendor.o(changeEmojiVisible),
        s: common_vendor.o(changeToolVisible),
        t: common_vendor.o(addRecord),
        v: common_vendor.o(insertEmoji),
        w: common_vendor.p({
          height: "350rpx",
          visible: subControler.visible
        }),
        x: tools.visible
      }, tools.visible ? common_vendor.e({
        y: common_vendor.o(($event) => openPopOver("recoderVisible", true)),
        z: !personal.value
      }, !personal.value ? {
        A: common_vendor.o(($event) => openPopOver("dialogVisible", true))
      } : {}, {
        B: !personal.value
      }, !personal.value ? {
        C: common_vendor.o(emitEndResult)
      } : {}, {
        D: personal.value
      }, personal.value ? {
        E: common_vendor.o(endPersonal)
      } : {}, {
        F: !personal.value
      }, !personal.value ? {
        G: common_vendor.o(addSucide)
      } : {}, {
        H: common_vendor.o(($event) => openPopOver("userInfoVisible", true)),
        I: !personal.value
      }, !personal.value ? {
        J: common_vendor.o(($event) => openPopOver("remberVisible", true))
      } : {}) : {}, {
        K: bottomHeight.value + "px",
        L: subControler.dialogVisible
      }, subControler.dialogVisible ? {
        M: common_vendor.o(($event) => openPopOver("dialogVisible", false)),
        N: common_vendor.f(consultantList.value, (item, k0, i0) => {
          return {
            a: item.consultantAvatar,
            b: common_vendor.t(item.consultantName),
            c: common_vendor.o(($event) => transfer(item), item.id),
            d: common_vendor.o(($event) => privateChat(item), item.id),
            e: item.id
          };
        }),
        O: common_vendor.o(toggleConsultantListPage),
        P: common_vendor.o(backOrNextOfCon),
        Q: common_vendor.p({
          total: transferPageInfo.total,
          currentPage: transferPageInfo.currentPage,
          pageSize: transferPageInfo.pageSize
        })
      } : {}, {
        R: subControler.userInfoVisible
      }, subControler.userInfoVisible ? common_vendor.e({
        S: common_vendor.o(($event) => openPopOver("userInfoVisible", false)),
        T: data.value.fromUser.userAvatar || data.value.fromUser.consultantAvatar,
        U: data.value.fromUser.realName
      }, data.value.fromUser.realName ? {
        V: common_vendor.t(data.value.fromUser.realName)
      } : {}, {
        W: common_vendor.t(data.value.fromUser.userName || data.value.fromUser.consultantName),
        X: common_vendor.n(data.value.fromUser.gender === "\u7537" ? "icon-nan" : "icon-xingbienv"),
        Y: common_vendor.t(data.value.fromUser.type ? "\u666E\u901A\u7528\u6237" : "\u54A8\u8BE2\u5E08"),
        Z: common_vendor.t(personal.value ? "\u79C1\u804A" : "\u54A8\u8BE2")
      }) : {}, {
        aa: subControler.recoderVisible
      }, subControler.recoderVisible ? {
        ab: common_vendor.o(($event) => openPopOver("recoderVisible", false))
      } : {}, {
        ac: common_vendor.s(_ctx.__cssVars())
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9b186cfb"], ["__file", "/Users/apple/Desktop/Consultant/pages/chatRoom/chatRoom.vue"]]);
wx.createPage(MiniProgramPage);
