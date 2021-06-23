"use strict";
// common utils
const setUID = () => "_" + Math.random().toString(36).substr(2, 9);
const rndNum = (limit) => Math.floor(Math.random() * limit);
const getElemsNum = (elemHeight) => document.documentElement.clientHeight / elemHeight + 1;
const createElem = (options = {}) => {
  const elem = document.createElement("div");
  elem.id = setUID();
  elem.classList = options.cln || HELPER.CLN_CIRCLE;
  Object.keys(options).forEach((key) => {
    elem.style[key] = options[key];
  });
  return elem;
};

(() => {
  const $ = document;
  const game = $.querySelector(".game");
  const score = $.querySelector(".score");
  const start = $.querySelector(".start");
  const gameArea = $.querySelector(".game-area");
  const car = createElem({ cln: "car" });

  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
  };

  const settings = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3,
    carHeight: 100,
    carWidth: 50,
    lineHeight: 50,
    lineMargin: 75
  };

  const addLines = () => {
    const linesNum = getElemsNum(settings.lineHeight);
    for (let i = 0; i < linesNum; i++) {
      const linePosY = i * settings.lineMargin;
      const line = createElem({ cln: 'line', top: `${linePosY}px` });
      line.y = linePosY;
      gameArea.append(line);
    }
  };

  const addEnemies = () => {
    const enemiesNum = getElemsNum(settings.carHeight * settings.traffic);
    for (let i = 0; i < enemiesNum; i++) {
      const enemyPosY = -settings.carHeight * settings.traffic * (i + 1);
      const enemyPosX = rndNum(gameArea.offsetWidth - settings.carWidth);
      const enemy = createElem({ cln: 'enemy', top: `${enemyPosY}px`, left: `${enemyPosX}px` });
      enemy.y = enemyPosY;
      gameArea.append(enemy);
    }
  };

  const moveLines = () => {
    const lines = document.querySelectorAll('.line');
    lines.forEach(line => {
      line.y += settings.speed;
      line.style.top = `${line.y}px`;
      if (line.y > document.documentElement.clientHeight) {
        line.y = -75;
      }
    });
  };
  const moveEnemies = () => {
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
      enemy.y += settings.speed / 2;
      enemy.style.top = `${enemy.y}px`;
      if (enemy.y > document.documentElement.clientHeight + settings.carWidth * settings.traffic) {
        enemy.y = -100 * settings.traffic;
        enemy.style.left = rndNum(gameArea.offsetWidth - settings.carWidth) + 'px';
      }
    });
  };

  const playGame = () => {
    if (settings.start) {
      moveLines();
      moveEnemies();
      if (keys.ArrowLeft && settings.x > 0) {
        settings.x -= settings.speed;
      }
      if (keys.ArrowRight && settings.x < (gameArea.offsetWidth - car.offsetWidth)) {
        settings.x += settings.speed;
      }

      if (keys.ArrowUp && settings.y > 0) {
        settings.y -= settings.speed;
      }
      if (keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)) {
        settings.y += settings.speed;
      }

      car.style.left = `${settings.x}px`;
      car.style.top = `${settings.y}px`;
      requestAnimationFrame(playGame);
    }
  };

  const startGame = () => {
    start.classList.add("hide");
    gameArea.classList.remove('hide');
    settings.start = true;
    addLines();
    addEnemies();
    gameArea.append(car);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    requestAnimationFrame(playGame);
  };

  const gameClickHandler = (e) => {
    const { target } = e;
    if (target === start) {
      startGame();
    }
  };

  const startRun = (e) => {
    e.preventDefault();
    keys[e.key] = true;
  };

  const stopRun = (e) => {
    e.preventDefault();
    keys[e.key] = false;
  };

  game.addEventListener("click", gameClickHandler);
  $.querySelector("html").addEventListener("keydown", startRun);
  $.querySelector("html").addEventListener("keyup", stopRun);
})();
