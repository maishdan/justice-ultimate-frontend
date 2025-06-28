declare module 'react-responsive-carousel' {
  import * as React from 'react';

  export interface CarouselProps {
    showArrows?: boolean;
    showStatus?: boolean;
    showIndicators?: boolean;
    showThumbs?: boolean;
    infiniteLoop?: boolean;
    autoPlay?: boolean;
    interval?: number;
    stopOnHover?: boolean;
    swipeable?: boolean;
    dynamicHeight?: boolean;
    emulateTouch?: boolean;
    selectedItem?: number;
    onChange?: (index: number, item: React.ReactNode) => void;
    onClickItem?: (index: number, item: React.ReactNode) => void;
    onClickThumb?: (index: number, item: React.ReactNode) => void;
    renderArrowPrev?: (onClickHandler: () => void, hasPrev: boolean, label: string) => React.ReactNode;
    renderArrowNext?: (onClickHandler: () => void, hasNext: boolean, label: string) => React.ReactNode;
    renderIndicator?: (onClickHandler: () => void, isSelected: boolean, index: number, label: string) => React.ReactNode;
    renderThumbs?: () => React.ReactNode[];
    renderStatus?: () => React.ReactNode;
    renderItem?: (item: React.ReactNode, options?: { isSelected: boolean; index: number }) => React.ReactNode;
    axis?: 'horizontal' | 'vertical';
    centerMode?: boolean;
    centerSlidePercentage?: number;
    useKeyboardArrows?: boolean;
    children?: React.ReactNode;
    className?: string;
  }

  export class Carousel extends React.Component<CarouselProps> {}
}
