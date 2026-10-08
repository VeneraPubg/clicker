/**
 * Магазин скинов (модульная версия).
 *
 * Экспортирует:
 *   initShop({ getScore, setScore, saveScore, getPerson }) — инициализация
 */

import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'skins';

/* Хранилище купленных скинов (объект: id -> true/false) */
let shopItems = {};

/* Внешние зависимости, передаются из main.js */
let getScore = () => 0;
let setScore = () => {};
let saveScore = () => {};
let getPerson = () => null;

/**
 * Инициализация магазина.
 * @param {Object} deps
 * @param {() => number} deps.getScore  — вернуть текущий счёт
 * @param {(v:number) => void} deps.setScore — установить счёт
 * @param {() => void} deps.saveScore   — сохранить счёт
 * @param {() => HTMLElement|null} deps.getPerson — получить персонажа
 */
export async function initShop(deps = {}) {
  if (deps.getScore) getScore = deps.getScore;
  if (deps.setScore) setScore = deps.setScore;
  if (deps.saveScore) saveScore = deps.saveScore;
  if (deps.getPerson) getPerson = deps.getPerson;

  /* Загружаем купленные скины из Capacitor Preferences */
  const { value } = await Preferences.get({ key: STORAGE_KEY });
  shopItems = value ? JSON.parse(value) : {};

  const skins = document.querySelectorAll('.skin');
  const skinsIDs = [];
  const skinsBuys = [];

  skins.forEach((skin) => {
    skin.addEventListener('click', changeSkin);
    skinsIDs.push(skin.id);

    if (skin.id === 'standart') {
      skinsBuys.push(true);
      skin.classList.add('active');
    } else if (shopItems[skin.id]) {
      const span = skin.querySelector('span');
      if (span) span.innerText = '✔️';
      skinsBuys.push(true);
    } else {
      skinsBuys.push(false);
    }
  });

  /* Первый запуск — сохраняем структуру */
  if (!value) {
    const shopStorage = {};
    for (let i = 0; i < skinsIDs.length; i++) {
      shopStorage[skinsIDs[i]] = skinsBuys[i];
    }
    await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(shopStorage) });
  }

  /* Кнопки магазина */
  const openBtn = document.getElementById('shopOpen');
  const shop = document.getElementById('shop');
  const cross = document.getElementById('close');

  if (openBtn && shop) {
    openBtn.addEventListener('click', () => shop.classList.add('open'));
  }
  if (cross && shop) {
    cross.addEventListener('click', () => shop.classList.remove('open'));
  }
}

/* Открытие/закрытие */
export function openModal() {
  const shop = document.getElementById('shop');
  if (shop) shop.classList.add('open');
}

export function closeModal() {
  const shop = document.getElementById('shop');
  if (shop) shop.classList.remove('open');
}

/* Смена/покупка скина */
async function changeSkin(event) {
  const skinEl = event.target.closest('.skin');
  if (!skinEl) return;

  const span = skinEl.querySelector('span');
  const skinCost = span ? Number(span.innerText) : NaN;
  const activeID = skinEl.id;

  const person = getPerson();
  const skins = document.querySelectorAll('.skin');

  /* Уже куплен — просто надеваем */
  if (shopItems[activeID]) {
    skins.forEach((s) => s.classList.remove('active'));
    skinEl.classList.add('active');

    const imgEl = skinEl.querySelector('img');
    const imgSkin = skinEl.src || (imgEl && imgEl.src);
    if (person && imgSkin) {
      person.style.backgroundImage = `url("${imgSkin}")`;
    }
    closeModal();
    return;
  }

  /* Не куплен — пробуем купить */
  const currentScore = Number(getScore()) || 0;

  if (!Number.isFinite(skinCost)) {
    console.warn('Не удалось определить цену скина', activeID);
    return;
  }

  if (currentScore >= skinCost) {
    setScore(currentScore - skinCost);
    saveScore();

    shopItems[activeID] = true;
    await Preferences.set({ key: STORAGE_KEY, value: JSON.stringify(shopItems) });

    skins.forEach((s) => s.classList.remove('active'));
    skinEl.classList.add('active');

    if (span) span.innerText = '✔️';

    const imgEl = skinEl.querySelector('img');
    const imgSkin = skinEl.src || (imgEl && imgEl.src);
    if (person && imgSkin) {
      person.style.backgroundImage = `url("${imgSkin}")`;
    }

    closeModal();
  }
}
