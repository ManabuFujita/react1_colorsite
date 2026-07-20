type ColorObject = {
  [key: string]: number | string;
}

/**
 * RGB/HSV/HSL/CMYKの値をまとめて保持する色の型。
 * いずれかの値が変更されるたびに、他の表色系の値も再計算して同期させる。
 */
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