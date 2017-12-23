
	/********************************************************
	 Brand new JS functions added for bitcoinpaperwallet.com
	 ********************************************************/


// Dynamic drawing of standard bitcoin design
		if (typeof PaperWallet == "undefined") {
			// global PaperWallet object
			var PaperWallet = window.PaperWallet = {};
		} 
		if (!PaperWallet.draw) {
			(function() {
				// images minimized with https://tinypng.com/ and http://pnggauntlet.com/ and encoded with http://www.base64-image.de/		
				var imgBitcoinLogo = new Image();
				imgBitcoinLogo.src =  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATEAAABlCAMAAAAS0yQPAAAAsVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////3kxr7kwD90ar3jQ38tWv/+fT3khf6nCf7pUH+5dH92rf3kBL/8+r+7dz7rlf4oDX+4MT9xI38vXz//vz4lyH9zJz806L5q03+69T+6M36tWH+8uP6u278zZT82Kv7xIL3igbY4iM2AAAAGXRSTlMAeUWrl+673YhmVg82H8sI1MMWKfblb6Jei/6cWwAADftJREFUeNrs2N2OojAYBuCKIKAMgjrq9yWMlcAiG0HwB3Tv/8LWtG5kHcqgiSfW57ik5E37QktaG1j9qdF1Hf1Td9yuMZ1bI/ImMp6r9ifc0pyZaQ3J2y2rY09AyFGVAXm7+pja8BNdtcgbp8w0aMWdv3fnmdKDqkOQnb5y349jP9+fymMEVY4pfWZWF662mzzGW0u/CBaVzPpEZiPj2va/9ykK5ZXQehL3WV+Hi0O2xB+UO7iYdCTdmkMVLrYrbMMP4MIdEwmNXeCiFbYVB8BpErZZXwMm2eA98i1wBpHMFLhgiXfaANeVq8wM4Aq8nx8B48p0RleBiXx8RJoBY8sT2SWwXYoPWksWmQFMiWJhSLHJHhhXjguNKTBrFKOxj54XothqweufSEBp0flhkGyzIsbGyGT5yRhrTSuMo+kBzn4tKSIVrbUVMHPy4oZuY4dxYZ7A2ZYihqdyH1OPCrtMe/Vzucq/ktjIW/NYPaQYASx2ZVoXWcFGOa/9J8tLLErxO1pJ7MiG7T0MY7baDrWJYdayyoZKv6P29JlJRAZKx7TI0zw+zYBf7/hYx/NCWq2xRRyi98UeOHpYix8yG99B6fQ0+MeuHTpQHX6L1FPIczw+jSH8TNLl7lj4PLXQT9jWpYhexp8QJMYH2kNxXjr8xybfmXDV+yBP8Pg04wmcBfVlDwBJxFL7U1xrjK2ixA+xXslGmuISqKgfOvpLq7kupw0DURgwlBAKadPSdLFs4Qu2sQmXhCRN3v/B2q6Q67VuHs/0+5HMRMYrr3ePjkQ8Mv79f5RZ/zAePn6kbckKEMxa2ZKxnMgYAQ9mVybrP4U2D+qcKNP/sI3oHeYzXns0eFZowXdB8GGTMWSHFwz1ARdwJSlZFcY4U32v8ISlOSDjhkz3XwzcYTrnOdd71ohDi8c83ce/bDKG4BWTe/M8yzDykYrUGMkpw0tC8TC4tHpf5YP1wx2mc4m9WTyryiP+2Fl2mAdaZOorqvwrKeqYzh6GvkC8tiU0+TLohTvMqOPHnkwPHr+mL6AniwNq+lVTNtUul2grYv9KBn/4phE65ksYUPpXmTvM0L1aTKzbo20QHC6GnPH0sg421iK71S3NmG7/Sozt25oT3t2vCYHSv8jcYT51E7/MugH/IL1JeL5sTK2J3eaZIqb+lUpz2S0KnV+zB6SWaWyfXounO4w3cIFSelpb2T6DkTI26P8ZDc6ij4wNabf4rF5a9+FfwRFl2Qd3mGE392o98kLDKimfOVD4q22v9KOPjI0wP74k4iK0sxbcuMM4ncsP95mF3B6J9THYXd6egPAemLX/UzcZo9zhbSNShgBHVy3cjZC5aWTRJUzDe+hv9km4VyvBKyDC5m+CYH0+kUoLA6OLnSxcMoZ8vSGr+hJjiWeJShAUpCyHw+GsUZqL2cMUrkw84nFvx0syYA0zxvwK36ed2v3E1pT0lEfafDyA3aUgwVNZY1veOmVMMp5ThQHOwjBkHASclCX5r4X5cAotJuOFyKTXHpgNLGEm8883S1DwFrSV87UNPD6U7IPadVTOvjxhHpwypu7H5ytQKWlZIvhC5mPQMsN8qUxH5jDeBPSMSZZP3WUs3v7zHKeGydDWWIy+ySFjBO9elqHKUS1LlMAZmJiZhoYDQ5gVGPnyrSFjhaMpQxDQQ9ftjpO/q0Rib+mSsSxpzAuvBoIqY02aj50gHFRwIGulDOxk9GYrTNkd9n/syNgJJGmgb1auFzK8YGSTMXYUiajlypNSkbErqZQxCSMjkrKqOz3ap7z55Kz4NyBTZgqDJML3CUKWNXYZC3Rjh85ubN/M2CF3Sf9J405XQsYUIlarzw1xlozIGKIIGmeRT2H11Cq/SVwCMjKEgSzdq4F4rWUjsQu3gceHEiFjtCstZ4uV+g3JgsgYIRT3m4tFv37JCSDMJxBBI/mSnzJ97Cjkf6ANg+WvUmTXqQ1+omPoLGP5upGxjzeoKbfmf8PwLHs5igg0FsbSl4Ag9BUyQLhmqCBDupTN9GGw/FUKLnpZOP63zjL2dD5sg2C72Wz+/Hp9dLr+s/qtx5gse9pWopuXEAS+QgxIHvum8uOFrwMbc6IPk9mmtry28rtbxmpeyvdLHB0Ou4tsCfmFXEd7MRXLHoXu7LT6kphkLIt8lZgkTD+ql7HUNDUcvRs84OGzU8Yoj9nLC6dWKbCc9k91R1K2N9lZxsxZYaSR9Z/sKGPkgpHbjqGMuXg6bCwZW1lkrGAJQFJR+bHLGKvJWg0eHxNhDYqI0yRHLAfIK3oQ5pCxMgHgZdE+CsL95tklYw7KCHvSaGHNMsaUBY0DYpaxGAgJqSsJp+1a5O0wgNhkLJRGs5WxpTtjKGMWsgoX0I4Zm2rdO49I7dtkbA+EkHQaoSLqSNXgd3vXupwoDEYXRfFet9W2dECEoqIiSNW2+v4PtgqJMRySsM7+KntmdmYHTAPH5OS7JRIKhTLGLqz5kDaMMbmMHY+reV7T4ggi/RLGHgVBiAn33jIZswRDzIJvklcg/KtSGcOvLs5sS7WO2Xu2Tr6dZm5w3G24BztCoF+iYx0IQggIcUUytuBoCcW5kxh7QWfeFcpY8ZNpmZO3L+1UppGxqbfmckt+BJQJ10odn1srYmyRZ4Jf5LUz+Gm2yqzS7tlV7ugmxpMMRTcoYwRhLh+hK+2x6Q7M1JkdHZ1b5Z/CvAR7TChjyJhaxpowWr3b8FqPIyPIrGK+m3eljMGgW2RJAA1sfomMJSw2Zi8JkbTaBwA2v0DGGoWvEkpfTYM80Pp2MGvYop7Z6jF0o5IxhxvcIxKs2iplDOMTdkSWUKiKAr+yKZWxugEKrJSxHg3sTQpzJTq+eyf3+blKxhw6f/KDuwaZJJmMcTdus75rwSA7puuLVMba8OhqGbsmNQImYzSjAGRm2eBuqW7mYElD/uqJi49hMed0BjIGWV8IXUB8TCZjw7Q9/+io0CBjWfw078JkaCA5v3RgSCpjMQR+6eB+MESppFl49CL7FICMQYIpjbBNxcZvTSpjOReopIw9tUWMPXa0AvenBgNGLmMrKmMwuIUm7Mx1zM3B/3aEYVbbZ4wtkDGM86OMMTtUoi+o2No14cPbr7qm6UaxwzjiPIv7ZeyMlkD67aOZgz+D/SOQSpIaFyhjBI7HSAR94cegycNF9oExB83k4G4Zo1/7hzhFyXA8cfveSBkxzfuKt/W+KJ3KIDfEUF8CAWMTcB1TwKJACKLw75UxTI2gUcHg75dvtm1PU9inNIyLCROUsVeRjCFhsYn6AnqFnhB9abn/tHBZz/fLGF2lvwosfYTzsf1Mlmd2IzfZbkylPZYZfX25jPkui285Im8vn6EwHZ/IDFK2snKRHfJRF2hXyRi6GsxA3oGlvzAFcA4fHwvy3ArjIuYt/pzZPfHf3/3Yu4kLkz5BX7god2hZVhjQt3Rvml/urCfn/+Tj9YFlxR7m7NQyhms0qxt2sf41/D5szHIIiifljitaymW7ED4+J5tiAPZRQE7jMCtUUsbQ1cgwLFwtL8miyPv8XphqrCRpkdFTrlpLRhjqizhd8U6XWQQbQgww9dUyhq4GgcZV9yBrX6YCjjcTV/T/hopADjglUV+YJYWMMT3HW5ZshJWXMSwp7jdkUcXpac8K+Bmw3A6xoSslhBQQIXlI1JdBg0o8DkmkDMcM9nO/jFHUUfvRGQqT7cIxC7D5tCU+5bhbhrEJfUcNn7Ol80sq1lVMFIKINRfD0jKGbivbiBZI87ub5cmehUUalohiY06+5qJHCm1C/uXdNeVr1KmjvtS6BhSckHobCp/jzIvTW9jIsxxCWL2EjKGn9ZCrT98JI4rU1T6ts+fb7kh+d/6xDaYiwrZYm84mxGUDV4q19X5bOvhsAh6uWwudlRWfm4QWazOizPjxJIXlE7oatBG5E1sLVjoH3ZTBAHY7fsmKhrc2tWo33uktWnpBEHjum3iXjYs7YYTFhKwKtlf4nB1Rk3ptLLzVEvZDupHDgCstqLeeR5KI4qdNi58O0TQtVEkLVt6E8KHOWk7ZoEd89Rx67IQvwLjLNpTCLUFnRq2wG+C3xnUJ75Jx/i2QMRLpsfcQwhAjwK+FFT4jBrXc0UG5A+C6Re3qXcYm3BJ0pou6aeUvdBr5Kxx0kfjPvGs0x/4CW0KI6CDcD9vTmqMcXVr/9n7rNyukZzf6usG1ad2sXHx9dKPe7l4bcXeabUk3fdEFeoXHY6oH8yUylhxSjWMytiwzxnbcvjdk7XJoQwpdq5U6FoNEV1vnJnUN2zy1W80UZFME3mlp//gQiFfhASFREvqHfSpjdNFU4qsKpx1lcz4udJVmUZQWRZFFU4l9Jr4//BCyx6HkoKPp5d/y05+ni6YKyYYUM/9w9EamvAZjattusl4qJ6U3JwXzPx5tEylD0tSEHaogYhlaSBmiJGGDahwL+KI65U6NJJuSRv9XJfBQlx89qcZ+kxFWmeOtKWU79z7CvsyKEXamjEzMQ3IHX+6ORFMqRNiNi7r9+xk5Jz5YRTQMjgJfwDArd978y88+PlF6/NxqWZqv6JIMqIrhiug3TQLfK8fXtaTA+PGukQDPDfazLGV+M4NC/+HOtwRPLHzpfHsy+dqyAuJhVQdYhs7QvOLwvV9GBWwlKV0E46r+kM0VD23CGcEuPgaJt7zAS4LP3I9yNVpVsykKOXv9bZaDof3ni6Cnj00VRs1ONQIVJdHtvBimGI3mc7V8orLHZDeNjQkYD1qd/7NRhIenzrPeHAwNwxgbw8HvF+21V8m5+AfCu6sYTeBU+wAAAABJRU5ErkJggg==";
				
				var draw = PaperWallet.draw = {
					imgBitcoinLogo: imgBitcoinLogo,
				
					/**
					 * Draw guilloche pattern with the given parameters into the canvas.
					 * Source: https://gist.github.com/3n/803329
					 */
					guilloche: function(ctx, opts) {
						ctx.save();
						
						var opts = opts || {};
						var scale = opts.scale || 1,
							majorR = opts.majorR || 49,
							minorR = opts.minorR || 20.4324,
							angleMultiplier = opts.angleMultiplier || 1,
							radiusEffectConstant = opts.radiusEffectConstant || 33,
							steps = opts.steps || 1000,
							centerPoint = opts.centerPoint || { x: 0, y:0 },
							color = opts.color || 'rgb(0,0,255)',
							width = opts.width || 0.5;
							globalAlpha = opts.globalAlpha || 1.0;
					 
						ctx.globalAlpha = globalAlpha;
					 
						var	diff = majorR - minorR,
							s = diff / minorR,
							theta = 0,
							radiusEffect = radiusEffectConstant + minorR,
							oldX, oldY;

						for (var i = steps; i>0; --i) {
							var new_theta = angleMultiplier * theta,
								x = (diff * Math.sin(new_theta) + radiusEffect * Math.sin(new_theta * s))*scale + (centerPoint.x),
								y = (diff * Math.cos(new_theta) - radiusEffect * Math.cos(new_theta * s))*scale + (centerPoint.y);

							theta += Math.PI * 4 / steps;

							if (oldX) {
								ctx.strokeStyle = color;
								ctx.lineWidth = width;
								ctx.beginPath();
								ctx.moveTo(oldX, oldY);
								ctx.lineTo(x, y);
								ctx.closePath();
								ctx.stroke();
							}

							oldX = x;
							oldY = y;
						}
						
						ctx.restore();
					},
					
					
					/**
					 * Calculate unique parameters for pattern drawing.
					 * @param {String} msg Message to extract parameters from.
					 */
					guillocheParams: function(msg) {			
						/** 
						 * Extracts a float in range [0, 1[ from first 4 bytes of the given bytearray.
						 * This treats the first 4 bytes as a signed integer value, scales it to size 1,
						 * and adds 0.5 to move to the range [0, 1[.
						 *
						 * @param {bytearray} Byte array, at least 4 bytes
						 */
						function float01(bytearray) {
							var v = bytearray[0] << 24;
							v |= bytearray[1] << 16;
							v |= bytearray[2] << 8;
							v |= bytearray[3];			
							v /= 4294967296;
								
							// since v is signed, just add 0.5 to remap to [0, 1[.
							return v + 0.5;
						}

						/**
						 * Linear interpolation between min and max based on v [0, 1[.
						 */
						function scaled_between(v, min, max) {
							return v*(max - min) + min;
						};			
					
						// this contains some hand tuned constant to make the generated patterns look pretty.
						var msg = Crypto.SHA256(msg, {asBytes: true});
						var majorR = scaled_between(float01(msg), 55, 300); // overall radius.
												
						var msg = Crypto.SHA256(msg, {asBytes: true});
						var scale = scaled_between(float01(msg), 5, 15);

						msg = Crypto.SHA256(msg, {asBytes: true}); 
						var minorR = scaled_between(float01(msg), 0.01, 10); // a large minorR makes for a sparser design, bigger holes in the spiderweb.
						
						
						msg = Crypto.SHA256(msg, {asBytes: true}); 
						var steps = scaled_between(float01(msg), 1500, 7000); 
						
						var width = (5000/steps) * .5; 
						width = Math.min(width,1.2); // prevent overly chunky lines
						
						msg = Crypto.SHA256(msg, {asBytes: true});
						var radiusEffectConstant = scaled_between(float01(msg), majorR*0.9, majorR); 
						
						msg = Crypto.SHA256(msg, {asBytes: true});
						var angleMultiplier = Math.ceil(scaled_between(float01(msg), 0, 3));

						// majorR = 110; scale = 11; minorR = .5; steps = 5000; width = .3; radiusEffectConstant = 100; angleMultiplier = 2; // test suite
					
						return  {
							angleMultiplier: angleMultiplier,
							majorR: majorR,
							minorR: minorR,
							radiusEffectConstant: radiusEffectConstant,
							scale: scale,
							steps: steps,		
							width: width
						}
					},
					
					
					/**
					 * Draws a rounded rectangle using the current state of the canvas. 
					 * If you omit the last three params, it will draw a rectangle 
					 * outline with a 5 pixel border radius 
					 *
					 * Source: http://stackoverflow.com/a/3368118
					 *
					 * @param {CanvasRenderingContext2D} ctx
					 * @param {Number} x The top left x coordinate
					 * @param {Number} y The top left y coordinate 
					 * @param {Number} width The width of the rectangle 
					 * @param {Number} height The height of the rectangle
					 * @param {Number} radius The corner radius. Defaults to 5;
					 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
					 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
					 */
					roundRect: function(ctx, x, y, w, h, opts) {
						ctx.save();
						
						ctx.beginPath();
						ctx.moveTo(x + opts.radius, y);
						ctx.lineTo(x + w - opts.radius, y);
						ctx.quadraticCurveTo(x + w, y, x + w, y + opts.radius);
						ctx.lineTo(x + w, y + h - opts.radius);
						ctx.quadraticCurveTo(x + w, y + h, x + w - opts.radius, y + h);
						ctx.lineTo(x + opts.radius, y + h);
						ctx.quadraticCurveTo(x, y + h, x, y + h - opts.radius);
						ctx.lineTo(x, y + opts.radius);
						ctx.quadraticCurveTo(x, y, x + opts.radius, y);
						ctx.closePath();

						if (typeof opts.lineWidth != "undefined") {
							ctx.lineWidth = opts.lineWidth;
						}
						if (typeof opts.strokeStyle != "undefined") {
							ctx.strokeStyle = opts.strokeStyle;
							ctx.stroke();
						}
						if (typeof opts.fillStyle != "undefined") {
							ctx.fillStyle = opts.fillStyle;
							ctx.fill();
						}
						
						ctx.restore();
					},			
					
					
					/**
					 * Draw text with strong blur around it.
					 * This is quite a hack, but I couldn't find a better way.
					 */
					fillTextStrongBlur: function(ctx, msg, x, y, offset, opts) {
						ctx.save();
						
						ctx.shadowColor = opts.color.textShadow;
						ctx.shadowBlur = 7;
						ctx.shadowOffsetX = 4;
						ctx.shadowOffsetY = 4;
						
						// run multiple times for stronger blur
						for (var i=0; i<1; ++i) {
							ctx.shadowOffsetX = offset;
							ctx.shadowOffsetY = offset;
							ctx.fillText(msg, x, y);
							
							ctx.shadowOffsetX = -offset;
							ctx.shadowOffsetY = offset;
							ctx.fillText(msg, x, y);
							
							ctx.shadowOffsetX = offset;
							ctx.shadowOffsetY = -offset;
							ctx.fillText(msg, x, y);
							
							ctx.shadowOffsetX = -offset;
							ctx.shadowOffsetY = -offset;
							ctx.fillText(msg, x, y);
						}
						
						ctx.restore();
					},			
					
					text: function(ctx, opts) {
						ctx.save();
						
						ctx.font = opts.font;
						ctx.textAlign = "center";
						ctx.fillStyle = opts.color.text;
						draw.fillTextStrongBlur(ctx, opts.text.publicAddress, 268, 320, 4, opts);
						draw.fillTextStrongBlur(ctx, opts.text.depositVerify, 268, 696, 4, opts);
						
						ctx.rotate(-Math.PI*2/4);
						draw.fillTextStrongBlur(ctx, opts.text.privateKey, -482, 2396, 4, opts);
						draw.fillTextStrongBlur(ctx, opts.text.walletImportFormat, -482, 2844, 4, opts);
						
						
						// text for green pointer
						ctx.fillStyle = opts.color.textPointer;
						ctx.fillText(opts.text.withdraw, -482, 1015);
						
						ctx.restore();
					},
					
					obfuscation: function(ctx, x, y, w, h) {
						ctx.save();
						ctx.font = "18px Courier";
						ctx.textAlign = "center";
						var obfuscationColors = ["#000000","#222222","#333333","#666666"];
						
						// create random text to black out private key pattern
						var possible_letters = "฿#";
						// var possible_letters = "■•";
						for (var i=0; i<1500; ++i) {
							ctx.fillStyle = obfuscationColors[Math.floor(Math.random() * obfuscationColors.length)];
							var letter = possible_letters[Math.floor(Math.random()*possible_letters.length)];
							ctx.fillText(letter, x + Math.random()*w, y + Math.random()*h);
						}
						ctx.restore();
					},
					
					gradients: function(ctx, opts) {
						ctx.save();
						
						// draw background gradients
						var grd = ctx.createLinearGradient(55, 82, 55, 807);
						grd.addColorStop(0, opts.color.publicUpper);
						grd.addColorStop(1, opts.color.publicLower);
						ctx.fillStyle = grd;
						ctx.fillRect(55, 82, 958, 807);
						
						grd = ctx.createLinearGradient(1013, 0, 2961, 0)
						grd.addColorStop(0, opts.color.privateLeft);
						grd.addColorStop(1, opts.color.privateRight);
						ctx.fillStyle = grd;
						ctx.fillRect(1013, 82, 2961, 807);
						ctx.restore();
					},
					
					logos: function(ctx, cp) {
						var w = 90;
						
						/* draw circle for bitcoin logo
						ctx.arc(cp.x, cp.y, w/2+5, 0, 2*Math.PI, false);
						ctx.fillStyle = "white";
						ctx.fill();
						*/

						// logo
						ctx.drawImage(PaperWallet.draw.imgBitcoinLogo, (cp.x-w/2)-4, (cp.y-w/2)-4, 305, 101);
					},

					pointer: function(ctx, colorPointer) {
						ctx.save();
						ctx.beginPath();
						ctx.moveTo(980, 82);
						ctx.lineTo(1030, 82);
						ctx.lineTo(1030, 355);
						ctx.quadraticCurveTo(1030, 466, 1070, 486);
						ctx.quadraticCurveTo(1030, 506, 1030, 617);
						ctx.lineTo(1030, 889);
						ctx.lineTo(980, 889);
						ctx.closePath();
						ctx.fillStyle = colorPointer;
						ctx.shadowColor = "#555";
						ctx.shadowBlur = 5;
						ctx.shadowOffsetX = 5;
						ctx.shadowOffsetY = 0;
						ctx.fill();
						ctx.restore();		
					},

					clearSurroundings: function(ctx) {
						ctx.save();
						
						ctx.beginPath();
						ctx.moveTo(55, 82);
						ctx.lineTo(1708, 82);
						ctx.lineTo(1708, 182);
						ctx.lineTo(2308, 182);
						ctx.lineTo(2809, 90);
						ctx.lineTo(2906, 182);
						
						ctx.lineTo(2906, 971-182);	
						ctx.lineTo(2809, 971-90);
						ctx.lineTo(2308, 971-182);
						ctx.lineTo(1708, 971-182);
						ctx.lineTo(1708, 971-82);
						ctx.lineTo(55, 971-82);
						
						// surroundings,  move back
						ctx.lineTo(0, 971);
						ctx.lineTo(2962, 971);
						ctx.lineTo(2962, 0);
						ctx.lineTo(0, 0);
						ctx.lineTo(0, 971);
						ctx.lineTo(55, 971);
						ctx.closePath();
						
						ctx.lineWidth = 0.2;	
						ctx.strokeStyle = "black";
						ctx.fillStyle = "white";
						
						ctx.stroke();	
						ctx.fill();
						
						ctx.restore();
					},
					
					// Creates an image based on the given public key.
					frontImage: function(key, opts) {
						// create the temporary draw canvas
						var canvas = document.createElement('canvas');
						canvas.width = 2962;
						canvas.height = 971;
						
						var key = key || "";
						
						var ctx = canvas.getContext('2d');
						var cp = {x: 665, y: 389};
						
						PaperWallet.draw.gradients(ctx, opts);
						
						// draw guilloche
						guillocheParams = PaperWallet.draw.guillocheParams(key);
						guillocheParams.color = opts.color.guilloche;
						guillocheParams.centerPoint = cp;
						PaperWallet.draw.guilloche(ctx,  guillocheParams);
						
						PaperWallet.draw.logos(ctx, cp);
						PaperWallet.draw.pointer(ctx, opts.color.pointer);
						
						PaperWallet.draw.clearSurroundings(ctx);
						
						// draw empty rectangle for public QR code
						var qrOpts = {
							lineWidth: 0.2,
							strokeStyle: "black",
							fillStyle: "white",
							radius: 20,
						};
						
						PaperWallet.draw.roundRect(ctx, 113, 344, 310, 310, qrOpts);
						PaperWallet.draw.roundRect(ctx, 1816, 290, 384, 384, qrOpts);
						PaperWallet.draw.roundRect(ctx, 2416, 290, 384, 384, qrOpts);
						
						PaperWallet.draw.text(ctx, opts);
						
						PaperWallet.draw.obfuscation(ctx, 1831, 310, 350, 350);

						return canvas.toDataURL();
					}
				};
			})();
		}

	// global drawing options, most of which will be replaced in setDesign() for translation
	
	var drawOpts = {
		color: {
			publicUpper: "#fff57c",
			publicLower: "#f7931a",
			privateLeft: "#8cd96f",			
			privateRight: "#fff67d",
			pointer: "#03ab5d",
			guilloche: "white",
			
			text: "#1937a9",
			textShadow: "white",
			textPointer: "white",				
		},

		font: "bold 20pt sans-serif",			
		
		text: {
			publicAddress: "",
			depositVerify: "",
			privateKey: "",
			walletImportFormat: "",
			withdraw: "",
		},
	};


	// Functions for printer calibration

	var inlineMediaStyle = null;

	function printZoom (changeBy) { /* handle +/- buttons for print zoom */
		var currentZoom = document.getElementById("printerzoom").value * 1;
		document.getElementById("printerzoom").value = currentZoom + changeBy;
		updateCalibrationInfo();
	}

	function printShift (changeBy) { /* handle +/- buttons for print shift */
		var currentShift = document.getElementById("printershift").value * 1;
		document.getElementById("printershift").value = currentShift + changeBy;
		updateCalibrationInfo();
	}

	// apply the printer zoom & shift values as !important <head> styles
	// thanks http://stackoverflow.com/questions/798535/changing-media-specific-css-properties-from-javascript
	function updateCalibrationInfo() { 

		var currentZoom = document.getElementById("printerzoom").value;
		var currentShift = document.getElementById("printershift").value;
		// first write values onto printable area for reference
		document.getElementById("calibrationinfo").innerHTML="Zoom: " + currentZoom + " / Horizontal shift: " + currentShift;
		// now update the @print style accordingly
		var head = document.getElementsByTagName('head')[0];
		var printerStyle = document.createElement('style');
		printerStyle.setAttribute('type', 'text/css');
		printerStyle.setAttribute('media', 'print');
		printerStyle.appendChild(document.createTextNode('body { width: ' + ( 950 + (currentZoom * 10)) + 'px !important;} #main { left: ' + ((currentShift * 5)) + 'px !important;}'));

		if (inlineMediaStyle != null) { 
			head.replaceChild(printerStyle, inlineMediaStyle)
		} else {
			head.appendChild(printerStyle);
		}
		inlineMediaStyle = printerStyle;
	}
	
	var printCounter=0;
	var landscapeAlert=0;
	
	async function doPrint(myContext) { /* What to do anytime a print button is clicked */
		window.landscapeAlert ++;
		updateCalibrationInfo();
		if (window.landscapeAlert == 1) {
			await CSP_Alert("Important note:","Please configure your print settings to LANDSCAPE (wide) orientation.","ok");
		}
		
		if (myContext == 'generate') {
			window.printCounter ++;
			if (window.printCounter == 2) {
			  await CSP_Alert("*** WARNING *** WARNING *** WARNING ***","You are about to print a second wallet with the same set of keys. \n\nUnless you intended to make a backup wallet, cancel this print job and generate a fresh set of keys.","ok");
			}
		}
		window.print();	
	}
	
	async function testAndApplyVanityKey() { /* Verify that a self-entered key is valid, and compute the corresponding public address, render the wallet. */
		var suppliedKey = document.getElementById('suppliedPrivateKey').value;
		suppliedKey = suppliedKey.trim(); // in case any spaces or whitespace got pasted in
		document.getElementById('suppliedPrivateKey').value = suppliedKey;
		if (!ninja.privateKey.isPrivateKey(suppliedKey)) {
			var message = 'What you entered does not appear to be a ' + window.currencyName + ' Wallet Import Format (WIF) private key.';
			if (suppliedKey == null || suppliedKey.length == 0) {
				//alert(message);
				CSP_Alert(null ,message,"ok");
				return;
			}
			if (suppliedKey.length < ninja.wallets.paperwallet.minPassphraseLength) {
				//alert(message + '\n\nIf you would like to use this text as a random data source or "brain wallet" passphrase, please supply a longer input.');
				CSP_Alert(null ,message + '<br> If you would like to use this text as a random data source or "brain wallet" passphrase, please supply a longer input.',"ok");
				return;
			}
			
			
			if (await CSP_Alert('Brain Wallet?', message + '<br><br>Click OK to interpret this text as a random data source or "brain wallet" passphrase from which a SHA256 hash and keypair will be computed.',"confirm")) {
				var wallet = new Bitcoin.ECKey(Crypto.SHA256(suppliedKey, { asBytes: true }));
				var computedPublicAddress = wallet.getBitcoinAddress();
				var privateKey = wallet.getBitcoinWalletImportFormat();
				ninja.wallets.paperwallet.buildManual({ address: computedPublicAddress, wifKey: privateKey }, document.getElementById('paperpassphrase').value);
			}
		} else {			
			var computedPublicAddress = new Bitcoin.ECKey(suppliedKey).getBitcoinAddress();
			CSP_Alert('OK!' ,'This is a valid WIF-format private key whose public address is: '+computedPublicAddress,"ok");
			ninja.wallets.paperwallet.buildManual({ address: computedPublicAddress, wifKey: suppliedKey }, document.getElementById('paperpassphrase').value);
			window.printCounter = 0;
		}
	}

	function guessPrinterSettings() {
		// detect browser / OS human-readable
		txt = "<p><small style=\"color: #666666;\"><b>User-agent:</b> " + navigator.userAgent + "</small><br />&nbsp;<br />";
		var parser = new UAParser();
		parser.setUA(navigator.userAgent);
		var result = parser.getResult();
		txt+=result.browser.name + " version " + result.browser.version + " (" + result.engine.name + ")<br />";
		txt+=result.os.name + " version " + result.os.version + " (" + result.cpu.architecture + ")<br />";
		txt += "</p>";
		document.getElementById("browserinfo").innerHTML=txt;
		
		// some common printer calibration settings here
		if (result.browser.name == 'Safari') { // OS X Safari
			document.getElementById("printerzoom").value = 5;
			document.getElementById("printershift").value = 6;
		} else if (result.browser.name == 'Chrome' && result.os.name == 'Mac OS X') { 
			document.getElementById("printerzoom").value = 3;
			document.getElementById("printershift").value = 3;
		} else if (result.browser.name == 'Firefox' && result.os.name == 'Ubuntu') { // live CD?
			document.getElementById("printerzoom").value = 1;
			document.getElementById("printershift").value = 0;
		} else if (result.browser.name == 'Iceweasel' && result.os.name == 'Debian') { 
			document.getElementById("printerzoom").value = 1.8;
			document.getElementById("printershift").value = 2.9;
		} else if (result.browser.name == 'IE' && result.os.name == 'Windows') { 
			document.getElementById("printerzoom").value = 5;
			document.getElementById("printershift").value = 6;
		}

		updateCalibrationInfo();
}

function setDesign (whichDesign, whichLanguage) {
  console.log("setDesign loading... whichDesign= " + whichDesign + " whichLanguage = " + whichLanguage);
  whichLanguage = typeof whichLanguage !== 'undefined' ? whichLanguage : 'english';

	
	//get the default design type if default selected
  if (whichDesign == "default"){whichDesign = walletsJSONfile.default_design;}


	
//	Do all this stuff if the user changes currencies types
	if (window.currencyType !== walletsJSONfile.designs[whichDesign].coin_type){
	  console.log("window.currencyType = " + window.currencyType + ", \n walletsJSONfile.designs['" + whichDesign + "'].coin_type) = " + walletsJSONfile.designs[whichDesign].coin_type);
	  window.currencyType = walletsJSONfile.designs[whichDesign].coin_type;
	  
	  document.getElementById('logoback').style.backgroundImage = 'url(./images/wallets/'+walletsJSONfile.coin_types[window.currencyType].folder+'/'+walletsJSONfile.coin_types[window.currencyType].logo+')';
  	  
    for (var wType in ninja.wallets) {
				document.getElementById(wType).className = "tab";
				ninja.wallets[wType].close();
		}
    document.getElementById('generate').style.display='block';
    document.getElementById('menu').style.visibility='hidden';
  
    var CSP_currencyName = document.getElementsByClassName("CSP-currencyName");
    setCryptoCurrency(walletsJSONfile.coin_types[window.currencyType].display_name);
    for(var i = 0; i < CSP_currencyName.length; i++){
      document.getElementsByClassName("CSP-currencyName")[i].textContent=walletsJSONfile.coin_types[window.currencyType].display_name;
    }
    document.getElementById("CSP-WIFPrefix").textContent = window.window.WIFPrefix;
    document.getElementById("CSP-compressedWIFPrefix").textContent = window.compressedWIFPrefix;

	}
	setLanguage(whichLanguage);

//  Do all this stuff if the user changes designes
  if (window.designChoice !== whichDesign){
    window.designChoice = whichDesign;
    
    var myFront = './images/wallets/' + walletsJSONfile.designs[whichDesign].folder_name +'/' + walletsJSONfile.designs[whichDesign].images['front'];
		var myBack = './images/wallets/' + walletsJSONfile.designs[whichDesign].folder_name +'/' + walletsJSONfile.designs[whichDesign].images['back'];
		var myPreview = './images/wallets/' + walletsJSONfile.designs[whichDesign].folder_name +'/' + walletsJSONfile.designs[whichDesign].images['sample'];
		
    // set languages
    if (walletsJSONfile.designs[whichDesign].multilanguage == true) { //hide back denomination options according to JSON
			document.getElementById('langPicker').style.display='inline';
		} else {
			document.getElementById('langPicker').style.display='none';
		}
  
    // if the front artwork is ready, set it to either the correspondong JPG, or draw it	
    //console.log("papersvg1 status = " + document.getElementById('papersvg1'));
    if (document.getElementById('papersvg1') != null) {
		  if (walletsJSONfile.designs[whichDesign].dynamic_drawing == true) {
			  document.getElementById("papersvg1").src = PaperWallet.draw.frontImage(document.getElementById("btcaddress1").innerHTML, drawOpts);
			} else {
			  document.getElementById('papersvg1').src=myFront;
			}
    }
    
    
    // set back
    document.getElementById('backsvg1').src = myBack;
    document.getElementById('designPreview').src = myPreview;
    document.getElementById('designPicker').value = whichDesign; // force menu option in case it was picked during onload.
    document.getElementById('langPicker').value = whichLanguage; 
		if (walletsJSONfile.designs[whichDesign].back_message_options == true) { //hide back message options according to JSON
			document.getElementById("backMessageOptions").style.display = 'inline';
			document.getElementById('backText').style.display='block';
		} else {
			document.getElementById("backMessageOptions").style.display = 'none';
			document.getElementById('backText').style.display='none';
		}
		if (walletsJSONfile.designs[whichDesign].back_demonitation_options == true) { //hide back denomination options according to JSON
		  document.getElementById("backSealImage").src = './images/wallets/' + walletsJSONfile.designs[whichDesign].folder_name +'/' + walletsJSONfile.designs[whichDesign].images['seal'];
			document.getElementById("backDenominationOptions").style.display = 'inline';
			//document.getElementById('backSeal').style.display='block';
		} else {
			document.getElementById("backDenominationOptions").style.display = 'none';
			document.getElementById('backSeal').style.display='none';
		}
    
    
  }

}


function setDenomination(valueAndUnit) {
	if (!valueAndUnit) {
		document.getElementById('backSeal').style.display = 'none';
		document.getElementById('backDenominationOther').style.display = 'none';
	} else if (valueAndUnit == 'other') {
		document.getElementById('backDenominationOther').style.display = 'block';
		document.getElementById('backSeal').style.display = 'block';
		document.getElementById('backSealBig').innerHTML = document.getElementById('backDenominationOtherAmount').value;
		document.getElementById('backSealSmall').innerHTML = document.getElementById('backDenominationOtherUnit').value;
	} else {
		denominationParts = valueAndUnit.split(' ');
		document.getElementById('backSeal').style.display = 'block';
		document.getElementById('backSealBig').innerHTML = denominationParts[0];
		document.getElementById('backSealSmall').innerHTML = denominationParts[1];
		document.getElementById('backDenominationOther').style.display = 'none'
	}
}

// disable unit testing if we are not working with regular old bitcoin
if (window.currencyName != 'Bitcoin') document.getElementById('footerlabeltests').style.display='none';
