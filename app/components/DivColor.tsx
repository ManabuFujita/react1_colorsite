"use client";

import { ReactNode, useEffect } from 'react';
import type { useColorEditor } from './useColorEditor';
import { getInitialComponentColor } from './ColorComponents';

type DivColorProps = Pick<ReturnType<typeof useColorEditor>,
  'addComponent' | 'getColorStyle' | 'handleClick' | 'handleDragStart' | 'handleDragOver' | 'handleDrop'
> & {
  id: string;
  className?: string;
  children?: ReactNode;
};

/**
 * クリックで選択、ドラッグ&ドロップで色を変更できる汎用のdiv。
 * ヘッダー・フッター・背景など、色を割り当てたい領域をこのコンポーネントでラップして使う。
 */
export const DivColor = ({ id, className, children, addComponent, getColorStyle, handleClick, handleDragStart, handleDragOver, handleDrop }: DivColorProps) => {
  console.log('DivColor')

  useEffect(() => {
    // idを検索して、無ければオブジェクトを作成する
    addComponent(id, getInitialComponentColor(id));
  }, [id, addComponent]);

  const style = getColorStyle(id);

  const divClassName = 'color-change can-select ' + (className ?? '');

  // styleを設定してdivタグに変換
  return <div
    id={id}
    style={style}
    className={divClassName}

    onClick={(e) => handleClick(e, id)}
    onDragStart={(e) => handleDragStart(e, id)}
    onDragOver={(e) => handleDragOver(e, id)}
    onDrop={(e) => handleDrop(e, id)}
    >
      { children }
    </div>
};
