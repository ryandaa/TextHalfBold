/*
background.js allows the user to keep the timer running even while the popup is disabled.
This makes it so that their reading can be tracked while they're able to scroll through anything.
*/

let timerInterval;
let seconds = 0;
let startTime = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // if we started the time, then the seconds keep going
    if (request.action === 'startTimer') {
        if (!timerInterval) {
            startTime = new Date().toISOString();
            timerInterval = setInterval(() => {
                seconds++;
            }, 1000);
        }
    // when stopped, it halts everything  
    } else if (request.action === 'stopTimer') {
        clearInterval(timerInterval);
        timerInterval = null;
        const endTime = new Date().toISOString();
        const session = { startTime, endTime, duration: seconds };
        chrome.storage.local.get(['readingSessions'], function(result) {
            let readingSessions = result.readingSessions || [];
            readingSessions.push(session);
            chrome.storage.local.set({ readingSessions });
        });
    } else if (request.action === 'resetTimer') {
        clearInterval(timerInterval);
        timerInterval = null;
        seconds = 0;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTimer') {
        sendResponse({seconds: seconds});
    }
});