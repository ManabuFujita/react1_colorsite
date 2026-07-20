"use client";

/**
 * componentsのstate操作(追加・削除・色の更新・選択状態の切り替え)と、
 * RGB/HSV/HSL/CMYKパネルの表示切り替えに関するヘルパー関数群。
 */

import { Component } from '../types/Component';
import { getRamdomColor, getRamdomGrayScaleColor, getWhiteColor, RGB2HSV, RGB2HSL } from '../components/ColorFunctions';
import { v4 as uuidv4 } from 'uuid';
import { Dispatch, SetStateAction } from 'react';
import { Color } from '../types/Color';
import { changeColor } from '../components/ColorFunctions';

const currentColorId = 'sample-color';

/**
 * componentsの中から、保存済みサンプルカラー(isSampleColorがtrue)だけを抽出する。
 */
export const getSampleColors = (components: Component[]) => {
  let sampleColors = [];

  const sampleColorsFilter = components.filter((component) => component.isSampleColor);
  if (sampleColorsFilter === undefined) {
    sampleColors = getInitialComponents();
  } else {
    sampleColors = sampleColorsFilter;
  }

  return sampleColors;
}

/**
 * componentsの初期値を取得する。
 * localStorageに保存済みのデータがあればそれを復元し、なければデフォルト値を返す。
 */
export const getInitialComponents = () => {
  console.log('・getInitialComponents')

  let localComponents = null;
  if (typeof localStorage !== "undefined") {
    localComponents = localStorage.getItem('components');
  }

// console.log(localComponents)

  let components: Component[] = [];

  if (localComponents !== null) {
    components = JSON.parse(localComponents);
  } else {
    console.log('getInitialComponents_initial')
    components = initialComponentsValue;
  }

  return components;
}

/**
 * 編集中の色(currentColor)を表すComponentの初期値を生成する。
 */
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

/**
 * 初期表示用の、ランダムなグレースケール色を持つサンプルカラーのComponentを生成する。
 */
const getInitialRamdomColorComponent = () => {
  const id = uuidv4();
  // 新しいColor作成
  let component: Component = {
    id: id,
    isSampleColor: true,
    isCurrentColor: false,
    isHover: false,
    isClick: false,
    color: getRamdomGrayScaleColor(id),
    isDrag: false,
    sampleColorNo: 1,
  };

  return component;
}

  
const initialComponentsValue: Component[] = [getInitialCurrenctColorComponent(), getInitialRamdomColorComponent()];


/**
 * componentsの中から、編集中の色(isCurrentColorがtrue)を取得する。
 * 見つからない場合はデフォルトの初期色を返す。
 */
export const getCurrentColor = (components: Component[]): Color => {
  const currentColor = components.find((component) => component.isCurrentColor);
  if (currentColor === undefined) {
    return getInitialComponentColor(currentColorId);
  } else {
    return currentColor.color;
  }
}

/**
 * 指定したidのComponentに設定する初期色を返す。
 * body-backgroundは白、それ以外はランダムなグレースケール色になる。
 */
export const getInitialComponentColor = (id: string): Color => {
  switch (id) {
    case 'body-background':
      // return getHighLuminanceColor(id);
      return getWhiteColor(id);
    default:
      return getRamdomGrayScaleColor(id);
  }
}

/**
 * 保存済みサンプルカラーの中で最大のsampleColorNoを取得する(新規サンプル追加時の採番に使用)。
 */
export const getMaxSampleColorNo = (components: Component[]) => {
  let maxSampleColorNo = 0;
  components.forEach((component) => {
    if (component.isSampleColor && component.sampleColorNo > maxSampleColorNo) {
      maxSampleColorNo = component.sampleColorNo;
    }
  });
  return maxSampleColorNo;
}


/**
 * 編集中の色(currentColor)のRGB値を更新し、HSV/HSLも合わせて再計算する。
 */
export const setRGB = (color: Color, components: Component[], setComponents: Dispatch<SetStateAction<Component[]>>) => {
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

/**
 * componentId(または常にcurrentColor)に該当するcomponentについて、色の成分を1つ更新し、
 * 他の表色系(RGB/HSV/HSL/CMYK)の値も合わせて再計算する。
 */
export const setOneRGBHSV = (colorName: string, colorValue: number, componentId: String, components: Component[], setComponents: Dispatch<SetStateAction<Component[]>>) => {

  const deepCopy = components.map((component) => ({ ...component }));
  const newComponent = deepCopy.map((component) => {
    if (component.id === currentColorId || component.id === componentId) {

      let newColor = component.color;
      newColor[colorName] = colorValue;

      component.color = changeColor(colorName, component.color);
    }
    return component;
  })

  setComponents(newComponent);
}

/**
 * 指定したidのcomponentをcomponentsから削除する。
 */
export const removeComponent = (id: string, components: Component[], setComponents: Dispatch<SetStateAction<Component[]>>) => {
  const newComponents = components.filter((component) => component.id !== id);
    
  setComponents(newComponents);
}

/**
 * RGB/HSV/HSL/CMYKパネルの表示切り替えボタンが押されたとき、該当するパネルの表示状態を反転させる。
 */
export const handleToggleColorButton = (buttonName: string,
  showColorRGB: boolean,
  showColorHSV: boolean,
  showColorHSL: boolean,
  showColorCMYK: boolean,
  setShowColorRGB: Dispatch<SetStateAction<boolean>>,
  setShowColorHSV: Dispatch<SetStateAction<boolean>>,
  setShowColorHSL: Dispatch<SetStateAction<boolean>>,
  setShowColorCMYK: Dispatch<SetStateAction<boolean>>) => {

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

/**
 * RGB/HSV/HSL/CMYKパネルの表示切り替えボタンに、現在の表示状態に応じたスタイル(active)を付与する。
 */
export const getColorButtonStyle = (buttonName: string,
  showColorRGB: boolean,
  showColorHSV: boolean,
  showColorHSL: boolean,
  showColorCMYK: boolean) => {

  switch (buttonName) {
    case 'button_rgb':
      return showColorRGB ? {active: true} : {active: false};

    case 'button_hsv':
      return showColorHSV ? {active: true} : {active: false};

    case 'button_hsl':
      return showColorHSL ? {active: true} : {active: false};

    case 'button_cmyk':
      return showColorCMYK ? {active: true} : {active: false};

    default:
      return {};
  }
  // return showColorSelector ? '' : {style: {display: 'none' }}
}

/**
 * RGB/HSV/HSL/CMYKパネルの表示状態の組み合わせに応じて、
 * 各パネルの幅(xxl)や表示/非表示を決定するpropsを返す。
 */
export const getShowColorSelector = (ColorSelectorName: string,
  showColorRGB: boolean,
  showColorHSV: boolean,
  showColorHSL: boolean,
  showColorCMYK: boolean
) => {

  switch (ColorSelectorName) {
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

    case 'hsv':
      if (!showColorRGB && showColorHSV && !showColorHSL && !showColorCMYK) {
        return {xxl: 12, } 
      } else if (showColorHSV) {
        return {xxl: 6, }
      } else {
        return {xxl: 6, style: {display: 'none' }}
      }

    case 'hsl':
      if (!showColorRGB && !showColorHSV && showColorHSL && !showColorCMYK) {
        return {xxl: 12, } 
      } else if (showColorHSL) {
        return {xxl: 6, }
      } else {
        return {xxl: 6, style: {display: 'none' }}
      }

    case 'cmyk':
      if (!showColorRGB && !showColorHSV && !showColorHSL && showColorCMYK) {
        return {xxl: 12, } 
      } else if (showColorCMYK) {
        return {xxl: 6, }
      } else {
        return {xxl: 6, style: {display: 'none' }}
      }

    default:
      return {};
  }
}

