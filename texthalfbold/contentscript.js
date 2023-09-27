// Function to wrap half of each word in <b> tags
let effectEnabled = false;

// Function to wrap half of each word in <b> tags
function wrapHalfBold(text) {
  if (!text.trim() || !effectEnabled) return text; // Skip text nodes that only contain whitespace or if effect is disabled
  // set variables for words and the outputs (set first and second half of word)
  var words = text.split(' ');
  var output = words.map(word => {

      var half = Math.ceil(word.length / 2); // ceil rounds up
      var firstHalf = word.substring(0, half);
      var secondHalf = word.substring(half);
      return (half > 0) ? '<b>' + firstHalf + '</b>' + secondHalf : word; // if half is greather than 0, then we bold 
  });
  
  return output.join(' ');
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.hasOwnProperty('enableEffect')) {
        effectEnabled = request.enableEffect;
        // Re-traverse the body whenever the effect is toggled
        traverse(document.body);
    }
});

// Recursive function to go through all the nodes
function traverse(node) {
  if (node.nodeType === 3) { // Text node
      var wrappedText = wrapHalfBold(node.textContent);
      if (node.textContent !== wrappedText) {
          var newElement = document.createElement('span');
          newElement.innerHTML = wrappedText;
          node.replaceWith(newElement);
          newElement.setAttribute('data-processed', 'true'); // Mark the node as processed
      }
  } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') { // Element node
      if (!node.getAttribute('data-processed')) { // Skip nodes that have already been processed
          Array.from(node.childNodes).forEach(traverse);
      }
  }
}

// Helper function that optimizes performance by making sure a function isn't called too frequently
function debounce(func, wait) {
  var timeout;
  return function() {
      var context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
          func.apply(context, args);
      }, wait);
  };
}

// Function to observe changes in the DOM
function observeChanges() {
  var observer = new MutationObserver(debounce(function(mutations) {
      mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
              Array.from(mutation.addedNodes).forEach(traverse);
          } else if (mutation.type === 'characterData') {
              traverse(mutation.target);
          }
      });
  }, 5)); // Wait 100ms after the last change before running the function

  observer.observe(document.body, {
      childList: true, // report added/removed nodes
      subtree: true, // also observe all descendants of body
      characterData: true, // also report changes to text node content
  });
}

window.onload = function() {
  traverse(document.body);
  observeChanges();
}
