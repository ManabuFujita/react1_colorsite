"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';


import { getCurrentColor,
  handleToggleColorButton,
  getColorButtonStyle} from './components/ColorComponents';
import { addCard, removeCard } from './components/CardComponents';
import { useColorEditor } from './components/useColorEditor';


import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Offcanvas, Button, Row, Col, ButtonToolbar, ButtonGroup } from 'react-bootstrap';

// import { get } from 'http';
// import InputGroupText from 'react-bootstrap/esm/InputGroupText';

import { faBrush } from "@fortawesome/free-solid-svg-icons";
import { ColorSpacePanel, colorSpaceConfigs } from './components/ColorSpacePanel';
import { DivColor } from './components/DivColor';
import { DivCard } from './components/DivCard';
import { DivSampleColors } from './components/SampleColorList';

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
    changeClickedColor,
    addComponent,
    getColorStyle,
    handleClick,
    handleClickClear,
    handleHover,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = useColorEditor();

  // const [appHeight, setAppHeight] = useState<number>(document.documentElement.clientHeight);

  // ページロード時の処理
  useEffect(() => {
    console.log('load page')

    // setComponents(getInitialComponents());

    const onResize = () => {
      // 画面の高さを再計算
      // setAppHeight(window.innerHeight);
      // setAppHeight(document.documentElement.clientHeight);
      // console.log('appHeight:' + appHeight)
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);


  }, []);

  // useEffect(() => {
  //   // 選択箇所の色、サンプルも変更する
  //   changeClickedColor();

  //   // localStrageに保存
  //   localStorage.setItem('currentColors', JSON.stringify(currentColors));
  // }, [currentColors]);

  // 表示・非表示機能
  const [showColorSelector, setShowColorSelector] = useState<boolean>(true);
  const [showSampleColor, setShowSampleColor] = useState<boolean>(true);

  const handleToggleColorSelector = () => {
    setShowColorSelector(!showColorSelector);
  }

  const getShowAllColorSelector = () => {
    return showColorSelector ? '' : {style: {display: 'none' }}
  }

  const handleToggleSampleColor = () => {
    setShowSampleColor(!showSampleColor);
  }

  const getShowSampleColor = () => {
    return showSampleColor ? '' : {style: {display: 'none' }}
  }


  // 各色の表示・非表示
  const [showColorRGB, setShowColorRGB] = useState<boolean>(true);
  const [showColorHSV, setShowColorHSV] = useState<boolean>(true);
  const [showColorHSL, setShowColorHSL] = useState<boolean>(true);
  const [showColorCMYK, setShowColorCMYK] = useState<boolean>(true);

  return (
    <>
    <Wrapper>

    <div className="App" ref={appRef}>


      {/* <BrowserRouter> */}

        {/* ヘッダー */}
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



        <Offcanvas show={show} onHide={toggleShow} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>My SPA Site</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/*" onClick={toggleShow}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about" onClick={toggleShow}>
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" onClick={toggleShow}>
                Contact
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

      
        {/* body用の背景 */}
        <DivColor id='body-background'
          addComponent={addComponent} getColorStyle={getColorStyle}
          handleClick={handleClick} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop}></DivColor>


        {/* Body */}
        <Container className='mt-5 pt-5 body-main' ref={bodyRef}>
          <Row>
            {/* Col */}
            <Col xs={12} md={9}>

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

              {/* <Button variant="outline-secondary" size="sm" onClick={() => {handleToggleColorSelector()}}>{showColorSelector ? "隠す" : "表示"}</Button> */}
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




            </Col>

            {/* Col */}
            <Col xs={12} md={3}>

              
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

              {/* Pattern */}
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

            </Col>
          </Row>
        </Container>

        {/* フッター */}
        <Row className="m-5"/>

        <Navbar expand="lg" fixed="bottom" className='footer' ref={footerRef}>
          

            {/* <Navbar.Collapse className="justify-content-center"> */}
              {/* <Navbar.Text> */}
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
              {/* </Navbar.Text> */}
            {/* </Navbar.Collapse> */}


        </Navbar>
        
      {/* </BrowserRouter> */}

    </div>

    </Wrapper>
    </>
  );
}

export default App;
