///////////////// настройки ///////////////////////////////////////
const startS = "messCrypter$"; // начало зашифрованной строки
const separator = "$+$"; // разделитель информации
const endS = "$-$"; // конец строки
const regExp = /messCrypter\$(\S*)\$\+\$(\S*)\$\-\$/gm; // регулярка для поиска строк
const icon_32 = chrome.runtime.getURL("images/icon_32.png");

//  LOCAL Storage
let storage = chrome.storage.sync;

/////////////////// начало скрипта //////////////////////

///////// кэшируем базу ключей
let storageCache = {};
// запрашиваем всю БД
chrome.storage.sync.get(null, function (data) {
  // записываем в кэш
  storageCache = data;
  // можно выполнять остальные скрипты
  cacheReady();
});

/////// кэш готов
function cacheReady() {
  // документ загружен
  $(document).ready(() => {
    // // проверка при изменении DOM
    // $("body").on("DOMSubtreeModified", () => {
    ///////////////////////////// поиск и замена зашифрованного текста
    // получаем весь html
    const html = $("body").html();
    console.log(html);
    // находим и заменяем строки с шифрами
    let newHTML = html.replace(regExp, (match, name, key, offset, string) => {
      // отправляем на расшифровку
      let decrypt = decrypter(name, key);
      // если ключ не найден
      if (decrypt == undefined) {
        // console.log("messCrypter: key '" + name + "' not found");
        // отправляем имя ключа
        return "messCrypter: key '" + name + "' not found";
        // если все ок
      } else {
        // возвращаем расшифрованное сообщение
        return decrypt;
      }
    }); // end replace

    ///// если что-то нашли, то обновляем html
    if (html != newHTML) $("body").html(newHTML);
    // }); // end DOMSubtreeModified

    ////////////////////// шифрование сообщений
    /// вставляем кнопку шифрования
    let input = $("div[contenteditable='true']"),
      h = input.height(),
      w = input.width();
    input.after(
      "<img src='" +
        icon_32 +
        "' style='position: absolute; cursor:pointer; left:" +
        (w - h) +
        "px; top:" +
        h / 2 +
        "px; height:" +
        h +
        "px;' id='buttonCrypt' >",
    ); //end document ready

    // при клике на кнопку шифрования
    $("#buttonCrypt").click(function (e) {
      // получаем текст поля
      let mess = $("div[contenteditable='true']").text();
      // шифруем его
      let res = encrypter(mess);
      // если что-то пошло не так
      if (!res) {
        alert("failed to encrypt message");
        return false;
      }
      // собираем сообщение
      let encrypt = startS + res.name + separator + res.encrypt + endS;
      // вставляем обратно
      $("div[contenteditable='true']").text(encrypt);
    });

    ///////////////////////////////// расшифровщик
    function decrypter(name, encrypt) {
      // ищем ключ в БД
      let key = storageCache[name];
      // если нашелся
      if (key != undefined) {
        // расшифровываем
        let decrypt = CryptoJS.AES.decrypt(encrypt, key).toString(
          CryptoJS.enc.Utf8,
        );
        // возвращаем ответ
        return decrypt;
        // если не нашелся
      } else {
        // возвращаем ответ
        return undefined;
      }
    } // end encrypter

    /////////////////////////////// шифровальщик
    function encrypter(mess) {
      // если сообщение пустое
      if (!(mess.length > 0)) return false;
      // находим имя дефолтного ключа
      let name = storageCache["def"];
      // ищем ключ в БД
      let key = storageCache[name];
      // шифруем
      let encrypt = CryptoJS.AES.encrypt(mess, key).toString();
      // возвращаем
      return { encrypt: encrypt, name: name };
    } // end encrypter
  }); // end document ready
} // end cache ready
