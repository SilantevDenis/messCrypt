//  LOCAL Storage
let storage = chrome.storage.sync;

///////// кэшируем базу ключей
let storageCache = {};
// запрашиваем всю БД
chrome.storage.sync.get(null, function (data) {
  // записываем в кэш
  storageCache = data;
  // можно выполнять остальные скрипты
  cacheReady();
});

//////////////////////////////////////// запись ключей ///////////////////////////////////////////////////
// данные для записи
let lastName = "",
  name = "",
  key = "";

/////// кэш готов
function cacheReady() {
  //// ждем загрузки страницы
  $(document).ready(() => {
    ///////////////////////// отображение полей
    let i = 0;
    // перебираем всю ключи
    for (let name in storageCache) {
      // пропускаем настройку
      if (name == "def") continue;

      // заполняем форму
      let tr = $("tr").eq(i);
      // name
      tr.find(".name").val(name);
      // key
      tr.find(".key")
        .val(storageCache[name])
        .attr("data-last-value", storageCache[name]);
      // radio
      tr.find(".radio").attr("for", name);
      // показываем
      tr.removeClass("d-none");

      // прибавляем
      i++;
    }
    // ищем дефолтный ключ
    let def = storageCache["def"] || $("tr:first .name").val();
    // выбираем соответствующий radio
    $("input[for='" + def + "']").prop("checked", true);

    ///////////////////////// при изменении имени ключа
    $(".name").change(function (e) {
      // получаем старое имя
      lastName = $(this).data("last-value");

      // получаем новое имя
      name = $(this).val();

      // сохраняем новое имя в last-value
      $(this).data("last-value", name);

      // получаем ключ
      key = $(e.target).parents("tr").find(".key").val();

      // отправляем на запись
      set(name, key);
    });

    /////////////////////// при изменении ключа
    $(".key").change(function (e) {
      // вбиваем новое имя
      name = $(e.target).parents("tr").find(".name").val();

      // вбиваем ключ
      key = $(this).val();

      // отправляем на запись
      set(name, key);
    });

    /////////////////////// при изменении дефолтного ключа
    $(".radio").change(function (e) {
      // название настройки
      key = "def";
      // имя ключа
      val = $(this).attr("for");
      // отправляем на запись
      set(key, val);
    });

    ////////////////////////////// запись значений в базу
    function set(key, val) {
      // проверяем все ли данные есть
      if (key != "" && val != "") {
        // подготавливаем данные
        let dt = {};
        dt[key] = val;
        // записываем новое значение
        storage.set(dt);
      }
    }

    ////////////////////// добавление полей
    $("#add").click(() => {
      // открываем одну скрытую строку
      $("tr.d-none:first").removeClass("d-none");
    });
  }); // document ready
} // cache ready
