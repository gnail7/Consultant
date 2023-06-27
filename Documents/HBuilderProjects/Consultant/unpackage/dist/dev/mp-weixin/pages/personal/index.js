"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_request = require("../../utils/request.js");
const utils_index = require("../../utils/index.js");
const utils_api = require("../../utils/api.js");
if (!Math) {
  gInputItem();
}
const gInputItem = () => "../../components/input/gInputItem.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    common_vendor.computed$1(() => {
      return JSON.parse(JSON.stringify(userInfo.value));
    });
    const fansLength = common_vendor.ref(0);
    const commonStore = store_index.useCommonStore();
    const userStore = store_index.useUserStore();
    common_vendor.storeToRefs(commonStore);
    const { userInfo } = common_vendor.storeToRefs(userStore);
    const sex = [
      {
        gender: "\u7537",
        checked: true,
        value: 1
      },
      {
        gender: "\u5973",
        checked: false,
        value: 0
      }
    ];
    function computedClass(label) {
      if (label === "\u7C89\u4E1D\u6570\u91CF") {
        return "fans";
      }
      return "";
    }
    const activeBox = common_vendor.ref(true);
    const form = common_vendor.ref(resetForm());
    function resetForm() {
      return {
        consultantName: userInfo.value.userName,
        gender: "\u7537"
      };
    }
    const renderUserInfo = common_vendor.computed$1(() => {
      const keys = Object.keys(userInfo.value);
      const values = Object.values(userInfo.value);
      let newArr = [];
      for (let i = 0; i < keys.length; i++) {
        if (utils_index.userInfoMap.get(keys[i])) {
          if (keys[i] === "hasManager") {
            const m1 = ["\u54A8\u8BE2\u5E08", "\u7BA1\u7406\u5458"];
            newArr.push({
              label: utils_index.userInfoMap.get(keys[i]),
              value: m1[values[i]]
            });
          } else {
            newArr.push({
              label: utils_index.userInfoMap.get(keys[i]),
              value: values[i]
            });
          }
        }
      }
      return newArr;
    });
    function toFansList() {
      common_vendor.index.navigateTo({
        url: "/pages/fansList/fansList"
      });
    }
    common_vendor.reactive({
      phoneHint: {
        show: false,
        label: "\u624B\u673A\u53F7\u780111\u4F4D"
      },
      usernameHint: {
        show: false,
        label: "\u4E0D\u80FD\u4E3A\u7A7A\u5594"
      },
      emailHint: {
        show: false,
        label: "\u6CE8\u610F\u90AE\u7BB1\u683C\u5F0F"
      }
    });
    const pattern = {
      phonePattern: /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/,
      emailPattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
      namePattern: /\S/
    };
    function chooseImage() {
      common_vendor.index.chooseMedia({
        count: 1,
        mediaType: "image",
        camera: "front",
        success: (res) => {
          const fileUrl = res.tempFiles[0].tempFilePath;
          console.log("fileUrl", fileUrl);
          common_vendor.index.navigateTo({
            url: `/pages/avatarPreview/avatarPreview?fileUrl=${fileUrl}`
          });
        }
      });
    }
    function onChange(e) {
      form.value.gender = e.detail.value;
    }
    async function saveEdit() {
      const cUserInfo = JSON.parse(JSON.stringify(userInfo.value));
      await utils_index.validator(form.value.consultantName, pattern.namePattern);
      if (form.value.consultantName == "") {
        form.value.consultantName = cUserInfo.consultantName;
      }
      common_vendor.index.showModal({
        confirmText: "\u786E\u8BA4\u4FDD\u5B58",
        cancelText: "\u53D6\u6D88",
        content: "\u4FDD\u5B58\u66F4\u6539",
        success: async () => {
          const r = await utils_request.request({ url: "/consultant/updateConsultant", method: "POST", data: { ...cUserInfo, ...form.value } });
          if (r.flag) {
            userInfo.value = { ...cUserInfo, ...form.value };
            common_vendor.index.setStorageSync("userInfo", userInfo.value);
          }
        }
      });
    }
    function inputEmit(obj) {
      const { att, value } = obj;
      form.value[att] = value;
    }
    common_vendor.onMounted(async () => {
      const r = await utils_api.getFansUser(userInfo.value);
      if (r) {
        fansLength.value = r.length;
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(userInfo).consultantAvatar,
        b: common_vendor.o(chooseImage),
        c: common_vendor.t(common_vendor.unref(userInfo).realName),
        d: common_vendor.f(common_vendor.unref(renderUserInfo), (ele, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(ele.label),
            b: ele.label !== "\u7C89\u4E1D\u6570\u91CF"
          }, ele.label !== "\u7C89\u4E1D\u6570\u91CF" ? {
            c: common_vendor.t(ele.value)
          } : {
            d: common_vendor.t(fansLength.value ? fansLength.value : 0)
          }, {
            e: ele.value,
            f: common_vendor.n(computedClass(ele.label)),
            g: common_vendor.o(toFansList, ele.value)
          });
        }),
        e: common_vendor.o(($event) => _ctx.changeBox(true)),
        f: common_vendor.n(activeBox.value ? "active" : ""),
        g: common_vendor.o(inputEmit),
        h: common_vendor.o(($event) => form.value.consultantName = $event),
        i: common_vendor.p({
          required: true,
          labelWidth: "200rpx",
          att: "consultantName",
          modelValue: form.value.consultantName
        }),
        j: common_vendor.f(sex, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.gender),
            b: item.checked,
            c: item.gender
          };
        }),
        k: sex.value,
        l: common_vendor.o(onChange),
        m: common_vendor.o(saveEdit)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3327436b"], ["__file", "/Users/apple/Desktop/Consultant/pages/personal/index.vue"]]);
wx.createComponent(Component);
