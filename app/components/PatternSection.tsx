"use client";

import { Row, Col, Button } from 'react-bootstrap';
import type { useColorEditor } from './useColorEditor';
import { addCard, removeCard } from './CardComponents';
import { DivCard } from './DivCard';

type PatternSectionProps = Pick<ReturnType<typeof useColorEditor>,
  'cardCount' | 'setCardCount' | 'addComponent' | 'getColorStyle' | 'handleClick' | 'handleDragStart' | 'handleDragOver' | 'handleDrop'
>;

/**
 * Header/Body/Footerのカードパターンを+/-で増減させながら表示するセクション。
 */
export const PatternSection = ({ cardCount, setCardCount, addComponent, getColorStyle, handleClick, handleDragStart, handleDragOver, handleDrop }: PatternSectionProps) => {
  return (
    <Row className="mt-5" id="card" >
      <Col sm={12}>
        <Button variant="outline-secondary" size="sm" className='button-card' onClick={() => removeCard(cardCount, setCardCount)}>-</Button>
        <span className='mx-2'>Pattern</span>
        <Button variant="outline-secondary" size="sm" className='button-card' onClick={() => addCard(cardCount, setCardCount)}>+</Button>
      </Col>
      <DivCard cardCount={cardCount}
        addComponent={addComponent} getColorStyle={getColorStyle}
        handleClick={handleClick} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop} />
    </Row>
  );
};
