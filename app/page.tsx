"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import { useColorEditor } from './components/useColorEditor';
import { DivColor } from './components/DivColor';
import { PageHeader } from './components/PageHeader';
import { NavMenu } from './components/NavMenu';
import { ColorEditorSection } from './components/ColorEditorSection';
import { SampleColorSection } from './components/SampleColorSection';
import { PatternSection } from './components/PatternSection';
import { PageFooter } from './components/PageFooter';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

const Wrapper = dynamic(() => import('./components/Wrapper'), { ssr: false });

/**
 * 配色パレットアプリのルートページ。
 * 色やカード枚数などの状態管理は {@link useColorEditor} に委譲し、ここでは画面全体のレイアウトを組み立てる。
 */
function App() {

  // メニューバー
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((s) => !s);

  const {
    components, setComponents,
    cardCount, setCardCount,
    appRef, headerRef, bodyRef, footerRef,
    resetPage,
    handleChangeRange,
    addComponent,
    getColorStyle,
    handleClick,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = useColorEditor();

  // ページロード時の処理
  useEffect(() => {
    console.log('load page')

    const onResize = () => {
      // 画面の高さを再計算
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);

  }, []);

  return (
    <>
    <Wrapper>

    <div className="App" ref={appRef}>

      <PageHeader headerRef={headerRef} resetPage={resetPage}
        addComponent={addComponent} getColorStyle={getColorStyle}
        handleClick={handleClick} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop} />

      <NavMenu show={show} toggleShow={toggleShow} />

      {/* body用の背景 */}
      <DivColor id='body-background'
        addComponent={addComponent} getColorStyle={getColorStyle}
        handleClick={handleClick} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop}></DivColor>

      {/* Body */}
      <Container className='mt-5 pt-5 body-main' ref={bodyRef}>
        <Row>
          {/* Col */}
          <Col xs={12} md={9}>
            <ColorEditorSection components={components} handleChangeRange={handleChangeRange} />
          </Col>

          {/* Col */}
          <Col xs={12} md={3}>
            <SampleColorSection components={components} setComponents={setComponents}
              addComponent={addComponent} getColorStyle={getColorStyle}
              handleClick={handleClick} handleDragStart={handleDragStart} />

            <PatternSection cardCount={cardCount} setCardCount={setCardCount}
              addComponent={addComponent} getColorStyle={getColorStyle}
              handleClick={handleClick} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop} />
          </Col>
        </Row>
      </Container>

      {/* フッター */}
      <Row className="m-5"/>

      <PageFooter footerRef={footerRef}
        addComponent={addComponent} getColorStyle={getColorStyle}
        handleClick={handleClick} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop} />

    </div>

    </Wrapper>
    </>
  );
}

export default App;
