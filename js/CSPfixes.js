//Coded by Josh Haughton for the purpose of porting app to Chrome OS
// email: intrepidsquatter@gmail.com


//The following code is to fix violations in Google's Content Security Policy (CSP) directive
//More informaion can be found here: https://developer.chrome.com/apps/contentSecurityPolicy
//Required to be able to compile this code as a secure offline Chrome APP
//Any tags added to html for this start with CSP. ie: class="CSP-currencyName"

//----------------Seed Page------------
document.getElementsByTagName("body")[0].onclick = function() { SecureRandom.seedTime();};
document.getElementsByTagName("body")[0].onmousemove = function() { ninja.seeder.seed(event);};
document.getElementsByTagName("body")[0].ontouchmove = function() { ninja.seeder.seed(event);};
document.getElementsByTagName("body")[0].onload = function() { 


    guessPrinterSettings(); 
};
document.getElementById("generatekeyinput").onkeypress = function() {ninja.seeder.seed(event);};
document.getElementById("seedSkipper").onclick = function() {
  ninja.seeder.seedCount = ninja.seeder.seedLimit;
  ninja.seeder.seed();
};


//----------------Header------------
document.getElementById("landwallet").onclick = function() { ninja.tabSwitch(this);};
document.getElementById("calibratewallet").onclick = function() { ninja.tabSwitch(this);};
document.getElementById("paperwallet").onclick = function() { ninja.tabSwitch(this);};
document.getElementById("backwallet").onclick = function() { ninja.tabSwitch(this);};
document.getElementById("foldwallet").onclick = function() { ninja.tabSwitch(this);};
document.getElementById("detailwallet").onclick = function() { ninja.tabSwitch(this);};

document.getElementById("CSP-printerZoomMinus").onclick = function() { printZoom(-1); return(false);};
document.getElementById("printerzoom").onclick = function() { updateCalibrationInfo();};
document.getElementById("CSP-printerZoomPlus").onclick = function() { printZoom(1); return(false);};
document.getElementById("CSP-printShiftMinus").onclick = function() { printShift(-1); return(false);};
document.getElementById("printershift").onclick = function() { updateCalibrationInfo();};
document.getElementById("CSP-printShiftPlus").onclick = function() { printShift(1); return(false);};

//----------------Instructions Page------------
document.getElementById("designPicker").onchange = function() {  setDesign(this.value, );};
document.getElementById("langPicker").onchange = function() {  setDesign(window.designChoice, this.value);};
var aboutWindow;
document.getElementById("CSP-AboutButton").onclick = function() { 
  console.log("i'm reading");
 //showAboutWindow();

 
   chrome.app.window.create(
    'about.html',
    {
      id: 'aboutWindow',
      frame: {
        type: 'chrome',
        color: '#f7931a'
      },
      innerBounds: {
        width: 620,
        height: 650,
        maxWidth: 1010,
        minHeight: 600
      },
      resizable: true
      
    }
  );
 
 
 
 
}

/*
document.getElementById("CSP-AboutButton").onclick = function() { 
  //$("#readMeTextArea").load("README"); 
  $.get("README.md", function(data, status){
    var converter = new showdown.Converter();
    
    document.getElementById("CSP-dialog-popup").className = "dialog-popup dialog-popup-large"
    var aboutBody = "<div style='   max-height: 300px;    border: 2px solid #eee;    overflow-y: scroll;    padding: 7px; background-color: white;' > " + converter.makeHtml(data) + "</div>"
      + "  <div class='footer' style='display:inherit;margin:0px;color:inherit;'>" + document.getElementById("footer").innerHTML + "</div>"
    document.getElementById("CSP-alertText").innerHTML = aboutBody;
    CSP_Alert("About",aboutBody,"ok");
  
    document.getElementsByClassName("CSP-Basic")[1].onclick = function() {  ninja.unitTests.runSynchronousTests();};
        
  });
};
*/
//----------------Calibrate Page---------------
document.getElementsByClassName("print")[0].onclick = function() {  doPrint('calibration');};


//----------------Print Front Page------------
document.getElementsByClassName("print")[1].onclick = function() {  doPrint('generate');};
document.getElementById("papergenerate1").onclick = function() {  ninja.wallets.paperwallet.build(document.getElementById('paperlimit').value * 1, document.getElementById('paperlimitperpage').value * 1, !document.getElementById('paperart').checked, document.getElementById('paperpassphrase').value);  printCounter=0;};
document.getElementById("papergenerate2").onclick = function() {  ninja.wallets.paperwallet.toggleVanityField(true);};
document.getElementById("papergenerate3").onclick = function() {  testAndApplyVanityKey();};
document.getElementById("papergenerate4").onclick = function() {  ninja.wallets.paperwallet.toggleVanityField(false);};
document.getElementById("paperart").onchange = function() { ninja.wallets.paperwallet.toggleArt(this);};      
document.getElementById("CSP-helpRollingDie").onclick = function() {  
  document.getElementById("CSP-dialog-popup").className = "dialog-popup dialog-popup-large";
  CSP_Alert(
    "If you are making a paper wallet for a <a href='https://en.bitcoin.it/wiki/Vanitygen' target='_blank'>vanity address</a>, or duplicating an existing paper wallet:",
    document.getElementById("selfinfo").innerHTML,
    "ok"
  );
};
    
document.getElementById("CSP-BIP38").onclick = function() {  ninja.wallets.paperwallet.toggleEncryptSettings(true);};
document.getElementById("paperencrypt").onclick = function() {  ninja.wallets.paperwallet.toggleEncryptSettings(this.checked);};
document.getElementById("paperpassphrase").onkeyup = function() { document.getElementById('paperbip38activate').disabled = this.value.length < 3;};
document.getElementById("paperpassphrase").onchange = function() { this.value = this.value.toString().replace(/^\s+|\s+$/g, '');};
document.getElementById("paperbip38activate").onclick = function() { ninja.wallets.paperwallet.toggleEncryptSettings(false);};
document.getElementById("CSP-BIP39cancel").onclick = function() { ninja.wallets.paperwallet.toggleEncryptSettings(false, true);};





document.getElementsByClassName("CSP-QRscanner")[0].onclick = function() {  ninja.wallets.detailwallet.qrscanner.start();};
document.getElementsByClassName("CSP-QRscanner")[1].onclick = function() {  ninja.wallets.detailwallet.qrscanner.start();};
document.getElementById("detailprivkey").onfocus = function() {  this.select();};
document.getElementById("detailprivkey").onkeypress = function() {  if (event.keyCode == 13) ninja.wallets.detailwallet.viewDetails();};

document.getElementById("CSP-qrCancelButton").onclick = function() { ninja.wallets.detailwallet.qrscanner.stop();};



//----------------Print Back Page------------
document.getElementsByClassName("print")[2].onclick = function() {  doPrint();};
document.getElementById("backDenominationSelect").onchange = function() { setDenomination(this.value);;};
document.getElementById("backTextChooser").onchange = function() { 
  var toggleBackLongText = (this.value == 'instructions' ? 'block' : 'none'); 				
  var toggleBackCustomMessage = (this.value == 'message' ? 'block' : 'none'); 				
  document.getElementById('backLongText').style.display=toggleBackLongText;
  document.getElementById('backCustomMessage').style.display=toggleBackCustomMessage;
};
document.getElementById("backTextCheckbox2").onclick = function() {
  var toggleStatus = (this.checked ? 'block' : 'none'); 				
  document.getElementById('backAmount').style.display=toggleStatus;
  document.getElementById('backDate').style.display=toggleStatus;
  document.getElementById('backNotes').style.display=toggleStatus;
  document.getElementById('backLines').style.display=toggleStatus;
};



//----------------Validate/Decrypt Page------------
document.getElementById("detailview").onclick = function() {  ninja.wallets.detailwallet.viewDetails();};
document.getElementById("CSP-LoadInPaperWallet").onclick = function() {  ninja.wallets.detailwallet.loadInPaperWallet();};
document.getElementById("detailprivkeypassphrase").onfocus = function() {  this.select();};
document.getElementById("detailprivkeypassphrase").onkeypress = function() {  if (event.keyCode == 13) ninja.wallets.detailwallet.viewDetails();};
document.getElementById("detaildecrypt").onclick = function() {  ninja.wallets.detailwallet.viewDetails();};

document.getElementById("CSP-DisplayCompressed").onclick = function() {  
  document.getElementById('compressed1').style.display='block'; 
  document.getElementById('compressed2').style.display='block';  
  document.getElementById('compressedpicker').style.display='none'; 
  return(false);
};


//------------------Added functions----------------



//Alerts can not be used in chrome apps. CSP_Alert function is a better looking, more functional replacement.
var CSP_alertPromise;
function CSP_Alert(messageTitle,messageBody,dialogType){ 
  CSP_alertPromise = $.Deferred();
  
  //Setup the buttons
  if (dialogType == "ok") { 
    document.getElementById("loader").style.display='none';
    document.getElementById("CSP-alertOk").style.display='block';
    document.getElementById("CSP-alertCancel").style.display='none';
  }  else if (dialogType == "confirm"){
    document.getElementById("loader").style.display='none';
    document.getElementById("CSP-alertOk").style.display='inline-block';
    document.getElementById("CSP-alertCancel").style.display='inline-block';
  } else{ //defaults to buttonless loading screen if no dialogType provided
    document.getElementById("loader").style.display='block';
    document.getElementById("CSP-alertOk").style.display='none';
    document.getElementById("CSP-alertCancel").style.display='none';
  }
    
  //Setup the text  
  if (messageTitle == null){    document.getElementById("CSP-alertTitle").textContent=getRandomTitle()  } else{     document.getElementById("CSP-alertTitle").innerHTML=messageTitle;  }
  document.getElementById("CSP-alertText").innerHTML=messageBody;
  document.getElementById('CSP-modal').style.display='block';
  document.getElementById("CSP-modal").focus();     //ensures that the user can't continue to execute background functions regardless of mode
  document.getElementById("CSP-alertOk").focus();   //if there is no 'ok' button then this won't fire, but atleast the focus was already removed from the foreground
  console.log("CSP_Alert() active. Waiting on promise...");

  return $.when(CSP_alertPromise).done(function (userClicked){
    console.log("CSP_alertPromise resolved. CSP_Alert() returned " + userClicked );
    document.getElementById('CSP-modal').style.display='none';
    document.getElementById("CSP-dialog-popup").className = "dialog-popup dialog-popup-narrow" //reset the css back to default for the next CSP_Alert() call
    return userClicked;
  });
}
document.getElementById("CSP-alertOk").onclick = function () {  CSP_alertPromise.resolve(true);};
document.getElementById("CSP-alertCancel").onclick = function () {    CSP_alertPromise.resolve(false);};






/*



var walletsJSONfile;
//Populate Intro Dropdown boxes with JSON Data
var languagesJSONfile = $.getJSON("json/languages.json")
    .done(function(){
      //console.log(languagesJSONfile);
      languagesJSONfile = languagesJSONfile.responseJSON;
      console.log("languagesJSONfile is suposidly ready");
      for (var key in languagesJSONfile){
        if (languagesJSONfile.hasOwnProperty(key)){ 
          //console.log(languagesJSONfile[key].dropdownName)
          var option = document.createElement("option");
          option.text = languagesJSONfile[key].dropdownName;
          option.value = key;
          document.getElementById('langPicker').add(option);
        }
      }
      
      //Populate Intro Dropdown boxes with JSON Data
      walletsJSONfile = $.getJSON("json/wallets.json")
        .done(function(){
          //console.log(languagesJSONfile);
          walletsJSONfile = walletsJSONfile.responseJSON;
          console.log("walletsJSONfile is suposidly ready");
          setDesign("default", "english");    //*in the future query navigator.language
          for (var key in walletsJSONfile.designs){
            if (walletsJSONfile.designs.hasOwnProperty(key) && walletsJSONfile.designs[key].enabled != false){ 
              //console.log(walletsJSONfile.designs[key].dropdown_name);
              var option = document.createElement("option");
              option.text = walletsJSONfile.designs[key].dropdown_name;
              option.value = key;
              document.getElementById('designPicker').add(option);
            }
          }
      });
  });
    
    
    //console.log(languagesJSONfile);

*/

//eventually all the language stuff will be cleaned up and moved to one place
  for (var key in languagesJSONfile){
    if (languagesJSONfile.hasOwnProperty(key)){ 
      //console.log(languagesJSONfile[key].dropdownName)
      var option = document.createElement("option");
      option.text = languagesJSONfile[key].dropdownName;
      option.value = key;
      document.getElementById('langPicker').add(option);
    }
  }
    
  setDesign("default", "english");    //*in the future query navigator.language
  for (var key in walletsJSONfile.designs){
    if (walletsJSONfile.designs.hasOwnProperty(key) && walletsJSONfile.designs[key].enabled != false){ 
      //console.log(walletsJSONfile.designs[key].dropdown_name);
      var option = document.createElement("option");
      option.text = walletsJSONfile.designs[key].dropdown_name;
      option.value = key;
      document.getElementById('designPicker').add(option);
    }
  }
    

function setLanguage(whichLanguage){
		//* in the future setup centralized text translation here
		drawOpts.text = languagesJSONfile[whichLanguage];
		document.getElementById("backPaperWallet").innerHTML = languagesJSONfile[whichLanguage].backPaperWallet;
		document.getElementById("backAmount").innerHTML = languagesJSONfile[whichLanguage].backAmount;
		document.getElementById("backDate").innerHTML = languagesJSONfile[whichLanguage].backDate;
		document.getElementById("backNotes").innerHTML = languagesJSONfile[whichLanguage].backNotes;
		document.getElementById("backLongText").style.fontSize = languagesJSONfile[whichLanguage].backLongTextFontSize;
		document.getElementById("backInst1").innerHTML = languagesJSONfile[whichLanguage].backInst1;
		document.getElementById("backInst2").innerHTML = languagesJSONfile[whichLanguage].backInst2;
		document.getElementById("backInst3").innerHTML = languagesJSONfile[whichLanguage].backInst3;
		document.getElementById("backInst4").innerHTML = languagesJSONfile[whichLanguage].backInst4;
		//console.log("drawOpts language data updated to " + whichLanguage);
  
}


//THIS IS THE MOST IMPORTANT FUNCTION.. CRITICALLY IMPORTANT!!
function getRandomTitle(){
  var myArray = ["Whoa...","But....But....","Hold on a sec..","O Geeze..","I don't know Rick..","My man!",
    "S-S-Samantha.","Puh rum pum pow!","dont mind those stare goblins","Oh, wow.","Awww, it's you guys!",
    "Wubbalubbadubdub!","Uh ohhhh! Somersoult jump!","GRASSSSS... tastes bad!","No jumping in the sewer.",
    "BURGERTIME!","Rubber baby buggy bumpers!","I turned myself into a PICKLE!","Heavens to Murgatroyd!",
    "Hey hey hey!","You blockhead!","That's all I can stands, I can't stands no more!","Beep Beep",
    "And now, here's something we hope you'll really like.","Excellent.","Wonder Twin powers activate!",
    "Scooby-Dooby-Doo!","Sufferin' succotash!","Ay, caramba!","By the power of Greyskull!","Good greif.","D'oh!",
    "What's up, doc?","Giggity","Mmmkay"
  ];
  return (myArray[Math.floor(Math.random()*myArray.length)]);
}



