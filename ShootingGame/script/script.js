(() => {
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  let util = null;
  let ctx = null;
  let image = null;
  let startTime = null;

  let viperX = CANVAS_WIDTH / 2;
  let viperY = CANVAS_HEIGHT / 2;

  /**
   * ページのロード完了時に実行
   */
  window.addEventListener("load", () => {
    util = new Canvas2DUtility(document.getElementById("main_canvas"));
    canvas = util.canvas;
    ctx = util.context;

    util.imageLoader("./image/viper.png", (loadedImage) => {
      image = loadedImage;
      initialize();
      eventSetting();
      startTime = Date.now();
      render();
    });
  });

  /**
   * Canvasの大きさを設定
   */
  function initialize() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }

  /**
   * イベントを設定する
   */
  function eventSetting() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        viperX -= 10;
      } else if (event.key === "ArrowRight") {
        viperX += 10;
      } else if (event.key === "ArrowUp") {
        viperY -= 10;
      } else if (event.key === "ArrowDown") {
        viperY += 10;
      }
    });
  }

  /**
   * 描画処理を行う
   */
  function render() {
    // 描画前に全体をグレーで塗りつぶす
    util.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#eee");

    let currentTime = (Date.now() - startTime) / 1000;
    ctx.drawImage(image, viperX, viperY);
    requestAnimationFrame(render);
  }
})();
