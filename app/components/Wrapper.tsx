import { FC, ReactNode } from 'react';

type WrapperProps = {
  children?: ReactNode;
};

/**
 * SSRを無効化し、クライアントサイドのみでレンダリングするためのラッパー。
 * localStorageに依存するAppコンポーネントを、page.tsxから`next/dynamic`(`ssr: false`)で読み込む際に使用する。
 */
const Wrapper: FC<WrapperProps> = ({ children }) => {
  return <div className="wrapper">{children}</div>;
};

export default Wrapper;