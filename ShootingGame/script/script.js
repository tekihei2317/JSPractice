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
   * @type {boolean} - 登場シーンかどうかを表すフラグ
   */
  let isComing = false;
  let comingStartTime = null;

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
   * Canvasを初期化する
   */
  function initialize() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    isComing = true;
    comingStartTime = Date.now();
    viperX = CANVAS_WIDTH / 2;
    viperY = CANVAS_HEIGHT;
  }

  /**
   * イベントを設定する
   */
  function eventSetting() {
    window.addEventListener("keydown", (event) => {
      // 登場シーンなら何もしない
      if (isComing === true) return;
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

    // 登場シーンの処理
    if (isComing === true) {
      let erapsedTime = (Date.now() - comingStartTime) / 1000;
      viperY = CANVAS_HEIGHT - erapsedTime * 50;

      // 一定の一に到達したら登場シーンを終了する
      if (viperY <= CANVAS_HEIGHT - 200) {
        isComing = false;
      }
      // (大体)50msごとに点滅させる
      if (Date.now() % 100 < 50) ctx.globalAlpha = 0.5;
      else ctx.globalAlpha = 1.0;
    }

    ctx.drawImage(image, viperX, viperY);
    requestAnimationFrame(render);
  }
})();
