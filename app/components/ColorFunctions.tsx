type ColorObject = {
  [key: string]: number | string;
}

export type Color = ColorObject & {
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

export const RGB2HSV = (color: Color) => {
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

export const RGB2HSL = (color: Color) => {
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

export const RGB2CMYK = (color: Color) => {
  color['cmyk_c'] = getCMYK_C(color);
  color['cmyk_m'] = getCMYK_M(color);
  color['cmyk_y'] = getCMYK_Y(color);
  color['cmyk_k'] = getCMYK_K(color);
  return color;
}

// HSV to RGB
export const HSV2RGB = (color: Color) => {
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
export const HSL2RGB = (color: Color) => {
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
export const CMYK2RGB = (color: Color) => {
  const r = 255 * (1 - color.cmyk_c) * (1 - color.cmyk_k);
  const g = 255 * (1 - color.cmyk_m) * (1 - color.cmyk_k);
  const b = 255 * (1 - color.cmyk_y) * (1 - color.cmyk_k);

  color['r'] = r;
  color['g'] = g;
  color['b'] = b;

  return color;
}

const newColorFromRGB = (color: Color): Color => {

  color = RGB2HSV(color);
  color = RGB2HSL(color);
  color = RGB2CMYK(color);

  return color;
}

const newColorFromHSV = (color: Color): Color => {

  color = HSV2RGB(color);

  color = RGB2HSL(color);
  color = RGB2CMYK(color);

  return color;
}

const newColorFromHSL = (color: Color): Color => {

  color = HSL2RGB(color);

  color = RGB2HSV(color);
  color = RGB2CMYK(color);

  return color;
}

const newColorFromCMYK = (color: Color): Color => {

  color = CMYK2RGB(color);

  color = RGB2HSV(color);
  color = RGB2HSL(color);

  return color;
}


export const getRamdomColor = (id: string) => {
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

  // newColor = RGB2HSV(newColor);
  // newColor = RGB2HSL(newColor);
  // newColor = RGB2CMYK(newColor);

  newColor = newColorFromRGB(newColor);

  return newColor;
}

export const getRamdomGrayScaleColor = (id: string) => {
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

export const getWhiteColor = (id: string) => {
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

export const getHighLuminanceColor = (id: string) => {
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


export const changeColor = (colorName: string, color: Color): Color => {
  switch (colorName) {
    case 'r':
    case 'g':
    case 'b':
      color = newColorFromRGB(color);
      break;

    case 'hsv_h':
    case 'hsv_s':
    case 'hsv_v':
      color = newColorFromHSV(color);
      break;

    case 'hsl_h':
    case 'hsl_s':
    case 'hsl_l':
      color = newColorFromHSL(color);
      break;

    case 'cmyk_c':
    case 'cmyk_m':
    case 'cmyk_y':
    case 'cmyk_k':
      color = newColorFromCMYK(color);
      break;

    default:
      break;
  }

  return color;
}




export const getRGBCodeFromRGB = (color: Color) => {
  const displayColor = getDisplayColor(color);
  return (
    'rgb(' + displayColor.r + ', ' + displayColor.g + ', ' + displayColor.b + ')'
  );
}

export const getHexCodeFromRGB = (color: Color) => {
  const displayColor = getDisplayColor(color);
  return "#"
    + Math.trunc(displayColor.r).toString(16).padStart(2, '0') 
    + Math.trunc(displayColor.g).toString(16).padStart(2, '0') 
    + Math.trunc(displayColor.b).toString(16).padStart(2, '0');
};

export const getHSLCodeFromRGB = (color: Color) => {
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
