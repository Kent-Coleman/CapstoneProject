import WorkoutTracker from "./WorkoutTracker.js";

export default class chart {
    updateView() {
        // ... (existing code)

        // Calculate total duration for each exercise type
        const exerciseDurations = {};
        this.entries.forEach((data) => {
            const exerciseType = data.workout;
            const duration = parseInt(data.duration);
            if (exerciseDurations[exerciseType]) {
                exerciseDurations[exerciseType] += duration;
            } else {
                exerciseDurations[exerciseType] = duration;
            }
        });

        // Create data for the bar chart
        const exerciseLabels = Object.keys(exerciseDurations);
        const exerciseData = Object.values(exerciseDurations);

        // Render the bar chart
        const exerciseChartElement = document.getElementById("exercise-chart");
        if (exerciseChartElement) {
            new Chart(exerciseChartElement, {
                type: "bar",
                data: {
                    labels: exerciseLabels,
                    datasets: [
                        {
                            label: "Exercise Duration",
                            data: exerciseData,
                            backgroundColor: [
                                "rgba(255, 99, 132, 0.2)",
                                "rgba(54, 162, 235, 0.2)",
                                "rgba(255, 206, 86, 0.2)",
                                "rgba(75, 192, 192, 0.2)",
                                "rgba(153, 102, 255, 0.2)",
                                // Add more colors as needed
                            ],
                            borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(54, 162, 235, 1)",
                                "rgba(255, 206, 86, 1)",
                                "rgba(75, 192, 192, 1)",
                                "rgba(153, 102, 255, 1)",
                                // Add more colors as needed
                            ],
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }
}