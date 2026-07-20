"use client";

import { Card, CardHeader, CardBody, CardText } from 'react-bootstrap';
import type { useColorEditor } from './useColorEditor';

type DivCardProps = Pick<ReturnType<typeof useColorEditor>,
  'addComponent' | 'getColorStyle' | 'handleClick' | 'handleDragStart' | 'handleDragOver' | 'handleDrop'
> & {
  cardCount: number;
};

/**
 * Header/Body/Footerの3段構成のカードを`cardCount`件分表示する。
 * 各カードはクリックで選択、ドラッグ&ドロップで色を変更できる。
 */
export const DivCard = ({ cardCount, addComponent, getColorStyle, handleClick, handleDragStart, handleDragOver, handleDrop }: DivCardProps) => {
  let cards;
  for (let i = 0; i < cardCount; i++) {
    const idHeader = 'card-header-' + (i + 1).toString();
    const idBody = 'card-body-' + (i + 1).toString();
    const idFooter = 'card-footer-' + (i + 1).toString();

    addComponent(idHeader);
    addComponent(idBody);
    addComponent(idFooter);
    const styleHeader = getColorStyle(idHeader);
    const styleBody = getColorStyle(idBody);
    const styleFooter = getColorStyle(idFooter);

    const card = <div className="col">
      <Card className='' >
        <CardHeader className='can-select'
          onClick={(e) => handleClick(e, idHeader)}
          onDragStart={(e) => handleDragStart(e, idHeader)}
          onDragOver={(e) => handleDragOver(e, idHeader)}
          onDrop={(e) => handleDrop(e, idHeader)}
          id={'card-header-' + (i + 1).toString()}
          style={styleHeader} >
          <CardText>Header</CardText>
        </CardHeader>

        <CardBody className='can-select'
          onClick={(e) => handleClick(e, idBody)}
          onDragStart={(e) => handleDragStart(e, idBody)}
          onDragOver={(e) => handleDragOver(e, idBody)}
          onDrop={(e) => handleDrop(e, idBody)}
          id={'card-body-' + (i + 1).toString()}
          style={styleBody} >
          <CardText>Body</CardText>
          <CardText>Select to change color</CardText>
        </CardBody>

        <Card.Footer className='can-select'
          onClick={(e) => handleClick(e, idBody)}
          onDragStart={(e) => handleDragStart(e, idBody)}
          onDragOver={(e) => handleDragOver(e, idBody)}
          onDrop={(e) => handleDrop(e, idBody)}
          id={'card-footer-' + (i + 1).toString()}
          style={styleFooter} >
          <CardText>Footer</CardText>
        </Card.Footer>
      </Card>
    </div>;


    if (cards === undefined) {
      cards = card;
    } else {
      cards = <>{cards}{card}</>;
    }
  }

  // styleを設定してdivタグに変換
  return <div className="row row-cols-1 g-4">{cards}</div>;
};
