/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      frame: {
        type: 'chrome',
        color: '#f7931a'
      },
      innerBounds: {
        minWidth: 1010,
        minHeight: 740
      },
      resizable: false
      
    }
  );
});
