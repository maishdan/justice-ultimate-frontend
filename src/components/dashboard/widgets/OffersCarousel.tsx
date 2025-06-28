// src/components/dashboard/widgets/OffersCarousel.tsx
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const offers = [
  {
    title: '🔥 Summer Sale - Up to 25% Off Rentals',
    description: 'Book a car this week and enjoy big discounts on SUVs and sedans.',
    image: '/images/offers/summer-sale.jpg',
  },
  {
    title: '🚘 Loyalty Rewards Program',
    description: 'Earn points every time you rent and redeem them for future discounts.',
    image: '/images/offers/loyalty.jpg',
  },
  {
    title: '🛠 Free Servicing on Long-Term Rentals',
    description: 'Enjoy a free full servicing for rentals booked for 30+ days.',
    image: '/images/offers/servicing.jpg',
  },
  {
    title: '🎁 Refer & Earn Cashback!',
    description: 'Invite your friends and earn up to KES 500 in cashback per referral.',
    image: '/images/offers/referral.jpg',
  },
];

const OffersCarousel: React.FC = () => {
  return (
    <div className="bg-green-900/70 rounded-lg shadow-md overflow-hidden">
      <h2 className="text-xl font-bold px-4 pt-4 pb-2 text-white">🎁 Special Offers</h2>
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        swipeable
        emulateTouch
        className="rounded-b-lg"
      >
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
