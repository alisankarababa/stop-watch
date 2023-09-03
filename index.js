/*think about the case minutes exceeds 59*/

class StopWatch {
  constructor(callBackTickComplete = null, callBackLap = null) {
    this.centiseconds = 0;
    this.seconds = 0;
    this.minutes = 0;

    this.lapCentiseconds = 0;
    this.lapSeconds = 0;
    this.lapMinutes = 0;

    this.timeBase = null;
    this.lapTimeBase = null;
    this.isLapActive = false;

    this.idTimeOut = null;
    this.cbTickComplete = callBackTickComplete;
    this.cbLap = callBackLap;
  }

  start() {
    if (!this.idTimeOut) {
      const currentTime = Date.now();
      this.timeBase =
        currentTime -
        10 * this.centiseconds -
        1000 * this.seconds -
        60000 * this.minutes;
      this.lapTimeBase = currentTime;

      if (this.isLapActive) {
        this.lapTimeBase =
          currentTime -
          10 * this.lapCentiseconds -
          1000 * this.lapSeconds -
          60000 * this.lapMinutes;
      }

      this.run();
    }
  }

  run() {
    const thisObj = this;
    this.idTimeOut = setTimeout(function () {
      const currentTime = Date.now();

      const relativeTime = currentTime - thisObj.timeBase;
      const relativeDate = new Date(relativeTime);

      thisObj.minutes = relativeDate.getMinutes();
      thisObj.seconds = relativeDate.getSeconds();
      thisObj.centiseconds = Math.trunc(relativeDate.getMilliseconds() / 10);

      if (thisObj.cbTickComplete) {
        thisObj.cbTickComplete(thisObj);
      }

      if (thisObj.isLapActive) {
        const relativeLapTime = currentTime - thisObj.lapTimeBase;
        const relativeLapDate = new Date(relativeLapTime);

        thisObj.lapMinutes = relativeLapDate.getMinutes();
        thisObj.lapSeconds = relativeLapDate.getSeconds();
        thisObj.lapCentiseconds = Math.trunc(
          relativeLapDate.getMilliseconds() / 10
        );

        if (thisObj.cbLap) {
          thisObj.cbLap(thisObj);
        }
      }

      thisObj.run();
    }, 200);
  }

  stop() {
    clearTimeout(this.idTimeOut);
    this.idTimeOut = null;
    return this;
  }

  reset() {
    this.seconds = 0;
    this.minutes = 0;
    this.centiseconds = 0;

    this.lapCentiseconds = 0;
    this.lapSeconds = 0;
    this.lapMinutes = 0;

    this.timeBase = null;
    this.lapTimeBase = null;
    this.isLapActive = false;

    return this;
  }

  lap() {
    this.lapCentiseconds = 0;
    this.lapSeconds = 0;
    this.lapMinutes = 0;
    this.isLapActive = true;
    if (cbLap) {
      cbLap(this);
    }
  }

  getFormattedTime() {
    return `${this.minutes.toString().padStart(2, "0")}:${this.seconds
      .toString()
      .padStart(2, "0")}:${this.centiseconds.toString().padStart(2, "0")}`;
  }

  getFormattedLapTime() {
    return `${this.lapMinutes.toString().padStart(2, "0")}:${this.lapSeconds
      .toString()
      .padStart(2, "0")}:${this.lapCentiseconds.toString().padStart(2, "0")}`;
  }
}

function cbTickComplete(objStopWatch) {
  overAllTimeDigits.innerText = objStopWatch.getFormattedTime();
}

function cbLap(objStopWatch) {
  lapTimeDigits.innerText = objStopWatch.getFormattedLapTime();
}

const stopWatch = new StopWatch(cbTickComplete, cbLap);

const buttons = document.querySelectorAll(".btn");
const btn1 = document.getElementById("btn-lap");
btn1.disabled = true;
const btn2 = document.getElementById("btn-start");

const secLapRecs = document.getElementById("lap-recs");
const secLapHeader = document.getElementById("lap-header");
const secLapRecordsContainer = secLapRecs.firstElementChild;
const overAllTimeDigits = document.getElementById("overall-time-digits");
const lapTimeDigits = document.getElementById("lap-time-digits");

let cntLap = 0;

if (
  !btn1 ||
  !btn2 ||
  !secLapRecs ||
  !secLapHeader ||
  !secLapRecordsContainer ||
  !overAllTimeDigits ||
  !lapTimeDigits
) {
  alert("ERROR!!");
}

function start() {
  btn2.id = "btn-stop";
  btn2.innerText = "Stop";

  stopWatch.start();

  btn1.disabled = false;
}

function reset() {
  btn1.id = "btn-lap";
  btn1.innerText = "Lap";

  btn2.id = "btn-start";
  btn2.innerText = "Start";

  stopWatch.reset();
  overAllTimeDigits.innerText = stopWatch.getFormattedTime();

  stopWatch.reset();
  lapTimeDigits.innerText = stopWatch.getFormattedTime();

  btn1.disabled = true;
  secLapRecordsContainer.replaceChildren();
  secLapHeader.style.visibility = "hidden";
  lapTimeDigits.style.visibility = "hidden";
  cntLap = 0;
}

function stop() {
  btn1.id = "btn-reset";
  btn1.innerText = "Reset";

  btn2.id = "btn-resume";
  btn2.innerText = "Resume";

  stopWatch.stop();
  stopWatch.stop();
}

function resume() {
  btn1.id = "btn-lap";
  btn1.innerText = "Lap";
  btn2.id = "btn-stop";
  btn2.innerText = "Stop";

  if (cntLap) {
    stopWatch.start();
  }
  stopWatch.start();
}

function lap() {
  const divRow = document.createElement("div");
  divRow.classList.add("row", "align-items-center");
  const divColCntLap = document.createElement("div");
  const divColTimeLap = document.createElement("div");
  const divColTimeOverall = document.createElement("div");
  divColCntLap.classList.add("col-sm-12", "col-md-4");
  divColTimeLap.classList.add("col-sm-12", "col-md-4");
  divColTimeOverall.classList.add("col-sm-12", "col-md-4");
  secLapRecordsContainer.prepend(divRow);

  stopWatch.stop();

  divColTimeOverall.innerText = stopWatch.getFormattedTime();
  if (!cntLap) {
    secLapHeader.style.visibility = "visible";
    lapTimeDigits.style.visibility = "visible";
    divColTimeLap.innerText = divColTimeOverall.innerText;
  } else {
    divColTimeLap.innerText = stopWatch.getFormattedLapTime();
  }
  divColCntLap.innerText = `${++cntLap}`;

  stopWatch.lap();
  stopWatch.start();
  divRow.append(divColCntLap);
  divRow.append(divColTimeLap);
  divRow.append(divColTimeOverall);
}

function btnFunc(idBtn) {
  switch (idBtn) {
    case "btn-start":
      start();
      break;
    case "btn-stop":
      stop();
      break;
    case "btn-resume":
      resume();
      break;
    case "btn-reset":
      reset();
      break;
    case "btn-lap":
      lap();
      break;
    default:
      break;
  }
}

for (const button of buttons) {
  button.addEventListener("click", function () {
    //console.log(this); // btn func id's change in btnFunc but why does this print the id as if btnFunc called before this line??

    btnFunc(this.id);
  });
}
