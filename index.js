//const timerDigits = document.getElementById("overall-time-digits");

/*think about the case minutes exceeds 59*/

let timer = {
  centiseconds: 0,
  seconds: 0,
  minutes: 0,
  lapCentiseconds: 0,
  lapSeconds: 0,
  lapMinutes: 0,
  timerDigits: null,
  lapDigits: null,
  idTimeOut: null,
  timeBase: null,
  lapTimeBase: null,
  isLapActive: false,
  init: function () {
    this.timerDigits = document.getElementById("overall-time-digits");
    this.lapDigits = document.getElementById("lap-time-digits");

    return this.lapDigits && this.timerDigits;
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

      if (this.isLapActive) {
        this.lapTimeBase = new Date(
          Date.now() -
            10 * this.lapCentiseconds -
            1000 * this.lapSeconds -
            60000 * this.lapMinutes
        );
      }
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

      if (thisObj.isLapActive) {
        const relativeLapTime = new Date() - thisObj.lapTimeBase;
        const timeLapNow = new Date(relativeLapTime);

        thisObj.lapMinutes = timeLapNow.getMinutes();
        thisObj.lapSeconds = timeLapNow.getSeconds();
        thisObj.lapCentiseconds = Math.trunc(timeLapNow.getMilliseconds() / 10);

        thisObj.setLapDigits(thisObj.getFormattedLapTime());
      }

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

    this.lapSeconds = 0;
    this.lapMinutes = 0;
    this.lapCentiseconds = 0;
    this.lapTimeBase = null;
    this.isLapActive = false;

    this.setTimerDigits(this.getFormattedTime());
    this.setLapDigits(this.getFormattedLapTime());

    return this;
  },
  lap: function () {
    this.lapTimeBase = new Date();

    this.lapCentiseconds = 0;
    this.lapSeconds = 0;
    this.lapMinutes = 0;
    this.isLapActive = true;
    this.setLapDigits(this.getFormattedLapTime());
    return this;
  },
  getFormattedLapTime: function () {
    return `${this.lapMinutes.toString().padStart(2, "0")}:${this.lapSeconds
      .toString()
      .padStart(2, "0")}:${this.lapCentiseconds.toString().padStart(2, "0")}`;
  },
  getFormattedTime: function () {
    return `${this.minutes.toString().padStart(2, "0")}:${this.seconds
      .toString()
      .padStart(2, "0")}:${this.centiseconds.toString().padStart(2, "0")}`;
  },
  setTimerDigits: function (formattedDigitStr) {
    this.timerDigits.innerText = formattedDigitStr;
  },
  setLapDigits: function (formattedDigitStr) {
    this.lapDigits.innerText = formattedDigitStr;
  },
};

const buttons = document.querySelectorAll(".btn");
const btn1 = document.getElementById("btn-lap");
const btn2 = document.getElementById("btn-start");
const secLapRecs = document.getElementById("lap-recs");
const secLapHeader = document.getElementById("lap-header");
const secLapRecordsContainer = secLapRecs.firstElementChild;
let cntLap = 0;

function btnFunc(idBtn) {
  switch (idBtn) {
    case "btn-start":
      btn2.id = "btn-stop";
      btn2.innerText = "Stop";
      timer.start();
      btn1.disabled = false;
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
      btn1.disabled = true;
      secLapRecordsContainer.replaceChildren();
      secLapHeader.style.visibility = "hidden";
      cntLap = 0;
      break;
    case "btn-lap":
      if (!cntLap) {
        secLapHeader.style.visibility = "visible";
        timer.lapDigits.style.visibility = "visible";
      }

      console.log("here");

      const divRow = document.createElement("div");
      divRow.classList.add("row", "align-items-center");
      const divColCntLap = document.createElement("div");
      const divColTimeLap = document.createElement("div");
      const divColTimeOverall = document.createElement("div");
      divColCntLap.classList.add("col-sm-12", "col-md-4");
      divColTimeLap.classList.add("col-sm-12", "col-md-4");
      divColTimeOverall.classList.add("col-sm-12", "col-md-4");

      divColCntLap.innerText = `${++cntLap}`;
      divColTimeLap.innerText = timer.getFormattedLapTime();
      divColTimeOverall.innerText = timer.getFormattedTime();

      divRow.append(divColCntLap);
      divRow.append(divColTimeLap);
      divRow.append(divColTimeOverall);

      secLapRecordsContainer.prepend(divRow);

      timer.lap();
      break;

    default:
      break;
  }
}

if (!btn1 || !btn2 || !secLapRecs || !secLapHeader || !secLapRecordsContainer) {
  alert("ERROR!!");
}

for (const button of buttons) {
  button.addEventListener("click", function () {
    //console.log(this); // btn func id's change in btnFunc but why does this print the id as if btnFunc called before this line??

    btnFunc(this.id);
  });
}

btn1.disabled = true;
if (!timer.init()) {
  alert("ERROR TIMER INIT!");
}
