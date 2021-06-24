"use strict";
// common utils
const setUID = () => "_" + Math.random().toString(36).substr(2, 9);
const rndNum = (limit) => Math.floor(Math.random() * limit);
const getElemsNum = (elemHeight) =>
  document.documentElement.clientHeight / elemHeight + 1;
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
  const startCtrls = $.querySelector(".start-controls");
  const gameArea = $.querySelector(".game-area");
  const gameBar = $.querySelector(".game-bar");
  const car = createElem({ cln: "car" });

  const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
  };

  const settings = {
    levels: {
      lite: 3,
      medium: 5,
      hard: 6,
      extreme: 7
    },
    currLvl: "lite",
    start: false,
    reset: false,
    score: 0,
    speed: 3,
    traffic: 3,
    carHeight: 100,
    carWidth: 50,
    lineHeight: 50,
    lineMargin: 75
  };

  const addStartBtns = () => {
    Object.keys(settings.levels).forEach((level) => {
      const btn = createElem({ cln: ["start", "btn-grad"].join(" ") });
      btn.textContent = level;
      btn.dataset.level = level;
      startCtrls.append(btn);
    });
  };

  const addLines = () => {
    const linesNum = getElemsNum(settings.lineHeight);
    for (let i = 0; i < linesNum; i++) {
      const linePosY = i * settings.lineMargin;
      const line = createElem({ cln: "line", top: `${linePosY}px` });
      line.y = linePosY;
      gameArea.append(line);
    }
  };

  const addEnemies = () => {
    const enemiesNum = getElemsNum(settings.carHeight * settings.traffic);
    for (let i = 0; i < enemiesNum; i++) {
      const enemyPosY = -settings.carHeight * settings.traffic * (i + 1);
      const enemyPosX = rndNum(gameArea.offsetWidth - settings.carWidth);
      const enemy = createElem({
        cln: "enemy",
        top: `${enemyPosY}px`,
        left: `${enemyPosX}px`
      });
      enemy.y = enemyPosY;
      gameArea.append(enemy);
    }
  };

  const moveLines = () => {
    const lines = document.querySelectorAll(".line");
    lines.forEach((line) => {
      line.y += settings.speed;
      line.style.top = `${line.y}px`;
      if (line.y > document.documentElement.clientHeight) {
        line.y = -75;
      }
    });
  };
  const moveEnemies = () => {
    const enemies = document.querySelectorAll(".enemy");
    enemies.forEach((enemy) => {
      const carRect = car.getBoundingClientRect();
      const enemyRect = enemy.getBoundingClientRect();
      if (
        carRect.top <= enemyRect.bottom &&
        carRect.right >= enemyRect.left &&
        carRect.left <= enemyRect.right &&
        carRect.bottom >= enemyRect.top
      ) {
        settings.start = false;
        settings.reset = true;
        gameBar.childNodes[3].classList.remove("hide");
        gameBar.childNodes[5].classList.remove("hide");
      }
      enemy.y += settings.speed / 2;
      enemy.style.top = `${enemy.y}px`;
      if (
        enemy.y >
        document.documentElement.clientHeight +
          settings.carWidth * settings.traffic
      ) {
        enemy.y = -100;
        enemy.style.left =
          rndNum(gameArea.offsetWidth - settings.carWidth) + "px";
      }
    });
  };

  const moveCar = () => {
    if (keys.ArrowLeft && settings.x > 0) {
      settings.x -= settings.speed;
    }
    if (
      keys.ArrowRight &&
      settings.x < gameArea.offsetWidth - car.offsetWidth
    ) {
      settings.x += settings.speed;
    }

    if (keys.ArrowUp && settings.y > 0) {
      settings.y -= settings.speed;
    }
    if (
      keys.ArrowDown &&
      settings.y < gameArea.offsetHeight - car.offsetHeight
    ) {
      settings.y += settings.speed;
    }

    car.style.left = `${settings.x}px`;
    car.style.top = `${settings.y}px`;
  };

  const playGame = () => {
    if (settings.start) {
      settings.score += settings.traffic * 0.1;
      score.textContent = `SCORE: ${settings.score.toFixed(0)}`;
      moveLines();
      moveEnemies();
      moveCar();
      requestAnimationFrame(playGame);
    }
  };

  const startGame = (level) => {
    settings.currLvl = level;
    settings.speed = settings.traffic = settings.levels[settings.currLvl];
    startCtrls.classList.add("hide");
    gameBar.childNodes[3].classList.add("hide");
    gameBar.childNodes[5].classList.add("hide");
    gameArea.classList.remove("hide");
    gameBar.classList.remove("hide");
    settings.start = true;
    settings.reset = false;
    addLines();
    addEnemies();
    gameArea.append(car);
    car.style.left = `${gameArea.offsetWidth / 2 - car.offsetWidth / 2}px`;
    car.style.top = `${
      document.documentElement.clientHeight - car.offsetHeight - 5
    }px`;
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    requestAnimationFrame(playGame);
  };

  const gameClickHandler = (e) => {
    const { target } = e;
    if (target.matches(".start")) {
      startGame(target.dataset.level);
    }

    if (target.matches(".reset") && settings.reset) {
      document.querySelectorAll(".line").forEach((line) => line.remove());
      document.querySelectorAll(".enemy").forEach((enemy) => enemy.remove());
      settings.score = 0;
      score.textContent = "SCORE: 0";
      startGame(settings.currLvl);
    }

    if (target.matches(".back") && settings.reset) {
      document.querySelectorAll(".line").forEach((line) => line.remove());
      document.querySelectorAll(".enemy").forEach((enemy) => enemy.remove());
      gameArea.classList.add("hide");
      gameBar.classList.add("hide");
      startCtrls.classList.remove("hide");
      settings.score = 0;
      score.textContent = "SCORE: 0";
    }
  };

  const startRun = (e) => {
    e.preventDefault();
    if (e.key in keys) {
      keys[e.key] = true;
    }
  };

  const stopRun = (e) => {
    e.preventDefault();
    if (e.key in keys) {
      keys[e.key] = false;
    }
  };
  addStartBtns();
  game.addEventListener("click", gameClickHandler);
  $.querySelector("html").addEventListener("keydown", startRun);
  $.querySelector("html").addEventListener("keyup", stopRun);
})();
