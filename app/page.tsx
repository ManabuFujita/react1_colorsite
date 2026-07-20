"use client";

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';


import { getRGBCodeFromRGB, getHexCodeFromRGB, getHSLCodeFromRGB } from './components/ColorFunctions';

import { getSampleColors, getCurrentColor, getInitialComponentColor,
  removeComponent,
  handleToggleColorButton,
  getColorButtonStyle} from './components/ColorComponents';
import { addCard, removeCard } from './components/CardComponents';
import { useColorEditor } from './components/useColorEditor';
import { Component } from './types/Component';
import { Color } from './types/Color';


import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Offcanvas, Button, Row, Col, InputGroup, Card, CardHeader, CardBody, CardText, ButtonToolbar, ButtonGroup, Form, NavbarBrand } from 'react-bootstrap';


import copy from "clipboard-copy"
import { v4 as uuidv4 } from 'uuid';
// import { get } from 'http';
// import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faBrush } from "@fortawesome/free-solid-svg-icons";
import { ColorSpacePanel, colorSpaceConfigs } from './components/ColorSpacePanel';

const Wrapper = dynamic(() => import('./components/Wrapper'), { ssr: false });
function App() {

  // メニューバー
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((s) => !s);

  const currentColorId = 'sample-color';

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

  const DivColor = ({...props}) => {
    console.log('DivColor')

    // console.log(props.class)

    const id = String(props.id);

    useEffect(() => {
      // idを検索して、無ければオブジェクトを作成する
      // if (id === 'body-background') {
        addComponent(id, getInitialComponentColor(id));
      // } else {
      //   addComponent(id);
      // }

    }, [id, props]);

    const style = getColorStyle(id);

    const className = 'color-change can-select ' + props.className;

    // styleを設定してdivタグに変換
    return <div 
      id={id} 
      style={style} 
      className={className}

        // onMouseEnter={() => handleHover(id, true)} 
        // onMouseLeave={() => handleHover(id, false)} 
        
      onClick={(e) => handleClick(e, id)} 
      onDragStart={(e) => handleDragStart(e, id)} 
      // onDragEnd={(e) => handleDrag(id, false)} 
      onDragOver={(e) => handleDragOver(e, id)} 
      onDrop={(e) => handleDrop(e, id)} 
      >
        { props.children }
      </div>
  };

  
  // カード
  const DivCard = ({...props}) => {
    // const id = String(props.id);

    // const className = 'card-change';

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
        {/* <Card className='h-100' > */}
        <Card className='' >
          <CardHeader className='can-select' 
            onClick={(e) => handleClick(e, idHeader)} 
            onDragStart={(e) => handleDragStart(e, idHeader)} 
            // onDragEnd={(e) => handleDrag(idHeader, false)} 
            onDragOver={(e) => handleDragOver(e, idHeader)} 
            onDrop={(e) => handleDrop(e, idHeader)} 
            id={'card-header-' + (i + 1).toString()} 
            style={styleHeader} >
            <CardText>Header</CardText>
          </CardHeader>

          <CardBody className='can-select' 
            onClick={(e) => handleClick(e, idBody)} 
            onDragStart={(e) => handleDragStart(e, idBody)} 
            // onDragEnd={(e) => handleDrag(idBody, false)} 
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
            // onDragEnd={(e) => handleDrag(idBody, false)} 
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

    // const html = <div className="row row-cols-1 row-cols-md-4 g-4">{cards}</div>;
    const html = <div className="row row-cols-1 g-4">{cards}</div>;

    // styleを設定してdivタグに変換
    return html;
  };


  // const inputValueRef = useRef();

  const CopyButton = ({ copyText, inputId }: { copyText: string, inputId: string }) => {
    const [isCopied, setIsCopied] = useState(false)
  
    const handleCopy = () => {
      // const elem = document.getElementById(id);
      // elem?.select();
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input !== null) {
        input.focus();
        input.select();
      }


      copy(copyText).then(() => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      })
    }
  
    return (
      
      <Button disabled={isCopied} onClick={handleCopy} className='copy-button' variant="outline-secondary">
        {/* {isCopied ? "Copied!" : "Copy"} */}
        {/* <i class="fa-solid fa-copy"></i> */}
        <FontAwesomeIcon icon={faCopy} />
      </Button>
    )
  }

  const DivSampleColors = ({...props}) => {
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
                { DivSampleColor({...props}, component, component.color) } 

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

  const DivSampleColor = ({...props}, component: Component, color: Color) => {

    const id = color.id === currentColorId ? currentColorId : color.id;

    useEffect(() => {
      // idを検索して、無ければオブジェクトを作成する
      // addComponent(id, color, id === currentColorId, true);
    }, [id, props]);


    const addSampleCount = (e: React.MouseEvent<HTMLElement>) => {
      // 新規追加時、色はサンプルと同じで、idを新規採番する
      let newColor = {...getCurrentColor(components)};
      const id = uuidv4();
      newColor.id = id;

      addComponent(id, newColor, false, true);

      if (e !== undefined) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    const removeSampleCount = (e: React.MouseEvent<HTMLElement>, id: string) => {

      removeComponent(id, components, setComponents);

      if (e !== undefined) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    const style = getColorStyle(id);

    const showDetailCode = component.id === currentColorId || component.isClick;

    // styleを設定してdivタグに変換
    return <>
      <Col className="col color-count-button" xs={2} md={2}>
        {/* +, - ボタン */}
        {color.id === currentColorId 
          ? <Button variant="outline-secondary" className="color-count-button-plus" onClick={() => addSampleCount(props.e)}>+</Button> 
          : <Button variant="outline-secondary" className="color-count-button-minus" onClick={() => removeSampleCount(props.e, color.id)}>-</Button>}
      </Col>

      <Col className="col color-sample" xs={10} md={10}>
        <InputGroup.Text className='form-control sample-color' 
          id={id} 
          style={style} 
          draggable='true' 
          onDragStart={() => handleDragStart(props.e, id)} 
          onClick={() => handleClick(props.e, id)} >
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


    </>
  };

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
            <DivColor id='header' className="header pt-2 navbar-brand ">
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
        <DivColor id='body-background'></DivColor>


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
                  <DivSampleColors />
                </Row>
              </Container>

              {/* Pattern */}
              <Row className="mt-5" id="card" >
                <Col sm={12}>
                  <Button variant="outline-secondary" size="sm" className='button-card' onClick={() => removeCard(cardCount, setCardCount)}>-</Button>
                  <span className='mx-2'>Pattern</span>
                  <Button variant="outline-secondary" size="sm" className='button-card' onClick={() => addCard(cardCount, setCardCount)}>+</Button>
                </Col>
                <DivCard />
              </Row>

            </Col>
          </Row>
        </Container>

        {/* フッター */}
        <Row className="m-5"/>

        <Navbar expand="lg" fixed="bottom" className='footer' ref={footerRef}>
          

            {/* <Navbar.Collapse className="justify-content-center"> */}
              {/* <Navbar.Text> */}
                <DivColor id='footer'>
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
