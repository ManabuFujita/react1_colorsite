import React from 'react';
// import logo from './logo.svg';
import './App.css';

import Color from './Color';

import { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Link, Routes, redirect } from 'react-router-dom';
import { Container, Navbar, Nav, Offcanvas, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { CompletionInfoFlags } from 'typescript';

import { createUseStyles } from "react-jss";  
import { deflate } from 'zlib';



function App() {

  // メニューバー
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((s) => !s);


  // 色
  const [currentColor, setCurrentColor] = useState<Color>({r: 100, g: 100, b: 100, h:0.5, s:0.5, v:0.5});

  type ColorObject = {
    [key: string]: number;
  }

  type Color = ColorObject & {
      r: number;
      g: number;
      b: number;
      h: number;
      s: number;
      v: number;
  };

  const handleChangeRange = (e: React.ChangeEvent<HTMLInputElement>, colorName: string) => {
    const colorValue = Number(e.target.value);

    // console.log(colorName);
    // console.log(value);

    const clickArea = components.find((component) => component.isClick);

    if (clickArea === undefined) {
      alert("クリックしてください");
      return;
    }

    // 色の設定値を変更
    changeOneCurrentColor(colorName, colorValue);

    // 選択箇所の色も変更する
    changeClickedColor(currentColor);
  }

  const changeAllCurrentColor = (color: Color) => {
    const newColor = {...currentColor};
    newColor['r'] = color.r;
    newColor['g'] = color.g;
    newColor['b'] = color.b;

    setCurrentColor(newColor);

  }

  const changeOneCurrentColor = (colorName: string, colorValue: number) => {
    const newColor = {...currentColor};
    newColor[colorName] = colorValue;

    newColor['h'] = getH(currentColor);
    newColor['s'] = getS(currentColor);
    newColor['v'] = getV(currentColor);
    
    setCurrentColor(newColor);
  }





  const rgb2hex = (color: Color) => {
    return "#"
      + Math.trunc(color.r).toString(16).padStart(2, '0') 
      + Math.trunc(color.g).toString(16).padStart(2, '0') 
      + Math.trunc(color.b).toString(16).padStart(2, '0');
  };

  const colorHex = (color: Color) => {
    return rgb2hex(color);
  };

  const randomColor = () => {
    //新しいColor作成
    const newColor: Color = {
      r: Math.trunc(Math.random() * 255),
      g: Math.trunc(Math.random() * 255),
      b: Math.trunc(Math.random() * 255),
      h: 0.5,
      s: 0.5,
      v: 0.5,
    };
    return newColor;
  }




  const changeClickedColor = (color: Color) => {

    const deepCopy = components.map((component) => ({ ...component }));
    // console.log(deepCopy);

    const newComponents = deepCopy.map((component) => {
      if (component.isClick) {
        component.color = color;
      }
      return component;
    });

    setComponents(newComponents);

  }


  // 明るさ等
  const handleChangeRange2 = (e: React.ChangeEvent<HTMLInputElement>, colorName: string) => {
    const value = Number(e.target.value);

    console.log(colorName);
    console.log(value);

    const clickArea = components.find((component) => component.isClick);

    if (clickArea === undefined) {
      alert("クリックしてください");
      return;
    }

    // 色の設定値を変更
    // switch (colorName) {
    //   case "v":
        changeCurrentColorHSV(currentColor, colorName, value);
    //     break;

    //   case "h":
    //     changeCurrentColorH(currentColor, value);
    //     break;

    //   case "s":
    //     changeCurrentColorS(currentColor, value);
    //     break;

    //   default:
    //     break;
    // }


    // 選択箇所の色も変更する
    changeClickedColor(currentColor);
  }

  // 輝度
  const changeCurrentColorHSV = (color: Color, colorName: string, v: number) => {
    let newColor = {...currentColor};
    newColor[colorName] = v;

    newColor = HSV2RGB(newColor);

    // const max = Math.max(color.r, color.g, color.b);
    // let ratio;
    // if (max > 0) {
    //   ratio = (v * 255) / Math.max(color.r, color.g, color.b);
    // } else {
    //   ratio = 1;
    // }

    // const newColor = {...currentColor};
    // newColor['r'] = (color.r + 0.01) * ratio;
    // newColor['g'] = (color.g + 0.01) * ratio;
    // newColor['b'] = (color.b + 0.01) * ratio;
    // newColor['v'] = v;
    
    setCurrentColor(newColor);
  }



  // 彩度
  const changeCurrentColorS = (color: Color, v: number) => {

  }

  // 色相
  const changeCurrentColorH = (color: Color, v: number) => {

  }


  // RGB to HSV
  const RGB2HSV = (color: Color) => {
    color['h'] = getH(color);
    color['s'] = getS(color);
    color['v'] = getV(color);
    return color;
  }

  const getH = (color: Color) => {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
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

  const getS = (color: Color) => {
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    const s = (max - min) / max;
    return s;
  }

  const getV = (color: Color) => {
    const max = Math.max(color.r, color.g, color.b);
    const v = (max / 255);
    return v;
  }

  // HSV to RGB
  const HSV2RGB = (color: Color) => {
    const max = color.v * 255;
    const min = max - (color.s * max);

    let r, g, b;
    if (color.h <= 60) {
      r = max;
      g = (color.h / 60) * (max - min) + min;
      b = min;
    } else if (color.h <= 120) {
      r = ((120 - color.h) / 60) * (max - min) + min;
      g = max;
      b = min;
    } else if (color.h <= 180) {
      r = min;
      g = max;
      b = ((color.h - 120) / 60) * (max - min) + min;
    } else if (color.h <= 240) {
      r = min;
      g = ((240 - color.h) / 60) * (max - min) + min;
      b = max;
    } else if (color.h <= 300) {
      r = ((color.h - 240) / 60) * (max - min) + min;
      g = min;
      b = max;
    } else {
      r = max;
      g = min;
      b = ((360 - color.h) / 60) * (max - min) + min;
    }

    color['r'] = r;
    color['g'] = g;
    color['b'] = b;

    return color;
  }




  // 選択したコンポーネント
  type Component = {
    id: string;
    isHover: boolean;
    isClick: boolean;
    color: Color;
  }
  const [components, setComponents] = useState<Component[]>([]);

  // click動作取得
  const handleClick = (id: string, isClick: boolean) => {

    const deepCopy = components.map((component) => ({ ...component }));
    const newComponents = deepCopy.map((component) => {
      
      // クリック時はhoverを解除
      component.isHover = false;

      if (component.id === id) {
        component.isClick = true;

        // 選択したコンポーネントの色を入力欄にセット
        changeAllCurrentColor(component.color);

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






  // const styles = {
  //   button: {
  //         background: colorHex(currentColor),
  //         border: "10px",
  //   }
  // };

  // const Button = ({...props}) => {

  //   // console.log(props);

  //   const useStyles = createUseStyles(styles);
  //   const classes = useStyles({...props});
  //   return (
  //         <button className={classes.button}>Button </button>
  //   );
  // };


  const DivColor = ({...props}) => {

    // console.log("props");
    // console.log(props);

    const id = String(props.id);

    // idを検索して、無ければオブジェクトを作成する

    let component;
    component = components.find((component) => component.id === id);

    if (component === undefined) {
      //新しいComponent作成
      const newComponent: Component = {
        id: id,
        isHover: false,
        isClick: false,
        color: randomColor(),
      };

      setComponents([...components, newComponent]);
    }

    // const style = () => {
    //   return component === undefined 
    //     ? { color: '#ed4134' } 
    //     : { color: colorHex(component.color) };
    // }
    component = components.find((component) => component.id === id);

    // console.log(id);
    // console.log(component);

    let style;
    if (component === undefined) {
      style = { backgroundColor: 'blue' };
    } else {
      style = { backgroundColor: colorHex(component.color) };



      if (component.isClick) {
        // styleを追加
        Object.assign(style, { 
          border: "solid",
          borderColor: "gray",
          color: "red",
        });
      } else {
        if (component.isHover) {
          // styleを追加
          Object.assign(style, { 
            border: "solid",
            borderColor: "red",
          });
        }
      }


    }
    const className = 'color-change';

    // styleを設定してdivタグに変換
    return <div 
      style={style} 
      className={className} 
      // onMouseEnter={() => handleHover(id, true)} 
      // onMouseLeave={() => handleHover(id, false)} 
      onClick={() => handleClick(id, true)} 
      >
        { props.children }
      </div>
  };

  
  const DivColorBar = ({...props}) => {
    const id = String(props.id);

    const className = 'color-bar-change';

    let colorMin = {...currentColor};
    let colorMax = {...currentColor};
    let style;

    switch (id) {
      case "label-h":
        let color1 = {...currentColor};
        let color2 = {...currentColor};
        let color3 = {...currentColor};
        let color4 = {...currentColor};
        color1['h'] = 0;
        color2['h'] = 90;
        color3['h'] = 180;
        color4['h'] = 270;
        color1 = HSV2RGB(color1);
        color2 = HSV2RGB(color2);
        color3 = HSV2RGB(color3);
        color4 = HSV2RGB(color4);
        style = { background: "linear-gradient(to right, " 
          + getRGBParam(color1) + ", " 
          + getRGBParam(color2) + ", " 
          + getRGBParam(color3) + ", " 
          + getRGBParam(color4) + ", " 
          + getRGBParam(color1) + ")" };
        break;

      case "label-s":
        colorMin['s'] = 0;
        colorMax['s'] = 1;
        colorMin = HSV2RGB(colorMin);
        colorMax = HSV2RGB(colorMax);
        style = { background: "linear-gradient(to right, " + getRGBParam(colorMin) + ", " + getRGBParam(colorMax) + ")" };
        break;

      case "label-v":
        colorMin['v'] = 0;
        colorMax['v'] = 1;
        colorMin = HSV2RGB(colorMin);
        colorMax = HSV2RGB(colorMax);
        style = { background: "linear-gradient(to right, " + getRGBParam(colorMin) + ", " + getRGBParam(colorMax) + ")" };
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

  const getRGBParam = (color: Color) => {
    return (
      'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')'
    );
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


        <Container className="mt-5 pt-5" id="body" >

          <Row className='my-2'>
            <Col sm={2}>
              <form>
                <label className="form-label">
                  R
                  <input type="text" className="form-control" id="r-text" onChange={() => {}} value={(currentColor.r)} />
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
                  <input type="text" className="form-control" id="g-text" onChange={() => {}} value={(currentColor.g)} />
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
                  <input type="text" className="form-control" id="b-text" onChange={() => {}} value={(currentColor.b)} />
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

          {/* 明るさ等 */}
          <Row className='my-2'>
            <Col sm={2}>
              <form>
                <label className="form-label">
                  明るさ
                  <input type="text" className="form-control" id="v-text" onChange={() => {}} value={currentColor.v} />
                </label>
              </form>
            </Col>
            <Col sm={10}>
              <Row className='color-range'>
                <DivColorBar className='label v' id="label-v">　</DivColorBar>
                <input type="range" className="form-range" id="v" min="0.0001" max="1" step="0.0001" value={currentColor.v} onChange={(e) => handleChangeRange2(e, 'v')}></input>
              </Row>
            </Col>
          </Row>

          <Row className='my-2'>
            <Col sm={2}>
              <form>
                <label className="form-label">
                  彩度
                  <input type="text" className="form-control" id="s-text" onChange={() => {}} value={currentColor.s} />
                </label>
              </form>
            </Col>
            <Col sm={10}>
              <Row className='color-range'>
                <DivColorBar className='label s' id="label-s">　</DivColorBar>
                <input type="range" className="form-range" id="s" min="0.0001" max="1" step="0.0001" value={currentColor.s} onChange={(e) => handleChangeRange2(e, 's')}></input>
              </Row>
            </Col>
          </Row>

          <Row className='my-2'>
            <Col sm={2}>
              <form>
                <label className="form-label">
                  色相
                  <input type="text" className="form-control" id="h-text" onChange={() => {}} value={currentColor.h} />
                </label>
              </form>
            </Col>
            <Col sm={10}>
              <Row className='color-range'>
                <DivColorBar className='label h' id="label-h">　</DivColorBar>
                <input type="range" className="form-range" id="h" min="0" max="359" step="0.0001" value={currentColor.h} onChange={(e) => handleChangeRange2(e, 'h')}></input>
              </Row>
            </Col>
          </Row>

          
        </Container>

      

        <Container className="mt-5 pt-5" id="body" >
          <Row className='m-2'>
            <DivColor id="body1">
              aaa
            </DivColor>
          </Row>
          {/* <Row className='m-2'>
            <DivColor id="body2">
              aaa
            </DivColor>
          </Row>
          <Row className='m-2'>
            <DivColor id="body3">
              aaa
            </DivColor>
          </Row> */}
        </Container>


        <Navbar fixed="bottom">
          
          <DivColor className="footer">
            <Container>
              <Navbar.Text className="text-white">
                &copy; 2024 My SPA Site. All rights reserved.
              </Navbar.Text>
            </Container>
          </DivColor>

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
