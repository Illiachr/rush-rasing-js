"use strict";
// common utils
const setUID = () => "_" + Math.random().toString(36).substr(2, 9);
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
    speed: 3
  };

  const playGame = () => {
    console.log("Play game!");
    if (settings.start) {
      if (keys.ArrowLeft) {
        settings.x -= settings.speed;
      }
      if (keys.ArrowRight) {
        settings.x += settings.speed;
      }

      if (keys.ArrowUp) {
        settings.y -= settings.speed;
      }
      if (keys.ArrowDown) {
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
