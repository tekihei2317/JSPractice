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
    /**
     * キャラクターの角度)
     * @type {number}
     */
    this.angle = 270 * Math.PI / 180;
    /**
     * 進行方向を表す単位ベクトル
     * @type {Position}
     */
    this.direction = new Position(0, -1.0);

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
    this.ctx.drawImage(
      this.image,
      this.position.x - this.width / 2,
      this.position.y - this.height / 2
    );
  }

  /**
   * 角度を考慮して画像を描画する
   */
  rotationDraw() {
    this.ctx.save();
    this.ctx.translate(this.position.x, this.position.y);
    // 適切に座標軸を回転させる
    this.ctx.rotate(this.angle - Math.PI * 1.5);

    this.ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
    // 座標系を元に戻す
    this.ctx.restore();
  }

  /**
   * 進行方向を設定する
   * @param {number} x - x成分
   * @param {number} y - y成分
   */
  setDirection(x, y) {
    this.direction.set(x, y);
  }
  /**
   * キャラクターの角度(ラジアン)と方向を設定する
   * @param {number} rad  
   */
  setAngleAndDirection(rad) {
    this.angle = rad;
    this.direction = new Position(Math.cos(rad), Math.sin(rad));
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
    /**
     * @type {Array<Shot>}
     */
    this.singleShotArray = null;
    /**
     * ショットを撃つことが出来る間隔(フレーム数)
     * @type {number}
     */
    this.shotInterval = 10;
    /**
     * ショットが撃てるかどうかを確認するためのカウンター
     * @type {number}
     */
    this.shotCheckCounter = 0;
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
  setShotArray(shotArray, singleShotArray) {
    this.shotArray = shotArray;
    this.singleShotArray = singleShotArray;
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

      // キーの押下状態に応じて移動させる
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

      // キーが押されていた場合ショットを生成する(カウンタが0のとき=10フレームごと)
      if (window.isKeyDown.key_z === true && this.shotCheckCounter === 0) {

        for (let i = 0; i < this.shotArray.length; i++) if (this.shotArray[i].life <= 0) {
          this.shotArray[i].set(this.position.x, this.position.y);
          // console.log(this.shotArray[i].position.x);
          break;
        }

        // console.log(this.singleShotArray.length);()
        for (let i = 0; i < this.singleShotArray.length; i += 2) if (this.singleShotArray[i].life <= 0) {
          this.singleShotArray[i].set(this.position.x, this.position.y);

          /**
           * @type {number} - シングルショットを傾ける角度
           */
          const diffRad = 10 * Math.PI / 180;
          this.singleShotArray[i].setAngleAndDirection(Math.PI * 1.5 + diffRad);
          this.singleShotArray[i + 1].set(this.position.x, this.position.y);
          this.singleShotArray[i + 1].setAngleAndDirection(Math.PI * 1.5 - diffRad);
          break;
        }
      }
      this.shotCheckCounter = (this.shotCheckCounter + 1) % this.shotInterval;
    }
  }
}

class Shot extends Character {
  constructor(ctx, x, y, w, h, imagePath) {
    super(ctx, x, y, w, h, 0, imagePath);
    this.speed = 12;
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

    this.position.x += this.speed * this.direction.x;
    this.position.y += this.speed * this.direction.y;
    this.rotationDraw();

    // 画面外に移動したらライフを0にする
    if (this.position.y + this.height < 0) this.life = 0;
  }
}

class Enemy extends Character {
  constructor(ctx, x, y, w, h, imagePath) {
    super(ctx, x, y, w, h, 0, imagePath);
    this.speed = 3;
  }

  /**
   * 敵を配置する
   * @param {number} x 
   * @param {number} y 
   * @param {number} life 
   */
  set(x, y, life = 1) {
    this.position.set(x, y);
    this.life = life;
  }

  update() {
    if (this.life <= 0) return;
    // 画面外(下)に出ていたらライフを0にする
    if (this.position.y - this.height / 2 > this.ctx.canvas.height) this.life = 0;

    // 位置を更新して描画する
    this.position.x += this.speed * this.direction.x;
    this.position.y += this.speed * this.direction.y;
    this.draw();
  }
}