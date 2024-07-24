"use client";

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';


import { getRamdomColor } from './components/ColorFunctions';
import { getRGBCodeFromRGB, getHexCodeFromRGB, getHSLCodeFromRGB } from './components/ColorFunctions';

import { getSampleColors, getInitialComponents, getCurrentColor, getInitialComponentColor, 
  getMaxSampleColorNo, setOneRGBHSV, setRGB, 
  removeComponent,
  handleToggleColorButton,
  getColorButtonStyle,
  getShowColorSelector} from './components/ColorComponents';
import { addCard, getInitialCardCount, removeCard } from './components/CardComponents';
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
import { faPalette, faBrush } from "@fortawesome/free-solid-svg-icons";
import { ColorSelectors } from './components/ColorSelectors';

const Wrapper = dynamic(() => import('./components/Wrapper'), { ssr: false });
function App() {

  // メニューバー
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((s) => !s);

  const currentColorId = 'sample-color';



  const [components, setComponents] = useState<Component[]>(getInitialComponents());

  // const [currentColors, setCurrentColors] = useState<Color[]>(getInitialCurrentColors());

  const [cardCount, setCardCount] = useState<number>(getInitialCardCount());

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

  useEffect(() => {
      // localStrageに保存
      localStorage.setItem('components', JSON.stringify(components));

      // 画面の高さを再計算
      // setAppHeight(document.documentElement.clientHeight);
  }, [components]);

  useEffect(() => {
    // localStrageに保存
    localStorage.setItem('cardCount', JSON.stringify(cardCount));
  }, [cardCount]);

  

  const appRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);  
  const footerRef = useRef<HTMLDivElement>(null);


  // 設定をクリアする
  const resetPage = () => {
    // localStorage.clear();

    // setCardCount(getInitialCardCount());
    // setComponents(getInitialComponents());
    // setCurrentColors(getInitialCurrentColors());



    // componentsのcolorを全て初期化する
    components.map((component) => {
      component.color = getInitialComponentColor(component.id);
      console.log(component)
    });

    // cardcountを初期化する
    setCardCount(1);
  }



  const handleChangeRange = (e: React.ChangeEvent<HTMLInputElement>, colorName: string) => {
    const colorValue = Number(e.target.value);

    // console.log(colorValue);

    const clickedComonent = components.find((component) => component.isClick);

    if (clickedComonent === undefined) {
      // 色の設定値を変更(currentColorのみ)
      setOneRGBHSV(colorName, colorValue, currentColorId, components, setComponents);
    } else {
      // 色の設定値を変更(clickcomponentとcurrentColorの両方)
      setOneRGBHSV(colorName, colorValue, clickedComonent.id, components, setComponents);
    }
  }




  const changeClickedColor = () => {

    // console.log(getCurrentColor())

    const deepCopy = components.map((component) => ({ ...component }));
    // console.log(deepCopy);

    const newComponents = deepCopy.map((component) => {
      if (component.isClick) {
        component.color = getCurrentColor(components);
      }
      if (component.id === currentColorId) {
        // console.log('match')
        component.color = getCurrentColor(components);
      }
      return component;
    });

    setComponents(newComponents);
  }



  const addComponent = (id: string, 
    color: Color = getRamdomColor(uuidv4()), 
    isCurrentColor: boolean = false, 
    isSampleColor: boolean = false,) => {
      
    // idを検索して、無ければオブジェクトを作成する
    let component;
    component = components.find((component) => component.id === id);


    // console.log('addComponent id:' + id)

    if (component === undefined) {
      //新しいComponent作成
      const newComponent: Component = {
        id: id,
        isCurrentColor: isCurrentColor,
        isSampleColor: isSampleColor,
        isHover: false,
        isClick: false,
        isDrag: false,
        color: color,
        sampleColorNo: isSampleColor ? getMaxSampleColorNo(components) + 1 : -1,
      };

      setComponents([...components, newComponent]);
    }
  }

  // const removeComponent = (id: string) => {
  //   const newComponents = components.filter((component) => component.id !== id);
      
  //   setComponents(newComponents);
  // }

  const getColorStyle = (id: string) => {

    // componentを検索
    const component = components.find((component) => component.id === id);

    let style = {
      backgroundColor: 'gray', // 初期値
      borderRadius: '0%',
    };
    if (component !== undefined) {
      style.backgroundColor = getHexCodeFromRGB(component.color);

      if (component.isClick) {
        // クリック時のstyleを追加
        Object.assign(style, { 
          border: "solid",
          borderColor: "red",
        });
      } else if (component.isHover) {
        // ホバー時のstyleを追加
        // Object.assign(style, { 
        //   border: "solid",
        //   borderColor: "red",
        //   cursor: "pointer",
        // });
      }

      // 背景色が暗いときは、文字色を明るくする
      if (component.color.hsl_l < 0.65) {
        Object.assign(style, { 
          color: "white",
        });
      }

      // body-backgroundの場合、高さを再計算してセットする
      if (id === 'body-background') {
        const headerHeight = headerRef.current === null ? 0 : headerRef.current.clientHeight;
        const footerHeight = footerRef.current === null ? 0 : footerRef.current.clientHeight;
        const appHeight = appRef.current === null ? 0 : appRef.current.clientHeight;
        const bodyHeight = appHeight - (headerHeight + 12);
        // const bodyHeight = bodyRef.current === null ? 0 : bodyRef.current.clientHeight;

        console.log('appHeight:' + appHeight)
        console.log('headerHeight:' + headerHeight)
        console.log('footerHeight:' + footerHeight)
        console.log('bodyHeight:' + bodyHeight)

        Object.assign(style, { 
          top: headerHeight,
          minHeight: bodyHeight,
        });
      }
    }
    return style;
  }

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
            <CardText>select and change color</CardText>
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


  // click動作取得
  const handleClick = (e: React.MouseEvent<HTMLElement>, id: string) => {
    
    console.log('clickStart:' + id)

    const deepCopy = components.map((component) => ({ ...component }));
    const newComponents = deepCopy.map((component) => {
      
      // クリック時はhoverを解除
      component.isHover = false;

      if (component.id === id) {
        component.isClick = !component.isClick; // トグル操作

        // 選択したコンポーネントの色を入力欄にセット
        setRGB(component.color, components, setComponents);

      } else {
        component.isClick = false;
      }

      return component;
    });

    setComponents(newComponents);


    if (e !== undefined) {
      e.preventDefault();
      e.stopPropagation(); // 親要素への伝播を停止
    }

  }

  const handleClickClear = () => {

    const deepCopy = components.map((component) => ({ ...component }));
    const newComponents = deepCopy.map((component) => {
      
      // クリック時はhoverを解除
      component.isHover = false;

      component.isClick = false;

      return component;
    });

    setComponents(newComponents);
  }

  // hover動作取得
  const handleHover = (id: string, isHover: boolean) => {
    isHover 
    ? console.log('hoverStart:' + id)
    : console.log('hoverEnd:' + id)

    const deepCopy = components.map((component) => ({ ...component }));
    // console.log(deepCopy);

    const newComponents = deepCopy.map((component) => {
      if (component.id === id) {
        component.isHover = isHover;
      } else {
        component.isHover = false;
      }
      return component;
    });

    setComponents(newComponents);
  }

  let draggingColorId: string;

  const handleDragStart = (e: React.DragEvent<HTMLElement>, id: string) => {
    console.log('drag start');
    // e.dataTransfer.effectAllowed = "copy";
    // e.dataTransfer.setData("text/plain", id);

    // ドラッグ状態に変更
    console.log(id);
    draggingColorId = id;
    console.log(draggingColorId);
  }

  const handleDragOver = (e: React.DragEvent<HTMLElement>, id: string) =>{
    // ToDo:ドロップ可能な場所のみ、preventするようにしたい
    // ↓参照
    // https://developer.mozilla.org/ja/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#draggableattribute
    e.preventDefault();
  }

  const handleDrop = (e: React.DragEvent<HTMLElement>, id: string) => {
    console.log('drop:' + id)
    // console.log(e.currentTarget.id);
    // console.log(e);
    // console.log(e.dataTransfer.getData("text/plain"));

    console.log('---')
    console.log(getCurrentColor(components))
    console.log(draggingColorId)

    // ドラッグした色を取得
    const dragColor = components.find((currentColor) => currentColor.id === draggingColorId)?.color
    console.log(dragColor)

    if (dragColor !== undefined) {
      const deepCopy = components.map((component) => ({ ...component }));
      const newComponents = deepCopy.map((component) => {
        if (component.id === id) {
          component.color = dragColor;
        } 
        return component;
      });

      setComponents(newComponents);
    }

    // e.dataTransfer.clearData('colorId');
    // e.preventDefault(); // ブラウザの挙動をキャンセル
    return;
  }

  
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
            ? 'change color, save with +' 
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
                <Button variant="outline-primary" size="sm" onClick={() => {handleToggleColorButton('button_rgb', showColorRGB, showColorHSV, showColorHSL, showColorCMYK, setShowColorRGB, setShowColorHSV, setShowColorHSL, setShowColorCMYK)}} {...getColorButtonStyle('button_rgb', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>RGB</Button>
                <Button variant="outline-primary" size="sm" onClick={() => {handleToggleColorButton('button_hsv', showColorRGB, showColorHSV, showColorHSL, showColorCMYK, setShowColorRGB, setShowColorHSV, setShowColorHSL, setShowColorCMYK)}} {...getColorButtonStyle('button_hsv', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>HSV</Button>
                <Button variant="outline-primary" size="sm" onClick={() => {handleToggleColorButton('button_hsl', showColorRGB, showColorHSV, showColorHSL, showColorCMYK, setShowColorRGB, setShowColorHSV, setShowColorHSL, setShowColorCMYK)}} {...getColorButtonStyle('button_hsl', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>HSL</Button>
                <Button variant="outline-primary" size="sm" onClick={() => {handleToggleColorButton('button_cmyk', showColorRGB, showColorHSV, showColorHSL, showColorCMYK, setShowColorRGB, setShowColorHSV, setShowColorHSL, setShowColorCMYK)}} {...getColorButtonStyle('button_cmyk', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>CMYK</Button>
              </ButtonGroup>
            </ButtonToolbar>

            <Container className='border mt-3 color-bars' fluid="md">

              {/* <Button variant="outline-secondary" size="sm" onClick={() => {handleToggleColorSelector()}}>{showColorSelector ? "隠す" : "表示"}</Button> */}
              <Row {...getShowAllColorSelector()}>

                {/* 色変更バー */}
                {/* RGB */}
                <Col {...getShowColorSelector('rgb', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>
                  <Row className="my-2" id="rgb">

                    <Row className='my-2'>
                      <Col xs='auto'>
                        <FontAwesomeIcon icon={faPalette} />
                        <span className='color-space-name'>RGB</span>
                      </Col>
                    </Row>

                      <ColorSelectors 
                        text='R'
                        id='rgb-r'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).r)}
                        colorRange={getCurrentColor(components).r}
                        handleChangeRange={(e) => handleChangeRange(e, 'r')}
                        min={0}
                        max={255}
                        step={1}
                      />

                      <ColorSelectors 
                        text='G'
                        id='rgb-g'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).g)}
                        colorRange={getCurrentColor(components).g}
                        handleChangeRange={(e) => handleChangeRange(e, 'g')}
                        min={0}
                        max={255}
                        step={1}
                      />

                    <ColorSelectors 
                        text='B'
                        id='rgb-b'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).b)}
                        colorRange={getCurrentColor(components).b}
                        handleChangeRange={(e) => handleChangeRange(e, 'b')}
                        min={0}
                        max={255}
                        step={1}
                    />

                  </Row>
                </Col>

                {/* HSV */}
                <Col {...getShowColorSelector('hsv', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>
                  <Row className="my-2" id="hsv">

                    <Row className='my-2'>
                      <Col xs='auto'>
                        <FontAwesomeIcon icon={faPalette} />
                        <span className='color-space-name'>HSV</span>
                      </Col>
                    </Row>

                      <ColorSelectors 
                        text='H(色相)'
                        id='hsv-h'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).hsv_h)}
                        colorRange={getCurrentColor(components).hsv_h}
                        handleChangeRange={(e) => handleChangeRange(e, 'hsv_h')}
                        min={0}
                        max={359}
                        step={0.0001}
                      />

                      <ColorSelectors 
                        text='S(彩度)'
                        id='hsv-s'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).hsv_s * 1000) / 1000}
                        colorRange={getCurrentColor(components).hsv_s}
                        handleChangeRange={(e) => handleChangeRange(e, 'hsv_s')}
                        min={0.0001}
                        max={1.001}
                        step={0.001}
                      />

                      <ColorSelectors 
                        text='V(明度)'
                        id='hsv-v'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).hsv_v * 1000) / 1000}
                        colorRange={getCurrentColor(components).hsv_v}
                        handleChangeRange={(e) => handleChangeRange(e, 'hsv_v')}
                        min={0.0001}
                        max={1.001}
                        step={0.001}
                      />

                  </Row>
                </Col>

                {/* HSL */}
                <Col {...getShowColorSelector('hsl', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>
                  <Row className="my-2" id="hsl">

                    <Row className='my-2'>
                      <Col xs='auto'>
                        <FontAwesomeIcon icon={faPalette} />
                        <span className='color-space-name'>HSL</span>
                      </Col>
                    </Row>

                    <ColorSelectors 
                        text='H(色相)'
                        id='hsl-h'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).hsl_h)}
                        colorRange={getCurrentColor(components).hsl_h}
                        handleChangeRange={(e) => handleChangeRange(e, 'hsl_h')}
                        min={0}
                        max={359}
                        step={0.0001}
                      />

                    <ColorSelectors 
                        text='S(彩度)'
                        id='hsl-s'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).hsl_s * 1000) / 1000}
                        colorRange={getCurrentColor(components).hsl_s}
                        handleChangeRange={(e) => handleChangeRange(e, 'hsl_s')}
                        min={0.0001}
                        max={1.001}
                        step={0.001}
                      />

                    <ColorSelectors 
                        text='L(輝度)'
                        id='hsl-l'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).hsl_l * 1000) / 1000}
                        colorRange={getCurrentColor(components).hsl_l}
                        handleChangeRange={(e) => handleChangeRange(e, 'hsl_l')}
                        min={0.0001}
                        max={1.001}
                        step={0.001}
                      />
                  </Row>
                </Col>

                {/* CMYK */}
                <Col {...getShowColorSelector('cmyk', showColorRGB, showColorHSV, showColorHSL, showColorCMYK)}>
                  <Row className="my-2" id="cmyk">

                    <Row className='my-2'>
                      <Col xs='auto'>
                        <FontAwesomeIcon icon={faPalette} />
                        <span className='color-space-name'>CMYK</span>
                      </Col>
                    </Row>

                    <ColorSelectors 
                        text='C'
                        id='cmyk-c'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).cmyk_c * 100)}
                        colorRange={getCurrentColor(components).cmyk_c}
                        handleChangeRange={(e) => handleChangeRange(e, 'cmyk_c')}
                        min={0.0001}
                        max={1.001}
                        step={0.001}
                      />

                    <ColorSelectors 
                        text='M'
                        id='cmyk-m'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).cmyk_m * 100)}
                        colorRange={getCurrentColor(components).cmyk_m}
                        handleChangeRange={(e) => handleChangeRange(e, 'cmyk_m')}
                        min={0.0001}
                        max={1.001}
                        step={0.001}
                      />

                    <ColorSelectors 
                        text='Y'
                        id='cmyk-y'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).cmyk_y * 100)}
                        colorRange={getCurrentColor(components).cmyk_y}
                        handleChangeRange={(e) => handleChangeRange(e, 'cmyk_y')}
                        min={0.0001}
                        max={1.001}
                        step={0.001}
                      />

                    <ColorSelectors 
                        text='K'
                        id='cmyk-k'
                        color={getCurrentColor(components)}
                        colorValue={Math.trunc(getCurrentColor(components).cmyk_k * 100)}
                        colorRange={getCurrentColor(components).cmyk_k}
                        handleChangeRange={(e) => handleChangeRange(e, 'cmyk_k')}
                        min={0.0001}
                        max={1.001}
                        step={0.001}
                      />


                  </Row>
                </Col>

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
                        <span>&copy; 2024 My SPA Site. All rights reserved.</span>
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
