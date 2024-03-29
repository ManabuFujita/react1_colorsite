import React, { useEffect, useRef } from 'react';
// import logo from './logo.svg';
import './App.scss';

import Color from './Color';

import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Link, Routes, redirect } from 'react-router-dom';
import { Container, Navbar, Nav, Offcanvas, Button, Row, Col, InputGroup, Card, CardHeader, CardBody, CardText, ButtonToolbar, ButtonGroup, Form, NavbarBrand } from 'react-bootstrap';


import copy from "clipboard-copy"
import { v4 as uuidv4 } from 'uuid';
import { get } from 'http';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faPalette, faBrush } from "@fortawesome/free-solid-svg-icons";

function App() {

  // メニューバー
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((s) => !s);

  const currentColorId = 'sample-color';

  // RGB to HSV
  const getHSV_H = (color: Color) => {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    
    if (max === min) {
      return 0;
    }

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

    if (max === min) {
      return 0;
    }

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

  // RGB to CMYK
  const getCMYK_C = (color: Color) => {
    const k = getCMYK_K(color);
    const c = (1 - (color.r / 255) - k) / (1 - k);
    return c;
  }

  const getCMYK_M = (color: Color) => {
    const k = getCMYK_K(color);
    const m = (1 - (color.g / 255) - k) / (1 - k);
    return m;
  }

  const getCMYK_Y = (color: Color) => {
    const k = getCMYK_K(color);
    const y = (1 - (color.b / 255) - k) / (1 - k);
    return y;
  }

  const getCMYK_K = (color: Color) => {
    const max = Math.max(color.r, color.g, color.b);
    const k = 1 - (max / 255);
    return k;
  }

  const RGB2CMYK = (color: Color) => {
    color['cmyk_c'] = getCMYK_C(color);
    color['cmyk_m'] = getCMYK_M(color);
    color['cmyk_y'] = getCMYK_Y(color);
    color['cmyk_k'] = getCMYK_K(color);
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

  // CMYK to RGB
  const CMYK2RGB = (color: Color) => {
    const r = 255 * (1 - color.cmyk_c) * (1 - color.cmyk_k);
    const g = 255 * (1 - color.cmyk_m) * (1 - color.cmyk_k);
    const b = 255 * (1 - color.cmyk_y) * (1 - color.cmyk_k);

    color['r'] = r;
    color['g'] = g;
    color['b'] = b;

    return color;
  }

    // const [currentColor, setCurrentColor] = useState<Color>({id:"aaa", r: 110, g: 120, b: 130, hsv_h: 200, hsv_s: 0.5, hsv_v: 0.7, hsl_h: 200, hsl_s: 0.5, hsl_l: 0.7});
  // const [currentColor, setCurrentColor] = useState<Color>(getRamdomColor());
  // const [currentColors, setCurrentColors] = useState<Color[]>([currentColor]);

  // const [currentColors, setCurrentColors] = useState<Color[]>([{id:"aaa", r: 110, g: 120, b: 130, hsv_h: 200, hsv_s: 0.5, hsv_v: 0.7, hsl_h: 200, hsl_s: 0.5, hsl_l: 0.7}]);

  // componentsの初期値を取得
  const getInitialCurrenctColorComponent = () => {
    const id = currentColorId;
    // 新しいColor作成
    let component: Component = {
      id: id,
      isSampleColor: true,
      isCurrentColor: true,
      isHover: false,
      isClick: false,
      color: getRamdomColor(id),
      isDrag: false,
      sampleColorNo: 1,
    };

    return component;
  }

  const getInitialRamdomColorComponent = () => {
    const id = uuidv4();
    // 新しいColor作成
    let component: Component = {
      id: id,
      isSampleColor: true,
      isCurrentColor: true,
      isHover: false,
      isClick: false,
      color: getRamdomGrayScaleColor(id),
      isDrag: false,
      sampleColorNo: 1,
    };

    return component;
  }


  // 色
  const getRamdomColor = (id: string) => {
    // 新しいColor作成
    let newColor: Color = {
      id: id,
      r: Math.trunc(Math.random() * 255),
      g: Math.trunc(Math.random() * 255),
      b: Math.trunc(Math.random() * 255),
      hsv_h: 0,
      hsv_s: 0,
      hsv_v: 0,
      hsl_h: 0,
      hsl_s: 0,
      hsl_l: 0,
      cmyk_c: 0,
      cmyk_m: 0,
      cmyk_y: 0,
      cmyk_k: 0,
    };

    newColor = RGB2HSV(newColor);
    newColor = RGB2HSL(newColor);
    newColor = RGB2CMYK(newColor);

    return newColor;
  }

  const getRamdomGrayScaleColor = (id: string) => {
    // 新しいColor作成
    let newColor: Color = {
      id: id,
      r: 0,
      g: 0,
      b: 0,
      hsv_h: 0,
      hsv_s: 0,
      hsv_v: 0,
      hsl_h: 0,
      hsl_s: 0,
      hsl_l: Math.random(),
      cmyk_c: 0,
      cmyk_m: 0,
      cmyk_y: 0,
      cmyk_k: 0,
    };

    newColor = HSL2RGB(newColor);

    newColor = RGB2HSV(newColor);
    newColor = RGB2CMYK(newColor);

    return newColor;
  }

  const getWhiteColor = (id: string) => {
    // 新しいColor作成
    let newColor: Color = {
      id: id,
      r: 255,
      g: 255,
      b: 255,
      hsv_h: 0,
      hsv_s: 0,
      hsv_v: 0,
      hsl_h: 0,
      hsl_s: 0,
      hsl_l: 0,
      cmyk_c: 0,
      cmyk_m: 0,
      cmyk_y: 0,
      cmyk_k: 0,
    };

    newColor = RGB2HSV(newColor);
    newColor = RGB2HSL(newColor);
    newColor = RGB2CMYK(newColor);

    return newColor;
  }

  const getHighLuminanceColor = (id: string) => {
    // 新しいColor作成
    let newColor: Color = {
      id: id,
      r: 0,
      g: 0,
      b: 0,
      hsv_h: 0,
      hsv_s: 0,
      hsv_v: 0,
      hsl_h: Math.random() * 360,
      hsl_s: Math.random(),
      hsl_l: 0.99,
      cmyk_c: 0,
      cmyk_m: 0,
      cmyk_y: 0,
      cmyk_k: 0,
    };

    newColor = HSL2RGB(newColor);

    newColor = RGB2HSV(newColor);
    newColor = RGB2CMYK(newColor);

    return newColor;
  }

  type ColorObject = {
    [key: string]: number | string;
  }

  type Color = ColorObject & {
      id: string;
      r: number;
      g: number;
      b: number;
      hsv_h: number;
      hsv_s: number;
      hsv_v: number;
      hsl_h: number;
      hsl_s: number;
      hsl_l: number;
      cmyk_c: number;
      cmyk_m: number;
      cmyk_y: number;
      cmyk_k: number;
  };

  // 選択したコンポーネント
  type Component = {
    id: string;
    isSampleColor: boolean;
    isCurrentColor: boolean;
    isHover: boolean;
    isClick: boolean;
    color: Color;
    isDrag: boolean;
    sampleColorNo: number;
  }

  // const initialCurrentColorsValue = [getRamdomColor(currentColorId), getRamdomColor(uuidv4())];
  const initialComponentsValue: Component[] = [getInitialCurrenctColorComponent(), getInitialRamdomColorComponent()];
  const initialCardCountValue = 1;

  // colorの初期値を取得
  // const getInitialCurrentColors = () => {
  //   console.log('・getInitialCurrentColors')

  //   const localCurrentColors = localStorage.getItem('currentColors');
  //   if (localCurrentColors !== null) {
  //     return JSON.parse(localCurrentColors);
  //   } else {
  //     return initialCurrentColorsValue;
  //   }
  // }

  // componentの初期値を取得
  const getInitialComponents = () => {
    console.log('・getInitialComponents')

    const localComponents = localStorage.getItem('components');

// console.log(localComponents)

    let components: Component[] = [];

    if (localComponents !== null) {
      components = JSON.parse(localComponents);
    } else {
      components = initialComponentsValue;
    }

    return components;
  }

  // cardCountの初期値を取得
  const getInitialCardCount = () => {
    console.log('・getInitialCardCount')

    const localCardCount = localStorage.getItem('cardCount');
    if (localCardCount !== null) {
      return JSON.parse(localCardCount);
    } else {
      return initialCardCountValue;
    }
  }

  const [components, setComponents] = useState<Component[]>(getInitialComponents());

  // const [currentColors, setCurrentColors] = useState<Color[]>(getInitialCurrentColors());

  const [cardCount, setCardCount] = useState<number>(getInitialCardCount());

  // const [appHeight, setAppHeight] = useState<number>(document.documentElement.clientHeight);

  // ページロード時の処理
  useEffect(() => {
    console.log('load page')

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

  // localStorageのcurrentColorsをクリア
  // const clearCurrentColors = () => {
  //   localStorage.removeItem('currentColors');
  //   console.log('◆clearCurrentColors')
  // }

  // localStorageのcomponentsをクリア
  // const clearComponents = () => {
  //   localStorage.removeItem('components');
  //   console.log('◆clearComponents')
  // }

  // localStorageのcardCountをクリア
  // const clearCardCount = () => {
  //   localStorage.removeItem('cardCount');
  //   console.log('◆clearCardCount')
  // }

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

  const getInitialComponentColor = (id: string) => {
    switch (id) {
      case 'body-background':
        // return getHighLuminanceColor(id);
        return getWhiteColor(id);
      default:
        return getRamdomGrayScaleColor(id);
    }
  }

  const handleChangeRange = (e: React.ChangeEvent<HTMLInputElement>, colorName: string) => {
    const colorValue = Number(e.target.value);

    // console.log(colorValue);

    const clickedComonent = components.find((component) => component.isClick);

    if (clickedComonent === undefined) {
      // 色の設定値を変更(currentColorのみ)
      setOneRGBHSV(colorName, colorValue, currentColorId);
    } else {
      // 色の設定値を変更(clickcomponentとcurrentColorの両方)
      setOneRGBHSV(colorName, colorValue, clickedComonent.id);
    }
  }

  // componentsからcurrentcolorを取得する
  const getCurrentColor = () => {
    const currentColor = components.find((component) => component.isCurrentColor);
    if (currentColor === undefined) {
      return getInitialComponentColor(currentColorId);
    } else {
      return currentColor.color;
    }
  }

  // sample colorにセットする
  const setRGB = (color: Color) => {
    // console.log(currentColors)

    const deepCopy = components.map((component) => ({ ...component }));
    const newComponents = deepCopy.map((component) => {
      if (component.color.id === currentColorId) {
        component.color['r'] = color.r;
        component.color['g'] = color.g;
        component.color['b'] = color.b;
        component.color = RGB2HSV(component.color);
        component.color = RGB2HSL(component.color);
      }
      return component;
    });

    setComponents(newComponents);
  }

  const setOneRGBHSV = (colorName: string, colorValue: number, componentId: String) => {

    const deepCopy = components.map((component) => ({ ...component }));
    const newComponent = deepCopy.map((component) => {
      if (component.isCurrentColor || component.color.id === componentId) {

        let newColor = component.color;
        newColor[colorName] = colorValue;

        switch (colorName) {
          case 'r':
          case 'g':
          case 'b':
            component.color = RGB2HSV(component.color);
            component.color = RGB2HSL(component.color);
            component.color = RGB2CMYK(component.color);
            break;
    
          case 'hsv_h':
          case 'hsv_s':
          case 'hsv_v':
            component.color = HSV2RGB(component.color);

            component.color = RGB2HSL(component.color);
            component.color = RGB2CMYK(component.color);
            break;
    
          case 'hsl_h':
          case 'hsl_s':
          case 'hsl_l':
            component.color = HSL2RGB(component.color);

            component.color = RGB2HSV(component.color);
            component.color = RGB2CMYK(component.color);
            break;

          case 'cmyk_c':
          case 'cmyk_m':
          case 'cmyk_y':
          case 'cmyk_k':
            component.color = CMYK2RGB(component.color);

            component.color = RGB2HSV(component.color);
            component.color = RGB2HSL(component.color);
            break;
    
          default:
            break;
        }
      }
      return component;
    })

    setComponents(newComponent);
  }




  const changeClickedColor = () => {

    // console.log(getCurrentColor())

    const deepCopy = components.map((component) => ({ ...component }));
    // console.log(deepCopy);

    const newComponents = deepCopy.map((component) => {
      if (component.isClick) {
        component.color = getCurrentColor();
      }
      if (component.id === currentColorId) {
        // console.log('match')
        component.color = getCurrentColor();
      }
      return component;
    });

    setComponents(newComponents);
  }


  const getMaxSampleColorNo = () => {
    let maxSampleColorNo = 0;
    components.map((component) => {
      if (component.isSampleColor && component.sampleColorNo > maxSampleColorNo) {
        maxSampleColorNo = component.sampleColorNo;
      }
    });
    return maxSampleColorNo;
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
        sampleColorNo: isSampleColor ? getMaxSampleColorNo() + 1 : -1,
      };

      setComponents([...components, newComponent]);
    }
  }

  const removeComponent = (id: string) => {
    const newComponents = components.filter((component) => component.id !== id);
      
    setComponents(newComponents);
  }

  const getColorStyle = (id: string) => {

    // componentを検索
    const component = components.find((component) => component.id === id);

    let style = {
      backgroundColor: 'blue', // 初期値
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
  const addCard = () => {
    setCardCount(cardCount + 1);
  }

  const removeCard = () => {
    if (cardCount > 0) {
      setCardCount(cardCount - 1);
    }
  }

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
        setRGB(component.color);

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
    console.log(getCurrentColor())
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

  // componentsからsample colorを取得する
  const getSampleColors = () => {
    let sampleColors = [];

    const sampleColorsFilter = components.filter((component) => component.isSampleColor);
    if (sampleColorsFilter === undefined) {
      sampleColors = getInitialComponents();
    } else {
      sampleColors = sampleColorsFilter;
    }

    return sampleColors;
  }


  const DivSampleColors = ({...props}) => {
    const currentColors = getSampleColors();

    const array: any = [];
    currentColors.map((component: Component) => {
      array.push(
        <>
          <Row {...component.color.id === currentColorId ? {className: 'my-2 pb-3 border-bottom'} : {className: 'my-2'}}>

            <InputGroup className='sample-color-row'>

              <Container fluid="md">
                <Row className='sample-color justify-content-end justify-content-md-center'>

                  {/* カラーバー */}
                  {DivSampleColor({...props}, component.color)}

                </Row>
              </Container>

              </InputGroup>
          </Row>
        </>);
    })

    return <>
      <Container className='my-2'>
        {array}
      </Container>
    </>;
  }

  const DivSampleColor = ({...props}, color: Color) => {

    const id = color.id === currentColorId ? currentColorId : color.id;

    useEffect(() => {
      // idを検索して、無ければオブジェクトを作成する
      // addComponent(id, color, id === currentColorId, true);
    }, [id, props]);


    const addSampleCount = (e: React.MouseEvent<HTMLElement>) => {
      // 新規追加時、色はサンプルと同じで、idを新規採番する
      let newColor = {...getCurrentColor()};
      const id = uuidv4();
      newColor.id = id;

      // const newComponents = components.map((component) => ({ ...component }));

      addComponent(id, newColor, false, true)

      // 2個目に挿入
      // newComponents.push(newColor)

      // setCurrentColors(newCurrentColors);

      if (e !== undefined) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    const removeSampleCount = (e: React.MouseEvent<HTMLElement>, id: string) => {
      // setCurrentColors(currentColors.filter((color) => color.id !== id));

      removeComponent(id);

      

      if (e !== undefined) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    const style = getColorStyle(id);

    // styleを設定してdivタグに変換
    return <>
      <Col className="col color-count-button" xs={3} md={1}>
        {/* +, - ボタン */}
        {color.id === currentColorId 
          ? <Button variant="outline-secondary" className="color-count-button-plus" onClick={() => addSampleCount(props.e)}>+</Button> 
          : <Button variant="outline-secondary" className="color-count-button-plus" disabled>　</Button>}
      {/* </Col>
      <Col className="col color-count-button" xs={1} md={1}> */}
        {color.id !== currentColorId 
          ? <Button variant="outline-secondary" className="color-count-button-minus" onClick={() => removeSampleCount(props.e, color.id)}>-</Button> 
          : <Button variant="outline-secondary" className="color-count-button-minus" disabled>　</Button>}
      </Col>

      <Col className="col color-sample" xs={9} md={3}>
        <InputGroup.Text className='form-control sample-color' 
          id={id} 
          style={style} 
          draggable='true' 
          onDragStart={() => handleDragStart(props.e, id)} 
          onClick={() => handleClick(props.e, id)} >
          {color.id === currentColorId ? 'change color, save with +' : 'drag and drop'}
        </InputGroup.Text>
      </Col>

      <Col className="col color-value rgb align-self-end" xs={9} md={2}>
        <Form.Control placeholder="rgb" aria-label="rgb" id={'copy-button-rgb'+id} value={getRGBCodeFromRGB(color)} readOnly />
        <CopyButton copyText={getRGBCodeFromRGB(color)} inputId={'copy-button-rgb'+id} />
      </Col>
      <Col className="col color-value hex" xs={9} md={2}>
        <Form.Control placeholder="hex" aria-label="hex" id={'copy-button-hex'+id} value={getHexCodeFromRGB(color)} readOnly />
        <CopyButton copyText={getHexCodeFromRGB(color)} inputId={'copy-button-hex'+id} />
      </Col>
      <Col className="col color-value hsl" xs={9} md={2}>
        <Form.Control placeholder="hsl" aria-label="hsl" id={'copy-button-hsl'+id} value={getHSLCodeFromRGB(color)} readOnly />
        <CopyButton copyText={getHSLCodeFromRGB(color)} inputId={'copy-button-hsl'+id} />
      </Col>

    </>
  };

  

  
  const DivColorBar = ({...props}) => {
    const id = String(props.id);

    const className = 'color-bar-change';

    let colorMin = {...getCurrentColor()};
    let colorMax = {...getCurrentColor()};
    let style;

    switch (id) {

      // HSV
      case "label-hsv-h":
        let colorv1 = {...getCurrentColor()};
        let colorv2 = {...getCurrentColor()};
        let colorv3 = {...getCurrentColor()};
        let colorv4 = {...getCurrentColor()};
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
        let colorl1 = {...getCurrentColor()};
        let colorl2 = {...getCurrentColor()};
        let colorl3 = {...getCurrentColor()};
        let colorl4 = {...getCurrentColor()};
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

      
      // CMYK
      case "label-cmyk-c":
        colorMin['cmyk_c'] = 0;
        colorMax['cmyk_c'] = 1;
        colorMin = CMYK2RGB(colorMin);
        colorMax = CMYK2RGB(colorMax);
        style = { background: "linear-gradient(to right, " + getRGBCodeFromRGB(colorMin) + ", " + getRGBCodeFromRGB(colorMax) + ")" };
        break;

      case "label-cmyk-m":
        colorMin['cmyk_m'] = 0;
        colorMax['cmyk_m'] = 1;
        colorMin = CMYK2RGB(colorMin);
        colorMax = CMYK2RGB(colorMax);
        style = { background: "linear-gradient(to right, " + getRGBCodeFromRGB(colorMin) + ", " + getRGBCodeFromRGB(colorMax) + ")" };
        break;

      case "label-cmyk-y":
        colorMin['cmyk_y'] = 0;
        colorMax['cmyk_y'] = 1;
        colorMin = CMYK2RGB(colorMin);
        colorMax = CMYK2RGB(colorMax);
        style = { background: "linear-gradient(to right, " + getRGBCodeFromRGB(colorMin) + ", " + getRGBCodeFromRGB(colorMax) + ")" };
        break;
      
      case "label-cmyk-k":
        colorMin['cmyk_k'] = 0;
        colorMax['cmyk_k'] = 1;
        colorMin = CMYK2RGB(colorMin);
        colorMax = CMYK2RGB(colorMax);
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
      'hsl(' + displayColor.hsl_h + 'deg, ' + displayColor.hsl_s + '%, ' + displayColor.hsl_l + '%)'
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
      hsl_s: Math.trunc(color.hsl_s * 100),
      hsl_l: Math.trunc(color.hsl_l * 100),
    }
  }


  // 表示・非表示機能
  const [showColorBar, setShowColorBar] = useState<boolean>(true);
  const [showSampleColor, setShowSampleColor] = useState<boolean>(true);

  const handleToggleColorBar = () => {
    setShowColorBar(!showColorBar);
  }

  const getShowAllColorBar = () => {
    return showColorBar ? '' : {style: {display: 'none' }}
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

  const handleToggleColorButton = (buttonName: string) => {
    switch (buttonName) {
      case 'button_rgb':
        setShowColorRGB(!showColorRGB);
        break;
      case 'button_hsv':
        setShowColorHSV(!showColorHSV);
        break;
      case 'button_hsl':
        setShowColorHSL(!showColorHSL);
        break;
      case 'button_cmyk':
        setShowColorCMYK(!showColorCMYK);
        break;
      default:
        break;
    }

  }
  const getColorButtonStyle = (buttonName: string) => {
    switch (buttonName) {
      case 'button_rgb':
        return showColorRGB ? {active: true} : {active: false};
        break;
      case 'button_hsv':
        return showColorHSV ? {active: true} : {active: false};
        break;
      case 'button_hsl':
        return showColorHSL ? {active: true} : {active: false};
        break;
      case 'button_cmyk':
        return showColorCMYK ? {active: true} : {active: false};
        break;
      default:
        return {};
        break;
    }
    // return showColorBar ? '' : {style: {display: 'none' }}
  }

  const getShowColorBar = (colorBarName: string) => {
    let obj;


    switch (colorBarName) {
      case 'rgb':
        if (showColorRGB && showColorHSV && showColorHSL) {
          // 全表示
          return {xxl: 12, className: 'border-bottom'} 
        } else if (showColorRGB && !showColorHSV && !showColorHSL && !showColorCMYK) {
          // RGBのみ表示
          return {xxl: 12, } 
        } else if (showColorRGB) {
          // RGBは表示状態
          return {xxl: 6, }
        } else {
          return {xxl: 6, style: {display: 'none' }}
        }
        break;

      case 'hsv':
        if (!showColorRGB && showColorHSV && !showColorHSL && !showColorCMYK) {
          return {xxl: 12, } 
        } else if (showColorHSV) {
          return {xxl: 6, }
        } else {
          return {xxl: 6, style: {display: 'none' }}
        }
        break;

      case 'hsl':
        if (!showColorRGB && !showColorHSV && showColorHSL && !showColorCMYK) {
          return {xxl: 12, } 
        } else if (showColorHSL) {
          return {xxl: 6, }
        } else {
          return {xxl: 6, style: {display: 'none' }}
        }
        break;

      case 'cmyk':
        if (!showColorRGB && !showColorHSV && !showColorHSL && showColorCMYK) {
          return {xxl: 12, } 
        } else if (showColorCMYK) {
          return {xxl: 6, }
        } else {
          return {xxl: 6, style: {display: 'none' }}
        }
        break;

      default:
        return {};
        break;
    }
  }


  return (
    // <div className="App" onClick={() => {handleClickClear()}}>
    <div className="App" ref={appRef}>


      <BrowserRouter>

        {/* ヘッダー */}
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top" id="header2" ref={headerRef}>
            <DivColor id='header' className="header pt-2 navbar-brand ">
              <Container>
                <Row>
                  <Col sm={2}>
                    <Navbar.Brand>{process.env.REACT_APP_TITLE}</Navbar.Brand>
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



        <Container className='mt-5 pt-5 body-main' ref={bodyRef}>
          <Row>
          <Col xs={12} md={9}>

          {/* 設定ボタン */}
          <Row>
            
          </Row>



          {/* カラーバー */}
          <ButtonToolbar aria-label="Toolbar with button groups" className='mt-2'>
            <ButtonGroup className="me-2" aria-label="First group">
              <Button variant="outline-secondary" size="sm" onClick={() => {handleToggleColorBar()}}>{showColorBar ? "hide" : "show"}</Button>
            </ButtonGroup>
            <ButtonGroup className="me-2" aria-label="Second group"　{...getShowAllColorBar()}>
              <Button variant="outline-primary" size="sm" onClick={() => {handleToggleColorButton('button_rgb')}} {...getColorButtonStyle('button_rgb')}>RGB</Button>
              <Button variant="outline-primary" size="sm" onClick={() => {handleToggleColorButton('button_hsv')}} {...getColorButtonStyle('button_hsv')}>HSV</Button>
              <Button variant="outline-primary" size="sm" onClick={() => {handleToggleColorButton('button_hsl')}} {...getColorButtonStyle('button_hsl')}>HSL</Button>
              <Button variant="outline-primary" size="sm" onClick={() => {handleToggleColorButton('button_cmyk')}} {...getColorButtonStyle('button_cmyk')}>CMYK</Button>
            </ButtonGroup>
          </ButtonToolbar>

          <Container className='border mt-3 color-bars' fluid="md">

            {/* <Button variant="outline-secondary" size="sm" onClick={() => {handleToggleColorBar()}}>{showColorBar ? "隠す" : "表示"}</Button> */}
            <Row {...getShowAllColorBar()}>

              {/* 色変更バー */}
              {/* RGB */}
              <Col {...getShowColorBar('rgb')}>
                <Row className="my-2" id="rgb">

                  <Row className='my-2'>
                    <Col xs='auto'>
                      <FontAwesomeIcon icon={faPalette} />
                      <span className='color-space-name'>RGB</span>
                    </Col>
                  </Row>

                  <Row className='my-2'>
                    <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          R
                          <input type="text" className="form-control" id="r-text" onChange={() => {}} value={Math.trunc(getCurrentColor().r)} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <div className='label r'>　</div>
                        <input type="range" className="form-range" id="r" min="0" max="255" step="1" value={getCurrentColor().r} onChange={(e) => handleChangeRange(e, 'r')}></input>
                      </Row>
                    </Col>
                  </Row>

                  <Row className='my-2'>
                    <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          G
                          <input type="text" className="form-control" id="g-text" onChange={() => {}} value={Math.trunc(getCurrentColor().g)} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <div className='label g'>　</div>
                        <input type="range" className="form-range" id="g" min="0" max="255" step="1" value={getCurrentColor().g} onChange={(e) => handleChangeRange(e, 'g')}></input>
                      </Row>
                    </Col>
                  </Row>

                  <Row className='my-2'>
                    <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          B
                          <input type="text" className="form-control" id="b-text" onChange={() => {}} value={Math.trunc(getCurrentColor().b)} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <div className='label b'>　</div>
                        <input type="range" className="form-range" id="b" min="0" max="255" step="1" value={getCurrentColor().b} onChange={(e) => handleChangeRange(e, 'b')}></input>
                      </Row>
                    </Col>
                  </Row>
                </Row>
              </Col>

              {/* <ColRGB /> */}

              {/* HSV */}
              <Col {...getShowColorBar('hsv')}>
                <Row className="my-2" id="hsv">

                  <Row className='my-2'>
                    <Col xs='auto'>
                      <FontAwesomeIcon icon={faPalette} />
                      <span className='color-space-name'>HSV</span>
                    </Col>
                  </Row>

                  <Row className='my-2'>
                    <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          色相(H)
                          <input type="text" className="form-control" id="hsv-h-text" onChange={() => {}} value={Math.trunc(getCurrentColor().hsv_h)} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <DivColorBar className='label hsv-h' id="label-hsv-h">　</DivColorBar>
                        <input type="range" className="form-range" id="hsv-h" min="0" max="359" step="0.0001" value={getCurrentColor().hsv_h} onChange={(e) => handleChangeRange(e, 'hsv_h')}></input>
                      </Row>
                    </Col>
                  </Row>

                  <Row className='my-2'>
                    <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          彩度(S)
                          <input type="text" className="form-control" id="hsv-s-text" onChange={() => {}} value={Math.trunc(getCurrentColor().hsv_s * 1000) / 1000} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <DivColorBar className='label hsv-s' id="label-hsv-s">　</DivColorBar>
                        <input type="range" className="form-range" id="hsv-s" min="0.0001" max="1.001" step="0.001" value={getCurrentColor().hsv_s} onChange={(e) => handleChangeRange(e, 'hsv_s')}></input>
                      </Row>
                    </Col>
                  </Row>

                  <Row className='my-2'>
                    <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          明度(V)
                          <input type="text" className="form-control" id="hsv-v-text" onChange={() => {}} value={Math.trunc(getCurrentColor().hsv_v * 1000) / 1000} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <DivColorBar className='label hsv-v' id="label-hsv-v">　</DivColorBar>
                        <input type="range" className="form-range" id="hsv-v" min="0.0001" max="1.001" step="0.001" value={getCurrentColor().hsv_v} onChange={(e) => handleChangeRange(e, 'hsv_v')}></input>
                      </Row>
                    </Col>
                  </Row>

                </Row>
              </Col>

              {/* HSL */}
              <Col {...getShowColorBar('hsl')}>
                <Row className="my-2" id="hsl">

                  <Row className='my-2'>
                    <Col xs='auto'>
                      <FontAwesomeIcon icon={faPalette} />
                      <span className='color-space-name'>HSL</span>
                    </Col>
                  </Row>

                  <Row className='my-2'>
                    <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          色相(H)
                          <input type="text" className="form-control" id="hsl-h-text" onChange={() => {}} value={Math.trunc(getCurrentColor().hsl_h)} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <DivColorBar className='label hsl-h' id="label-hsl-h">　</DivColorBar>
                        <input type="range" className="form-range" id="hsl-h" min="0" max="359" step="0.0001" value={getCurrentColor().hsl_h} onChange={(e) => handleChangeRange(e, 'hsl_h')}></input>
                      </Row>
                    </Col>

                  </Row>
                  
                  <Row className='my-2'>
                   <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          彩度(S)
                          <input type="text" className="form-control" id="hsl-s-text" onChange={() => {}} value={Math.trunc(getCurrentColor().hsl_s * 1000) / 1000} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <DivColorBar className='label hsl-s' id="label-hsl-s">　</DivColorBar>
                        <input type="range" className="form-range" id="hsl-s" min="0.0001" max="1.001" step="0.001" value={getCurrentColor().hsl_s} onChange={(e) => handleChangeRange(e, 'hsl_s')}></input>
                      </Row>
                    </Col>
                  </Row>

                  <Row className='my-2'>
                    <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          輝度(L)
                          <input type="text" className="form-control" id="hsl-l-text" onChange={() => {}} value={Math.trunc(getCurrentColor().hsl_l * 1000) / 1000} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <DivColorBar className='label hsl-l' id="label-hsl-l">　</DivColorBar>
                        <input type="range" className="form-range" id="hsl-l" min="0.0001" max="1.001" step="0.001" value={getCurrentColor().hsl_l} onChange={(e) => handleChangeRange(e, 'hsl_l')}></input>
                      </Row>
                    </Col>
                  </Row>
                </Row>
              </Col>

              {/* CMYK */}
              <Col {...getShowColorBar('cmyk')}>
                <Row className="my-2" id="cmyk">

                  <Row className='my-2'>
                    <Col xs='auto'>
                      <FontAwesomeIcon icon={faPalette} />
                      <span className='color-space-name'>CMYK</span>
                    </Col>
                  </Row>

                  <Row className='my-2'>
                    <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          Cyan
                          <input type="text" className="form-control" id="cmyk-c-text" onChange={() => {}} value={Math.trunc(getCurrentColor().cmyk_c * 100)} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <DivColorBar className='label cmyk-c' id="label-cmyk-c">　</DivColorBar>
                        <input type="range" className="form-range" id="cmyk-c" min="0.0001" max="1.001" step="0.001" value={getCurrentColor().cmyk_c} onChange={(e) => handleChangeRange(e, 'cmyk_c')}></input>
                      </Row>
                    </Col>

                  </Row>
                  
                  <Row className='my-2'>
                   <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          Magenta
                          <input type="text" className="form-control" id="cmyk-m-text" onChange={() => {}} value={Math.trunc(getCurrentColor().cmyk_m * 100)} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <DivColorBar className='label cmyk-m' id="label-cmyk-m">　</DivColorBar>
                        <input type="range" className="form-range" id="cmyk-m" min="0.0001" max="1.001" step="0.001" value={getCurrentColor().cmyk_m} onChange={(e) => handleChangeRange(e, 'cmyk_m')}></input>
                      </Row>
                    </Col>
                  </Row>

                  <Row className='my-2'>
                   <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          Yellow
                          <input type="text" className="form-control" id="cmyk-y-text" onChange={() => {}} value={Math.trunc(getCurrentColor().cmyk_y * 100)} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <DivColorBar className='label cmyk-y' id="label-cmyk-y">　</DivColorBar>
                        <input type="range" className="form-range" id="cmyk-y" min="0.0001" max="1.001" step="0.001" value={getCurrentColor().cmyk_y} onChange={(e) => handleChangeRange(e, 'cmyk_y')}></input>
                      </Row>
                    </Col>
                  </Row>

                  <Row className='my-2'>
                   <Col xs={3} md={2}>
                      <form>
                        <label className="form-label">
                          Key plate
                          <input type="text" className="form-control" id="cmyk-k-text" onChange={() => {}} value={Math.trunc(getCurrentColor().cmyk_k * 100)} />
                        </label>
                      </form>
                    </Col>
                    <Col xs={9} md={10} className='col-color-range'>
                      <Row className='color-range'>
                        <DivColorBar className='label cmyk-k' id="label-cmyk-k">　</DivColorBar>
                        <input type="range" className="form-range" id="cmyk-k" min="0.0001" max="1.001" step="0.001" value={getCurrentColor().cmyk_k} onChange={(e) => handleChangeRange(e, 'cmyk_k')}></input>
                      </Row>
                    </Col>
                  </Row>


                </Row>
              </Col>

            </Row>
          </Container>


          {/* サンプルカラー */}
          <ButtonToolbar aria-label="Toolbar with button groups" className='mt-4'>
            <ButtonGroup className="me-2" aria-label="First group">
              <Button variant="outline-secondary" size="sm" onClick={() => {handleToggleSampleColor()}}>{showSampleColor ? "hide" : "show"}</Button>
            </ButtonGroup>
          </ButtonToolbar>

          <Container className='border mt-3'>
            <Row {...getShowSampleColor()}>
              {/* <DivSampleColor /> */}
              <DivSampleColors />
            </Row>
          </Container>

          {/* onClick={(e) => handleClick(id, true)} 

  onDragStart={(e) => handleDrag(id, true)} 


  onDrop={(e) => handleDrop(id, false)} 
  onDragOver={(e) => handleDragOver(id, true)}  */}
        
          {/* test */}
            {/* <Row className="mt-5" id="body" >
              <Row className='m-2'>
                <DivColor id="body1" className="my-5 py-3">
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
            </Row> */}

          </Col>

          <Col xs={12} md={3}>

          {/* カードPattern */}
          <Row className="mt-5" id="card" >
            <Col sm={12}>
              <Button variant="outline-secondary" size="sm" className='button-card' onClick={removeCard}>-</Button>
              <span className='mx-2'>Pattern</span>
              <Button variant="outline-secondary" size="sm" className='button-card' onClick={addCard}>+</Button>
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
