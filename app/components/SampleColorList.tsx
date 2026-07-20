"use client";

import { Container, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import type { useColorEditor } from './useColorEditor';
import { getSampleColors, getCurrentColor, removeComponent } from './ColorComponents';
import { getRGBCodeFromRGB, getHexCodeFromRGB, getHSLCodeFromRGB } from './ColorFunctions';
import { CopyButton } from './CopyButton';
import { Component } from '../types/Component';
import { Color } from '../types/Color';

const currentColorId = 'sample-color';

type SampleColorListProps = Pick<ReturnType<typeof useColorEditor>,
  'components' | 'setComponents' | 'addComponent' | 'getColorStyle' | 'handleClick' | 'handleDragStart'
>;

/**
 * 保存済みのサンプルカラー一覧を表示する。
 * 先頭は編集中の色(currentColor)で、+ボタンで新規サンプルとして保存できる。
 * それ以降は保存済みサンプルで、ドラッグして他の要素に色を適用できる。
 */
export const DivSampleColors = ({ components, setComponents, addComponent, getColorStyle, handleClick, handleDragStart }: SampleColorListProps) => {
  const currentColors = getSampleColors(components);

  const array: any = [];
  currentColors.forEach((component: Component) => {
    array.push(
      <Row key={ component.id }
           {...component.color.id === currentColorId
           ? {className: 'my-2 pb-3 border-bottom'}
           : {className: 'my-2'}}>

        <InputGroup className='sample-color-row'>

          <Container fluid="md">
            <Row className='sample-color justify-content-end justify-content-md-center'>

              {/* カラーバー */}
              { DivSampleColor({ component, color: component.color, components, setComponents, addComponent, getColorStyle, handleClick, handleDragStart }) }

            </Row>
          </Container>

          </InputGroup>
      </Row>
      );
  })

  return <>
    <Container className='my-2'>
      { array }
    </Container>
  </>;
}

type SampleColorProps = SampleColorListProps & {
  component: Component;
  color: Color;
};

/** サンプルカラー1件分の表示。スウォッチ・追加/削除ボタンに加え、選択中はRGB/HEX/HSLコードも表示する。 */
const DivSampleColor = ({ component, color, components, setComponents, addComponent, getColorStyle, handleClick, handleDragStart }: SampleColorProps) => {

  const id = color.id === currentColorId ? currentColorId : color.id;

  const addSampleCount = () => {
    // 新規追加時、色はサンプルと同じで、idを新規採番する
    let newColor = {...getCurrentColor(components)};
    const id = uuidv4();
    newColor.id = id;

    addComponent(id, newColor, false, true);
  }

  const removeSampleCount = (id: string) => {
    removeComponent(id, components, setComponents);
  }

  const style = getColorStyle(id);

  const showDetailCode = component.id === currentColorId || component.isClick;

  // styleを設定してdivタグに変換
  return <>
    <Col className="col color-count-button" xs={2} md={2}>
      {/* +, - ボタン */}
      {color.id === currentColorId
        ? <Button variant="outline-secondary" className="color-count-button-plus" onClick={() => addSampleCount()}>+</Button>
        : <Button variant="outline-secondary" className="color-count-button-minus" onClick={() => removeSampleCount(color.id)}>-</Button>}
    </Col>

    <Col className="col color-sample" xs={10} md={10}>
      <InputGroup.Text className='form-control sample-color'
        id={id}
        style={style}
        draggable='true'
        // 元実装では常にeがundefinedで渡っていた(handleClick内のpreventDefault/stopPropagationは実質未実行)。挙動を変えないためそのまま維持
        onDragStart={() => handleDragStart(undefined as any, id)}
        onClick={() => handleClick(undefined as any, id)} >
        {color.id === currentColorId
          ? 'Change color, then save with +'
          : 'drag and drop'}
      </InputGroup.Text>
    </Col>

    {/* 設定値のコード表示 */}
    { showDetailCode
      ? <>
          <Col className="col color-value rgb align-self-end" xs={2} md={2}></Col>
          <Col className="col color-value rgb align-self-end" xs={10} md={10}>
            <Form.Control placeholder="rgb" aria-label="rgb" id={'copy-button-rgb'+id} value={getRGBCodeFromRGB(color)} readOnly />
            <CopyButton copyText={getRGBCodeFromRGB(color)} inputId={'copy-button-rgb'+id} />
          </Col>
          <Col className="col color-value rgb align-self-end" xs={2} md={2}></Col>
          <Col className="col color-value hex" xs={10} md={10}>
            <Form.Control placeholder="hex" aria-label="hex" id={'copy-button-hex'+id} value={getHexCodeFromRGB(color)} readOnly />
            <CopyButton copyText={getHexCodeFromRGB(color)} inputId={'copy-button-hex'+id} />
          </Col>
          <Col className="col color-value rgb align-self-end" xs={2} md={2}></Col>
          <Col className="col color-value hsl" xs={10} md={10}>
            <Form.Control placeholder="hsl" aria-label="hsl" id={'copy-button-hsl'+id} value={getHSLCodeFromRGB(color)} readOnly />
            <CopyButton copyText={getHSLCodeFromRGB(color)} inputId={'copy-button-hsl'+id} />
          </Col>
        </>
      : <></>
    }


  </>;
};
