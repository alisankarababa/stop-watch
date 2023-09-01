const timerDigits = document.getElementById("timer-digits");

/*think about the case minutes exceeds 59*/
/* time is running behind??? */

let timer = {
  centiseconds: 0,
  seconds: 0,
  minutes: 0,
  timerDigits: null,
  idTimeOut: null,
  timeBase: null,
  init: function () {
    this.timerDigits = document.getElementById("timer-digits");
  },
  start: function () {
    if (!this.idTimeOut) {
      this.run();
      this.timeBase = new Date(
        Date.now() -
          10 * this.centiseconds -
          1000 * this.seconds -
          60000 * this.minutes
      );
    }
  },
  run: function () {
    const thisObj = this;
    this.idTimeOut = setTimeout(function () {
      let relativeTime = new Date() - thisObj.timeBase;
      const timeNow = new Date(relativeTime);

      thisObj.minutes = timeNow.getMinutes();
      thisObj.seconds = timeNow.getSeconds();
      thisObj.centiseconds = Math.trunc(timeNow.getMilliseconds() / 10);
      thisObj.setTimerDigits(thisObj.getFormattedTime());
      thisObj.run();
    }, 200);
  },
  pause: function () {
    clearTimeout(this.idTimeOut);
    this.idTimeOut = null;
    return this;
  },
  reset: function () {
    this.seconds = 0;
    this.minutes = 0;
    this.centiseconds = 0;
    this.timeBase = null;
    this.setTimerDigits(this.getFormattedTime());
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

const buttons = document.querySelectorAll(".btn");
const btn1 = document.getElementById("btn-lap");
const btn2 = document.getElementById("btn-start");

function btnFunc(idBtn) {
  switch (idBtn) {
    case "btn-start":
      btn2.id = "btn-stop";
      btn2.innerText = "Stop";
      timer.start();
      break;

    case "btn-stop":
      btn1.id = "btn-reset";
      btn1.innerText = "Reset";
      btn2.id = "btn-resume";
      btn2.innerText = "Resume";
      timer.pause();
      break;
    case "btn-resume":
      btn1.id = "btn-lap";
      btn1.innerText = "Lap";
      btn2.id = "btn-stop";
      btn2.innerText = "Stop";
      timer.start();
      break;
    case "btn-reset":
      btn1.id = "btn-lap";
      btn1.innerText = "Lap";
      btn2.id = "btn-start";
      btn2.innerText = "Start";
      timer.reset();
      break;

    default:
      break;
  }
}

if (!btn1 || !btn2) {
  alert("ERROR!!");
}

for (const button of buttons) {
  button.addEventListener("click", function () {
    btnFunc(button.id);
  });
}

timer.init();
