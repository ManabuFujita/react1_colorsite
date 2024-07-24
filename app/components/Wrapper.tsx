import { FC, ReactNode } from 'react';

type WrapperProps = {
  children?: ReactNode;
};
const Wrapper: FC<WrapperProps> = ({ children }) => {
  return <div className="wrapper">{children}</div>;
};

export default Wrapper;