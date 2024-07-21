import { Dispatch, SetStateAction } from "react";
import { Card, CardBody, CardHeader, CardText } from "react-bootstrap";

const initialCardCountValue = 1;

// cardCountの初期値を取得
export const getInitialCardCount = () => {
  console.log('・getInitialCardCount')

  let localCardCount = null;

  if (process.browser) {
    localCardCount = localStorage.getItem('cardCount');
  }

  if (localCardCount !== null) {
    return JSON.parse(localCardCount);
  } else {
    return initialCardCountValue;
  }
}

// カード
export const addCard = (cardCount: number, setCardCount: Dispatch<SetStateAction<number>>) => {
  setCardCount(cardCount + 1);
}

export const removeCard = (cardCount: number, setCardCount: Dispatch<SetStateAction<number>>) => {
  if (cardCount > 0) {
    setCardCount(cardCount - 1);
  }
}
