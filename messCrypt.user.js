// ==UserScript==
// @name         messCrypt
// @namespace
// @version      1.0
// @description  encryption of social media messages
// @author       silantevdenis
// @match        *://*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.slim.js
// @require      https://raw.githubusercontent.com/SilantevDenis/messCrypt/master/js/aes-min.js
// ==/UserScript==

(function () {
  "use strict";

  let encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
​   console.log(encrypted)
})();
