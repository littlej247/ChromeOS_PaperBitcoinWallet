	ninja.seeder = {
		init: (function () {
			document.getElementById("generatekeyinput").value = "";
		})(),

		// number of mouse movements to wait for
		seedLimit: (function () {
			var num = Crypto.util.randomBytes(12)[11];
			return 200 + Math.floor(num);
		})(),

		seedCount: 0, // counter
		lastInputTime: new Date().getTime(),
		seedPoints: [],

		// seed function exists to wait for mouse movement to add more entropy before generating an address
		seed: function (evt) {
			if (!evt) var evt = window.event;
			var timeStamp = new Date().getTime();

			if (ninja.seeder.seedCount == ninja.seeder.seedLimit) {
				ninja.seeder.seedCount++;
				ninja.wallets.landwallet.open();
				document.getElementById("generate").style.display = "none";
				document.getElementById("menu").style.visibility = "visible";
				ninja.seeder.removePoints();
			}
			// seed mouse position X and Y when mouse movements are greater than 40ms apart.
			else if ((ninja.seeder.seedCount < ninja.seeder.seedLimit) && evt && (timeStamp - ninja.seeder.lastInputTime) > 40) {
				SecureRandom.seedTime();
				SecureRandom.seedInt16((evt.clientX * evt.clientY));
				ninja.seeder.showPoint(evt.clientX, evt.clientY);
				ninja.seeder.seedCount++;
				ninja.seeder.lastInputTime = new Date().getTime();
				ninja.seeder.showPool();
			}
		},

		// seed function exists to wait for mouse movement to add more entropy before generating an address
		seedKeyPress: function (evt) {
			if (!evt) var evt = window.event;
			// seeding is over now we generate and display the address
			if (ninja.seeder.seedCount == ninja.seeder.seedLimit) {
				ninja.seeder.seedCount++;
				ninja.wallets.landwallet.open();
				document.getElementById("generate").style.display = "none";
				document.getElementById("menu").style.visibility = "visible";
				ninja.seeder.removePoints();
			}
			// seed key press character
			else if ((ninja.seeder.seedCount < ninja.seeder.seedLimit) && evt.which) {
				var timeStamp = new Date().getTime();
				// seed a bunch (minimum seedLimit) of times
				SecureRandom.seedTime();
				SecureRandom.seedInt8(evt.which);
				var keyPressTimeDiff = timeStamp - ninja.seeder.lastInputTime;
				SecureRandom.seedInt8(keyPressTimeDiff);
				ninja.seeder.seedCount++;
				ninja.seeder.lastInputTime = new Date().getTime();
				ninja.seeder.showPool();
			}
		},

		showPool: function () {
			var poolHex;
			if (SecureRandom.poolCopyOnInit != null) {
				poolHex = Crypto.util.bytesToHex(SecureRandom.poolCopyOnInit);
				document.getElementById("seedpool").innerHTML = poolHex;
				document.getElementById("seedpooldisplay").innerHTML = poolHex;
			}
			else {
				poolHex = Crypto.util.bytesToHex(SecureRandom.pool);
				document.getElementById("seedpool").innerHTML = poolHex;
				document.getElementById("seedpooldisplay").innerHTML = poolHex;
			}
			document.getElementById("mousemovelimit").innerHTML = (ninja.seeder.seedLimit - ninja.seeder.seedCount);
		},

		showPoint: function (x, y) {
			var div = document.createElement("div");
			div.setAttribute("class", "seedpoint");
			div.style.top = y + "px";
			div.style.left = x + "px";
			
			// let's make the entropy 'points' grow and change color!
			percentageComplete = ninja.seeder.seedCount / ninja.seeder.seedLimit;
			pointSize = 2 + Math.ceil(9*percentageComplete) + 'px'
			pointColor = 255 - Math.ceil(110 * percentageComplete);
			div.style.backgroundColor = '#' + pointColor.toString(16) + 'FF' + pointColor.toString(16);
			div.style.width = pointSize;
			div.style.height = pointSize;
			
			document.getElementById("progress-bar-percentage").style.width=Math.ceil(percentageComplete*100)+"%";

			// for some reason, appending these divs to an IOS device breaks clicking altogether (?)
			if (navigator.platform != 'iPad' && navigator.platform != 'iPhone' && navigator.platform != 'iPod') {
				document.body.appendChild(div);
			}
			ninja.seeder.seedPoints.push(div);

		},

		removePoints: function () {
			for (var i = 0; i < ninja.seeder.seedPoints.length; i++) {
				document.body.removeChild(ninja.seeder.seedPoints[i]);
			}
			ninja.seeder.seedPoints = [];
		}
	};

	ninja.qrCode = {
		// determine which type number is big enough for the input text length
		getTypeNumber: function (text) {
			var lengthCalculation = text.length * 8 + 12; // length as calculated by the QRCode
			if (lengthCalculation < 72) { return 1; }
			else if (lengthCalculation < 128) { return 2; }
			else if (lengthCalculation < 208) { return 3; }
			else if (lengthCalculation < 288) { return 4; }
			else if (lengthCalculation < 368) { return 5; }
			else if (lengthCalculation < 480) { return 6; }
			else if (lengthCalculation < 528) { return 7; }
			else if (lengthCalculation < 688) { return 8; }
			else if (lengthCalculation < 800) { return 9; }
			else if (lengthCalculation < 976) { return 10; }
			return null;
		},

		createCanvas: function (text, sizeMultiplier) {
			sizeMultiplier = (sizeMultiplier == undefined) ? 2 : sizeMultiplier; // default 2
			// create the qrcode itself
			var typeNumber = ninja.qrCode.getTypeNumber(text);
			var qrcode = new QRCode(typeNumber, QRCode.ErrorCorrectLevel.H);
			qrcode.addData(text);
			qrcode.make();
			var width = qrcode.getModuleCount() * sizeMultiplier;
			var height = qrcode.getModuleCount() * sizeMultiplier;
			// create canvas element
			var canvas = document.createElement('canvas');
			var scale = 10.0;
			canvas.width = width * scale;
			canvas.height = height * scale;
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			var ctx = canvas.getContext('2d');
			ctx.scale(scale, scale);
			// compute tileW/tileH based on width/height
			var tileW = width / qrcode.getModuleCount();
			var tileH = height / qrcode.getModuleCount();
			// draw in the canvas
			for (var row = 0; row < qrcode.getModuleCount(); row++) {
				for (var col = 0; col < qrcode.getModuleCount(); col++) {
					ctx.fillStyle = qrcode.isDark(row, col) ? "#000000" : "#ffffff";
					ctx.fillRect(col * tileW, row * tileH, tileW, tileH);
				}
			}
			// return just built canvas
			return canvas;
		},

		// generate a QRCode and return it's representation as an Html table 
		createTableHtml: function (text) {
			var typeNumber = ninja.qrCode.getTypeNumber(text);
			var qr = new QRCode(typeNumber, QRCode.ErrorCorrectLevel.H);
			qr.addData(text);
			qr.make();
			var tableHtml = "<table class='qrcodetable'>";
			for (var r = 0; r < qr.getModuleCount(); r++) {
				tableHtml += "<tr>";
				for (var c = 0; c < qr.getModuleCount(); c++) {
					if (qr.isDark(r, c)) {
						tableHtml += "<td class='qrcodetddark'/>";
					} else {
						tableHtml += "<td class='qrcodetdlight'/>";
					}
				}
				tableHtml += "</tr>";
			}
			tableHtml += "</table>";
			return tableHtml;
		},

		// show QRCodes with canvas OR table (IE8)
		// parameter: keyValuePair 
		// example: { "id1": "string1", "id2": "string2"}
		//		"id1" is the id of a div element where you want a QRCode inserted.
		//		"string1" is the string you want encoded into the QRCode.
		showQrCode: function (keyValuePair, sizeMultiplier) {
			for (var key in keyValuePair) {
				var value = keyValuePair[key];
				try {
					if (document.getElementById(key)) {
						document.getElementById(key).innerHTML = "";
						document.getElementById(key).appendChild(ninja.qrCode.createCanvas(value, sizeMultiplier));
					}
				}
				catch (e) {
					// for browsers that do not support canvas (IE8)
					document.getElementById(key).innerHTML = ninja.qrCode.createTableHtml(value);
				}
			}
		}
	};

	ninja.tabSwitch = function (walletTab) {
		if (walletTab.className.indexOf("selected") == -1) {
			// unselect all tabs
			for (var wType in ninja.wallets) {
				document.getElementById(wType).className = "tab";
				ninja.wallets[wType].close();
			}
			walletTab.className += " selected";
			ninja.wallets[walletTab.getAttribute("id")].open();
		}
	};

	ninja.getQueryString = function () {
		var result = {}, queryString = location.search.substring(1), re = /([^&=]+)=([^&]*)/g, m;
		while (m = re.exec(queryString)) {
			result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		return result;
	};
	
	// use when passing an Array of Functions
	ninja.runSerialized = function (functions, onComplete) {
		onComplete = onComplete || function () { };
	
		if (functions.length === 0) onComplete();
		else {
			// run the first function, and make it call this
			// function when finished with the rest of the list
			var f = functions.shift();
			f(function () { ninja.runSerialized(functions, onComplete); });
		}
	};
	
	ninja.forSerialized = function (initial, max, whatToDo, onComplete) {
		onComplete = onComplete || function () { };
	
		if (initial === max) { onComplete(); }
		else {
			// same idea as runSerialized
			whatToDo(initial, function () { ninja.forSerialized(++initial, max, whatToDo, onComplete); });
		}
	};
	
	// use when passing an Object (dictionary) of Functions
	ninja.foreachSerialized = function (collection, whatToDo, onComplete) {
		var keys = [];
		for (var name in collection) {
			keys.push(name);
		}
		ninja.forSerialized(0, keys.length, function (i, callback) {
			whatToDo(keys[i], callback);
		}, onComplete);
	};


 /****************************************************
 **          previously a break in <scrip>          **
 **                                                 **
 ***************************************************/
 

	ninja.translator = {
		currentCulture: "en",

		translate: function (culture) {
			var dict = ninja.translator.translations[culture];
			if (dict) {
				// set current culture
				ninja.translator.currentCulture = culture;
				// update menu UI
				for (var cult in ninja.translator.translations) {
					document.getElementById("culture" + cult).setAttribute("class", "");
				}
				document.getElementById("culture" + culture).setAttribute("class", "selected");
				// apply translations
				for (var id in dict) {
					if (document.getElementById(id) && document.getElementById(id).value) {
						document.getElementById(id).value = dict[id];
					}
					else if (document.getElementById(id)) {
						document.getElementById(id).innerHTML = dict[id];
					}
				}
			}
		},

		get: function (id) {
			var translation = ninja.translator.translations[ninja.translator.currentCulture][id];
			return translation;
		},

		translations: {
			"en": {
				// javascript alerts or messages
				"paperlabelbitcoinaddress": "Bitcoin Address:",
				"paperlabelprivatekey": "Private Key (Wallet Import Format):",
				"paperlabelencryptedkey": "Encrypted Private Key (Password required)",
				"bip38alertpassphraserequired": "Passphrase required for BIP38 key",
				"detailalertnotvalidprivatekey": "The text you entered is not a valid private key or passphrase.",
				"detailconfirmsha256": "The text you entered does not appear to be a private " + window.currencyName + " key.<br><br>Would you like to use this text as a passphrase and create a private key using its SHA256 hash?<br><br><b>Warning:</b> Choosing an extremely strong passphrase (also known as a \"brain wallet\") is important as all common phrases, words, lyrics etc. are regularly scanned by hackers for bitcoin balances worth stealing.",
				"bip38alertincorrectpassphrase": "Incorrect passphrase for this encrypted private key.",
			},

			"es": {
				// javascript alerts or messages
				"paperlabelbitcoinaddress": "Dirección Bitcoin:",
				"paperlabelprivatekey": "Clave privada (formato para importar):",

				// header and menu html
				"tagline": "Generador de carteras Bitcoin de código abierto en lado de cliente con Javascript",
				"generatelabelbitcoinaddress": "Generando dirección Bitcoin...",
				"generatelabelmovemouse": "<blink>Mueve un poco el ratón para crear entropía...</blink>",
				"calibratewallet": "Calibrate Printer (es)",
				"paperwallet": "Cartera en papel",
				"landwallet": "Welcome (Es)",

				// footer html
				"footerlabeldonations": "Donaciones:",
				"footerlabeltranslatedby": "Traducción: <b>12345</b>Vypv2QSmuRXcciT5oEB27mPbWGeva",
				"footerlabelpgp": "Clave pública PGP",
				"footerlabelversion": "Histórico de versiones",
				"footerlabelgithub": "Repositorio GitHub",
				"footerlabelcopyright1": "&copy; Copyright 2016 Canton Becker and bitaddress.org.",
				"footerlabelcopyright2": "Copyright del código JavaScript: en el fuente.",
				"footerlabelnowarranty": "Sin garantía.",

				// paper wallet html
				"paperlabeladdressesperpage": "Direcciones por página:",
				"paperlabeladdressestogenerate": "Direcciones en total:",
				"papergenerate1": "Generar",
				"paperprint": "Imprimir"
			},
				
			"fr": {
				// javascript alerts or messages
				"paperlabelbitcoinaddress": "Adresse Bitcoin:",
				"paperlabelprivatekey": "Clé Privée (Format d'importation de porte-monnaie):",

				// header and menu html
				"tagline": "Générateur De Porte-Monnaie Bitcoin Javascript Hors-Ligne",
				"generatelabelbitcoinaddress": "Création de l'adresse Bitcoin...",
				"generatelabelmovemouse": "<blink>BOUGEZ votre souris pour ajouter de l'entropie...</blink>",
				"calibratewallet": "Calibrate Printer (fr)",
				"paperwallet": "Porte-Monnaie Papier",
				"landwallet": "Welcome (Fr)",

				// footer html
				"footerlabeldonations": "Dons:",
				"footerlabeltranslatedby": "Traduction: 1Gy7NYSJNUYqUdXTBow5d7bCUEJkUFDFSq",
				"footerlabelpgp": "Clé Publique PGP",
				"footerlabelversion": "Historique De Version Signé",
				"footerlabelgithub": "Dépôt GitHub",
				"footerlabelcopyright1": "&copy; Copyright 2016 Canton Becker and bitaddress.org.",
				"footerlabelcopyright2": "Les droits d'auteurs JavaScript sont inclus dans le code source.",
				"footerlabelnowarranty": "Aucune garantie.",
				"newaddress": "Générer Une Nouvelle Adresse",

				// paper wallet html
				"paperlabeladdressesperpage": "Adresses par page:",
				"paperlabeladdressestogenerate": "Nombre d'adresses à créer:",
				"papergenerate1": "Générer",
				"paperprint": "Imprimer"
			}
		}
	};

	ninja.translator.showEnglishJson = function () {
		var english = ninja.translator.translations["en"];
		var spanish = ninja.translator.translations["es"];
		var spanishClone = {};
		for (var key in spanish) {
			spanishClone[key] = spanish[key];
		}
		var newLang = {};
		for (var key in english) {
			newLang[key] = english[key];
			delete spanishClone[key];
		}
		for (var key in spanishClone) {
			if (document.getElementById(key)) {
				if (document.getElementById(key).value) {
					newLang[key] = document.getElementById(key).value;
				}
				else {
					newLang[key] = document.getElementById(key).innerHTML;
				}
			}
		}
		var div = document.createElement("div");
		div.setAttribute("class", "englishjson");
		div.innerHTML = "<h3>English Json</h3>";
		var elem = document.createElement("textarea");
		elem.setAttribute("rows", "35");
		elem.setAttribute("cols", "110");
		elem.setAttribute("wrap", "off");
		var langJson = "{\n";
		for (var key in newLang) {
			langJson += "\t\"" + key + "\"" + ": " + "\"" + newLang[key].replace(/\"/g, "\\\"").replace(/\n/g, "\\n") + "\",\n";
		}
		langJson = langJson.substr(0, langJson.length - 2);
		langJson += "\n}\n";
		elem.innerHTML = langJson;
		div.appendChild(elem);
		document.body.appendChild(div);
	};


 /****************************************************
 **          previously a break in <scrip>          **
 **    <!-- UX controls for switching tabs -->      **
 ***************************************************/
 

	ninja.wallets.landwallet = {
		open: function () {
			document.getElementById("landarea").style.display = "block";
		},

		close: function () {
			document.getElementById("landarea").style.display = "none";
		}
	};


 /***************************************************
 **          previously a break in <scrip>          **
 **                                                **
 ***************************************************/
 

	ninja.wallets.calibratewallet = {
		open: function () {
			document.getElementById("calibratearea").style.display = "block";
		},

		close: function () {
			document.getElementById("calibratearea").style.display = "none";
		}
	};


 /***************************************************
 **          previously a break in <scrip>          **
 **                                                **
 ***************************************************/
 

	ninja.wallets.backwallet = {
		open: function () {
			document.getElementById("backarea").style.display = "block";
		},

		close: function () {
			document.getElementById("backarea").style.display = "none";
		}
	};


 /***************************************************
 **          previously a break in <scrip>          **
 **                                                **
 ***************************************************/
 

	ninja.wallets.foldwallet = {
		open: function () {
			document.getElementById("foldarea").style.display = "block";
		},

		close: function () {
			document.getElementById("foldarea").style.display = "none";
		}
	};


 /***************************************************
 **          previously a break in <scrip>          **
 **                                                **
 ***************************************************/
 

	ninja.wallets.paperwallet = {
		open: function () {
			document.getElementById("main").setAttribute("class", "paper"); // add 'paper' class to main div
			var paperArea = document.getElementById("paperarea");
			paperArea.style.display = "block";
			var perPageLimitElement = document.getElementById("paperlimitperpage");
			var limitElement = document.getElementById("paperlimit");
			var pageBreakAt = (ninja.wallets.paperwallet.useArtisticWallet) ? ninja.wallets.paperwallet.pageBreakAtArtisticDefault : ninja.wallets.paperwallet.pageBreakAtDefault;
			if (perPageLimitElement && perPageLimitElement.value < 1) {
				perPageLimitElement.value = pageBreakAt;
			}
			if (limitElement && limitElement.value < 1) {
				limitElement.value = pageBreakAt;
			}
			if (document.getElementById("paperkeyarea").innerHTML == "") {
				document.getElementById("paperencrypt").checked = false;
				ninja.wallets.paperwallet.encrypt = false;
				ninja.wallets.paperwallet.build(pageBreakAt, pageBreakAt, !document.getElementById('paperart').checked, document.getElementById('paperpassphrase').value);
			}
		},

		close: function () {
			document.getElementById("paperarea").style.display = "none";
			document.getElementById("main").setAttribute("class", ""); // remove 'paper' class from main div
		},

		toggleVanityField: function(show) {
			document.getElementById('keyButtons').style.display= show ? 'none' : 'block'; 
			document.getElementById('supplyKeys').style.display = show ? 'block' : 'none';
		},

		remaining: null, // use to keep track of how many addresses are left to process when building the paper wallet
		count: 0,
		pageBreakAtDefault: 7,
		pageBreakAtArtisticDefault: 1,
		useArtisticWallet: true,
		pageBreakAt: null,
		passphrase: null,
		lastwallet: null,
		minPassphraseLength: 15,

		build: function (numWallets, pageBreakAt, useArtisticWallet, passphrase) {
			if (numWallets < 1) numWallets = 1;
			ninja.wallets.paperwallet.remaining = numWallets;
			ninja.wallets.paperwallet.count = 0;
			ninja.wallets.paperwallet.useArtisticWallet = useArtisticWallet;
			ninja.wallets.paperwallet.pageBreakAt = pageBreakAt;
			document.getElementById("paperkeyarea").innerHTML = "";
			if (ninja.wallets.paperwallet.encrypt && passphrase == "") {
				CSP_Alert(null,ninja.translator.get("bip38alertpassphraserequired"));
				return;
			}
			ninja.wallets.paperwallet.passphrase = passphrase;
			setTimeout(ninja.wallets.paperwallet.batch, 0);
		},
		
		buildManual: function(wallet, passphrase) {
			ninja.wallets.paperwallet.remaining = 1;
			ninja.wallets.paperwallet.count = 0;
			ninja.wallets.paperwallet.pageBreakAt = 1;
			document.getElementById("paperkeyarea").innerHTML = "";
			if (ninja.wallets.paperwallet.encrypt && passphrase == "") {
				CSP_Alert(null,ninja.translator.get("bip38alertpassphraserequired"));
				return;
			}
			ninja.wallets.paperwallet.passphrase = passphrase;
			setTimeout(function() {
				ninja.wallets.paperwallet.batch(wallet);
			}, 0);
		},
		
		batch: function (addressSeed) {
			if (ninja.wallets.paperwallet.remaining > 0) {
				var paperArea = document.getElementById("paperkeyarea");
				ninja.wallets.paperwallet.count++;
				var i = ninja.wallets.paperwallet.count;
				var pageBreakAt = ninja.wallets.paperwallet.pageBreakAt;
				var div = document.createElement("div");
				div.setAttribute("id", "keyarea" + i);
				div.innerHTML = ninja.wallets.paperwallet.templateArtisticHtml(i);
				div.setAttribute("class", "keyarea art");
				if (paperArea.innerHTML != "") {
					// page break
				   if ((i-1) % pageBreakAt == 0 && i >= pageBreakAt) {
						var pBreak = document.createElement("div");
						pBreak.setAttribute("class", "pagebreak");
						document.getElementById("paperkeyarea").appendChild(pBreak);
						div.style.pageBreakBefore = "always";
						if (!ninja.wallets.paperwallet.useArtisticWallet) {
							div.style.borderTop = "2px solid green";
						}
					}
				}
				document.getElementById("paperkeyarea").appendChild(div);
				ninja.wallets.paperwallet.generateNewWallet(addressSeed, function(wallet) {
					var walletKey = ninja.wallets.paperwallet.encrypt ? wallet.encryptedKey : wallet.wifKey;
					ninja.wallets.paperwallet.showArtisticWallet(i, wallet.address, walletKey);
				});
				ninja.wallets.paperwallet.remaining--;
				setTimeout(ninja.wallets.paperwallet.batch, 0);
			}
		},

		generateNewWallet: function(addressSeed, callback) {
			if (addressSeed == null) {
				var key = new Bitcoin.ECKey(false);
				addressSeed = { address: key.getBitcoinAddress(), wifKey: key.getBitcoinWalletImportFormat() };
			}
			ninja.wallets.paperwallet.lastwallet = addressSeed;
			if (ninja.wallets.paperwallet.encrypt) {
				CSP_Alert("One Moment Please . . .","Encrypting your wallet. This may take up to several minutes on a slower computer.");
				setTimeout(function() {
					ninja.privateKey.BIP38PrivateKeyToEncryptedKeyAsync(addressSeed.wifKey, ninja.wallets.paperwallet.passphrase, false, function(encodedKey) {

						CSP_alertPromise.resolve(true);   //document.getElementById("busyblock").className = "";
						addressSeed.passphrase = ninja.wallets.paperwallet.passphrase;
						addressSeed.encryptedKey = encodedKey;
						ninja.wallets.paperwallet.lastwallet.addressSeed = addressSeed;
						callback(addressSeed);
					});
				}, 10);
			} else {
				callback(addressSeed);
			}
		},

		templateArtisticHtml: function (i) {
			var keyelement = 'btcprivwif';
			if (ninja.wallets.paperwallet.encrypt) {
				keyelement = 'btcencryptedkey'
			}
      var myFront = './images/wallets/' + walletsJSONfile.designs[window.designChoice].folder_name +'/' + walletsJSONfile.designs[window.designChoice].images['front'];
			var walletHtml =
						"<div class='artwallet' id='artwallet" + i + "'>" +
			//"<iframe src='bitcoin-wallet-01.svg' id='papersvg" + i + "' class='papersvg' ></iframe>" +
							"<img id='papersvg" + i + "' class='papersvg' src='" + myFront + "' />" +
							"<div id='qrcode_public" + i + "' class='qrcode_public'></div>" +
							"<div id='qrcode_private" + i + "' class='qrcode_private'></div>" +
							"<div class='btcaddress' id='btcaddress" + i + "'></div>" +
							"<div class='dupbtcaddress' id='dupbtcaddress" + i + "'></div>" +
							"<div class='" + keyelement + "' id='" + keyelement + i + "'></div>" +
							"<div class='dup" + keyelement + "' id='dup" + keyelement + i + "'></div>" +
							"<div class='wallettype' id='wallettype" + i + "'></div>" +
						"</div>";
			return walletHtml;
		},

		showArtisticWallet: function (idPostFix, bitcoinAddress, privateKey) {

			// BIP38 coloration
			var colors = {
				'bip38': {
					publicUpper: "#fff57c",
					publicLower: "#f7931a",
					privateLeft: "#78bad6",			
					privateRight: "#fff67d",
					pointer: "#0084a8",
					guilloche: "white",
					text: "#1937a9",
					textShadow: "white",
					textPointer: "white",
				},				
				'default': {
					publicUpper: "#fff57c",
					publicLower: "#f7931a",
					privateLeft: "#8cd96f",			
					privateRight: "#fff67d",
					pointer: "#02ab5c",
					guilloche: "white",
					text: "#1937a9",
					textShadow: "white",
					textPointer: "white",
				}
			};
			
			var keyValuePair = {};
			keyValuePair["qrcode_public" + idPostFix] = bitcoinAddress;
			keyValuePair["qrcode_private" + idPostFix] = privateKey;
			ninja.qrCode.showQrCode(keyValuePair, 2.75);
			document.getElementById("btcaddress" + idPostFix).innerHTML = bitcoinAddress;
			document.getElementById("dupbtcaddress" + idPostFix).innerHTML = bitcoinAddress;

			if (ninja.wallets.paperwallet.encrypt) {
				var half = privateKey.length / 2;
				document.getElementById("btcencryptedkey" + idPostFix).innerHTML = privateKey;
				document.getElementById("dupbtcencryptedkey" + idPostFix).innerHTML = privateKey;
				if (window.designChoice != 'default') document.getElementById("wallettype" + idPostFix).innerHTML = 'BIP38 ENCRYPTED'; // only add for special designs
				drawOpts.text['walletImportFormat'] = 'BIP38 ENCRYPTED';
				drawOpts.color = colors['bip38'];
			}
			else {
				document.getElementById("btcprivwif" + idPostFix).innerHTML = privateKey;
				document.getElementById("dupbtcprivwif" + idPostFix).innerHTML = privateKey;
				document.getElementById("wallettype" + idPostFix).innerHTML = '';
				drawOpts.color = colors['default'];
				if (window.designChoice != 'default') document.getElementById("wallettype" + idPostFix).innerHTML = ''; // special designs should have this burned into the JPG
				drawOpts.text['walletImportFormat'] = 'WALLET IMPORT FORMAT';
			}

			if (walletsJSONfile.designs[window.designChoice].dynamic_drawing == true) { // if we are not loading up a special JPG-based design, render the canvas
				document.getElementById("papersvg1").src = PaperWallet.draw.frontImage(bitcoinAddress, drawOpts);
			}
			// CODE to modify SVG DOM elements
			//var paperSvg = document.getElementById("papersvg" + idPostFix);
			//if (paperSvg) {
			//	svgDoc = paperSvg.contentDocument;
			//	if (svgDoc) {
			//		var bitcoinAddressElement = svgDoc.getElementById("bitcoinaddress");
			//		var privateKeyElement = svgDoc.getElementById("privatekey");
			//		if (bitcoinAddressElement && privateKeyElement) {
			//			bitcoinAddressElement.textContent = bitcoinAddress;
			//			privateKeyElement.textContent = privateKeyWif;
			//		}
			//	}
			//}
		},

		toggleArt: function (element) {
			if (!element.checked) {
				// show Art
				document.getElementById("paperlimitperpage").value = ninja.wallets.paperwallet.pageBreakAtArtisticDefault;
				document.getElementById("paperlimit").value = ninja.wallets.paperwallet.pageBreakAtArtisticDefault;
			}
			else {
				// hide Art
				document.getElementById("paperlimitperpage").value = ninja.wallets.paperwallet.pageBreakAtDefault;
				document.getElementById("paperlimit").value = ninja.wallets.paperwallet.pageBreakAtDefault;
			}
		},

		toggleEncryptSettings: function(show, cancelSave) {

			document.getElementById('paperbip38settings').style.display = show ? "block":"none";

			var encryptBox = document.getElementById('paperencrypt');
			if (cancelSave == true) {
				encryptBox.checked = ninja.wallets.paperwallet.encrypt;
			}
				
			if (!cancelSave) document.getElementById('paperencryptpassphrase').innerText = 
				document.getElementById('paperencryptpassphrase').textContent = document.getElementById('paperpassphrase').value;
			
			if (!show && !cancelSave) {
				ninja.wallets.paperwallet.encrypt = encryptBox.checked;
				ninja.wallets.paperwallet.buildManual(ninja.wallets.paperwallet.lastwallet, document.getElementById('paperpassphrase').value);
				ninja.wallets.paperwallet.resetLimits();
			}
			
			document.getElementById('paperencryptstatus').style.display = ninja.wallets.paperwallet.encrypt ? 'block' : 'none';
		},

		resetLimits: function () {
			var hideArt = document.getElementById("paperart");
			var paperEncrypt = document.getElementById("paperencrypt");
			var limit;
			var limitperpage;

			document.getElementById("paperkeyarea").style.fontSize = "100%";
			if (!hideArt.checked) {
				limit = ninja.wallets.paperwallet.pageBreakAtArtisticDefault;
				limitperpage = ninja.wallets.paperwallet.pageBreakAtArtisticDefault;
			}
			else if (hideArt.checked && paperEncrypt.checked) {
				limit = ninja.wallets.paperwallet.pageBreakAtDefault;
				limitperpage = ninja.wallets.paperwallet.pageBreakAtDefault;
				// reduce font size
				document.getElementById("paperkeyarea").style.fontSize = "95%";
			}
			else if (hideArt.checked && !paperEncrypt.checked) {
				limit = ninja.wallets.paperwallet.pageBreakAtDefault;
				limitperpage = ninja.wallets.paperwallet.pageBreakAtDefault;
			}
			document.getElementById("paperlimitperpage").value = limitperpage;
			document.getElementById("paperlimit").value = limit;
		}
	};


 /***************************************************
 **          previously a break in <scrip>          **
 **                                                **
 ***************************************************/
 

	ninja.wallets.detailwallet = {
		qrscanner: {
			scanner: null,

			start: function() {
				document.getElementById('paperqrscanner').style.display = 'block';
				document.getElementById('CSP-qrCancelButton').focus();
				ninja.wallets.detailwallet.qrscanner.showError(null);
				var supported = ninja.wallets.detailwallet.qrscanner.scanner.isSupported();
				if (!supported) {
					document.getElementById('paperqrnotsupported').style.display = 'block';
				} else {
					ninja.wallets.detailwallet.qrscanner.scanner.start();
				}
			},

			stop: function() {
				ninja.wallets.detailwallet.qrscanner.scanner.stop();
				document.getElementById('paperqrscanner').style.display = 'none';
			},

			showError: function(error) {
			  console.log("camera error: " + error);
				if (error) {
					if (error == 'PERMISSION_DENIED' || error == 'PermissionDeniedError') {
						document.getElementById('paperqrerror').innerHTML = '';
						document.getElementById('paperqrpermissiondenied').style.display = 'block';
					} else {
						document.getElementById('paperqrerror').innerHTML = error;
						document.getElementById('paperqrpermissiondenied').style.display = 'none';
					}
				} else {
					document.getElementById('paperqrerror').innerHTML = '';
					document.getElementById('paperqrpermissiondenied').style.display = 'none';
				}
			}
		},

		open: function () {
			document.getElementById("detailarea").style.display = "block";
			document.getElementById("detailprivkey").focus();
			if (!ninja.wallets.detailwallet.qrscanner.scanner) {
				ninja.wallets.detailwallet.qrscanner.scanner = new QRCodeScanner(700, 500, 'paperqroutput', 
					function(data) {
						document.getElementById('detailprivkey').value = data;
						document.getElementById('paperqrscanner').style.display = 'none';
					},
					function(error) {
						ninja.wallets.detailwallet.qrscanner.showError(error);
					});
			}
		},

		close: function () {
			document.getElementById("detailarea").style.display = "none";
			if(ninja.wallets.detailwallet.qrscanner.scanner != null) {
			}
		},

		openCloseFaq: function (faqNum) {
			// do close
			if (document.getElementById("detaila" + faqNum).style.display == "block") {
				document.getElementById("detaila" + faqNum).style.display = "none";
				document.getElementById("detaile" + faqNum).setAttribute("class", "more");
			}
			// do open
			else {
				document.getElementById("detaila" + faqNum).style.display = "block";
				document.getElementById("detaile" + faqNum).setAttribute("class", "less");
			}
		},

		viewDetails: async function () {
			var bip38 = false;
			var key = document.getElementById("detailprivkey").value.toString().replace(/^\s+|\s+$/g, ""); // trim white space
			document.getElementById("detailprivkey").value = key;
			var bip38CommandDisplay = document.getElementById("detailbip38commands").style.display;
			ninja.wallets.detailwallet.clear();
			if (key == "") {
				return;
			}
			if (ninja.privateKey.isBIP38Format(key)) {
				document.getElementById("detailbip38commands").style.display = bip38CommandDisplay;
				if (bip38CommandDisplay != "block") {
					document.getElementById("detailbip38commands").style.display = "block";
					document.getElementById("detailprivkeypassphrase").focus();
					return;
				}
				var passphrase = document.getElementById("detailprivkeypassphrase").value.toString().replace(/^\s+|\s+$/g, ""); // trim white space
				if (passphrase == "") {
					//alert(ninja.translator.get("bip38alertpassphraserequired"));
					CSP_Alert(null,ninja.translator.get("bip38alertpassphraserequired"),"ok");
					
					return;
				}
				//document.getElementById("busyblock_decrypt").className = "busy";
				CSP_Alert("One Moment Please . . .","Decrypting the private key. This may take up to several minutes on a slower computer.");
				
				// show Private Key BIP38 Format
				document.getElementById("detailprivbip38").innerHTML = key;
				document.getElementById("detailbip38").style.display = "block";
				ninja.privateKey.BIP38EncryptedKeyToByteArrayAsync(key, passphrase, function (btcKeyOrError) {
					CSP_alertPromise.resolve(true);   //document.getElementById("busyblock_decrypt").className = "";
					if (btcKeyOrError.message) {
						//alert(btcKeyOrError.message);
						CSP_Alert(null,btcKeyOrError.message,"ok");
						ninja.wallets.detailwallet.clear();
					} else {
						ninja.wallets.detailwallet.populateKeyDetails(new Bitcoin.ECKey(btcKeyOrError));
					}
				});
			}
			else {
				if (Bitcoin.ECKey.isMiniFormat(key)) {
					// show Private Key Mini Format
					document.getElementById("detailprivmini").innerHTML = key;
					document.getElementById("detailmini").style.display = "block";
				}
				else if (Bitcoin.ECKey.isBase6Format(key)) {
					// show Private Key Base6 Format
					document.getElementById("detailprivb6").innerHTML = key;
					document.getElementById("detailb6").style.display = "block";
				}
				var btcKey = new Bitcoin.ECKey(key);
				if (btcKey.priv == null) {
					// enforce a minimum passphrase length
					if (key.length >= ninja.wallets.paperwallet.minPassphraseLength) {
						// Deterministic Wallet confirm box to ask if user wants to SHA256 the input to get a private key
						//var usePassphrase = confirm(ninja.translator.get("detailconfirmsha256"));
						
						var usePassphrase = await CSP_Alert(null, ninja.translator.get("detailconfirmsha256"),"confirm");
						
						if (usePassphrase) {
							var bytes = Crypto.SHA256(key, { asBytes: true });
							var btcKey = new Bitcoin.ECKey(bytes);
						}
						else {
							ninja.wallets.detailwallet.clear();
						}
					}
					else {
						//alert(ninja.translator.get("detailalertnotvalidprivatekey"));
						await CSP_Alert(null, ninja.translator.get("detailalertnotvalidprivatekey"),"ok")
						ninja.wallets.detailwallet.clear();
					}
				}
				ninja.wallets.detailwallet.populateKeyDetails(btcKey);
			}
		},

		populateKeyDetails: function (btcKey) {
			if (btcKey.priv != null) {
				btcKey.setCompressed(false);
				document.getElementById('detailkeyarea').style.display = "block";;
				document.getElementById('detailkeyareakey').innerHTML = document.getElementById('detailprivkey').value;
				document.getElementById("detailprivhex").innerHTML = btcKey.toString().toUpperCase();
				document.getElementById("detailprivb64").innerHTML = btcKey.toString("base64");
				var bitcoinAddress = btcKey.getBitcoinAddress();
				var wif = btcKey.getBitcoinWalletImportFormat();
				ninja.wallets.detailwallet.lastwallet = { address: bitcoinAddress, wifKey: wif };
				document.getElementById("detailpubkey").innerHTML = btcKey.getPubKeyHex();
				document.getElementById("detailaddress").innerHTML = bitcoinAddress;
				document.getElementById("detailprivwif").innerHTML = wif;
				btcKey.setCompressed(true);
				var bitcoinAddressComp = btcKey.getBitcoinAddress();
				var wifComp = btcKey.getBitcoinWalletImportFormat();
				document.getElementById("detailpubkeycomp").innerHTML = btcKey.getPubKeyHex();
				document.getElementById("detailaddresscomp").innerHTML = bitcoinAddressComp;
				document.getElementById("detailprivwifcomp").innerHTML = wifComp;

				ninja.qrCode.showQrCode({
					"detailqrcodepublic": bitcoinAddress,
					"detailqrcodepubliccomp": bitcoinAddressComp,
					"detailqrcodeprivate": wif,
					"detailqrcodeprivatecomp": wifComp
				}, 4);
			}
		},

		clear: function () {
			document.getElementById('detailkeyarea').style.display = "none";
			document.getElementById("detailpubkey").innerHTML = "";
			document.getElementById("detailpubkeycomp").innerHTML = "";
			document.getElementById("detailaddress").innerHTML = "";
			document.getElementById("detailaddresscomp").innerHTML = "";
			document.getElementById("detailprivwif").innerHTML = "";
			document.getElementById("detailprivwifcomp").innerHTML = "";
			document.getElementById("detailprivhex").innerHTML = "";
			document.getElementById("detailprivb64").innerHTML = "";
			document.getElementById("detailprivb6").innerHTML = "";
			document.getElementById("detailprivmini").innerHTML = "";
			document.getElementById("detailprivbip38").innerHTML = "";
			document.getElementById("detailqrcodepublic").innerHTML = "";
			document.getElementById("detailqrcodepubliccomp").innerHTML = "";
			document.getElementById("detailqrcodeprivate").innerHTML = "";
			document.getElementById("detailqrcodeprivatecomp").innerHTML = "";
			document.getElementById("detailb6").style.display = "none";
			document.getElementById("detailmini").style.display = "none";
			document.getElementById("detailbip38commands").style.display = "none";
			document.getElementById("detailbip38").style.display = "none";
		},

		loadInPaperWallet: async function() {
			document.getElementById("paperkeyarea").innerHTML = 'Loading...';
			ninja.tabSwitch(document.getElementById('paperwallet'));
			ninja.wallets.paperwallet.toggleVanityField(true);
			document.getElementById('suppliedPrivateKey').value = ninja.wallets.detailwallet.lastwallet.wifKey;
			//if (ninja.wallets.paperwallet.encrypt && !confirm('Do you want to encrypt this wallet using the previously supplied private key?')) {
			var response = await CSP_Alert(null, 'Do you want to encrypt this wallet using the previously supplied private key?',"confirm");
			if (ninja.wallets.paperwallet.encrypt && !response) {
			  
				document.getElementById('paperencrypt').checked = false;
				ninja.wallets.paperwallet.toggleEncryptSettings(false);
			}
			ninja.wallets.paperwallet.buildManual(ninja.wallets.detailwallet.lastwallet, ninja.wallets.paperwallet.passphrase);
		}
	};


 /***************************************************
 **          previously a break in <scrip>          **
 **                                                **
 ***************************************************/
 

(function (ninja) {
	var ut = ninja.unitTests = {
		runSynchronousTests: async function () {
			CSP_Alert("One Moment Please . . .","Doing something intense... Not sure what exactly..");  //document.getElementById("busyblock").className = "busy";
			//var div = document.createElement("div");
			//div.setAttribute("class", "unittests");
			//div.setAttribute("id", "unittests");
			var testResults = "";
			var passCount = 0;
			var testCount = 0;
			for (var test in ut.synchronousTests) {
				var exceptionMsg = "";
				var resultBool = false;
				try {
					resultBool = ut.synchronousTests[test]();
				} catch (ex) {
					exceptionMsg = ex.toString();
					resultBool = false;
				}
				if (resultBool == true) {
					var passFailStr = "pass";
					passCount++;
				}
				else {
					var passFailStr = "<b>FAIL " + exceptionMsg + "</b>";
				}
				testCount++;
				testResults += test + ": " + passFailStr + "\n";
			}
			testResults += passCount + " of " + testCount + " synchronous tests passed";
			if (passCount < testCount) {
				testResults += "<b>" + (testCount - passCount) + " unit test(s) failed</b>";
			}
			//div.innerHTML = "<a name=\"tests\"></a><h3>Unit Tests</h3><div id=\"unittestresults\">" + testResults + "<br/><br/></div>";
			//document.body.appendChild(div);
			await CSP_alertPromise.resolve(true);  //document.getElementById("busyblock").className = "";
			document.getElementById("CSP-dialog-popup").className = "dialog-popup dialog-popup-large";
			CSP_Alert("Synchronous Test Results","<textarea readonly id='readMeTextArea' style='width: 100%; height: 400px'>Loading...</textarea>","ok");
			document.getElementById("readMeTextArea").value = testResults;



  //var aboutBody = "<textarea readonly id='readMeTextArea' style='width: 100%; height: 300px'>Loading...</textarea>  "
  //  + "  <div class='footer' style='display:inherit;margin:0px;color:inherit;'>" + document.getElementById("footer").innerHTML + "</div>"
  //CSP_Alert("About",aboutBody,"ok");
  //$("#readMeTextArea").load("README"); 






	},

		runAsynchronousTests: function () {
			//var div = document.createElement("div");
			//div.setAttribute("class", "unittests");
			//div.setAttribute("id", "asyncunittests");
			//div.innerHTML = "<a name=\"tests\"></a><h3>Async Unit Tests</h3><div id=\"asyncunittestresults\"></div><br/><br/><br/><br/>";
			//document.body.appendChild(div);

			// run the asynchronous tests one after another so we don't crash the browser
			ninja.foreachSerialized(ninja.unitTests.asynchronousTests, function (name, cb) {
				//document.getElementById("busyblock").className = "busy";
				//CSP_Alert("One Moment Please . . .","Doing something intense... Not sure what exactly..");  //document.getElementById("busyblock").className = "busy";
        
        CSP_Alert("Asynchronous Unit Testing...",'<div id="asyncunittestresults" style="overflow-x: scroll;  max-height: 140px;"> Warning! This feature is incomplete and will most likely crash the app. <br> </div>',"ok");
        document.getElementById("loader").style.display='block';
				ninja.unitTests.asynchronousTests[name](cb);
			}, function () {
				//document.getElementById("asyncunittestresults").innerHTML += "running of asynchronous unit tests complete!<br/>";
				//document.getElementById("busyblock").className = "";
				//CSP_alertPromise.resolve(true);
				
				
				
				
				
				
				
				//document.getElementById("CSP-dialog-popup").className = "dialog-popup dialog-popup-large";
			//CSP_Alert("Asynchronous Test Results","<textarea readonly id='readMeTextArea' style='width: 100%; height: 400px'>Loading...</textarea>","ok");
			//document.getElementById("readMeTextArea").value = document.getElementById("asyncunittestresults").innerHTML;

				
				
				
				
				
				
			});
		},

		synchronousTests: {
			//ninja.publicKey tests
			testIsPublicKeyHexFormat: function () {
				var key = "0478982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB521F054FAD982AF4CC1933AFD1F1B563EA779A6AA6CCE36A30B947DD653E63E44";
				var bool = ninja.publicKey.isPublicKeyHexFormat(key);
				if (bool != true) {
					return false;
				}
				return true;
			},
			testGetHexFromByteArray: function () {
				var bytes = [4, 120, 152, 47, 64, 250, 12, 11, 122, 85, 113, 117, 131, 175, 201, 154, 78, 223, 211, 1, 162, 114, 157, 197, 155, 11, 142, 185, 225, 134, 146, 188, 181, 33, 240, 84, 250, 217, 130, 175, 76, 193, 147, 58, 253, 31, 27, 86, 62, 167, 121, 166, 170, 108, 206, 54, 163, 11, 148, 125, 214, 83, 230, 62, 68];
				var key = ninja.publicKey.getHexFromByteArray(bytes);
				if (key != "0478982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB521F054FAD982AF4CC1933AFD1F1B563EA779A6AA6CCE36A30B947DD653E63E44") {
					return false;
				}
				return true;
			},
			testHexToBytes: function () {
				var key = "0478982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB521F054FAD982AF4CC1933AFD1F1B563EA779A6AA6CCE36A30B947DD653E63E44";
				var bytes = Crypto.util.hexToBytes(key);
				if (bytes.toString() != "4,120,152,47,64,250,12,11,122,85,113,117,131,175,201,154,78,223,211,1,162,114,157,197,155,11,142,185,225,134,146,188,181,33,240,84,250,217,130,175,76,193,147,58,253,31,27,86,62,167,121,166,170,108,206,54,163,11,148,125,214,83,230,62,68") {
					return false;
				}
				return true;
			},
			testGetBitcoinAddressFromByteArray: function () {
				var bytes = [4, 120, 152, 47, 64, 250, 12, 11, 122, 85, 113, 117, 131, 175, 201, 154, 78, 223, 211, 1, 162, 114, 157, 197, 155, 11, 142, 185, 225, 134, 146, 188, 181, 33, 240, 84, 250, 217, 130, 175, 76, 193, 147, 58, 253, 31, 27, 86, 62, 167, 121, 166, 170, 108, 206, 54, 163, 11, 148, 125, 214, 83, 230, 62, 68];
				var address = ninja.publicKey.getBitcoinAddressFromByteArray(bytes);
				if (address != "1Cnz9ULjzBPYhDw1J8bpczDWCEXnC9HuU1") {
					return false;
				}
				return true;
			},
			testGetByteArrayFromAdding: function () {
				var key1 = "0478982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB521F054FAD982AF4CC1933AFD1F1B563EA779A6AA6CCE36A30B947DD653E63E44";
				var key2 = "0419153E53FECAD7FF07FEC26F7DDEB1EDD66957711AA4554B8475F10AFBBCD81C0159DC0099AD54F733812892EB9A11A8C816A201B3BAF0D97117EBA2033C9AB2";
				var bytes = ninja.publicKey.getByteArrayFromAdding(key1, key2);
				if (bytes.toString() != "4,151,19,227,152,54,37,184,255,4,83,115,216,102,189,76,82,170,57,4,196,253,2,41,74,6,226,33,167,199,250,74,235,223,128,233,99,150,147,92,57,39,208,84,196,71,68,248,166,106,138,95,172,253,224,70,187,65,62,92,81,38,253,79,0") {
					return false;
				}
				return true;
			},
			testGetByteArrayFromAddingCompressed: function () {
				var key1 = "0278982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB5";
				var key2 = "0219153E53FECAD7FF07FEC26F7DDEB1EDD66957711AA4554B8475F10AFBBCD81C";
				var bytes = ninja.publicKey.getByteArrayFromAdding(key1, key2);
				var hex = ninja.publicKey.getHexFromByteArray(bytes);
				if (hex != "029713E3983625B8FF045373D866BD4C52AA3904C4FD02294A06E221A7C7FA4AEB") {
					return false;
				}
				return true;
			},
			testGetByteArrayFromAddingUncompressedAndCompressed: function () {
				var key1 = "0478982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB521F054FAD982AF4CC1933AFD1F1B563EA779A6AA6CCE36A30B947DD653E63E44";
				var key2 = "0219153E53FECAD7FF07FEC26F7DDEB1EDD66957711AA4554B8475F10AFBBCD81C";
				var bytes = ninja.publicKey.getByteArrayFromAdding(key1, key2);
				if (bytes.toString() != "4,151,19,227,152,54,37,184,255,4,83,115,216,102,189,76,82,170,57,4,196,253,2,41,74,6,226,33,167,199,250,74,235,223,128,233,99,150,147,92,57,39,208,84,196,71,68,248,166,106,138,95,172,253,224,70,187,65,62,92,81,38,253,79,0") {
					return false;
				}
				return true;
			},
			testGetByteArrayFromAddingShouldReturnNullWhenSameKey1: function () {
				var key1 = "0478982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB521F054FAD982AF4CC1933AFD1F1B563EA779A6AA6CCE36A30B947DD653E63E44";
				var key2 = "0478982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB521F054FAD982AF4CC1933AFD1F1B563EA779A6AA6CCE36A30B947DD653E63E44";
				var bytes = ninja.publicKey.getByteArrayFromAdding(key1, key2);
				if (bytes != null) {
					return false;
				}
				return true;
			},
			testGetByteArrayFromAddingShouldReturnNullWhenSameKey2: function () {
				var key1 = "0478982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB521F054FAD982AF4CC1933AFD1F1B563EA779A6AA6CCE36A30B947DD653E63E44";
				var key2 = "0278982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB5";
				var bytes = ninja.publicKey.getByteArrayFromAdding(key1, key2);
				if (bytes != null) {
					return false;
				}
				return true;
			},
			testGetByteArrayFromMultiplying: function () {
				var key1 = "0478982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB521F054FAD982AF4CC1933AFD1F1B563EA779A6AA6CCE36A30B947DD653E63E44";
				var key2 = "SQE6yipP5oW8RBaStWoB47xsRQ8pat";
				var bytes = ninja.publicKey.getByteArrayFromMultiplying(key1, new Bitcoin.ECKey(key2));
				if (bytes.toString() != "4,102,230,163,180,107,9,21,17,48,35,245,227,110,199,119,144,57,41,112,64,245,182,40,224,41,230,41,5,26,206,138,57,115,35,54,105,7,180,5,106,217,57,229,127,174,145,215,79,121,163,191,211,143,215,50,48,156,211,178,72,226,68,150,52") {
					return false;
				}
				return true;
			},
			testGetByteArrayFromMultiplyingCompressedOutputsUncompressed: function () {
				var key1 = "0278982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB5";
				var key2 = "SQE6yipP5oW8RBaStWoB47xsRQ8pat";
				var bytes = ninja.publicKey.getByteArrayFromMultiplying(key1, new Bitcoin.ECKey(key2));
				if (bytes.toString() != "4,102,230,163,180,107,9,21,17,48,35,245,227,110,199,119,144,57,41,112,64,245,182,40,224,41,230,41,5,26,206,138,57,115,35,54,105,7,180,5,106,217,57,229,127,174,145,215,79,121,163,191,211,143,215,50,48,156,211,178,72,226,68,150,52") {
					return false;
				}
				return true;
			},
			testGetByteArrayFromMultiplyingCompressedOutputsCompressed: function () {
				var key1 = "0278982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB5";
				var key2 = "L1n4cgNZAo2KwdUc15zzstvo1dcxpBw26NkrLqfDZtU9AEbPkLWu";
				var ecKey = new Bitcoin.ECKey(key2);
				var bytes = ninja.publicKey.getByteArrayFromMultiplying(key1, ecKey);
				if (bytes.toString() != "2,102,230,163,180,107,9,21,17,48,35,245,227,110,199,119,144,57,41,112,64,245,182,40,224,41,230,41,5,26,206,138,57") {
					return false;
				}
				return true;
			},
			testGetByteArrayFromMultiplyingShouldReturnNullWhenSameKey1: function () {
				var key1 = "0478982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB521F054FAD982AF4CC1933AFD1F1B563EA779A6AA6CCE36A30B947DD653E63E44";
				var key2 = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var bytes = ninja.publicKey.getByteArrayFromMultiplying(key1, new Bitcoin.ECKey(key2));
				if (bytes != null) {
					return false;
				}
				return true;
			},
			testGetByteArrayFromMultiplyingShouldReturnNullWhenSameKey2: function () {
				var key1 = "0278982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB5";
				var key2 = "KxbhchnQquYQ2dfSxz7rrEaQTCukF4uCV57TkamyTbLzjFWcdi3S";
				var bytes = ninja.publicKey.getByteArrayFromMultiplying(key1, new Bitcoin.ECKey(key2));
				if (bytes != null) {
					return false;
				}
				return true;
			},
			// confirms multiplication is working and BigInteger was created correctly (Pub Key B vs Priv Key A)
			testGetPubHexFromMultiplyingPrivAPubB: function () {
				var keyPub = "04F04BF260DCCC46061B5868F60FE962C77B5379698658C98A93C3129F5F98938020F36EBBDE6F1BEAF98E5BD0E425747E68B0F2FB7A2A59EDE93F43C0D78156FF";
				var keyPriv = "B1202A137E917536B3B4C5010C3FF5DDD4784917B3EEF21D3A3BF21B2E03310C";
				var bytes = ninja.publicKey.getByteArrayFromMultiplying(keyPub, new Bitcoin.ECKey(keyPriv));
				var pubHex = ninja.publicKey.getHexFromByteArray(bytes);
				if (pubHex != "04C6732006AF4AE571C7758DF7A7FB9E3689DFCF8B53D8724D3A15517D8AB1B4DBBE0CB8BB1C4525F8A3001771FC7E801D3C5986A555E2E9441F1AD6D181356076") {
					return false;
				}
				return true;
			},
			// confirms multiplication is working and BigInteger was created correctly (Pub Key A vs Priv Key B)
			testGetPubHexFromMultiplyingPrivBPubA: function () {
				var keyPub = "0429BF26C0AF7D31D608474CEBD49DA6E7C541B8FAD95404B897643476CE621CFD05E24F7AE8DE8033AADE5857DB837E0B704A31FDDFE574F6ECA879643A0D3709";
				var keyPriv = "7DE52819F1553C2BFEDE6A2628B6FDDF03C2A07EB21CF77ACA6C2C3D252E1FD9";
				var bytes = ninja.publicKey.getByteArrayFromMultiplying(keyPub, new Bitcoin.ECKey(keyPriv));
				var pubHex = ninja.publicKey.getHexFromByteArray(bytes);
				if (pubHex != "04C6732006AF4AE571C7758DF7A7FB9E3689DFCF8B53D8724D3A15517D8AB1B4DBBE0CB8BB1C4525F8A3001771FC7E801D3C5986A555E2E9441F1AD6D181356076") {
					return false;
				}
				return true;
			},

			// Private Key tests
			testBadKeyIsNotWif: function () {
				return !(Bitcoin.ECKey.isWalletImportFormat("bad key"));
			},
			testBadKeyIsNotWifCompressed: function () {
				return !(Bitcoin.ECKey.isCompressedWalletImportFormat("bad key"));
			},
			testBadKeyIsNotHex: function () {
				return !(Bitcoin.ECKey.isHexFormat("bad key"));
			},
			testBadKeyIsNotBase64: function () {
				return !(Bitcoin.ECKey.isBase64Format("bad key"));
			},
			testBadKeyIsNotMini: function () {
				return !(Bitcoin.ECKey.isMiniFormat("bad key"));
			},
			testBadKeyReturnsNullPrivFromECKey: function () {
				var key = "bad key";
				var ecKey = new Bitcoin.ECKey(key);
				if (ecKey.priv != null) {
					return false;
				}
				return true;
			},
			testGetBitcoinPrivateKeyByteArray: function () {
				var key = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var bytes = [41, 38, 101, 195, 135, 36, 24, 173, 241, 218, 127, 250, 58, 100, 111, 47, 6, 2, 36, 109, 166, 9, 138, 145, 210, 41, 195, 33, 80, 242, 113, 139];
				var btcKey = new Bitcoin.ECKey(key);
				if (btcKey.getBitcoinPrivateKeyByteArray().toString() != bytes.toString()) {
					return false;
				}
				return true;
			},
			testECKeyDecodeWalletImportFormat: function () {
				var key = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var bytes1 = [41, 38, 101, 195, 135, 36, 24, 173, 241, 218, 127, 250, 58, 100, 111, 47, 6, 2, 36, 109, 166, 9, 138, 145, 210, 41, 195, 33, 80, 242, 113, 139];
				var bytes2 = Bitcoin.ECKey.decodeWalletImportFormat(key);
				if (bytes1.toString() != bytes2.toString()) {
					return false;
				}
				return true;
			},
			testECKeyDecodeCompressedWalletImportFormat: function () {
				var key = "KxbhchnQquYQ2dfSxz7rrEaQTCukF4uCV57TkamyTbLzjFWcdi3S";
				var bytes1 = [41, 38, 101, 195, 135, 36, 24, 173, 241, 218, 127, 250, 58, 100, 111, 47, 6, 2, 36, 109, 166, 9, 138, 145, 210, 41, 195, 33, 80, 242, 113, 139];
				var bytes2 = Bitcoin.ECKey.decodeCompressedWalletImportFormat(key);
				if (bytes1.toString() != bytes2.toString()) {
					return false;
				}
				return true;
			},
			testWifToPubKeyHex: function () {
				var key = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var btcKey = new Bitcoin.ECKey(key);
				if (btcKey.getPubKeyHex() != "0478982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB521F054FAD982AF4CC1933AFD1F1B563EA779A6AA6CCE36A30B947DD653E63E44"
					|| btcKey.getPubPoint().compressed != false) {
				return false;
			}
			return true;
		},
		testWifToPubKeyHexCompressed: function () {
			var key = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
			var btcKey = new Bitcoin.ECKey(key);
			btcKey.setCompressed(true);
			if (btcKey.getPubKeyHex() != "0278982F40FA0C0B7A55717583AFC99A4EDFD301A2729DC59B0B8EB9E18692BCB5"
					|| btcKey.getPubPoint().compressed != true) {
				return false;
			}
			return true;
		},
		testBase64ToECKey: function () {
			var key = "KSZlw4ckGK3x2n/6OmRvLwYCJG2mCYqR0inDIVDycYs=";
			var btcKey = new Bitcoin.ECKey(key);
			if (btcKey.getBitcoinBase64Format() != "KSZlw4ckGK3x2n/6OmRvLwYCJG2mCYqR0inDIVDycYs=") {
				return false;
			}
			return true;
		},
		testHexToECKey: function () {
			var key = "292665C3872418ADF1DA7FFA3A646F2F0602246DA6098A91D229C32150F2718B";
			var btcKey = new Bitcoin.ECKey(key);
			if (btcKey.getBitcoinHexFormat() != "292665C3872418ADF1DA7FFA3A646F2F0602246DA6098A91D229C32150F2718B") {
				return false;
			}
			return true;
		},
		testCompressedWifToECKey: function () {
			var key = "KxbhchnQquYQ2dfSxz7rrEaQTCukF4uCV57TkamyTbLzjFWcdi3S";
			var btcKey = new Bitcoin.ECKey(key);
			if (btcKey.getBitcoinWalletImportFormat() != "KxbhchnQquYQ2dfSxz7rrEaQTCukF4uCV57TkamyTbLzjFWcdi3S"
					|| btcKey.getPubPoint().compressed != true) {
					return false;
				}
				return true;
			},
			testWifToECKey: function () {
				var key = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var btcKey = new Bitcoin.ECKey(key);
				if (btcKey.getBitcoinWalletImportFormat() != "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb") {
					return false;
				}
				return true;
			},
			testBrainToECKey: function () {
				var key = "bitaddress.org unit test";
				var bytes = Crypto.SHA256(key, { asBytes: true });
				var btcKey = new Bitcoin.ECKey(bytes);
				if (btcKey.getBitcoinWalletImportFormat() != "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb") {
					return false;
				}
				return true;
			},
			testMini30CharsToECKey: function () {
				var key = "SQE6yipP5oW8RBaStWoB47xsRQ8pat";
				var btcKey = new Bitcoin.ECKey(key);
				if (btcKey.getBitcoinWalletImportFormat() != "5JrBLQseeZdYw4jWEAHmNxGMr5fxh9NJU3fUwnv4khfKcg2rJVh") {
					return false;
				}
				return true;
			},
			testGetECKeyFromAdding: function () {
				var key1 = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var key2 = "SQE6yipP5oW8RBaStWoB47xsRQ8pat";
				var ecKey = ninja.privateKey.getECKeyFromAdding(key1, key2);
				if (ecKey.getBitcoinWalletImportFormat() != "5KAJTSqSjpsZ11KyEE3qu5PrJVjR4ZCbNxK3Nb1F637oe41m1c2") {
					return false;
				}
				return true;
			},
			testGetECKeyFromAddingCompressed: function () {
				var key1 = "KxbhchnQquYQ2dfSxz7rrEaQTCukF4uCV57TkamyTbLzjFWcdi3S";
				var key2 = "L1n4cgNZAo2KwdUc15zzstvo1dcxpBw26NkrLqfDZtU9AEbPkLWu";
				var ecKey = ninja.privateKey.getECKeyFromAdding(key1, key2);
				if (ecKey.getBitcoinWalletImportFormat() != "L3A43j2pc2J8F2SjBNbYprPrcDpDCh8Aju8dUH65BEM2r7RFSLv4") {
					return false;
				}
				return true;
			},
			testGetECKeyFromAddingUncompressedAndCompressed: function () {
				var key1 = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var key2 = "L1n4cgNZAo2KwdUc15zzstvo1dcxpBw26NkrLqfDZtU9AEbPkLWu";
				var ecKey = ninja.privateKey.getECKeyFromAdding(key1, key2);
				if (ecKey.getBitcoinWalletImportFormat() != "5KAJTSqSjpsZ11KyEE3qu5PrJVjR4ZCbNxK3Nb1F637oe41m1c2") {
					return false;
				}
				return true;
			},
			testGetECKeyFromAddingShouldReturnNullWhenSameKey1: function () {
				var key1 = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var key2 = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var ecKey = ninja.privateKey.getECKeyFromAdding(key1, key2);
				if (ecKey != null) {
					return false;
				}
				return true;
			},
			testGetECKeyFromAddingShouldReturnNullWhenSameKey2: function () {
				var key1 = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var key2 = "KxbhchnQquYQ2dfSxz7rrEaQTCukF4uCV57TkamyTbLzjFWcdi3S";
				var ecKey = ninja.privateKey.getECKeyFromAdding(key1, key2);
				if (ecKey != null) {
					return false;
				}
				return true;
			},
			testGetECKeyFromMultiplying: function () {
				var key1 = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var key2 = "SQE6yipP5oW8RBaStWoB47xsRQ8pat";
				var ecKey = ninja.privateKey.getECKeyFromMultiplying(key1, key2);
				if (ecKey.getBitcoinWalletImportFormat() != "5KetpZ5mCGagCeJnMmvo18n4iVrtPSqrpnW5RP92Gv2BQy7GPCk") {
					return false;
				}
				return true;
			},
			testGetECKeyFromMultiplyingCompressed: function () {
				var key1 = "KxbhchnQquYQ2dfSxz7rrEaQTCukF4uCV57TkamyTbLzjFWcdi3S";
				var key2 = "L1n4cgNZAo2KwdUc15zzstvo1dcxpBw26NkrLqfDZtU9AEbPkLWu";
				var ecKey = ninja.privateKey.getECKeyFromMultiplying(key1, key2);
				if (ecKey.getBitcoinWalletImportFormat() != "L5LFitc24jme2PfVChJS3bKuQAPBp54euuqLWciQdF2CxnaU3M8t") {
					return false;
				}
				return true;
			},
			testGetECKeyFromMultiplyingUncompressedAndCompressed: function () {
				var key1 = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var key2 = "L1n4cgNZAo2KwdUc15zzstvo1dcxpBw26NkrLqfDZtU9AEbPkLWu";
				var ecKey = ninja.privateKey.getECKeyFromMultiplying(key1, key2);
				if (ecKey.getBitcoinWalletImportFormat() != "5KetpZ5mCGagCeJnMmvo18n4iVrtPSqrpnW5RP92Gv2BQy7GPCk") {
					return false;
				}
				return true;
			},
			testGetECKeyFromMultiplyingShouldReturnNullWhenSameKey1: function () {
				var key1 = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var key2 = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var ecKey = ninja.privateKey.getECKeyFromMultiplying(key1, key2);
				if (ecKey != null) {
					return false;
				}
				return true;
			},
			testGetECKeyFromMultiplyingShouldReturnNullWhenSameKey2: function () {
				var key1 = "5J8QhiQtAiozKwyk3GCycAscg1tNaYhNdiiLey8vaDK8Bzm4znb";
				var key2 = "KxbhchnQquYQ2dfSxz7rrEaQTCukF4uCV57TkamyTbLzjFWcdi3S";
				var ecKey = ninja.privateKey.getECKeyFromMultiplying(key1, key2);
				if (ecKey != null) {
					return false;
				}
				return true;
			},
			testGetECKeyFromBase6Key: function () {
				var baseKey = "100531114202410255230521444145414341221420541210522412225005202300434134213212540304311321323051431";
				var hexKey = "292665C3872418ADF1DA7FFA3A646F2F0602246DA6098A91D229C32150F2718B";
				var ecKey = new Bitcoin.ECKey(baseKey);
				if (ecKey.getBitcoinHexFormat() != hexKey) {
					return false;
				}
				return true;
			},

			// EllipticCurve tests
			testDecodePointEqualsDecodeFrom: function () {
				var key = "04F04BF260DCCC46061B5868F60FE962C77B5379698658C98A93C3129F5F98938020F36EBBDE6F1BEAF98E5BD0E425747E68B0F2FB7A2A59EDE93F43C0D78156FF";
				var ecparams = EllipticCurve.getSECCurveByName("secp256k1");
				var ecPoint1 = EllipticCurve.PointFp.decodeFrom(ecparams.getCurve(), Crypto.util.hexToBytes(key));
				var ecPoint2 = ecparams.getCurve().decodePointHex(key);
				if (!ecPoint1.equals(ecPoint2)) {
					return false;
				}
				return true;
			},
			testDecodePointHexForCompressedPublicKey: function () {
				var key = "03F04BF260DCCC46061B5868F60FE962C77B5379698658C98A93C3129F5F989380";
				var pubHexUncompressed = ninja.publicKey.getDecompressedPubKeyHex(key);
				if (pubHexUncompressed != "04F04BF260DCCC46061B5868F60FE962C77B5379698658C98A93C3129F5F98938020F36EBBDE6F1BEAF98E5BD0E425747E68B0F2FB7A2A59EDE93F43C0D78156FF") {
					return false;
				}
				return true;
			},
			// old bugs
			testBugWithLeadingZeroBytePublicKey: function () {
				var key = "5Je7CkWTzgdo1RpwjYhwnVKxQXt8EPRq17WZFtWcq5umQdsDtTP";
				var btcKey = new Bitcoin.ECKey(key);
				if (btcKey.getBitcoinAddress() != "1M6dsMZUjFxjdwsyVk8nJytWcfr9tfUa9E") {
					return false;
				}
				return true;
			},
			testBugWithLeadingZeroBytePrivateKey: function () {
				var key = "0004d30da67214fa65a41a6493576944c7ea86713b14db437446c7a8df8e13da";
				var btcKey = new Bitcoin.ECKey(key);
				if (btcKey.getBitcoinAddress() != "1NAjZjF81YGfiJ3rTKc7jf1nmZ26KN7Gkn") {
					return false;
				}
				return true;
			}
		},

		asynchronousTests: {
			//https://en.bitcoin.it/wiki/BIP_0038
			testBip38: function (done) {
				var tests = [
				//No compression, no EC multiply
					["6PRVWUbkzzsbcVac2qwfssoUJAN1Xhrg6bNk8J7Nzm5H7kxEbn2Nh2ZoGg", "TestingOneTwoThree", "5KN7MzqK5wt2TP1fQCYyHBtDrXdJuXbUzm4A9rKAteGu3Qi5CVR"],
					["6PRNFFkZc2NZ6dJqFfhRoFNMR9Lnyj7dYGrzdgXXVMXcxoKTePPX1dWByq", "Satoshi", "5HtasZ6ofTHP6HCwTqTkLDuLQisYPah7aUnSKfC7h4hMUVw2gi5"],
				//Compression, no EC multiply
					["6PYNKZ1EAgYgmQfmNVamxyXVWHzK5s6DGhwP4J5o44cvXdoY7sRzhtpUeo", "TestingOneTwoThree", "L44B5gGEpqEDRS9vVPz7QT35jcBG2r3CZwSwQ4fCewXAhAhqGVpP"],
					["6PYLtMnXvfG3oJde97zRyLYFZCYizPU5T3LwgdYJz1fRhh16bU7u6PPmY7", "Satoshi", "KwYgW8gcxj1JWJXhPSu4Fqwzfhp5Yfi42mdYmMa4XqK7NJxXUSK7"],
				//EC multiply, no compression, no lot/sequence numbers
					["6PfQu77ygVyJLZjfvMLyhLMQbYnu5uguoJJ4kMCLqWwPEdfpwANVS76gTX", "TestingOneTwoThree", "5K4caxezwjGCGfnoPTZ8tMcJBLB7Jvyjv4xxeacadhq8nLisLR2"],
					["6PfLGnQs6VZnrNpmVKfjotbnQuaJK4KZoPFrAjx1JMJUa1Ft8gnf5WxfKd", "Satoshi", "5KJ51SgxWaAYR13zd9ReMhJpwrcX47xTJh2D3fGPG9CM8vkv5sH"],
				//EC multiply, no compression, lot/sequence numbers
					["6PgNBNNzDkKdhkT6uJntUXwwzQV8Rr2tZcbkDcuC9DZRsS6AtHts4Ypo1j", "MOLON LABE", "5JLdxTtcTHcfYcmJsNVy1v2PMDx432JPoYcBTVVRHpPaxUrdtf8"],
					["6PgGWtx25kUg8QWvwuJAgorN6k9FbE25rv5dMRwu5SKMnfpfVe5mar2ngH", Crypto.charenc.UTF8.bytesToString([206, 156, 206, 159, 206, 155, 206, 169, 206, 157, 32, 206, 155, 206, 145, 206, 146, 206, 149])/*UTF-8 characters, encoded in source so they don't get corrupted*/, "5KMKKuUmAkiNbA3DazMQiLfDq47qs8MAEThm4yL8R2PhV1ov33D"]];

				// running each test uses a lot of memory, which isn't freed
				// immediately, so give the VM a little time to reclaim memory
				function waitThenCall(callback) {
				  console.log("wait then call");
					return function () { setTimeout(callback, 10000); }
				}

				var decryptTest = function (test, i, onComplete) {
					ninja.privateKey.BIP38EncryptedKeyToByteArrayAsync(test[0], test[1], function (privBytes) {
						if (privBytes.constructor == Error) {
							document.getElementById("asyncunittestresults").innerHTML += "fail testDecryptBip38 #" + i + ", error: " + privBytes.message + "<br/>";
						} else {
							var btcKey = new Bitcoin.ECKey(privBytes);
							var wif = !test[2].substr(0, 1).match(/[LK]/) ? btcKey.setCompressed(false).getBitcoinWalletImportFormat() : btcKey.setCompressed(true).getBitcoinWalletImportFormat();
							if (wif != test[2]) {
								document.getElementById("asyncunittestresults").innerHTML += "fail testDecryptBip38 #" + i + "<br/>";
							} else {
								document.getElementById("asyncunittestresults").innerHTML += "pass testDecryptBip38 #" + i + "<br/>";
							}
						}
						onComplete();
					});
				};

				var encryptTest = function (test, compressed, i, onComplete) {
					ninja.privateKey.BIP38PrivateKeyToEncryptedKeyAsync(test[2], test[1], compressed, function (encryptedKey) {
						if (encryptedKey === test[0]) {
							document.getElementById("asyncunittestresults").innerHTML += "pass testBip38Encrypt #" + i + "<br/>";
						} else {
							document.getElementById("asyncunittestresults").innerHTML += "fail testBip38Encrypt #" + i + "<br/>";
							document.getElementById("asyncunittestresults").innerHTML += "expected " + test[0] + "<br/>received " + encryptedKey + "<br/>";
						}
						onComplete();
					});
				};

				// test randomly generated encryption-decryption cycle
				var cycleTest = function (i, compress, onComplete) {
					// create new private key
					var privKey = (new Bitcoin.ECKey(false)).getBitcoinWalletImportFormat();

					// encrypt private key
					ninja.privateKey.BIP38PrivateKeyToEncryptedKeyAsync(privKey, 'testing', compress, function (encryptedKey) {
						// decrypt encryptedKey
						ninja.privateKey.BIP38EncryptedKeyToByteArrayAsync(encryptedKey, 'testing', function (decryptedBytes) {
							var decryptedKey = (new Bitcoin.ECKey(decryptedBytes)).getBitcoinWalletImportFormat();

							if (decryptedKey === privKey) {
								document.getElementById("asyncunittestresults").innerHTML += "pass cycleBip38 test #" + i + "<br/>";
							}
							else {
								document.getElementById("asyncunittestresults").innerHTML += "fail cycleBip38 test #" + i + " " + privKey + "<br/>";
								document.getElementById("asyncunittestresults").innerHTML += "encrypted key: " + encryptedKey + "<br/>decrypted key: " + decryptedKey;
							}
							onComplete();
						});
					});
				};

				// intermediate test - create some encrypted keys from an intermediate
				// then decrypt them to check that the private keys are recoverable
				var intermediateTest = function (i, onComplete) {
					var pass = Math.random().toString(36).substr(2);
					ninja.privateKey.BIP38GenerateIntermediatePointAsync(pass, null, null, function (intermediatePoint) {
						ninja.privateKey.BIP38GenerateECAddressAsync(intermediatePoint, false, function (address, encryptedKey) {
							ninja.privateKey.BIP38EncryptedKeyToByteArrayAsync(encryptedKey, pass, function (privBytes) {
								if (privBytes.constructor == Error) {
									document.getElementById("asyncunittestresults").innerHTML += "fail testBip38Intermediate #" + i + ", error: " + privBytes.message + "<br/>";
								} else {
									var btcKey = new Bitcoin.ECKey(privBytes);
									var btcAddress = btcKey.getBitcoinAddress();
									if (address !== btcKey.getBitcoinAddress()) {
										document.getElementById("asyncunittestresults").innerHTML += "fail testBip38Intermediate #" + i + "<br/>";
									} else {
										document.getElementById("asyncunittestresults").innerHTML += "pass testBip38Intermediate #" + i + "<br/>";
									}
								}
								onComplete();
							});
						});
					});
				}

				document.getElementById("asyncunittestresults").innerHTML += "running " + tests.length + " tests named testDecryptBip38<br/>";
				document.getElementById("asyncunittestresults").innerHTML += "running 4 tests named testBip38Encrypt<br/>";
				document.getElementById("asyncunittestresults").innerHTML += "running 2 tests named cycleBip38<br/>";
				document.getElementById("asyncunittestresults").innerHTML += "running 5 tests named testBip38Intermediate<br/>";
				ninja.runSerialized([
					function (cb) {
						ninja.forSerialized(0, tests.length, function (i, callback) {
							decryptTest(tests[i], i, waitThenCall(callback));
						}, waitThenCall(cb));
					},
					function (cb) {
						ninja.forSerialized(0, 4, function (i, callback) {
							// only first 4 test vectors are not EC-multiply,
							// compression param false for i = 1,2 and true for i = 3,4
							encryptTest(tests[i], i >= 2, i, waitThenCall(callback));
						}, waitThenCall(cb));
					},
					function (cb) {
						ninja.forSerialized(0, 2, function (i, callback) {
							cycleTest(i, i % 2 ? true : false, waitThenCall(callback));
						}, waitThenCall(cb));
					},
					function (cb) {
						ninja.forSerialized(0, 5, function (i, callback) {
							intermediateTest(i, waitThenCall(callback));
						}, cb);
					}
				], done);
			}
		}
	};
})(ninja);



 /***************************************************
 **          previously a break in <scrip>          **
 **                                                **
 ***************************************************/
 

	// run unit tests
	if (ninja.getQueryString()["unittests"] == "true" || ninja.getQueryString()["unittests"] == "1") {
		ninja.unitTests.runSynchronousTests();
		// ninja.translator.showEnglishJson();
		// no need to show translations until we actually have some. 9/5/2013 - Canton
	}
	// run async unit tests
	if (ninja.getQueryString()["asyncunittests"] == "true" || ninja.getQueryString()["asyncunittests"] == "1") {
		ninja.unitTests.runAsynchronousTests();
	}
	// change language
	if (ninja.getQueryString()["culture"] != undefined) {
		ninja.translator.translate(ninja.getQueryString()["culture"]);
	}

	if (ninja.getQueryString()["showseedpool"] == "true" || ninja.getQueryString()["showseedpool"] == "1") {
		document.getElementById("seedpoolarea").style.display = "block";
	}