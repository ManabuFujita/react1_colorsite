"use client";

import { useState } from 'react';
import { Row, Container, ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import type { useColorEditor } from './useColorEditor';
import { getCurrentColor, handleToggleColorButton, getColorButtonStyle } from './ColorComponents';
import { ColorSpacePanel, colorSpaceConfigs } from './ColorSpacePanel';

type ColorEditorSectionProps = Pick<ReturnType<typeof useColorEditor>, 'components' | 'handleChangeRange'>;

/** RGB/HSV/HSL/CMYKの表示切り替えボタンと、各色空間の調整パネルをまとめたセクション。 */
export const ColorEditorSection = ({ components, handleChangeRange }: ColorEditorSectionProps) => {
  // 表示・非表示機能
  const [showColorSelector, setShowColorSelector] = useState<boolean>(true);

  const handleToggleColorSelector = () => {
    setShowColorSelector(!showColorSelector);
  }

  const getShowAllColorSelector = () => {
    return showColorSelector ? '' : {style: {display: 'none' }}
  }

  // 各色の表示・非表示
  const [showColorRGB, setShowColorRGB] = useState<boolean>(true);
  const [showColorHSV, setShowColorHSV] = useState<boolean>(true);
  const [showColorHSL, setShowColorHSL] = useState<boolean>(true);
  const [showColorCMYK, setShowColorCMYK] = useState<boolean>(true);

  return (
    <>
      {/* 設定ボタン */}
      <Row>

      </Row>

      {/* カラーバー */}
      <ButtonToolbar aria-label="Toolbar with button groups" className='mt-2'>
        <ButtonGroup className="me-2" aria-label="First group">
          <Button variant="outline-secondary" size="sm" onClick={() => {handleToggleColorSelector()}}>{showColorSelector ? "hide" : "show"}</Button>
        </ButtonGroup>
        <ButtonGroup className="me-2" aria-label="Second group"　{...getShowAllColorSelector()}>
          <Button variant="outline-primary" size="sm" className="hide-button" onClick={() => {handleToggleColorButton('button_rgb', showColorRGB, showColorHSV, showColorHSL, showColorCMYK, setShowColorRGB, setShowColorHSV, setShowColorHSL, setShowColorCMYK)}} {...getColorButtonStyle('button_rgb', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>RGB</Button>
          <Button variant="outline-primary" size="sm" className="hide-button" onClick={() => {handleToggleColorButton('button_hsv', showColorRGB, showColorHSV, showColorHSL, showColorCMYK, setShowColorRGB, setShowColorHSV, setShowColorHSL, setShowColorCMYK)}} {...getColorButtonStyle('button_hsv', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>HSV</Button>
          <Button variant="outline-primary" size="sm" className="hide-button" onClick={() => {handleToggleColorButton('button_hsl', showColorRGB, showColorHSV, showColorHSL, showColorCMYK, setShowColorRGB, setShowColorHSV, setShowColorHSL, setShowColorCMYK)}} {...getColorButtonStyle('button_hsl', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>HSL</Button>
          <Button variant="outline-primary" size="sm" className="hide-button" onClick={() => {handleToggleColorButton('button_cmyk', showColorRGB, showColorHSV, showColorHSL, showColorCMYK, setShowColorRGB, setShowColorHSV, setShowColorHSL, setShowColorCMYK)}} {...getColorButtonStyle('button_cmyk', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>CMYK</Button>
        </ButtonGroup>
      </ButtonToolbar>

      <Container className='border mt-3 color-bars' fluid="md">

        <Row {...getShowAllColorSelector()}>

          {/* 色変更バー(RGB/HSV/HSL/CMYK) */}
          {colorSpaceConfigs.map((config) => (
            <ColorSpacePanel
              key={config.id}
              config={config}
              color={getCurrentColor(components)}
              handleChangeRange={handleChangeRange}
              showColorRGB={showColorRGB}
              showColorHSV={showColorHSV}
              showColorHSL={showColorHSL}
              showColorCMYK={showColorCMYK}
            />
          ))}

        </Row>
      </Container>
    </>
  );
};
