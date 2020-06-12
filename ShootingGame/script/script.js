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

  const ENEMY_MAX_COUNT = 10;
  const ENEMY_SHOT_MAX_COUNT = 50;
  let enemyArray = [];
  let enemyShotArray = [];

  /**
   * シーンマネージャー
   * @type {SceneManager}
   */
  let scene = null;

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
   * Canvasとキャラクターを初期化する
   */
  function initialize() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // シーンを初期化する
    scene = new SceneManager();

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

    // 敵キャラクターのショットを初期化
    for (let i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
      enemyShotArray[i] = new Shot(ctx, 0, 0, 32, 32, "image/enemy_shot.png");
    }

    // 敵キャラクターを初期化(ショットは共有する)
    for (let i = 0; i < ENEMY_MAX_COUNT; i++) {
      enemyArray[i] = new Enemy(ctx, 0, 0, 48, 48, "image/enemy_small.png");
      enemyArray[i].setShotArray(enemyShotArray);
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
      sceneSetting();
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

  function sceneSetting() {
    // イントロシーン
    scene.add('intro', (time) => {
      if (time > 2.0) {
        scene.use('invade');
        console.log('switch to invade scene');
      }
    });

    // invadeシーン
    scene.add('invade', (time) => {
      // console.log(scene.frame);
      if (scene.frame === 0) {
        // 敵を配置する
        for (let i = 0; i < ENEMY_MAX_COUNT; i++) if (enemyArray[i].life <= 0) {
          let enemy = enemyArray[i];
          enemy.set(CANVAS_WIDTH / 2, -enemy.height);
          enemy.setDirection(0.0, 1.0);
          break;
        }
      }
      // 100フレームごとに再実行する
      if (scene.frame === 100) {
        scene.use('invade');
      }
    })
    // 最初はintroシーンを設定する
    scene.use('intro');
    console.log('switch to intro scene');
  }

  /**
   * 描画処理を行う
   */
  function render() {
    // 描画前に全体をグレーで塗りつぶす
    util.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#eee");

    scene.update();

    viper.update();
    shotArray.map((v) => {
      v.update();
    });
    singleShotArray.map((v) => {
      v.update();
    });
    enemyArray.map((v) => {
      v.update();
    });
    requestAnimationFrame(render);
  }
})();