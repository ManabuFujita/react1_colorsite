import React, { useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';

import Color from './Color';

import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Link, Routes, redirect } from 'react-router-dom';
import { Container, Navbar, Nav, Offcanvas, Button, Row, Col, InputGroup, Card, CardHeader, CardBody, CardText } from 'react-bootstrap';
import { CompletionInfoFlags } from 'typescript';

import { createUseStyles } from "react-jss";  
import { deflate } from 'zlib';
import copy from "clipboard-copy"


function App() {

  // メニューバー
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((s) => !s);

  const sampleColorId = 'sample-color';

  // RGB to HSV
  const getHSV_H = (color: Color) => {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    
    // 本当は0を返したいけど、0に初期化されてしまうため、計算エラーにする
    // if (max === min) {
    //   return 0.001;
    // }

    let h = 0;
    switch (max) {
      case color.r:
        h = 60 * ((color.g - color.b) / (max - min));
        break;

      case color.g:
        h = 60 * ((color.b - color.r) / (max - min)) + 120;
        break;

      case color.b:
        h = 60 * ((color.r - color.g) / (max - min)) + 240;
        break;

      default:
        break; 
    }

    if (h < 0) {
      h += 360;
    }

    return h;
  }

  const getHSV_S = (color: Color) => {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    const s = (max - min) / max;
    return s;
  }

  const getHSV_V = (color: Color) => {
    const max = Math.max(color.r, color.g, color.b);
    const v = (max / 255);
    return v;
  }

  const RGB2HSV = (color: Color) => {
    color['hsv_h'] = getHSV_H(color);
    color['hsv_s'] = getHSV_S(color);
    color['hsv_v'] = getHSV_V(color);
    return color;
  }

  // RGB to HSL
  const getHSL_H = (color: Color) => {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);

    // 本当は0を返したいけど、0に初期化されてしまうため、計算エラーにする
    // if (max === min) {
    //   return 0.001;
    // }

    let h = 0;
    switch (max) {
      case color.r:
        h = 60 * ((color.g - color.b) / (max - min));
        break;

      case color.g:
        h = 60 * ((color.b - color.r) / (max - min)) + 120;
        break;

      case color.b:
        h = 60 * ((color.r - color.g) / (max - min)) + 240;
        break;

      default:
        break; 
    }

    if (h < 0) {
      h += 360;
    }

    return h;
  }

  const getHSL_S = (color: Color) => {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);

    let cnt = (max + min) / 2;
    let s = 0;
    if (cnt <= 127) {
      s = (cnt - min) / cnt;
    } else {
      s = (max - cnt) / (255.001 - cnt);
    }
    return s;
  }

  const getHSL_L = (color: Color) => {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    const l = (max + min) / (2 * 255);
    return l;
  }

  const RGB2HSL = (color: Color) => {
    color['hsl_h'] = getHSL_H(color);
    color['hsl_s'] = getHSL_S(color);
    color['hsl_l'] = getHSL_L(color);
    return color;
  }

  // HSV to RGB
  const HSV2RGB = (color: Color) => {
    const max = color.hsv_v * 255;
    const min = max - (color.hsv_s * max);

    let r, g, b;
    if (color.hsv_h <= 60) {
      r = max;
      g = (color.hsv_h / 60) * (max - min) + min;
      b = min;
    } else if (color.hsv_h <= 120) {
      r = ((120 - color.hsv_h) / 60) * (max - min) + min;
      g = max;
      b = min;
    } else if (color.hsv_h <= 180) {
      r = min;
      g = max;
      b = ((color.hsv_h - 120) / 60) * (max - min) + min;
    } else if (color.hsv_h <= 240) {
      r = min;
      g = ((240 - color.hsv_h) / 60) * (max - min) + min;
      b = max;
    } else if (color.hsv_h <= 300) {
      r = ((color.hsv_h - 240) / 60) * (max - min) + min;
      g = min;
      b = max;
    } else {
      r = max;
      g = min;
      b = ((360 - color.hsv_h) / 60) * (max - min) + min;
    }

    color['r'] = r;
    color['g'] = g;
    color['b'] = b;

    return color;
  }

  // HSL to RGB
  const HSL2RGB = (color: Color) => {
    let min, max;
    if (color.hsl_l < 0.49) {
      max = 255 * (color.hsl_l + color.hsl_l * (color.hsl_s / 1));
      min = 255 * (color.hsl_l - color.hsl_l * (color.hsl_s / 1));
    } else {
      max = 255 * (color.hsl_l + (1 - color.hsl_l) * (color.hsl_s / 1));
      min = 255 * (color.hsl_l - (1 - color.hsl_l) * (color.hsl_s / 1));
    }

    let r, g, b;
    if (color.hsl_h <= 60) {
      r = max;
      g = (color.hsl_h / 60) * (max - min) + min;
      b = min;
    } else if (color.hsl_h <= 120) {
      r = ((120 - color.hsl_h) / 60) * (max - min) + min;
      g = max;
      b = min;
    } else if (color.hsl_h <= 180) {
      r = min;
      g = max;
      b = ((color.hsl_h - 120) / 60) * (max - min) + min;
    } else if (color.hsl_h <= 240) {
      r = min;
      g = ((240 - color.hsl_h) / 60) * (max - min) + min;
      b = max;
    } else if (color.hsl_h <= 300) {
      r = ((color.hsl_h - 240) / 60) * (max - min) + min;
      g = min;
      b = max;
    } else {
      r = max;
      g = min;
      b = ((360 - color.hsl_h) / 60) * (max - min) + min;
    }

    color['r'] = r;
    color['g'] = g;
    color['b'] = b;

    return color;
  }

  // 色
  const getRamdomColor = () => {
    // 新しいColor作成
    const tempColor: Color = {
      r: Math.trunc(Math.random() * 255),
      g: Math.trunc(Math.random() * 255),
      b: Math.trunc(Math.random() * 255),
      hsv_h: 0,
      hsv_s: 0,
      hsv_v: 0,
      hsl_h: 0,
      hsl_s: 0,
      hsl_l: 0,
    };

    let newColor = RGB2HSV(tempColor);
    newColor = RGB2HSL(tempColor);

    return newColor;
  }

  type ColorObject = {
    [key: string]: number;
  }

  type Color = ColorObject & {
      r: number;
      g: number;
      b: number;
      hsv_h: number;
      hsv_s: number;
      hsv_v: number;
      hsl_h: number;
      hsl_s: number;
      hsl_l: number;
  };

  const [currentColor, setCurrentColor] = useState<Color>(getRamdomColor());
  // const [currentColor, setCurrentColor] = useState<Color>({r: 110, g: 120, b: 130, h: 200, s: 0.5, v: 0.7});

  useEffect(() => {

    // 選択箇所の色、サンプルも変更する
    changeClickedColor();
  }, [currentColor]);

  const handleChangeRange = (e: React.ChangeEvent<HTMLInputElement>, colorName: string) => {
    const colorValue = Number(e.target.value);

    // console.log(colorValue);

    // const clickArea = components.find((component) => component.isClick);

    // if (clickArea === undefined) {
    //   alert("クリックしてください");
    //   return;
    // }

    // 色の設定値を変更
    setOneRGBHSV(colorName, colorValue);
  }

  const setRGB = (color: Color) => {
    let newColor = {...currentColor};
    newColor['r'] = color.r;
    newColor['g'] = color.g;
    newColor['b'] = color.b;
    newColor = RGB2HSV(newColor);
    newColor = RGB2HSL(newColor);

    setCurrentColor(newColor);
  }

  const setOneRGBHSV = (colorName: string, colorValue: number) => {
    let newColor = {...currentColor};
    newColor[colorName] = colorValue;
    switch (colorName) {
      case 'r':
      case 'g':
      case 'b':
        newColor = RGB2HSV(newColor);
        newColor = RGB2HSL(newColor);
        break;

      case 'hsv_h':
      case 'hsv_s':
      case 'hsv_v':
        newColor = HSV2RGB(newColor);
        newColor = RGB2HSL(newColor);
        break;

      case 'hsl_h':
      case 'hsl_s':
      case 'hsl_l':
        newColor = HSL2RGB(newColor);
        newColor = RGB2HSV(newColor);
        break;

      default:
        break;
    }

    setCurrentColor(newColor);
  }




  const changeClickedColor = () => {

    const deepCopy = components.map((component) => ({ ...component }));
    // console.log(deepCopy);

    const newComponents = deepCopy.map((component) => {
      if (component.isClick) {
        component.color = currentColor;
      }
      if (component.id === sampleColorId) {
        component.color = currentColor;
      }
      return component;
    });

    setComponents(newComponents);
  }



  // 選択したコンポーネント
  type Component = {
    id: string;
    isHover: boolean;
    isClick: boolean;
    color: Color;
    isDrag: boolean;
  }
  const [components, setComponents] = useState<Component[]>([]);

  // click動作取得
  const handleClick = (id: string, isClick: boolean) => {
    isClick 
    ? console.log('clickStart:' + id)
    : console.log('clickEnd:' + id)

    const deepCopy = components.map((component) => ({ ...component }));
    const newComponents = deepCopy.map((component) => {
      
      // クリック時はhoverを解除
      component.isHover = false;

      if (component.id === id) {
        component.isClick = true;

        // 選択したコンポーネントの色を入力欄にセット
        setRGB(component.color);

      } else {
        component.isClick = false;
      }

      return component;
    });

    setComponents(newComponents);
    return;
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


  const addComponent = (id: string, color: Color = getRamdomColor()) => {
    // idを検索して、無ければオブジェクトを作成する
    let component;
    component = components.find((component) => component.id === id);

    if (component === undefined) {
      //新しいComponent作成
      const newComponent: Component = {
        id: id,
        isHover: false,
        isClick: false,
        isDrag: false,
        color: color,
      };

      setComponents([...components, newComponent]);
    }
  }

  const getColorStyle = (id: string) => {

    const component = components.find((component) => component.id === id);

    let style;
    if (component === undefined) {
      style = { backgroundColor: 'blue' };
    } else {
      style = { backgroundColor: getHexCodeFromRGB(component.color) };

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
      if (component.color.hsv_v < 0.6 || component.color.hsv_s > 0.75 ) {
        Object.assign(style, { 
          color: "white",
        });
      }
    }
    return style;
  }

  const DivColor = ({...props}) => {
    const id = String(props.id);

    useEffect(() => {
      // idを検索して、無ければオブジェクトを作成する
      addComponent(id);
    }, [id, props]);

    const style = getColorStyle(id);
    const className = 'color-change can-select';

    // styleを設定してdivタグに変換
    return <div 
      id={id} 
      style={style} 
      className={className} 

        // onMouseEnter={() => handleHover(id, true)} 
        // onMouseLeave={() => handleHover(id, false)} 
        
      onClick={(e) => handleClick(id, true)} 

      onDragStart={(e) => handleDrag(id, true)} 
      onDragEnd={(e) => handleDrag(id, false)} 

      onDrop={(e) => handleDrop(e, id)} 
      onDragOver={(e) => handleDragOver(e, id)} 

      // {...getEvents({...props}, id)}

      // {...getEvents2}
      >
        { props.children }
      </div>
  };

  const getEvents = ({...props}, id: string) => {
    // return <>        
    // onClick={() => handleClick(id, true)} 

    // onDragStart={() => handleDrag(id, true)} 
    // onDragEnd={() => handleDrag(id, false)} 

    // onDrop={() => handleDrop(props.e, id)} 
    // onDragOver={() => handleDragOver(props.e, id)}
    //    </>
  }

  const getEvents2 = () => {
    return {    
      onclick: { handleClick },
      ondragstart: { handleDrag } ,
      ondragend: { handleDrag } ,
      ondrop: { handleDrop } ,
      ondragover: { handleDragOver }
    }
  }


  const handleDrag = (id: string, isDrag: boolean) => {
    isDrag 
    ? console.log('dragStart:' + id)
    : console.log('dragEnd:' + id)
  }

  // const handleDrag = ({...props}) => {
  //   console.log('drag')
  //   console.log(props)
  //   // isDrag 
  //   // ? console.log('dragStart:' + id)
  //   // : console.log('dragEnd:' + id)
  // }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    console.log('dragOver:' + id)
    e.preventDefault();
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    console.log('drop:' + id)
    console.log(e.currentTarget.id);
    console.log(e);



    const deepCopy = components.map((component) => ({ ...component }));
    const newComponents = deepCopy.map((component) => {
      
      // クリック時はhoverを解除
      // component.isHover = false;

      if (component.id === id) {
        // component.isClick = true;
        component.color = currentColor;

        // 選択したコンポーネントの色を入力欄にセット
        // setRGB(component.color);

      } else {
        // component.isClick = false;
      }

      return component;
    });

    setComponents(newComponents);
    return;
  }

  // const getEvents2 = ({...props}, id: string) => {
  //   return  {      
  //     onClick={() => handleClick(id, true)} 
  
  //     onDragStart={() => handleDrag(id, true)} 
  //     onDragEnd={() => handleDrag(id, false)} 
  
  //     onDrop={(e) => handleDrop(e, id)} 
  //     onDragOver={(e) => handleDragOver(e, id)}
  //   }
  // }
  

  const DivSampleColor = ({...props}) => {
    const id = sampleColorId;


    useEffect(() => {
      // idを検索して、無ければオブジェクトを作成する
      addComponent(id, currentColor);
    }, [id, props]);


    const style = getColorStyle(id);

    // styleを設定してdivタグに変換
    return <Row>
      <Col />
      <Col sm={10}>
      <InputGroup>
        {/* <label> */}
        <input type='text' className='form-control sample-color' id={id} style={style} value='sample color' draggable='true' readOnly />
        {/* </label> */}
      {/* </Col>
      <Col sm={3}> */}

          <input type='text' className='form-control' style={{backgroundColor: getRGBCodeFromRGB(currentColor)}} value={getRGBCodeFromRGB(currentColor)} readOnly />
          <CopyButton copyText={getRGBCodeFromRGB(currentColor)} />
        {/* </InputGroup>
      </Col>
      <Col sm={3}>
        <InputGroup> */}
          <input type='text' className='form-control' style={{backgroundColor: getHexCodeFromRGB(currentColor)}} value={getHexCodeFromRGB(currentColor)} readOnly />
          <CopyButton copyText={getHexCodeFromRGB(currentColor)} />

          <input type='text' className='form-control' style={{backgroundColor: getHSLCodeFromRGB(currentColor)}} value={getHSLCodeFromRGB(currentColor)} readOnly />
          <CopyButton copyText={getHSLCodeFromRGB(currentColor)} />
        </InputGroup>
      </Col>
      <Col />
    </Row>
  };

  
  const CopyButton = ({ copyText }: { copyText: string }) => {
    const [isCopied, setIsCopied] = useState(false)
  
    const handleCopy = () => {
      copy(copyText).then(() => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 3000)
      })
    }
  
    return (
      <Button disabled={isCopied} onClick={handleCopy}>
        {isCopied ? "Copied!" : "<- Copy"}
      </Button>
    )
  }
  
  const DivColorBar = ({...props}) => {
    const id = String(props.id);

    const className = 'color-bar-change';

    let colorMin = {...currentColor};
    let colorMax = {...currentColor};
    let style;

    switch (id) {

      // HSV
      case "label-hsv-h":
        let colorv1 = {...currentColor};
        let colorv2 = {...currentColor};
        let colorv3 = {...currentColor};
        let colorv4 = {...currentColor};
        colorv1['hsv_h'] = 0;
        colorv2['hsv_h'] = 90;
        colorv3['hsv_h'] = 180;
        colorv4['hsv_h'] = 270;
        colorv1 = HSV2RGB(colorv1);
        colorv2 = HSV2RGB(colorv2);
        colorv3 = HSV2RGB(colorv3);
        colorv4 = HSV2RGB(colorv4);
        style = { background: "linear-gradient(to right, " 
          + getRGBCodeFromRGB(colorv1) + ", " 
          + getRGBCodeFromRGB(colorv2) + ", " 
          + getRGBCodeFromRGB(colorv3) + ", " 
          + getRGBCodeFromRGB(colorv4) + ", " 
          + getRGBCodeFromRGB(colorv1) + ")" };
        break;

      case "label-hsv-s":
        colorMin['hsv_s'] = 0;
        colorMax['hsv_s'] = 1;
        colorMin = HSV2RGB(colorMin);
        colorMax = HSV2RGB(colorMax);
        style = { background: "linear-gradient(to right, " + getRGBCodeFromRGB(colorMin) + ", " + getRGBCodeFromRGB(colorMax) + ")" };
        break;

      case "label-hsv-v":
        colorMin['hsv_v'] = 0;
        colorMax['hsv_v'] = 1;
        colorMin = HSV2RGB(colorMin);
        colorMax = HSV2RGB(colorMax);
        style = { background: "linear-gradient(to right, " + getRGBCodeFromRGB(colorMin) + ", " + getRGBCodeFromRGB(colorMax) + ")" };
        break;


      // HSL
      case "label-hsl-h":
        let colorl1 = {...currentColor};
        let colorl2 = {...currentColor};
        let colorl3 = {...currentColor};
        let colorl4 = {...currentColor};
        colorl1['hsl_h'] = 0;
        colorl2['hsl_h'] = 90;
        colorl3['hsl_h'] = 180;
        colorl4['hsl_h'] = 270;
        colorl1 = HSL2RGB(colorl1);
        colorl2 = HSL2RGB(colorl2);
        colorl3 = HSL2RGB(colorl3);
        colorl4 = HSL2RGB(colorl4);
        style = { background: "linear-gradient(to right, " 
          + getRGBCodeFromRGB(colorl1) + ", " 
          + getRGBCodeFromRGB(colorl2) + ", " 
          + getRGBCodeFromRGB(colorl3) + ", " 
          + getRGBCodeFromRGB(colorl4) + ", " 
          + getRGBCodeFromRGB(colorl1) + ")" };
        break;

      case "label-hsl-s":
        colorMin['hsl_s'] = 0;
        colorMax['hsl_s'] = 1;
        colorMin = HSL2RGB(colorMin);
        colorMax = HSL2RGB(colorMax);
        style = { background: "linear-gradient(to right, " + getRGBCodeFromRGB(colorMin) + ", " + getRGBCodeFromRGB(colorMax) + ")" };
        break;

      case "label-hsl-l":
        colorMin['hsl_l'] = 0;
        colorMax['hsl_l'] = 1;
        colorMin = HSL2RGB(colorMin);
        colorMax = HSL2RGB(colorMax);
        style = { background: "linear-gradient(to right, " + getRGBCodeFromRGB(colorMin) + ", " + getRGBCodeFromRGB(colorMax) + ")" };
        break;

      default:
        break;
    }

    // styleを設定してdivタグに変換
    return <div 
      style={style} 
      className={className} 
      >
        { props.children }
      </div>
  };

  const getRGBCodeFromRGB = (color: Color) => {
    const displayColor = getDisplayColor(color);
    return (
      'rgb(' + displayColor.r + ', ' + displayColor.g + ', ' + displayColor.b + ')'
    );
  }

  const getHexCodeFromRGB = (color: Color) => {
    const displayColor = getDisplayColor(color);
    return "#"
      + Math.trunc(displayColor.r).toString(16).padStart(2, '0') 
      + Math.trunc(displayColor.g).toString(16).padStart(2, '0') 
      + Math.trunc(displayColor.b).toString(16).padStart(2, '0');
  };

  const getHSLCodeFromRGB = (color: Color) => {
    const displayColor = getDisplayColor(color);
    return (
      'hsl(' + displayColor.hsl_h + 'deg, ' + displayColor.hsl_s * 100 + '%, ' + displayColor.hsl_l * 100 + '%)'
    );
  }

  const getDisplayColor = (color: Color) => {
    return {
      r: Math.trunc(color.r),
      g: Math.trunc(color.g),
      b: Math.trunc(color.b),
      hsv_h: Math.trunc(color.hsv_h),
      hsv_s: Math.trunc(color.hsv_s * 100) / 100,
      hsv_v: Math.trunc(color.hsv_v * 100) / 100,
      hsl_h: Math.trunc(color.hsl_h),
      hsl_s: Math.trunc(color.hsl_s * 100) / 100,
      hsl_l: Math.trunc(color.hsl_l * 100) / 100,
    }
  }

  // カード
  const [cardCount, setCardCount] = useState<number>(0);

  const cardIncrement = () => {
    setCardCount(cardCount + 1);
  }

  const cardDecrement = () => {
    if (cardCount > 0) {
      setCardCount(cardCount - 1);
    }
  }

  const DivCard = ({...props}) => {
    const id = String(props.id);

    const className = 'card-change';



    let cards;
    for (let i=0; i<cardCount; i++) {
      const idHeader = 'card-header-' + (i + 1).toString();
      const idBody = 'card-body-' + (i + 1).toString();
      addComponent(idHeader);
      addComponent(idBody);
      const styleHeader = getColorStyle(idHeader);
      const styleBody = getColorStyle(idBody);

      const card = <div className="col">
        <Card className='h-100' >
          <CardHeader className='can-select' id={'card-header-' + (i + 1).toString()} style={styleHeader} onClick={() => handleClick(idHeader, true)} >タイトル</CardHeader>
          <CardBody className='can-select' id={'card-body-' + (i + 1).toString()} style={styleBody} onClick={() => handleClick(idBody, true)} >
            <CardText>あああ</CardText>
            <Button>button</Button>
          </CardBody>
        </Card>
      </div>;


      if (cards === undefined) {
        cards = card;
      } else {
        cards = <>{cards}{card}</>;
      }
    }

    const html = <div className="row row-cols-1 row-cols-md-3 g-4">{cards}</div>;

    // styleを設定してdivタグに変換
    return html;
  };

  const [showColorBar, setShowColorBar] = useState<boolean>(true);

  const handleToggleColorBar = () => {
    const newShowColorBar = !showColorBar;
    setShowColorBar(newShowColorBar);
  }

  const getColorBarStyle = () => {
    return showColorBar ? '' : {style: {display: 'none' }}
  }

  return (
    <div className="App">


      <BrowserRouter>

        <Navbar bg="dark" variant="dark" expand="lg" fixed="top" id="header" 
        >
          <Container>
            <Navbar.Brand as={Link} to="/" className="ms-3">
              My SPA Site
            </Navbar.Brand>
            <Button variant="outline-light" onClick={toggleShow}>
              Menu
            </Button>
          </Container>
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

        <Container className='mt-5 pt-5'>

        {/* 設定ボタン */}
        <Row>
          
        </Row>

        {/* サンプル */}
        <DivSampleColor />


        {/* カラーバー */}
        <Container className='border mt-3'>
        <Button variant="outline-secondary" size="sm" onClick={() => {handleToggleColorBar()}}>{showColorBar ? "隠す" : "表示"}</Button>
        <Row {...getColorBarStyle()}>

          {/* 色変更バー */}
          {/* RGB */}
          <Col xxl={6}>
            <Row className="my-4 pb-4 border-bottom" id="rgb">

              <Row className='my-2'>
                <Col sm={2}>
                  <form>
                    <label className="form-label">
                      R
                      <input type="text" className="form-control" id="r-text" onChange={() => {}} value={Math.trunc(currentColor.r)} />
                    </label>
                  </form>
                </Col>
                <Col sm={10}>
                  <Row className='color-range'>
                    <div className='label r'>　</div>
                    <input type="range" className="form-range" id="r" min="0" max="255" step="1" value={currentColor.r} onChange={(e) => handleChangeRange(e, 'r')}></input>
                  </Row>
                </Col>
              </Row>

              <Row className='my-2'>
                <Col sm={2}>
                  <form>
                    <label className="form-label">
                      G
                      <input type="text" className="form-control" id="g-text" onChange={() => {}} value={Math.trunc(currentColor.g)} />
                    </label>
                  </form>
                </Col>
                <Col sm={10}>
                  <Row className='color-range'>
                    <div className='label g'>　</div>
                    <input type="range" className="form-range" id="g" min="0" max="255" step="1" value={currentColor.g} onChange={(e) => handleChangeRange(e, 'g')}></input>
                  </Row>
                </Col>
              </Row>

              <Row className='my-2'>
                <Col sm={2}>
                  <form>
                    <label className="form-label">
                      B
                      <input type="text" className="form-control" id="b-text" onChange={() => {}} value={Math.trunc(currentColor.b)} />
                    </label>
                  </form>
                </Col>
                <Col sm={10}>
                  <Row className='color-range'>
                    <div className='label b'>　</div>
                    <input type="range" className="form-range" id="b" min="0" max="255" step="1" value={currentColor.b} onChange={(e) => handleChangeRange(e, 'b')}></input>
                  </Row>
                </Col>
              </Row>
            </Row>
          </Col>

          {/* HSV */}
          <Col xxl={6}>
            <Row className="my-4 pb-4 border-bottom" id="hsv">

              <Row className='my-2'>
                <Col sm={2}>
                  <form>
                    <label className="form-label">
                      色相
                      <input type="text" className="form-control" id="hsv-h-text" onChange={() => {}} value={Math.trunc(currentColor.hsv_h)} />
                    </label>
                  </form>
                </Col>
                <Col sm={10}>
                  <Row className='color-range'>
                    <DivColorBar className='label hsv-h' id="label-hsv-h">　</DivColorBar>
                    <input type="range" className="form-range" id="hsv-h" min="0" max="359" step="0.0001" value={currentColor.hsv_h} onChange={(e) => handleChangeRange(e, 'hsv_h')}></input>
                  </Row>
                </Col>
              </Row>

              <Row className='my-2'>
                <Col sm={2}>
                  <form>
                    <label className="form-label">
                      彩度
                      <input type="text" className="form-control" id="hsv-s-text" onChange={() => {}} value={Math.trunc(currentColor.hsv_s * 1000) / 1000} />
                    </label>
                  </form>
                </Col>
                <Col sm={10}>
                  <Row className='color-range'>
                    <DivColorBar className='label hsv-s' id="label-hsv-s">　</DivColorBar>
                    <input type="range" className="form-range" id="hsv-s" min="0.0001" max="1.001" step="0.001" value={currentColor.hsv_s} onChange={(e) => handleChangeRange(e, 'hsv_s')}></input>
                  </Row>
                </Col>
              </Row>

              <Row className='my-2'>
                <Col sm={2}>
                  <form>
                    <label className="form-label">
                      明るさ
                      <input type="text" className="form-control" id="hsv-v-text" onChange={() => {}} value={Math.trunc(currentColor.hsv_v * 1000) / 1000} />
                    </label>
                  </form>
                </Col>
                <Col sm={10}>
                  <Row className='color-range'>
                    <DivColorBar className='label hsv-v' id="label-hsv-v">　</DivColorBar>
                    <input type="range" className="form-range" id="hsv-v" min="0.0001" max="1.001" step="0.001" value={currentColor.hsv_v} onChange={(e) => handleChangeRange(e, 'hsv_v')}></input>
                  </Row>
                </Col>
              </Row>

            </Row>
          </Col>

          {/* HSL */}
          <Col xxl={5}>
            <Row className="my-2" id="hsl">
              <Row className='my-2'>
                <Col sm={2}>
                  <form>
                    <label className="form-label">
                      色相
                      <input type="text" className="form-control" id="hsl-h-text" onChange={() => {}} value={Math.trunc(currentColor.hsl_h)} />
                    </label>
                  </form>
                </Col>
                <Col sm={10}>
                  <Row className='color-range'>
                    <DivColorBar className='label hsl-h' id="label-hsl-h">　</DivColorBar>
                    <input type="range" className="form-range" id="hsl-h" min="0" max="359" step="0.0001" value={currentColor.hsl_h} onChange={(e) => handleChangeRange(e, 'hsl_h')}></input>
                  </Row>
                </Col>

              </Row>
              
              <Row className='my-2'>
                <Col sm={2}>
                  <form>
                    <label className="form-label">
                      彩度
                      <input type="text" className="form-control" id="hsl-s-text" onChange={() => {}} value={Math.trunc(currentColor.hsl_s * 1000) / 1000} />
                    </label>
                  </form>
                </Col>
                <Col sm={10}>
                  <Row className='color-range'>
                    <DivColorBar className='label hsl-s' id="label-hsl-s">　</DivColorBar>
                    <input type="range" className="form-range" id="hsl-s" min="0.0001" max="1.001" step="0.001" value={currentColor.hsl_s} onChange={(e) => handleChangeRange(e, 'hsl_s')}></input>
                  </Row>
                </Col>
              </Row>

              <Row className='my-2'>
                <Col sm={2}>
                  <form>
                    <label className="form-label">
                      輝度
                      <input type="text" className="form-control" id="hsl-l-text" onChange={() => {}} value={Math.trunc(currentColor.hsl_l * 1000) / 1000} />
                    </label>
                  </form>
                </Col>
                <Col sm={10}>
                  <Row className='color-range'>
                    <DivColorBar className='label hsl-l' id="label-hsl-l">　</DivColorBar>
                    <input type="range" className="form-range" id="hsl-l" min="0.0001" max="1.001" step="0.001" value={currentColor.hsl_l} onChange={(e) => handleChangeRange(e, 'hsl_l')}></input>
                  </Row>
                </Col>
              </Row>
            </Row>
          </Col>

        </Row>
        </Container>

        {/* onClick={(e) => handleClick(id, true)} 

onDragStart={(e) => handleDrag(id, true)} 


onDrop={(e) => handleDrop(id, false)} 
onDragOver={(e) => handleDragOver(id, true)}  */}
      
        {/* body */}
          <Row className="mt-5" id="body" >
            <Row className='m-2'>
              <DivColor id="body1">
                aaa
              </DivColor>
            </Row>
            <Row className='m-2'>
              <DivColor id="body2">
                bbb
              </DivColor>
            </Row>
            <Row className='m-2'>
              <DivColor id="body3">
                ccc
              </DivColor>
            </Row>
          </Row>

        {/* card */}
        <Row className="m-5" id="card" >
          <Col sm={2}>
            <Button variant="outline-secondary" size="sm" className='button-card' onClick={cardDecrement}>-</Button>
            <span className='mx-2'>card</span>
            <Button variant="outline-secondary" size="sm" className='button-card' onClick={cardIncrement}>+</Button>
          </Col>
          <DivCard>

          </DivCard>
        </Row>

        </Container>

        {/* フッター */}
        <Row className="m-5" />

        <Navbar expand="lg" fixed="bottom" className='footer'>
          

            {/* <Navbar.Collapse className="justify-content-center"> */}
              {/* <Navbar.Text> */}
                <DivColor id='footer'>
                &copy; 2024 My SPA Site. All rights reserved.
                </DivColor>
              {/* </Navbar.Text> */}
            {/* </Navbar.Collapse> */}


        </Navbar>


      </BrowserRouter>

    </div>
  );
}


// function Home() {
//   return (
//     <>
//       <h1>Home</h1>
//       <p>This is the home page of my SPA site.</p>
//     </>
//   );
// }

// function About() {
//   return (
//     <>
//       <h1>About</h1>
//       <p>This is the about page of my SPA site.</p>
//     </>
//   );
// }

// function Contact() {
//   return (
//     <>
//       <h1>Contact</h1>
//       <p>This is the contact page of my SPA site.</p>
//     </>
//   );
// }

export default App;
