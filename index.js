let isTimerRunning = false;
const timerDigits = document.getElementById("timer-digits");

/*think about the case minutes exceeds 59*/
/* time is running behind??? */

let timer = {
  centiseconds: 0,
  seconds: 0,
  minutes: 0,
  timerDigits: null,
  idTimeOut: null,
  init: function () {
    this.timerDigits = document.getElementById("timer-digits");
  },
  start: function () {
    if (!this.idTimeOut) {
      this.run();
    }
  },
  run: function () {
    const thisObj = this;
    this.idTimeOut = setTimeout(function () {
      thisObj.setTimerDigits(timer.increment().getFormattedTime());
      thisObj.run();
    }, 10);
  },
  pause: function () {
    clearTimeout(this.idTimeOut);
    this.idTimeOut = null;
    return this;
  },
  stop: function () {
    clearTimeout(this.idTimeOut);
    this.idTimeOut = null;
    this.setTimerDigits(timer.reset().getFormattedTime());
    return this;
  },
  increment: function () {
    if (99 === this.centiseconds) {
      ++this.seconds;
      this.centiseconds = 0;
    } else if (59 === this.seconds) {
      ++this.minutes;
      this.seconds = 0;
    } else {
      ++this.centiseconds;
    }
    return this;
  },
  reset: function () {
    this.seconds = 0;
    this.minutes = 0;
    this.centiseconds = 0;
    return this;
  },
  getFormattedTime: function () {
    return `${this.minutes.toString().padStart(2, "0")}:${this.seconds
      .toString()
      .padStart(2, "0")}:${this.centiseconds.toString().padStart(2, "0")}`;
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
