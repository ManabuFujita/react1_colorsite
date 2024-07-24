"use client";

import { Component } from '../types/Component';
import { getRamdomColor, getRamdomGrayScaleColor, getWhiteColor, RGB2HSV, RGB2HSL } from '../components/ColorFunctions';
import { v4 as uuidv4 } from 'uuid';
import { Dispatch, SetStateAction } from 'react';
import { Color } from '../types/Color';
import { changeColor } from '../components/ColorFunctions';

const currentColorId = 'sample-color';

// componentsからsample colorを取得する
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

// componentの初期値を取得
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

  
const initialComponentsValue: Component[] = [getInitialCurrenctColorComponent(), getInitialRamdomColorComponent()];


// componentsからcurrentcolorを取得する
export const getCurrentColor = (components: Component[]): Color => {
  const currentColor = components.find((component) => component.isCurrentColor);
  if (currentColor === undefined) {
    return getInitialComponentColor(currentColorId);
  } else {
    return currentColor.color;
  }
}

export const getInitialComponentColor = (id: string): Color => {
  switch (id) {
    case 'body-background':
      // return getHighLuminanceColor(id);
      return getWhiteColor(id);
    default:
      return getRamdomGrayScaleColor(id);
  }
}

export const getMaxSampleColorNo = (components: Component[]) => {
  let maxSampleColorNo = 0;
  components.forEach((component) => {
    if (component.isSampleColor && component.sampleColorNo > maxSampleColorNo) {
      maxSampleColorNo = component.sampleColorNo;
    }
  });
  return maxSampleColorNo;
}


// sample colorにセットする
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

export const setOneRGBHSV = (colorName: string, colorValue: number, componentId: String, components: Component[], setComponents: Dispatch<SetStateAction<Component[]>>) => {

  const deepCopy = components.map((component) => ({ ...component }));
  const newComponent = deepCopy.map((component) => {
    if (component.isCurrentColor || component.color.id === componentId) {

      let newColor = component.color;
      newColor[colorName] = colorValue;

      component.color = changeColor(colorName, component.color);
    }
    return component;
  })

  setComponents(newComponent);
}

export const removeComponent = (id: string, components: Component[], setComponents: Dispatch<SetStateAction<Component[]>>) => {
  const newComponents = components.filter((component) => component.id !== id);
    
  setComponents(newComponents);
}

// 各色の表示・非表示
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

