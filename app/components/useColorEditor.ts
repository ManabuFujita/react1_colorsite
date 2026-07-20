"use client";

import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Component } from '../types/Component';
import { Color } from '../types/Color';
import { getRamdomColor, getHexCodeFromRGB } from './ColorFunctions';
import {
  getInitialComponents,
  getInitialComponentColor,
  getCurrentColor,
  getMaxSampleColorNo,
  setOneRGBHSV,
  setRGB,
} from './ColorComponents';
import { getInitialCardCount } from './CardComponents';

const currentColorId = 'sample-color';

// components/cardCountのstateと、それに紐づくハンドラ群
export const useColorEditor = () => {
  const [components, setComponents] = useState<Component[]>(getInitialComponents());
  const [cardCount, setCardCount] = useState<number>(getInitialCardCount());

  // componentsが変わるたびlocalStorageへ保存(色変更・追加・削除など全部これ経由)
  useEffect(() => {
      // localStrageに保存
      localStorage.setItem('components', JSON.stringify(components));
  }, [components]);

  // cardCountが変わるたびlocalStorageへ保存
  useEffect(() => {
    // localStrageに保存
    localStorage.setItem('cardCount', JSON.stringify(cardCount));
  }, [cardCount]);

  // ヘッダー/フッターの実高さからbody部分の高さを計算するためのref(getColorStyle内のbody-background用)
  const appRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // 設定をクリアする
  const resetPage = () => {
    // componentsのcolorを全て初期化する
    components.map((component) => {
      component.color = getInitialComponentColor(component.id);
      console.log(component)
    });

    // cardcountを初期化する
    setCardCount(1);
  }

  // RGB/HSV/HSL/CMYKのスライダー操作。選択中コンポーネントがあればそれとcurrentColorの両方、なければcurrentColorのみ変更する
  const handleChangeRange = (e: React.ChangeEvent<HTMLInputElement>, colorName: string) => {
    const colorValue = Number(e.target.value);

    const clickedComonent = components.find((component) => component.isClick);

    if (clickedComonent === undefined) {
      // 色の設定値を変更(currentColorのみ)
      setOneRGBHSV(colorName, colorValue, currentColorId, components, setComponents);
    } else {
      // 色の設定値を変更(clickcomponentとcurrentColorの両方)
      setOneRGBHSV(colorName, colorValue, clickedComonent.id, components, setComponents);
    }
  }

  // idのcomponentが無ければ新規作成してcomponentsに追加する(あれば何もしない)
  const addComponent = (id: string,
    color: Color = getRamdomColor(uuidv4()),
    isCurrentColor: boolean = false,
    isSampleColor: boolean = false,) => {

    // idを検索して、無ければオブジェクトを作成する
    let component;
    component = components.find((component) => component.id === id);

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
        sampleColorNo: isSampleColor ? getMaxSampleColorNo(components) + 1 : -1,
      };

      setComponents([...components, newComponent]);
    }
  }

  // idのcomponentの色・選択状態から、DivColor/DivCard/サンプルカラーに渡すstyleを組み立てる
  const getColorStyle = (id: string) => {

    // componentを検索
    const component = components.find((component) => component.id === id);

    let style = {
      backgroundColor: 'gray', // 初期値
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
        setRGB(component.color, components, setComponents);

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

  // refやstateではなくただのクロージャ変数。dragstart→dropが同一レンダー内で完結する前提で動いている(壊れやすいが既存動作のまま維持)
  let draggingColorId: string;

  const handleDragStart = (e: React.DragEvent<HTMLElement>, id: string) => {
    console.log('drag start');

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

    console.log('---')
    console.log(getCurrentColor(components))
    console.log(draggingColorId)

    // ドラッグした色を取得
    const dragColor = components.find((currentColor) => currentColor.id === draggingColorId)?.color
    console.log(dragColor)

    if (dragColor !== undefined) {
      const deepCopy = components.map((component) => ({ ...component }));
      const newComponents = deepCopy.map((component) => {
        if (component.id === id) {
          // dragColorをそのまま参照させると色オブジェクトがドラッグ元と共有されてしまうため、
          // 値だけをコピーし、自分自身のcolor.idは維持する
          component.color = { ...dragColor, id: component.color.id };
        }
        return component;
      });

      setComponents(newComponents);
    }
  }

  return {
    components,
    setComponents,
    cardCount,
    setCardCount,
    appRef,
    headerRef,
    bodyRef,
    footerRef,
    resetPage,
    handleChangeRange,
    addComponent,
    getColorStyle,
    handleClick,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
}
