export default class WorkoutTracker {
    static LOCAL_STORAGE_DATA_KEY = "workout-tracker-entries";

    constructor(root) {
        this.root = root;
        this.entries = [];

        this.initHTML();
        this.loadEntries();
        this.updateView();

        this.root.querySelector(".tracker__add").addEventListener("click", () => {
            this.addEntry({
                date: new Date().toISOString().split('T')[0],
                workout: "walking",
                duration: 30,
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
                            <button type="button" class="tracker__add">Add Entry &plus;</button>
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
                        <!-- Add other workout options here -->
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

    initHTML() {
        this.root.insertAdjacentHTML("afterbegin", WorkoutTracker.html());
    }

    loadEntries() {
        const storedData = localStorage.getItem(WorkoutTracker.LOCAL_STORAGE_DATA_KEY);
        this.entries = storedData ? JSON.parse(storedData) : [];
    }

    saveEntries() {
        localStorage.setItem(WorkoutTracker.LOCAL_STORAGE_DATA_KEY, JSON.stringify(this.entries));
    }

    updateView() {
        const tableBody = this.root.querySelector(".tracker__entries");
        tableBody.innerHTML = "";

        this.entries.forEach(data => {
            const row = this.createRow(data);
            tableBody.appendChild(row);
        });

        this.updateHomeGameImage();
    }

    createRow(data) {
        const template = document.createElement("template");
        template.innerHTML = WorkoutTracker.rowHtml().trim();
        const row = template.content.firstElementChild;

        const dateInput = row.querySelector(".tracker__date");
        const workoutSelect = row.querySelector(".tracker__workout");
        const durationInput = row.querySelector(".tracker__duration");
        const deleteButton = row.querySelector(".tracker__delete");

        dateInput.value = data.date;
        workoutSelect.value = data.workout;
        durationInput.value = data.duration;

        dateInput.addEventListener("change", () => {
            data.date = dateInput.value;
            this.saveEntries();
        });

        workoutSelect.addEventListener("change", () => {
            data.workout = workoutSelect.value;
            this.saveEntries();
        });

        durationInput.addEventListener("change", () => {
            data.duration = parseInt(durationInput.value, 10);
            this.saveEntries();
        });

        deleteButton.addEventListener("click", () => {
            this.deleteEntry(data);
        });

        return row;
    }

    updateHomeGameImage() {
        const totalDuration = this.entries.reduce((total, entry) => total + entry.duration, 0);
        const imageNumber = Math.min(Math.floor(totalDuration / 60), 8); // Adjust this range as needed

        const homeGameImage = document.getElementById("home-game-image");
        homeGameImage.src = `images/${imageNumber}.png`;
    }

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
}
