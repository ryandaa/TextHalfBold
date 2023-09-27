// ELEMENTS
const locationIdElement = document.getElementById("locationId")
const startDateElement = document.getElementById("startDate")
const endDateElement = document.getElementById("endDate")

// BUTTON ELEMENTS
const startButtonElement = document.getElementById("startButton")
const stopButtonElement = document.getElementById("stopButton")

// SPAN LISTENERS
const runningSpan = document.getElementById("runningSpan")
const stoppedSpan = document.getElementById("stoppedSpan")

// Error message
const locationIdError = document.getElementById("locationIdError")
const startDateError = document.getElementById("startDateError")
const endDateError = document.getElementById("endDateError")

const hideElement = (elem) => {
    elem.style.display = 'none'
}

const showElement = (elem) => {
    elem.style.display = ''
}

const handleOnStartState = () => {
    // spans
    showElement(runningSpan)
    hideElement(stoppedSpan)
}

const handleOnStopState = () => {
    showElement(stoppedSpan)
    hideElement(runningSpan)
}

function resetReadingSessions() {
    chrome.storage.local.set({readingSessions: []}, function() {
        console.log('Reading sessions data has been reset.');
        displayReadingSessions(); // Refresh the displayed reading sessions
    });
}

// Inject the content script
function injectContentScript() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {file: 'contentscript.js'}
        );
    });
}

// Remove the content script
function removeContentScript() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.reload(tabs[0].id);
    });
}

function toggleEffect(enable) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {enableEffect: enable});
    });
}

// Store the state
function storeState(isRunning) {
    chrome.storage.local.set({ isRunning: isRunning }, function() {
        console.log('State is stored');
    });
}

// Update UI based on state
function updateUI(isRunning) {
    if (isRunning) {
        handleOnStartState();
    } else {
        handleOnStopState();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const timerElement = document.getElementById('timer');
    const timerStartButton = document.getElementById('timerStartButton');
    const timerStopButton = document.getElementById('timerStopButton');
    const timerResetButton = document.getElementById('timerResetButton');

    function displayTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // when start button is clicked, this activates
    timerStartButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({action: 'startTimer'});
        toggleEffect(true); // enables effect
        storeState(true); // stores data
        updateUI(true); // Update UI
    });
    
    // when stop button is closed, this activates
    timerStopButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({action: 'stopTimer'});
        displayReadingSessions();
        toggleEffect(false); // Disable the effect when the timer stops
        storeState(false); // Store the state
        updateUI(false); // Update UI
    });
    

    timerResetButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({action: 'resetTimer'});
        handleOnStopState();
    });

    setInterval(() => {
        chrome.runtime.sendMessage({action: 'getTimer'}, response => {
            displayTime(response.seconds);
        });
    }, 1000);

    chrome.storage.local.get(['isRunning'], function(result) {
        updateUI(result.isRunning);
    });

    function displayReadingSessions() {
        chrome.storage.local.get(['readingSessions'], function(result) {
            let readingSessions = result.readingSessions || [];
            let totalSeconds = 0;
            const readingSessionsList = document.getElementById('readingSessionsList');
            readingSessionsList.innerHTML = '';
            readingSessions.forEach(session => {
                totalSeconds += session.duration;
    
                // Parse the ISO strings
                const startDateTime = new Date(session.startTime);
                const endDateTime = new Date(session.endTime);
    
                // Format the dates
                const startDateString = startDateTime.toLocaleDateString();
                const startTimeString = startDateTime.toLocaleTimeString();
                const endDateString = endDateTime.toLocaleDateString();
                const endTimeString = endDateTime.toLocaleTimeString();
    
                const li = document.createElement('li');
                li.textContent = `Date: ${startDateString}, Start Time: ${startTimeString}, End Time: ${endTimeString}, Duration: ${session.duration} seconds`;
                readingSessionsList.appendChild(li);
            });
            const totalReadingTime = document.getElementById('totalReadingTime');
            totalReadingTime.textContent = `This is how much time you've spent reading: ${totalSeconds} seconds`;
        });
    }

    // Call this function when the popup is loaded
    displayReadingSessions();
    
    const resetDataButton = document.getElementById('resetDataButton');
    resetDataButton.addEventListener('click', () => {
        resetReadingSessions();
    });
});

