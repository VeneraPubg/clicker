/**
 *  1. Хранилище, где указано, что купленно, а что нет
 *  2. Переключение скинов
 *  3. Функция покупки
 *  4. Функция открытия и закрытия окна магазина
 * */

/* Получаем все скины */
const skins = document.querySelectorAll(".skin");
/* Получаем данные о купленных скинах */
const shopItems = JSON.parse(localStorage.getItem("skins")) || {};

/* Для первого запуска игры, собираем
пустой объект
массив с ID скинов
массив с купленными скинами
*/
let shopStorage = {};
let skinsIDs = [];
let skinsBuys = [];

/* Перебираем скины */
skins.forEach((skin) => {
  /* Добавляем слушатель по клику */
  skin.addEventListener("click", changeSkin);
  /* Перебираем ID скинов */
  skinsIDs.push(skin.id);
  /* Делаем стандартный по умолчанию купленным */
  if (skin.id == "standart") {
    skinsBuys.push(true);
  } else if (shopItems[skin?.id]) {
    /* Проверяем есть ли уже купленные скины и ставим галку */
    skin.querySelector("span").innerText = "✔️";
    skinsBuys.push(true);
  } else {
    /* Если не стандартный и не купленный */
    skinsBuys.push(false);
  }
});

/* Если в первый раз, то сохраняем данные из массивов в объект */
if (localStorage.getItem("skins") == null) {
  for (let i = 0; i < skinsIDs.length; i++) {
    shopStorage[skinsIDs[i]] = skinsBuys[i];
  }
  localStorage.setItem("skins", JSON.stringify(shopStorage));
}
/* Кнопку открытия магазина */
const openBtn = document.getElementById("shopOpen");
/* Сам магазин */
const shop = document.getElementById("shop");
/* Крестик в окне магазина */
const cross = document.getElementById("close");
/* Открытие по клику на кнопку открытия */
openBtn.addEventListener("click", openModal);
function openModal() {
  shop.classList.add("open");
}
/* Закрытие по клику на крестик */
cross.addEventListener("click", closeModal);
function closeModal() {
  shop.classList.remove("open");
}

/* Получаем нашего персонажа */
const person = document.getElementById("pers");

/* Функция смены и покупки скина */
function changeSkin(event) {
  /* Находим скин по которому кликнули */
  const skinActive = event.target;
  /* Находим его цену */
  const skinCost = skinActive.closest(".skin").querySelector("span")?.innerText;
  /* Находим его ID */
  const activeID = skinActive.closest(".skin").id;

  /* Если куплен  */
  if (shopItems[activeID]) {
    /* Убираем у всех скинов рамку зеленую */
    skins.forEach((skin) => {
      skin.classList.remove("active");
    });
    /* Добавляем рамку, на который нажали */
    skinActive.closest(".skin").classList.add("active");
    /* Получаем картинку из скина нажатого */
    let imgSkin = skinActive.src || skinActive.querySelector("img").src;

    /* Изменяем картинку персонажу */
    person.style.backgroundImage = 'url("' + imgSkin + '")';
    /* Закрываем магазин */
    closeModal();

    /* Если не куплено */
  } else if (scoresText >= skinCost) {
    /* Вычитаем очки из счёта */
    scoresText = scoresText - skinCost;
    /* Делаем скин "купленным" */
    shopItems[activeID] = true;
    /* Сохраняем что купили */
    localStorage.setItem("skins", JSON.stringify(shopItems));
    /* Сохраняем очки */
    save();

    skins.forEach((skin) => {
      skin.classList.remove("active");
    });

    skinActive.closest(".skin").classList.add("active");

    /* Меняем цену на галочку */
    skinActive.closest(".skin").querySelector("span").innerText = "✔️";

    let imgSkin = skinActive.src || skinActive.querySelector("img").src;

    person.style.backgroundImage = 'url("' + imgSkin + '")';

    closeModal();
  }
}
