declare module 'react-world-flags' {
  import * as React from 'react';

  interface FlagProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    code: string; // ISO country code, like 'KE' or 'US'
  }

  const Flag: React.FC<FlagProps>;
  export default Flag;
}
