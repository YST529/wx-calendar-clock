Page({
  data: {
    width: 0,
    height: 0
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.width = res.windowWidth;
        that.height = res.windowHeight;
      },
    })
  },
  onReady: function () {
    this.canvasClock();
    this.interval = setInterval(this.canvasClock, 1000);
  },
  onUnload: function () {
    clearInterval(this.interval)
  },
  canvasClock: function () {
    const ctx = wx.createContext()
    const width = this.width;
    const height = this.height;
    const R = width / 2 - 55;
    function reSet() {
      ctx.height = ctx.height;
      ctx.translate(width / 2, height / 2);
      ctx.save();
    }
    // 圆盘
    function circle() {
      ctx.setLineWidth(10);
      ctx.beginPath();
      ctx.setStrokeStyle('#FF1515');
      ctx.arc(0, 0, width / 2 - 30, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineWidth(5);
      ctx.beginPath();
      ctx.setStrokeStyle('#B70D0D');
      ctx.arc(0, 0, width / 2 - 35, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.stroke();
    }
    // 数字
    function num() {
      ctx.setFontSize(20);
      ctx.setTextBaseline('middle');
      for (let i = 1; i < 13; i++) {
        const x = (R - 10) * Math.cos(i * Math.PI / 6 - Math.PI / 2);
        const y = (R - 20) * Math.sin(i * Math.PI / 6 - Math.PI / 2);
        if (i === 11 || i === 12) {
          ctx.fillText(i, x - 10, y - 2);
        } else {
          ctx.fillText(i, x - 6, y + 2);
        }
      }
    }
    // 刻度 start
    function smallGrid() {
      ctx.setLineWidth(4);
      ctx.rotate(-Math.PI / 2);
      ctx.setStrokeStyle('#ccc')
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.rotate(Math.PI / 30);
        ctx.arc(width/2 - 45, 0, 2, 0, 2*Math.PI)
        ctx.stroke();
        
      }
    }
    function bigGrid() {
      ctx.setLineWidth(6);
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.rotate(Math.PI / 6);
        ctx.moveTo(width / 2 - 35, 0);
        ctx.lineTo(width / 2 - 50, 0);
        ctx.setStrokeStyle('black');
        ctx.stroke();
      }
    }
    // 刻度 end
    // 指针移动方法
    function move() {
      const date = new Date();
      let h = date.getHours();
      h = (h > 12) ? (h - 12) : h;
      const m = date.getMinutes();
      const s = date.getSeconds();
      ctx.save();
      // 时针
      ctx.setLineWidth(7);
      ctx.beginPath();
      ctx.setStrokeStyle('orange');
      ctx.rotate((Math.PI / 6) * (h + m / 60 + s / 3600));
      ctx.moveTo(-20, 0);
      ctx.lineTo(width / 4.5 - 20, 0);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      // 分针
      ctx.setLineWidth(5);
      ctx.beginPath();
      ctx.setStrokeStyle('blue');
      ctx.rotate((Math.PI / 30) * (m + s / 60));
      ctx.moveTo(-20, 0);
      ctx.lineTo(width / 3.5 - 20, 0);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      // 秒针
      ctx.setLineWidth(2);
      ctx.beginPath();
      ctx.setStrokeStyle('red');
      ctx.rotate((Math.PI / 30) * s);
      ctx.moveTo(-20, 0);
      ctx.lineTo(width / 3 - 20, 0);
      ctx.stroke();
    }
    function drawClock() {
      reSet();
      circle();
      num();
      smallGrid();
      bigGrid();
      move();
    }
    drawClock();
    wx.drawCanvas({
      canvasId: 'clock',
      actions: ctx.getActions()
    })
  }
})