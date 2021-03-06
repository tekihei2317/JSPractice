/**
 * Canvas2D APIをラップしたユーティリティクラス
 */
class Canvas2DUtility {
  constructor(canvas) {
    this.canvasElement = canvas;
    this.context2d = canvas.getContext("2d");
  }

  get canvas() {
    return this.canvasElement;
  }

  get context() {
    return this.context2d;
  }

  drawRect(x, y, width, height, color) {
    if (color != null) this.context2d.fillStyle = color;
    this.context2d.fillRect(x, y, width, height);
  }

  imageLoader(path, callback) {
    let target = new Image();
    target.addEventListener("load", () => {
      if (callback != null) callback(target);
    });
    target.src = path;
  }

  /**
   * テキストを描画する
   * @param {string} text 
   * @param {number} x 
   * @param {number} y 
   * @param {string} color 
   * @param {number} width 
   */
  drawText(text, x, y, color, width) {
    if (color != null) this.context2d.fillStyle = color;
    this.context2d.fillText(text, x, y, width);
  }
}
