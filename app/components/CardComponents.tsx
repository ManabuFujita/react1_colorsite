"use client";

/**
 * Patternセクションに表示するカード枚数(cardCount)の初期値取得と増減を行うヘルパー関数群。
 */

import { Dispatch, SetStateAction } from "react";

const initialCardCountValue = 1;

/**
 * cardCountの初期値を取得する。
 * localStorageに保存済みの値があればそれを、なければデフォルト値を返す。
 */
export const getInitialCardCount = () => {
  console.log('・getInitialCardCount')

  let localCardCount = null;
  if (typeof localStorage !== "undefined") {
    localCardCount = localStorage.getItem('cardCount');
  }

  if (localCardCount !== null) {
    return JSON.parse(localCardCount);
  } else {
    return initialCardCountValue;
  }
}

/**
 * カードを1枚追加する。
 */
export const addCard = (cardCount: number, setCardCount: Dispatch<SetStateAction<number>>) => {
  setCardCount(cardCount + 1);
}

/**
 * カードを1枚減らす(0枚未満にはしない)。
 */
export const removeCard = (cardCount: number, setCardCount: Dispatch<SetStateAction<number>>) => {
  if (cardCount > 0) {
    setCardCount(cardCount - 1);
  }
}
