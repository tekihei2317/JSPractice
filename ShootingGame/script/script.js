(() => {
  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  let util = null;
  let ctx = null;
  let image = null;

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
      render();
    });
  });

  function initialize() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }

  function render() {
    util.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#eee");
    ctx.drawImage(image, 100, 100);
  }
})();
