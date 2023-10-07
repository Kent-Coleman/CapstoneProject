import WorkoutTracker from "./WorkoutTracker.js";
import chart from "./chart.js"

const app = document.getElementById("app");

const wt = new WorkoutTracker(app);

window.wt = wt;