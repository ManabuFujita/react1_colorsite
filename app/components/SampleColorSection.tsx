"use client";

import { useState } from 'react';
import { Row, Container, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import type { useColorEditor } from './useColorEditor';
import { DivSampleColors } from './SampleColorList';

type SampleColorSectionProps = Pick<ReturnType<typeof useColorEditor>,
  'components' | 'setComponents' | 'addComponent' | 'getColorStyle' | 'handleClick' | 'handleDragStart'
>;

/**
 * 保存済みサンプルカラー一覧の表示/非表示トグルと、一覧本体をまとめたセクション。
 */
export const SampleColorSection = ({ components, setComponents, addComponent, getColorStyle, handleClick, handleDragStart }: SampleColorSectionProps) => {
  const [showSampleColor, setShowSampleColor] = useState<boolean>(true);

  const handleToggleSampleColor = () => {
    setShowSampleColor(!showSampleColor);
  }

  const getShowSampleColor = () => {
    return showSampleColor ? '' : {style: {display: 'none' }}
  }

  return (
    <>
      {/* サンプルカラー */}
      <ButtonToolbar aria-label="Toolbar with button groups" className='mt-4'>
        <ButtonGroup className="me-2" aria-label="First group">
          <Button variant="outline-secondary" size="sm" onClick={() => {handleToggleSampleColor()}}>{showSampleColor ? "hide" : "show"}</Button>
        </ButtonGroup>
      </ButtonToolbar>

      <Container className='border mt-3'>
        <Row {...getShowSampleColor()}>
          <DivSampleColors
            components={components} setComponents={setComponents}
            addComponent={addComponent} getColorStyle={getColorStyle}
            handleClick={handleClick} handleDragStart={handleDragStart} />
        </Row>
      </Container>
    </>
  );
};
