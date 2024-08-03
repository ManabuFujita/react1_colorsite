import { Color } from './Color';

// 選択したコンポーネント
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