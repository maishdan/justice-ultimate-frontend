import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  FiGift, 
  FiStar, 
  FiClock, 
  FiPercent,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiHeart
} from 'react-icons/fi';

export default function OffersDeals() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(1250);
  const [loyaltyTier, setLoyaltyTier] = useState('Gold');

  useEffect(() => {
    // Mock offers data
    const mockOffers = [
      {
        id: '1',
        title: '🔥 Summer Sale - Up to 25% Off',
        description: 'Book any SUV or sedan this week and enjoy massive discounts',
        discount: '25%',
        validUntil: '2024-02-15',
        code: 'SUMMER25',
        category: 'seasonal',
        minSpend: 50000,
        maxDiscount: 15000,
        image: '/images/offers/summer-sale.jpg'
      },
      {
        id: '2',
        title: '🎁 Loyalty Rewards - Double Points',
        description: 'Earn double loyalty points on all rentals this month',
        discount: '2x Points',
        validUntil: '2024-01-31',
        code: 'DOUBLEPOINTS',
        category: 'loyalty',
        minSpend: 0,
        maxDiscount: 0,
        image: '/images/offers/loyalty.jpg'
      },
      {
        id: '3',
        title: '🚘 First-Time User Discount',
        description: 'Special 15% off for new customers on their first rental',
        discount: '15%',
        validUntil: '2024-03-01',
        code: 'FIRST15',
        category: 'new_user',
        minSpend: 30000,
        maxDiscount: 10000,
        image: '/images/offers/first-time.jpg'
      },
      {
        id: '4',
        title: '🛠 Free Servicing on Long-Term Rentals',
        description: 'Get free full servicing for rentals booked for 30+ days',
        discount: 'Free Service',
        validUntil: '2024-02-28',
        code: 'FREESERVICE',
        category: 'service',
        minSpend: 500000,
        maxDiscount: 25000,
        image: '/images/offers/servicing.jpg'
      },
      {
        id: '5',
        title: '🎯 Weekend Special - Luxury Cars',
        description: '20% off all luxury vehicles for weekend rentals',
        discount: '20%',
        validUntil: '2024-01-28',
        code: 'LUXURY20',
        category: 'weekend',
        minSpend: 80000,
        maxDiscount: 20000,
        image: '/images/offers/luxury.jpg'
      },
      {
        id: '6',
        title: '👥 Group Booking Discount',
        description: 'Book 3+ vehicles and get 10% off total bill',
        discount: '10%',
        validUntil: '2024-02-10',
        code: 'GROUP10',
        category: 'group',
        minSpend: 150000,
        maxDiscount: 30000,
        image: '/images/offers/group.jpg'
      }
    ];

    setOffers(mockOffers);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (dateString: string) => {
    const endDate = new Date(dateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'seasonal':
        return 'bg-orange-100 text-orange-800';
      case 'loyalty':
        return 'bg-purple-100 text-purple-800';
      case 'new_user':
        return 'bg-green-100 text-green-800';
      case 'service':
        return 'bg-blue-100 text-blue-800';
      case 'weekend':
        return 'bg-pink-100 text-pink-800';
      case 'group':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'seasonal':
        return '🔥';
      case 'loyalty':
        return '🎁';
      case 'new_user':
        return '🆕';
      case 'service':
        return '🛠️';
      case 'weekend':
        return '🎯';
      case 'group':
        return '👥';
      default:
        return '🎉';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Offers & Deals</h1>
          <p className="text-gray-600">Exclusive promotions and loyalty rewards just for you</p>
        </div>
        <div className="flex gap-4">
          <Button>
            <FiGift className="mr-2" />
            Refer Friends
          </Button>
          <Button variant="outline">
            <FiStar className="mr-2" />
            Loyalty Program
          </Button>
        </div>
      </div>

      {/* Loyalty Status */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Loyalty Program</h2>
              <p className="text-purple-100 mb-4">Earn points with every rental and unlock exclusive benefits</p>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-purple-200">Current Points</p>
                  <p className="text-3xl font-bold">{loyaltyPoints.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-200">Tier Status</p>
                  <p className="text-2xl font-bold">{loyaltyTier}</p>
                </div>
                <div>
                  <p className="text-sm text-purple-200">Points to Next Tier</p>
                  <p className="text-xl font-bold">750</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 p-4 rounded-lg">
                <p className="text-sm">Available Rewards</p>
                <p className="text-2xl font-bold">KES {(loyaltyPoints * 10).toLocaleString()}</p>
                <p className="text-xs">Worth of rewards</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Offers</p>
                <p className="text-2xl font-bold text-green-600">{offers.length}</p>
              </div>
              <FiGift className="text-green-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Savings</p>
                <p className="text-2xl font-bold text-blue-600">KES 45,000</p>
              </div>
              <FiTrendingUp className="text-blue-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Referrals</p>
                <p className="text-2xl font-bold text-purple-600">8</p>
              </div>
              <FiUsers className="text-purple-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rewards Earned</p>
                <p className="text-2xl font-bold text-orange-600">KES 12,500</p>
              </div>
              <FiAward className="text-orange-500 text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => {
          const daysRemaining = getDaysRemaining(offer.validUntil);
          return (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/1967-ford-mustang.png';
                  }}
                />
                <Badge className={`absolute top-2 left-2 ${getCategoryColor(offer.category)}`}>
                  {getCategoryIcon(offer.category)} {offer.category.replace('_', ' ')}
                </Badge>
                <Badge className={`absolute top-2 right-2 ${
                  daysRemaining <= 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  <FiClock className="w-3 h-3 mr-1" />
                  {daysRemaining} days left
                </Badge>
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white p-2 rounded">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{offer.discount}</p>
                    <p className="text-xs">OFF</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{offer.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Min. Spend:</span>
                    <span className="font-semibold">KES {offer.minSpend.toLocaleString()}</span>
                  </div>
                  {offer.maxDiscount > 0 && (
                    <div className="flex justify-between">
                      <span>Max. Discount:</span>
                      <span className="font-semibold">KES {offer.maxDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Valid Until:</span>
                    <span className="font-semibold">{formatDate(offer.validUntil)}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded mb-4">
                  <p className="text-sm text-gray-600 mb-1">Promo Code:</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-2 py-1 rounded border font-mono text-sm">
                      {offer.code}
                    </code>
                    <Button size="sm" variant="outline">
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <FiGift className="mr-2" />
                    Use Offer
                  </Button>
                  <Button variant="outline">
                    <FiHeart className="mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Loyalty Rewards */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiAward />
            Available Rewards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-green-800">500 Points</h3>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
              <p className="text-sm text-green-700 mb-3">Free car wash and detailing</p>
              <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                Redeem
              </Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-blue-800">1000 Points</h3>
                <Badge className="bg-blue-100 text-blue-800">Available</Badge>
              </div>
              <p className="text-sm text-blue-700 mb-3">KES 10,000 credit towards next rental</p>
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                Redeem
              </Button>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-purple-800">2000 Points</h3>
                <Badge className="bg-gray-100 text-gray-800">Need 750 more</Badge>
              </div>
              <p className="text-sm text-purple-700 mb-3">Free weekend rental (up to KES 50,000)</p>
              <Button size="sm" className="w-full bg-gray-400" disabled>
                Not Enough Points
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}