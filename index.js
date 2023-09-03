//const timerDigits = document.getElementById("overall-time-digits");

/*think about the case minutes exceeds 59*/

class StopWatch {
  constructor(callBackTickComplete = null) {
    this.centiseconds = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.idTimeOut = null;
    this.timeBase = null;
    this.cbTickComplete = callBackTickComplete;
  }

  start() {
    if (!this.idTimeOut) {
      this.run();
      this.timeBase = new Date(
        Date.now() -
          10 * this.centiseconds -
          1000 * this.seconds -
          60000 * this.minutes
      );
    }
  }

  run() {
    const thisObj = this;
    this.idTimeOut = setTimeout(function () {
      let relativeTime = new Date() - thisObj.timeBase;
      const timeNow = new Date(relativeTime);

      thisObj.minutes = timeNow.getMinutes();
      thisObj.seconds = timeNow.getSeconds();
      thisObj.centiseconds = Math.trunc(timeNow.getMilliseconds() / 10);

      if (thisObj.cbTickComplete) {
        cbTickComplete(thisObj); // should i call the cbFunc with timeout???
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
    this.timeBase = null;

    return this;
  }

  getFormattedTime() {
    return `${this.minutes.toString().padStart(2, "0")}:${this.seconds
      .toString()
      .padStart(2, "0")}:${this.centiseconds.toString().padStart(2, "0")}`;
  }
}

function cbTickComplete(objStopWatch) {
  const formattedTime = objStopWatch.getFormattedTime();

  switch (objStopWatch) {
    case timerOverAll:
      overAllTimeDigits.innerText = formattedTime;
      break;

    case timerLap:
      lapTimeDigits.innerText = formattedTime;
      break;

    default:
      //???
      break;
  }
}

const timerOverAll = new StopWatch(cbTickComplete);
const timerLap = new StopWatch(cbTickComplete);

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

  timerOverAll.start();

  btn1.disabled = false;
}

function reset() {
  btn1.id = "btn-lap";
  btn1.innerText = "Lap";

  btn2.id = "btn-start";
  btn2.innerText = "Start";

  timerOverAll.reset();
  overAllTimeDigits.innerText = timerOverAll.getFormattedTime();

  timerLap.reset();
  lapTimeDigits.innerText = timerLap.getFormattedTime();

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

  timerLap.stop();
  timerOverAll.stop();
}

function resume() {
  btn1.id = "btn-lap";
  btn1.innerText = "Lap";
  btn2.id = "btn-stop";
  btn2.innerText = "Stop";

  if (cntLap) {
    timerLap.start();
  }
  timerOverAll.start();
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

  timerLap.stop();
  lapTimeDigits.innerText = timerLap.getFormattedTime();

  divColTimeOverall.innerText = timerOverAll.getFormattedTime();
  if (!cntLap) {
    secLapHeader.style.visibility = "visible";
    lapTimeDigits.style.visibility = "visible";
    divColTimeLap.innerText = divColTimeOverall.innerText;
  } else {
    divColTimeLap.innerText = timerLap.getFormattedTime();
  }
  divColCntLap.innerText = `${++cntLap}`;

  timerLap.reset();
  timerLap.start();
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
