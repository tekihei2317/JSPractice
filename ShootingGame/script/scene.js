/**
 * シーンを管理するためのクラス
 */
class SceneManager {
  /**
   * @constructor
   */
  constructor() {
    /**
     * シーンを格納するためのオブジェクト
     * @type {object}
     */
    this.scene = {};
    /**
     * 現在アクティブなシーン
     * @type {function}
     */
    this.activeScene = null;
    /**
     * 現在のシーンがアクティブになってからの実行回数
     * @type {number}
     */
    this.frame = null;
  }

  /**
   * シーンを追加する
   * @param {string} name - シーンの名前
   * @param {function} updateFunction - シーン中の処理
   */
  add(name, updateFunction) {
    this.scene[name] = updateFunction;
  }

  use(name) {
    // 指定されたシーンが存在しない場合は終了する
    if (this.scene.hasOwnProperty(name) !== true) return;

    this.activeScene = this.scene[name];
    this.startTime = Date.now();
    this.frame = -1;
  }

  update() {
    let activeTime = (Date.now() - this.startTime) / 1000;
    // 経過時間を引数に与えて処理を行う
    this.activeScene(activeTime);
    // 関数実行してからframeインクリメントしてるのに関数側ではframeが0から始まってる(非同期だから?)
    this.frame++;
  }
}