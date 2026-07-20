import { Color } from './Color';

/**
 * 画面上で色変更の対象になる要素(ヘッダー・サンプルカラー・カードなど)を表す型。
 */
export type Component = {
  id: string;
  isSampleColor: boolean;
  isCurrentColor: boolean;
  isHover: boolean;
  isClick: boolean;
  color: Color;
  isDrag: boolean;
  sampleColorNo: number;
}