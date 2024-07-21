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