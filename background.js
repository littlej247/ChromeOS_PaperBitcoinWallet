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
  
  /*
  myNewWindow =  window.open( 'index.html' ,
                              '',
                              'chrome=yes,close=yes,resize=false,scrollbars=no,minimizable=yes,' +
                              'width=1010,height=740,background'
  );
  */
});
function showAboutWindow(){
   popupWindow = window.open(
      'about.html', 
      'Joshs custom shell box',
      'chrome=yes,close=yes,resize=yes,scrollbars=yes,minimizable=yes,' +
      'width=735,height=440'
  );
  
  
}
