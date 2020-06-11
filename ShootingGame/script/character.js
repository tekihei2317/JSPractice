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
  constructor(ctx, x, y, w, h, life, imagePath) {
    this.ctx = ctx;
    this.position = new Position(x, y);
    this.width = w;
    this.height = h;
    this.life = life;
    this.ready = false;

    this.image = new Image();
    this.image.addEventListener('load', () => {
      this.ready = true;
    });
    this.image.src = imagePath;
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
    this.speed = 5;
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
    /**
     * @type {Array<Shot>}
     */
    this.shotArray = null;
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
  } viperviper

  /**
   * ショットを設定する
   * @param {Array<Shot>} shotArray 
   */
  setShotArray(shotArray) {
    this.shotArray = shotArray;
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

      let nextX = this.position.x;
      let nextY = this.position.y;
      if (window.isKeyDown.key_ArrowLeft === true) nextX -= this.speed;
      if (window.isKeyDown.key_ArrowRight === true) nextX += this.speed;
      if (window.isKeyDown.key_ArrowUp === true) nextY -= this.speed;
      if (window.isKeyDown.key_ArrowDown === true) nextY += this.speed;

      // clamp
      nextX = Math.max(this.width / 2, Math.min(nextX, this.ctx.canvas.width - this.width / 2));
      nextY = Math.max(this.height / 2, Math.min(nextY, this.ctx.canvas.height - this.height / 2));
      this.position.set(nextX, nextY);
      this.draw();

      // キーが押されていた場合ショットを一つ生成する
      if (window.isKeyDown.key_z === true) {
        for (let i = 0; i < this.shotArray.length; i++) if (this.shotArray[i].life <= 0) {
          this.shotArray[i].set(this.position.x, this.position.y);
          // console.log(this.shotArray[i].position.x);
          break;
        }
      }
    }
  }
}

class Shot extends Character {
  constructor(ctx, x, y, w, h, imagePath) {
    super(ctx, x, y, w, h, 0, imagePath);
    this.speed = 7;
  }

  /**
   * ショットを配置する
   * @param {number} x - x座標
   * @param {number} y - y座標
   */
  set(x, y) {
    this.position.set(x, y);
    this.life = 1;
  }

  update() {
    // ライフが0以下の場合は描画しない
    if (this.life <= 0) return;

    this.position.y -= this.speed;
    this.draw();
    // 画面外に移動したらライフを0にする
    if (this.position.y + this.height < 0) this.life = 0;
  }
}