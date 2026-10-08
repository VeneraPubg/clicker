let multiDigi = 
parseInt(localStorage.getItem('multi'))
|| 1;

/* На сколько умножиться клик */
const multiCount = document
.querySelector('.multiCount');

if (multiDigi == 1) { /* Первый раз купили */
    multiCount.innerText = 'x' + (multiDigi + 1);
} else if (multiDigi >= 2) {
    multiCount.innerText = 'x' + (multiDigi + 2);
}

/* Стоимость бонуса */
let multiCost = parseInt(localStorage.getItem('multiCost')) || 
document.querySelector('.multiCost').innerText;

document.querySelector('.multiCost').innerText = multiCost;

/* Получаем персонажа */
const pers = document
.getElementById('pers');

/* Получаем тег в которм отображаеться очки */
const scores = document
.getElementById('scores');

/* Кол-во очков. Если есть в сторе, то возьми от туда 
ИЛИ
возьми из вёрстки
*/
let scoresText = parseInt(localStorage.getItem('scores')) ||
 scores.innerText;

/* Если есть в сторе очки, то вставь в вёрстку */
scores.innerText = scoresText;

/* Слушатель событий на клик */
pers.addEventListener('click', addScore);
/* Функция по клику */
function addScore() {
    scoresText = parseInt(scoresText) 
    + (1 * multiDigi); // Увеличение на 1 клик
    save()
} 
/* Кнопка бонуса */
const multiBonus = document
.getElementById('multi');


multiBonus.addEventListener('click', buyMulti)

function buyMulti() {
    /* Хватает ли у нас очков */
    if(scoresText >= multiCost) {
        scoresText = scoresText - multiCost;
        multiCost = multiCost * 2;
        if (multiDigi == 1) { /* Первый раз купили */
            multiDigi = multiDigi + 1; // 2
            multiCount.innerText = 'x' + (multiDigi + 2);
        } else if (multiDigi >= 2) {
            multiDigi = multiDigi + 2; // 4, 6, 8, 10
            multiCount.innerText = 'x' + (multiDigi + 2);
        }
        save()
    }
}

function save() {
    /* Сохраняем в стор кол-во очков */
    localStorage.setItem('scores', scoresText.toString());
    localStorage.setItem('multi', multiDigi.toString());
    localStorage.setItem('multiCost', multiCost.toString());
    localStorage.setItem('autoCount', autoCount.toString());
    localStorage.setItem('autoCost', autoCost.toString());
    /* Обновляем кол-во очков в вёрстке */
    scores.innerText = scoresText;
    document.querySelector('.multiCost').innerText = multiCost;
    document.querySelector('.autoCost').innerText = autoCost;
}

const autoBuy = document.getElementById('auto');
let autoCount = parseInt(localStorage.getItem('autoCount'))
|| 0;

let autoCost = parseInt(localStorage.getItem('autoCost')) || 
document.querySelector('.autoCost').innerText;

let autoText = document.querySelector('.autoCount');

if (autoCount == 0) { /* ни разу не купили */
    autoText.innerText = '1 в сек.';
} else if (autoCount >= 1) {
    autoText.innerText = (autoCount * 2) +
    ' в сек.';
}

autoBuy.addEventListener('click', buyAuto);
function buyAuto() {
        /* Хватает ли у нас очков */
    if(scoresText >= autoCost) {
        scoresText = scoresText - autoCost;
        autoCost = autoCost * 2;
        if (autoCount == 0) { /* Первый раз купили */
            autoCount = autoCount + 1;
            autoText.innerText = (autoCount * 2) +
            ' в сек.';
        } else if (autoCount >= 1) {
            autoCount = autoCount * 2;
            autoText.innerText = (autoCount * 2) +
            ' в сек.';
        }
        save();
    }
}
setInterval(autoClick, 1000);
function autoClick() {

    scoresText = parseInt(scoresText) + autoCount;

    /* Сохраняем в стор кол-во очков */
    localStorage.setItem('scores', scoresText.toString());

    /* Обновляем кол-во очков в вёрстке */
    scores.innerText = scoresText;
}