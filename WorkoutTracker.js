export default class WorkoutTracker {
    static LOCAL_STORAGE_DATA_KEY = "workout-tracker-entries";
    constructor(root) {
        this.root = root;
        this.root.insertAdjacentHTML("afterbegin", WorkoutTracker.html());
        this.entries = [];

        this.loadEntries();
        this.updateView();

        this.root.querySelector(".tracker__add").addEventListener("click", () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDay().toString().padStart(2, "0");
            // TODO: Fix bug preventing default of current date

            this.addEntry({
                date: `${ year }-${ month }-${ day }`,
                workout: "walking",
                duration: 30
            });
        });
    }

    static html() {
        return `
            <table class="tracker">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Workout</th>
                        <th>Duration</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="tracker__entries"></tbody>
                <tbody>
                    <tr class="tracker__row tracker__row--add">
                        <td colspan="4">
                            <button type="button" class="tracker__add">Add Entry &plus;</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    static rowHtml() {
        return `
            <tr class="tracker__row">
                <td>
                    <input type="date" class="tracker__date">
                </td>
                <td>
                    <select class="tracker__workout">
                        <option value="walking">Walking</option>
                        <option value="running">Running</option>
                        <option value="cycling">Cycling</option>
                        <option value="yoga">Yoga</option>
                        <option value="swimming">Swimming</option>
                        <option value="strength-exercise">Strength Exercise</option>
                    </select>
                </td>
                <td>
                    <input type="number" class="tracker__duration">
                    <span class="tracker__text">minutes</span>
                </td>
                <td>
                    <button type="button" class="tracker__button tracker__delete">&times;</button>
                </td>
            </tr>
        `;
    }

    loadEntries() {
        this.entries = JSON.parse(localStorage.getItem("WorkoutTracker.LOCAL_STORAGE_DATA_KEY") || "[]");
    }

    saveEntries() {
        localStorage.setItem("WorkoutTracker.LOCAL_STORAGE_DATA_KEY", JSON.stringify(this.entries));
    }

    updateView() {
        const tableBody = this.root.querySelector(".tracker__entries");
        const addRow = data => {
            const template = document.createElement("template");
            let row = null;

            template.innerHTML = WorkoutTracker.rowHtml().trim();
            row = template.content.firstElementChild;

            row.querySelector(".tracker__date").value = data.date;
            row.querySelector(".tracker__workout").value = data.workout;
            row.querySelector(".tracker__duration").value = data.duration;

            row.querySelector(".tracker__date").addEventListener("change", ({ target }) => {
                data.date = target.value;
                this.saveEntries();
            });

            row.querySelector(".tracker__workout").addEventListener("change", ({ target }) => {
                data.workout = target.value;
                this.saveEntries();
            });

            row.querySelector(".tracker__duration").addEventListener("change", ({ target }) => {
                data.duration = target.value;
                this.saveEntries();
            });

            row.querySelector(".tracker__delete").addEventListener("click", () => {
                this.deleteEntry(data);
            });

            tableBody.appendChild(row);
        };

        tableBody.querySelectorAll(".tracker__row").forEach(row => {
            row.remove();
        });

        this.entries.forEach(data => addRow(data));

        const totalDuration = this.entries.reduce((total, entry) => total + entry.duration, 0);
    
        // Update the home game image based on the total duration
        const homeGameImage = document.getElementById("home-game-image");
        if (totalDuration < 60) {
            homeGameImage.src = "images/0.png";
        } else if (totalDuration >= 60 && totalDuration < 120) {
            homeGameImage.src = "images/1.png";
        } else if (totalDuration >= 120 && totalDuration < 180) {
            homeGameImage.src = "images/2.png";
        } else if (totalDuration >= 180 && totalDuration < 220) {
            homeGameImage.src = "images/3.png";
        } else if (totalDuration >= 220 && totalDuration < 260) {
            homeGameImage.src = "images/4.png";
        } else if (totalDuration >= 260 && totalDuration < 300) {
            homeGameImage.src = "images/5.png";
        } else if (totalDuration >= 300 && totalDuration < 340) {
            homeGameImage.src = "images/6.png";
        } else if (totalDuration >= 380 && totalDuration < 450) {
            homeGameImage.src = "images/7.png";
        } else {
            homeGameImage.src = "images/8.png";
        }

    };

    addEntry(data) {
        this.entries.push(data);
        this.saveEntries();
        this.updateView();
    }

    deleteEntry(dataToDelete) {
        this.entries = this.entries.filter(data => data !== dataToDelete);
        this.saveEntries();
        this.updateView();
    }

    calculateTotalDurations() {
        const exerciseTypes = [
            "walking",
            "running",
            "cycling",
            "yoga",
            "swimming",
            "strength-exercise"
        ];

        const totalDurations = {};

        // Initialize totalDurations object with zeros for each exercise type
        exerciseTypes.forEach(exercise => {
            totalDurations[exercise] = 0;
        });

        // Calculate total duration for each exercise type
        this.entries.forEach(entry => {
            if (entry.workout in totalDurations) {
                totalDurations[entry.workout] += entry.duration;
            }
        });

        return totalDurations;
    }

    // Expose the total durations as properties
    get totalDurations() {
        return this.calculateTotalDurations();
    }
}
