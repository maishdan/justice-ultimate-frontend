// src/components/dashboard/widgets/OffersCarousel.tsx
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface Offer {
  title: string;
  description: string;
  image: string;
}

interface OffersCarouselProps {
  offers?: Offer[];
}

const OffersCarousel: React.FC<OffersCarouselProps> = ({ offers }) => {
  if (!offers || offers.length === 0) return null;
  return (
    <div className="bg-green-900/70 rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-bold px-4 pt-4 pb-2 text-white">Special Offers</h2>
      <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={5000} swipeable emulateTouch className="rounded-b-lg">
        {offers.map((offer, index) => (
          <div key={index} className="relative text-center text-white">
            <img src={offer.image} alt={offer.title} className="object-cover h-64 w-full" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-left">
              <h3 className="text-lg font-semibold">{offer.title}</h3>
              <p className="text-sm opacity-90">{offer.description}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default OffersCarousel;
