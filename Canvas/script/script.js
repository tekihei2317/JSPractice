(() => {
  /**
   * 描画対象となるCanvas Element
   * @type {HTMLCanvasElement}
   */
  let canvas = null;

  /**
   * Canvas2D APIのコンテキスト
   * @type {CanvasRenderingContext2D}
   */
  let context = null;

  window.addEventListener("load", () => {
    initialize();
    render();
  });

  /**
   * canvasとコンテキストを初期化する
   */
  function initialize() {
    canvas = document.getElementById("main_canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context = canvas.getContext("2d");
  }

  /**
   * 色を設定して塗りつぶす
   */
  function render() {
    drawRect(0, 0, canvas.width, canvas.height, "black");
  }

  /**
   * 長方形を描画
   * @param {number} x - 塗りつぶす長方形の左上のx座標
   * @param {number} y - 塗りつぶす長方形の左上のy座標
   * @param {number} width - 塗りつぶす長方形の横の長さ
   * @param {number} height - 塗りつぶす長方形の縦の長さ
   * @param {sring} [color] - 塗りつぶす長方形の色
   */
  function drawRect(x, y, width, height, color) {
    if (color != null) context.fillStyle = color;
    context.fillRect(x, y, width, height);
  }
})();
