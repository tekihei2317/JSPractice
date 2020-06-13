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

  // 自機が放つショット
  const SHOT_MAX_COUNT = 10;
  let shotArray = [];
  let singleShotArray = [];

  // 敵
  const ENEMY_SMALL_MAX_COUNT = 15;
  const ENEMY_LARGE_MAX_COUNT = 5;
  const ENEMY_SHOT_MAX_COUNT = 50;
  let enemyArray = [];
  let enemyShotArray = [];

  /**
   * シーンマネージャー
   * @type {SceneManager}
   */
  let scene = null;

  // 爆発エフェクト
  const EXPLOSION_MAX_COUNT = 10;
  let explosionArray = [];

  /**
   * 再スタートするためのフラグ
   * type {boolean}
   */
  let restart = false;

  /**
   * ゲームのスコア
   * @type {number}
   */
  window.gameScore = 0;

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
    console.log('start initializing...');

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

    // 敵キャラクター(小)を初期化
    for (let i = 0; i < ENEMY_SMALL_MAX_COUNT; i++) {
      enemyArray[i] = new Enemy(ctx, 0, 0, 32, 32, "image/enemy_small.png");
      enemyArray[i].setShotArray(enemyShotArray);
      enemyArray[i].setAttackTarget(viper);
    }

    // 敵キャラクター(大)を初期化
    for (i = 0; i < ENEMY_LARGE_MAX_COUNT; i++) {
      enemyArray[ENEMY_SMALL_MAX_COUNT + i] = new Enemy(ctx, 0, 0, 48, 48, "image/enemy_large.png");
      enemyArray[ENEMY_SMALL_MAX_COUNT + i].setShotArray(enemyShotArray);
      enemyArray[ENEMY_SMALL_MAX_COUNT + i].setAttackTarget(viper);
    }

    // 爆発エフェクトを初期化
    for (let i = 0; i < EXPLOSION_MAX_COUNT; i++) {
      explosionArray[i] = new Explosion(ctx, 100, 15, 40, 1.0);
    }

    // ショットを初期化
    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
      shotArray[i] = new Shot(ctx, 0, 0, 32, 32, "image/viper_shot.png");
      singleShotArray[i * 2 + 0] = new Shot(ctx, 0, 0, 32, 32, "image/viper_single_shot.png");
      singleShotArray[i * 2 + 1] = new Shot(ctx, 0, 0, 32, 32, "image/viper_single_shot.png");

      // 衝突判定の対象を設定
      shotArray[i].setTargets(enemyArray);
      singleShotArray[i * 2 + 0].setTargets(enemyArray);
      singleShotArray[i * 2 + 1].setTargets(enemyArray);

      // 爆発エフェクトを設定
      shotArray[i].setExplosions(explosionArray);
      singleShotArray[i * 2 + 0].setExplosions(explosionArray);
      singleShotArray[i * 2 + 1].setExplosions(explosionArray);
    }
    viper.setShotArray(shotArray, singleShotArray);

    // 敵キャラクターのショットを初期化
    for (let i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
      enemyShotArray[i] = new Shot(ctx, 0, 0, 32, 32, "image/enemy_shot.png");
      enemyShotArray[i].setTargets([viper]);
      enemyShotArray[i].setExplosions(explosionArray);
    }
    console.log('initializing finished!');
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
    });
    enemyShotArray.map((v) => {
      ready = ready && v.ready;
    });

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
      if (event.key === 'Enter' && viper.life <= 0) restart = true;
    });
    window.addEventListener("keyup", (event) => {
      isKeyDown[`key_${event.key}`] = false;
    });
  }

  /**
   * シーンの設定をする
   */
  function sceneSetting() {
    // イントロシーン
    scene.add('intro', (time) => {
      if (time > 2.0) {
        scene.use('invade_default_type');
        console.log('switch to invade default type scene');
      }
    });

    // invadeシーン(defaultタイプの敵を生成)
    scene.add('invade_default_type', (time) => {
      // console.log(scene.frame);
      if (scene.frame % 30 === 0) {
        // 敵を配置する
        for (let i = 0; i < ENEMY_SMALL_MAX_COUNT; i++) if (enemyArray[i].life <= 0) {
          let enemy = enemyArray[i];
          // 左右から交互に出現させる
          if (scene.frame % 60 === 0) {
            enemy.set(-enemy.width, 30, 2, 'default');
            enemy.setAngleAndDirection(30 * Math.PI / 180);
          } else {
            enemy.set(CANVAS_WIDTH + enemy.width, 30, 2, 'default');
            enemy.setAngleAndDirection(150 * Math.PI / 180);
          }
          break;
        }
      }
      if (scene.frame === 270) scene.use('blank');

      if (viper.life <= 0) scene.use('gameover');
    });

    // 間隔調整のためのシーン
    scene.add('blank', (time) => {
      if (scene.frame === 150) scene.use('invade_wave_type');
      if (viper.life <= 0) scene.use('gameover');
    });

    // invadeシーン(waveタイプの敵を生成)
    scene.add('invade_wave_type', (time) => {
      if (scene.frame % 50 === 0) {
        for (let i = 0; i < ENEMY_SMALL_MAX_COUNT; i++) if (enemyArray[i].life <= 0) {
          let enemy = enemyArray[i];
          // 5体ずつ左右から出現させる
          if (scene.frame <= 200) {
            enemy.set(CANVAS_WIDTH * 0.2, -enemy.height, 2, 'wave');
          } else {
            enemy.set(CANVAS_WIDTH * 0.8, -enemy.height, 2, 'wave');
          }
          break;
        }
      }
      if (scene.frame === 450) scene.use('invade_default_type');
      if (viper.life <= 0) scene.use('gameover');
    });

    // gameoverシーン
    scene.add('gameover', (time) => {
      let textWidth = CANVAS_WIDTH / 2;
      let x = Math.max(CANVAS_WIDTH - scene.frame * 3, CANVAS_WIDTH / 2 - textWidth / 2);
      ctx.font = 'bold 72px sans-serif';
      util.drawText('GAME OVER', x, CANVAS_HEIGHT / 2, '#222222', textWidth);

      // 再スタートの処理
      if (restart === true) {
        restart = false;
        gameScore = 0;
        viper.setComingScene(CANVAS_WIDTH / 2, ANVAS_HEIGHT, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 100);
        scene.use('intro');
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
    ctx.globalAlpha = 1.0;

    // 描画前に全体をグレーで塗りつぶす
    util.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, "#eee");

    // スコアの表示
    ctx.font = 'bold 24px monospace';
    util.drawText(String(gameScore).padStart(5, '0'), 30, 50, '#111111');

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
    enemyShotArray.map((v) => {
      v.update();
    })
    explosionArray.map((v) => {
      v.update();
    });

    requestAnimationFrame(render);
  }
})();