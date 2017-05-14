import React from "react";
import CalendarPage from "./rc/cal";

function layOutDay(data) {
  React.render(
    <CalendarPage events={data}/>, document.body
  );
}
layOutDay([]);

window.layOutDay = layOutDay;
let testEvents = [
  { start: 30, end: 150 },
  { start: 540, end: 600 },
  { start: 560, end: 620 },
  { start: 610, end: 670 }
];

let testEvents_1 = [
  { start: 30, end: 620 },

  { start: 340, end: 400 },
  { start: 360, end: 420 },
  { start: 410, end: 470 },

  { start: 540, end: 600 },
  { start: 560, end: 620 },
  { start: 570, end: 610 }
];

let testEvents_2 = [
  { start: 30, end: 150 },

  { start: 120, end: 280 },
  { start: 170, end: 360 },
  { start: 200, end: 290 },
  { start: 290, end: 320 }
];

layOutDay(testEvents);
