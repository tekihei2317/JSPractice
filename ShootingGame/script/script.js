(() => {
  /**
   * キーの押下状態を調べるためのオブジェクト
   * @global
   * @type {object}
   */
  window.isKeyDown = {};

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 480;

  let util = null;
  let ctx = null;

  /**
   * @type {Viper}
   */

  let viper = null;

  const SHOT_MAX_COUNT = 10;
  let shotArray = [];
  let singleShotArray = [];

  const ENEMY_COUNT = 10;
  let enemyArray = [];

  /**
   * ページのロード完了時に実行
   */
  window.addEventListener("load", () => {
    util = new Canvas2DUtility(document.getElementById("main_canvas"));
    canvas = util.canvas;
    ctx = util.context;

    initialize();
    startGame();
  });

  /**
   * Canvasを初期化する
   */
  function initialize() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // 自機を初期化
    viper = new Viper(ctx, 0, 0, 64, 64, "image/viper.png");
    viper.setComingScene(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 100
    );

    // ショットを初期化
    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
      shotArray[i] = new Shot(ctx, 0, 0, 32, 32, "image/viper_shot.png");
      singleShotArray[i * 2 + 0] = new Shot(ctx, 0, 0, 32, 32, "image/viper_single_shot.png");
      singleShotArray[i * 2 + 1] = new Shot(ctx, 0, 0, 32, 32, "image/viper_single_shot.png");
    }
    viper.setShotArray(shotArray, singleShotArray);

    // 敵キャラクターを初期化
    for (let i = 0; i < ENEMY_COUNT; i++) {
      enemyArray[i] = new Enemy(ctx, 0, 0, 48, 48, "image/enemy_small.png");
    }
  }

  /**
   * ロード完了したかチェックし、完了したら描画を開始する
   */
  function startGame() {
    let ready = true;

    ready = ready && viper.ready;
    shotArray.map((v) => {
      ready = ready && v.ready;
    });
    singleShotArray.map((v) => {
      ready = ready && v.ready;
    });
    enemyArray.map((v) => {
      ready = ready && v.ready;
    })

    console.log(ready === true ? "ready" : "not ready");
    if (ready === true) {
      eventSetting();
      render();
    } else {
      // 100msごとに再実行する
      setTimeout(startGame, 100);
    }
  }

  /**
   * イベントを設定する
   */
  function eventSetting() {
    window.addEventListener("keydown", (event) => {
      isKeyDown[`key_${event.key}`] = true;
    });
    window.addEventListener("keyup", (event) => {
      isKeyDown[`key_${event.key}`] = false;
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
    shotArray.map((v) => {
      v.update();
    });
    singleShotArray.map((v) => {
      v.update();
    })
    enemyArray.map((v) => {
      v.update();
    })
    requestAnimationFrame(render);
  }
})();
