/**
 * Точка входа. Здесь связываем магазин с основной логикой игры.
 */

import { initShop } from './shop.js';

/* ---- Пример вашей игровой логики ---- */

const SCORE_KEY = 'score';
let score = Number(localStorage.getItem(SCORE_KEY)) || 0;

function getScore() {
  return score;
}

function setScore(v) {
  score = v;
}

function saveScore() {
  localStorage.setItem(SCORE_KEY, String(score));
}

function getPerson() {
  return document.getElementById('pers');
}

/* ---- Запуск магазина ---- */

initShop({
  getScore,
  setScore,
  saveScore,
  getPerson,
});
