"use client";

import { Color } from "../types/Color";
import { getCurrentColor } from "./ColorComponents";
import { CMYK2RGB, HSL2RGB, HSV2RGB, getRGBCodeFromRGB } from "./ColorFunctions";

interface ColorSelectorProps {
  // colorValue: number;
  text: string;
  id: string;
  color: Color;
  colorValue: number;
  colorRange: number;
  handleChangeRange: (event: any, colorName: string) => void;
  min: number;
  max: number;
  step: number;
}

export const ColorSelectors = ({ text, id, color, colorValue, colorRange, handleChangeRange, min, max, step }: ColorSelectorProps) => {
  return (
    <div>

      <div className='my-2 grid grid-cols-12 gap-4'>
        {/* <div className="col-span-3 md:col-span-2"> */}
        <div className="col-span-3 md:col-span-2">
          <form>
            <label className="form-label">
              {text}
              <input type="text" className="form-control" id={id + "-text"} onChange={() => {}} value={colorValue} />
            </label>
          </form>
        </div>


        {/* <div className="col-span-9 md:col-span-10 col-color-range"> */}
        <div className="col-span-9 md:col-span-10 col-color-range">
          <div className="color-range">
          <DivColorSelector className={"label " + id} id={"label-" + id} color={{ ...color }}>　</DivColorSelector>
            <div className={"label " + id}>　</div>
            <input type="range" className="form-range" id={id} min={min} max={max} step={step} value={colorRange} onChange={(e) => handleChangeRange(e, id)}></input>
          </div>
        </div>
      </div>
      
    </div>
  )
}



export const DivColorSelector = ({...props}) => {
  // const id = String(props.id);

  const className = 'color-bar-change';

  let colorMin = { ...props.color };
  let colorMax = { ...props.color };
  let style;

  switch (props.id) {

    // RGB
    case "label-rgb-r":
      style = { background: "linear-gradient(to right, rgb(255, 255, 255), rgb(255, 0, 0))" };
      break;

    case "label-rgb-g":
      style = { background: "linear-gradient(to right, rgb(255, 255, 255), rgb(0, 255, 0))" };
      break;

    case "label-rgb-b":
      style = { background: "linear-gradient(to right, rgb(255, 255, 255), rgb(0, 0, 255))" };
      break;
      
    // HSV
    case "label-hsv-h":
      let colorv1 = { ...props.color };
      let colorv2 = { ...props.color };
      let colorv3 = { ...props.color };
      let colorv4 = { ...props.color };
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
      let colorl1 = { ...props.color };
      let colorl2 = { ...props.color };
      let colorl3 = { ...props.color };
      let colorl4 = { ...props.color };
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
