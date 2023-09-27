function displayReadingSessions() {
    chrome.storage.local.get(['readingSessions'], function(result) { // chrome.storage.local.get allows us to store the data for the readingSessions
        
        let readingSessions = result.readingSessions || [];
        let totalSeconds = 0;
        const readingSessionsList = document.getElementById('readingSessionsList');
        readingSessionsList.innerHTML = '';

        // Group the reading sessions by date
        const sessionsByDate = {};
        readingSessions.forEach(session => {
            totalSeconds += session.duration;

            // Parse the ISO strings
            const startDateTime = new Date(session.startTime);

            // Format the date
            const startDateString = startDateTime.toLocaleDateString();

            // Add the session to the corresponding date group
            if (!sessionsByDate[startDateString]) {
                sessionsByDate[startDateString] = [];
            }
            sessionsByDate[startDateString].push(session);
        });

        // Display the reading sessions grouped by date
        for (const date in sessionsByDate) {
            const dateGroup = sessionsByDate[date];
            const dateLi = document.createElement('li');
            const dateSpan = document.createElement('span');
            dateSpan.className = 'reading-date is-size-10 has-text-danger has-text-weight-bold';
            dateSpan.textContent = `Date: ${date}`;
            dateLi.appendChild(dateSpan);
            readingSessionsList.appendChild(dateLi);

            dateGroup.forEach(session => {
                // Calculate the duration in hours, minutes, and seconds
                const hours = Math.floor(session.duration / 3600);
                const minutes = Math.floor((session.duration % 3600) / 60);
                const seconds = session.duration % 60;

                // Build the reading time string conditionally
                let readingTimeString = 'Reading Time:';
                if (hours > 0) {
                    readingTimeString += ` ${hours} hours,`;
                }
                if (minutes > 0) {
                    readingTimeString += ` ${minutes} minutes,`;
                }
                if (seconds > 0) {
                    readingTimeString += ` ${seconds} seconds`;
                }

                const timeLi = document.createElement('li');
                const timeSpan = document.createElement('span');
                timeSpan.className = 'reading-time is-size-10';
                timeSpan.textContent = `${readingTimeString}`;

                timeLi.appendChild(timeSpan);
                readingSessionsList.appendChild(timeLi);
            });
        }

        // Calculate the total reading time in hours, minutes, and seconds
        const totalHours = Math.floor(totalSeconds / 3600);
        const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
        const totalSecondsRemainder = totalSeconds % 60;

        // Build the total reading time string conditionally
        let totalReadingTimeString = 'This is how much time you\'ve spent reading in total:';
        if (totalHours > 0) {
            totalReadingTimeString += ` ${totalHours} hours,`;
        }
        if (totalMinutes > 0) {
            totalReadingTimeString += ` ${totalMinutes} minutes,`;
        }
        if (totalSecondsRemainder > 0) {
            totalReadingTimeString += ` ${totalSecondsRemainder} seconds`;
        }

        const totalReadingTime = document.getElementById('totalReadingTime');
        totalReadingTime.textContent = totalReadingTimeString;
    });
}

function resetReadingSessions() {
    chrome.storage.local.set({readingSessions: []}, function() {
        console.log('Reading sessions data has been reset.');
        displayReadingSessions(); // Refresh the displayed reading sessions
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Call this function when the page is loaded
    displayReadingSessions();

    const resetDataButton = document.getElementById('resetDataButton');
    resetDataButton.addEventListener('click', () => {
        resetReadingSessions();
    });
});
