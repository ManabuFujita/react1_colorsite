"use client";

import { Navbar, Container, Row, Col, Button } from 'react-bootstrap';
import type { useColorEditor } from './useColorEditor';
import { DivColor } from './DivColor';

type PageHeaderProps = Pick<ReturnType<typeof useColorEditor>,
  'headerRef' | 'resetPage' | 'addComponent' | 'getColorStyle' | 'handleClick' | 'handleDragStart' | 'handleDragOver' | 'handleDrop'
>;

/**
 * ヘッダー(サイトタイトル + Resetボタン)。
 * DivColorでラップしているため背景色も変更できる。
 */
export const PageHeader = ({ headerRef, resetPage, addComponent, getColorStyle, handleClick, handleDragStart, handleDragOver, handleDrop }: PageHeaderProps) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" id="header2" ref={headerRef}>
        <DivColor id='header' className="header pt-2 navbar-brand "
          addComponent={addComponent} getColorStyle={getColorStyle}
          handleClick={handleClick} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop}>
          <Container>
            <Row>
              <Col sm={2}>
                <Navbar.Brand>{ process.env.NEXT_PUBLIC_REACT_APP_TITLE }</Navbar.Brand>
              </Col>
              <Col className="ms-auto"></Col>
              <Col sm={1}>
                {/* localStorageのクリアボタンを右寄せで表示 */}
                <Button variant="outline-danger" className="float-right" onClick={() => {resetPage()}}>Reset</Button>
              </Col>
            </Row>
          </Container>
        </DivColor>
    </Navbar>
  );
};
