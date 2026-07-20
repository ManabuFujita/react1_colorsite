"use client";

import { Navbar, Container, Row, Col } from 'react-bootstrap';
import type { useColorEditor } from './useColorEditor';
import { DivColor } from './DivColor';

type PageFooterProps = Pick<ReturnType<typeof useColorEditor>,
  'footerRef' | 'addComponent' | 'getColorStyle' | 'handleClick' | 'handleDragStart' | 'handleDragOver' | 'handleDrop'
>;

/** フッター(コピーライト表記)。DivColorでラップしているため背景色も変更できる。 */
export const PageFooter = ({ footerRef, addComponent, getColorStyle, handleClick, handleDragStart, handleDragOver, handleDrop }: PageFooterProps) => {
  return (
    <Navbar expand="lg" fixed="bottom" className='footer' ref={footerRef}>
        <DivColor id='footer'
          addComponent={addComponent} getColorStyle={getColorStyle}
          handleClick={handleClick} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop}>
          <Container>
            <Row>
              <Col className="ms-auto"></Col>
              <Col md={4}>
                <span>&copy; 2024 Design Palette. All rights reserved.</span>
              </Col>
              <Col className="ms-auto"></Col>
            </Row>
          </Container>
        </DivColor>
    </Navbar>
  );
};
