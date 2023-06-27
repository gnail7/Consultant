"use strict";
const common_vendor = require("../../../../common/vendor.js");
const block0 = (Component2) => {
  if (!Component2.wxsCallMethods) {
    Component2.wxsCallMethods = [];
  }
  Component2.wxsCallMethods.push("updateData");
};
const _sfc_main = {
  props: {
    mode: {
      type: String,
      default: "free"
    },
    url: {
      type: String,
      default: ""
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    maxWidth: {
      type: Number,
      default: 1024
    },
    maxHeight: {
      type: Number,
      default: 1024
    }
  },
  data() {
    return {
      canvasId: Math.random().toString(36).slice(-6),
      real: {
        width: 100,
        height: 100
      },
      target: {
        width: 100,
        height: 100
      },
      body: {
        width: 100,
        height: 100
      },
      frame: {
        left: 50,
        top: 50,
        width: 200,
        height: 300
      },
      image: {
        left: 20,
        top: 20,
        width: 300,
        height: 400
      },
      rotate: 0,
      transit: false,
      modeValue: ""
    };
  },
  methods: {
    imageLoad(event) {
      common_vendor.index.getImageInfo({
        src: this.url,
        success: (rst) => {
          this.real.width = rst.width;
          this.real.height = rst.height;
          this.target = {};
          var query = common_vendor.index.createSelectorQuery().in(this);
          query.select(".body").boundingClientRect((data) => {
            this.body.width = data.width;
            this.body.height = data.height;
            this.init();
          }).exec();
        }
      });
    },
    init() {
      this.modeValue = this.mode;
      this.rotate = 0;
      var rate = this.width / this.height;
      var width = this.body.width * 0.7;
      var height = this.body.height * 0.7;
      if (width / height > rate) {
        width = height * rate;
      } else {
        height = width / rate;
      }
      var left = (this.body.width - width) / 2;
      var top = (this.body.height - height) / 2;
      this.frame = {
        left,
        top,
        width,
        height
      };
      rate = this.real.width / this.real.height;
      width = this.frame.width;
      height = this.frame.height;
      if (width / height > rate) {
        height = width / rate;
      } else {
        width = height * rate;
      }
      left = (this.frame.width - width) / 2 + this.frame.left;
      top = (this.frame.height - height) / 2 + this.frame.top;
      this.image = {
        left,
        top,
        width,
        height
      };
    },
    async updateData(data) {
      this.frame = data.frame;
      this.image = data.image;
      await this.$nextTick();
      this.trimImage();
    },
    trimImage() {
      var rate = this.frame.width / this.frame.height;
      var width = this.body.width * 0.7;
      var height = this.body.height * 0.7;
      if (width / height > rate) {
        width = height * rate;
      } else {
        height = width / rate;
      }
      var left = (this.body.width - width) / 2;
      var top = (this.body.height - height) / 2;
      var mul = width / this.frame.width;
      var ox = this.frame.left - this.image.left;
      var oy = this.frame.top - this.image.top;
      this.frame = {
        left,
        top,
        width,
        height
      };
      width = this.image.width * mul;
      height = this.image.height * mul;
      left = this.frame.left - ox * mul;
      top = this.frame.top - oy * mul;
      this.image = {
        left,
        top,
        width,
        height
      };
      if (mul != 1) {
        this.transit = true;
        setTimeout(() => {
          this.transit = false;
        }, 300);
      }
    },
    rotateAngle() {
      this.rotate -= 90;
      var width = this.image.height;
      var height = this.image.width;
      var left = this.image.left;
      var top = this.image.top;
      var rate = width / height;
      if (width < this.frame.width) {
        width = this.frame.width;
        height = width / rate;
      }
      if (height < this.frame.height) {
        height = this.frame.height;
        width = height * rate;
      }
      if (left > this.frame.left) {
        left = this.frame.left;
      }
      if (top > this.frame.top) {
        top = this.frame.top;
      }
      if (left + width < this.frame.left + this.frame.width) {
        left = this.frame.left + this.frame.width - width;
      }
      if (top + height < this.frame.top + this.frame.height) {
        top = this.frame.top + this.frame.height - height;
      }
      this.image = {
        left,
        top,
        width,
        height
      };
      this.transit = true;
      setTimeout(() => {
        this.transit = false;
      }, 300);
    },
    onok() {
      this.cropWx();
    },
    oncancle() {
      this.$emit("cancel");
    },
    async cropWx() {
      var mx = this.computeMatrix();
      this.target = {
        width: mx.tw,
        height: mx.th
      };
      var canvas = await new Promise((resolve) => {
        common_vendor.index.createSelectorQuery().in(this).select(".canvas").fields({ node: true }).exec((rst) => {
          var node = rst[0].node;
          resolve(node);
        });
      });
      canvas.width = mx.tw;
      canvas.height = mx.th;
      common_vendor.index.showLoading({
        title: "\u5904\u7406\u4E2D"
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
      var context = canvas.getContext("2d");
      var image = canvas.createImage();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = this.url;
      });
      context.save();
      context.rotate(this.rotate * Math.PI / 180);
      context.drawImage(image, mx.sx, mx.sy, mx.sw, mx.sh, mx.dx, mx.dy, mx.dw, mx.dh);
      context.restore();
      wx.canvasToTempFilePath({
        canvas,
        success: (rst) => {
          var path = rst.tempFilePath;
          this.$emit("ok", {
            path
          });
        },
        complete: () => {
          common_vendor.index.hideLoading();
        }
      });
    },
    async cropAppH5() {
      var mx = this.computeMatrix();
      this.target = {
        width: mx.tw,
        height: mx.th
      };
      common_vendor.index.showLoading({
        title: "\u5904\u7406\u4E2D"
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
      var context = common_vendor.index.createCanvasContext(this.canvasId, this);
      context.save();
      context.rotate(this.rotate * Math.PI / 180);
      context.drawImage(this.url, mx.sx, mx.sy, mx.sw, mx.sh, mx.dx, mx.dy, mx.dw, mx.dh);
      context.restore();
      await new Promise((resolve) => {
        context.draw(false, resolve);
      });
      common_vendor.index.canvasToTempFilePath({
        canvasId: this.canvasId,
        destWidth: mx.tw,
        destHeight: mx.th,
        success: (rst) => {
          rst.tempFilePath;
        },
        complete: () => {
          common_vendor.index.hideLoading();
        }
      }, this);
    },
    computeMatrix() {
      var width = this.width;
      var height = this.height;
      var mul = this.image.width / this.real.width;
      if (this.rotate % 180 != 0) {
        mul = this.image.height / this.real.width;
      }
      if (this.mode != "fixed") {
        width = this.frame.width / mul;
        height = this.frame.height / mul;
      }
      var rate = width / height;
      if (width > this.maxWidth) {
        width = this.maxWidth;
        height = width / rate;
      }
      if (height > this.maxHeight) {
        height = this.maxHeight;
        width = height * rate;
      }
      var sx = (this.frame.left - this.image.left) / mul;
      var sy = (this.frame.top - this.image.top) / mul;
      var sw = this.frame.width / mul;
      var sh = this.frame.height / mul;
      var ox = sx + sw / 2;
      var oy = sy + sh / 2;
      if (this.rotate % 180 != 0) {
        var temp = sw;
        sw = sh;
        sh = temp;
      }
      var angle = this.rotate % 360;
      if (angle < 0) {
        angle += 360;
      }
      if (angle == 270) {
        var x = this.real.width - oy;
        var y = ox;
        ox = x;
        oy = y;
      }
      if (angle == 180) {
        var x = this.real.width - ox;
        var y = this.real.height - oy;
        ox = x;
        oy = y;
      }
      if (angle == 90) {
        var x = oy;
        var y = this.real.height - ox;
        ox = x;
        oy = y;
      }
      sx = ox - sw / 2;
      sy = oy - sh / 2;
      var dr = { x: 0, y: 0, w: width, h: height };
      dr = this.parseRect(dr, -this.rotate);
      return {
        tw: width,
        th: height,
        sx,
        sy,
        sw,
        sh,
        dx: dr.x,
        dy: dr.y,
        dw: dr.w,
        dh: dr.h
      };
    },
    parsePoint(point, angle) {
      var result = {};
      result.x = point.x * Math.cos(angle * Math.PI / 180) - point.y * Math.sin(angle * Math.PI / 180);
      result.y = point.y * Math.cos(angle * Math.PI / 180) + point.x * Math.sin(angle * Math.PI / 180);
      return result;
    },
    parseRect(rect, angle) {
      var x1 = rect.x;
      var y1 = rect.y;
      var x2 = rect.x + rect.w;
      var y2 = rect.y + rect.h;
      var p1 = this.parsePoint({ x: x1, y: y1 }, angle);
      var p2 = this.parsePoint({ x: x2, y: y2 }, angle);
      var result = {};
      result.x = Math.min(p1.x, p2.x);
      result.y = Math.min(p1.y, p2.y);
      result.w = Math.abs(p2.x - p1.x);
      result.h = Math.abs(p2.y - p1.y);
      return result;
    },
    parseBlob(base64) {
      var arr = base64.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      for (var i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      var url = URL || webkitURL;
      return url.createObjectURL(new Blob([u8arr], { type: mime }));
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.url
  }, $props.url ? {
    b: $data.target.width + "px",
    c: $data.target.height + "px",
    d: $data.transit ? 1 : "",
    e: $props.url,
    f: common_vendor.o((...args) => $options.imageLoad && $options.imageLoad(...args)),
    g: $data.transit ? 1 : "",
    h: $data.image,
    i: $data.transit ? 1 : "",
    j: $props.url,
    k: $data.transit ? 1 : "",
    l: $data.transit ? 1 : "",
    m: $data.frame,
    n: common_vendor.o((...args) => $options.oncancle && $options.oncancle(...args)),
    o: common_vendor.o((...args) => $options.rotateAngle && $options.rotateAngle(...args)),
    p: common_vendor.o((...args) => $options.onok && $options.onok(...args)),
    q: $data.modeValue,
    r: $data.rotate
  } : {});
}
if (typeof block0 === "function")
  block0(_sfc_main);
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c759d1e7"], ["__file", "/Users/apple/Desktop/Consultant/uni_modules/ksp-cropper/components/ksp-cropper/ksp-cropper.vue"]]);
wx.createComponent(Component);
