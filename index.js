let isTimerRunning = false;
const timerDigits = document.getElementById("timer-digits");

let timer = {
  seconds: 0,
  minutes: 0,
  isRunning: false,
  timerDigits: null,
  init: function () {
    this.timerDigits = document.getElementById("timer-digits");
  },
  start: function () {
    this.isRunning = true;
    this.run();
  },
  run: function () {
    const thisObj = this;
    setTimeout(function () {
      if (thisObj.isRunning) {
        thisObj.setTimerDigits(timer.increment().getFormattedTime());
        thisObj.run();
      }
    }, 1000);
  },
  pause: function () {
    this.isRunning = false;
    return this;
  },
  stop: function () {
    this.isRunning = false;
    this.setTimerDigits(timer.reset().getFormattedTime());
    return this;
  },
  increment: function () {
    if (59 === this.seconds) {
      ++this.minutes;
      this.seconds = 0;
    } else {
      ++this.seconds;
    }
    return this;
  },
  reset: function () {
    this.seconds = 0;
    this.minutes = 0;
    return this;
  },
  getFormattedTime: function () {
    return `${this.minutes.toString().padStart(2, "0")} : ${this.seconds
      .toString()
      .padStart(2, "0")}`;
  },
  setTimerDigits: function (formattedDigitStr) {
    this.timerDigits.innerText = formattedDigitStr;
  },
};

function btnFunc(idBtn) {
  switch (idBtn) {
    case "btn-start":
      timer.start();
      break;

    case "btn-stop":
      timer.stop();
      break;

    case "btn-pause":
      timer.pause();
      break;

    default:
      break;
  }
}

const buttons = document.querySelectorAll(".btn");

for (const button of buttons) {
  button.addEventListener("click", function () {
    btnFunc(button.id);
  });
}

timer.init();
