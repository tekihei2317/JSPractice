/**
 * 座標を管理するためのクラス
 */
class Position {
  constructor(x, y) {
    this.x = null;
    this.y = null;
    this.set(x, y);
  }
  set(x, y) {
    if (x != null) this.x = x;
    if (y != null) this.y = y;
  }
}

class Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画に利用する2Dコンテキスト
   * @param {number} x - x座標
   * @param {number} y - y座標
   * @param {number} w - 横の長さ
   * @param {number} h - 縦の長さ
   * @param {number} life - キャラクターのライフ
   * @param {Image} image - キャラクターの画像
   */
  constructor(ctx, x, y, w, h, life, image) {
    this.ctx = ctx;
    this.position = new Position(x, y);
    this.width = w;
    this.height = h;
    this.life = life;
    this.image = image;
  }

  /**
   * キャラクターを描画する
   */
  draw() {
    this.ctx.drawImage(this.image, this.position.x - this.width / 2, this.position.y - this.height / 2);
  }
}

class Viper extends Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx 
   * @param {number} x 
   * @param {number} y 
   * @param {number} w
   * @param {number} h
   * @param {Image} image 
   */
  constructor(ctx, x, y, w, h, image) {
    super(ctx, x, y, w, h, 0, image);
    /**
     * 自信の移動速度
     * @type {number}
     */
    this.speed = 3;
    /**
     * viperが登場中かどうかを表すフラグ
     * @type {boolean}
     */
    this.isComing = false;
    this.comingStartTime = null;
    /**
     * 登場が開始する場所の座標
     * @type {position}
     */
    this.comingStartPosition = null;
    /**
     * 登場が完了する場所の座標
     * @type {position}
     */
    this.comingEndPosition = null;
  }

  /**
   * 登場演出に関する設定を行う
   * @param {number} startX
   * @param {number} startY 
   * @param {number} endX 
   * @param {number} endY 
   */
  setComingScene(startX, startY, endX, endY) {
    this.isComing = true;
    this.comingStartTime = Date.now();
    this.position.set(startX, startY);
    this.comingStartPosition = new Position(startX, startY);
    this.comingEndPosition = new Position(endX, endY);
  }

  /**
   * 登場シーンの位置の更新と描画
   */
  update() {
    if (this.isComing === true) {
      // 秒速50px
      const elapsedTime = (Date.now() - this.comingStartTime) / 1000;
      const nextY = this.comingStartPosition.y - 50 * elapsedTime;
      this.position.set(this.position.x, nextY);
      if (this.position.y <= this.comingEndPosition.y) {
        this.isComing = false;
      }
      // 大体50msごとに点滅させる
      this.ctx.globalAlpha = (Date.now() % 100 < 50 ? 0.5 : 1.0);
      this.draw();
    } else {
      this.ctx.globalAlpha = 1.0;
      if (window.isKeyDown.key_ArrowLeft === true) this.position.x -= this.speed;
      if (window.isKeyDown.key_ArrowRight === true) this.position.x += this.speed;
      if (window.isKeyDown.key_ArrowUp === true) this.position.y -= this.speed;
      if (window.isKeyDown.key_ArrowDown === true) this.position.y += this.speed;
      this.draw();
    }
  }
}