(() => {
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  let util = null;
  let ctx = null;
  let image = null;
  /**
   * @type {Viper}
   */
  let viper = null;

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
      render();
    });
  });

  /**
   * Canvasを初期化する
   */
  function initialize() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    viper = new Viper(ctx, 0, 0, 64, 64, image);
    viper.setComingScene(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 100
    );
  }

  /**
   * イベントを設定する
   */
  function eventSetting() {
    window.addEventListener("keydown", (event) => {
      // 登場シーンなら何もしない
      if (viper.isComing === true) return;
      if (event.key === "ArrowLeft") {
        viper.position.x -= 10;
      } else if (event.key === "ArrowRight") {
        viper.position.x += 10;
      } else if (event.key === "ArrowUp") {
        viper.position.y -= 10;
      } else if (event.key === "ArrowDown") {
        viper.position.y += 10;
      }
    });
  }

  /**
   * 描画処理を行う
   */
  function render() {
    //console.log('hoge');
    // 描画前に全体をグレーで塗りつぶす
    util.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#eee");
    viper.update();
    requestAnimationFrame(render);
  }
})();
