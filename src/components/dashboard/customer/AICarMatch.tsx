import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { 
  FiStar, 
  FiHeart, 
  FiDollarSign,
  FiMapPin,
  FiUsers,
  FiTrendingUp,
  FiCheckCircle,
  FiSettings,
  FiTarget,
  FiAward,
  FiXCircle
} from 'react-icons/fi';
import { 
  AiFillCar,
  AiOutlineBulb
} from 'react-icons/ai';

export default function AICarMatch() {
  const [preferences, setPreferences] = useState({
    budget: '',
    usage: '',
    passengers: '',
    fuel_preference: '',
    transmission: '',
    features: [] as string[]
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile();
    generateInitialRecommendations();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch user's rental history and preferences
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setUserProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const generateInitialRecommendations = () => {
    // Mock AI recommendations based on user behavior
    const mockRecommendations = [
      {
        id: '1',
        car_name: 'BMW X5',
        match_score: 95,
        price_range: 'KES 85,000 - 95,000/day',
        reason: 'Perfect for your luxury preferences and family size',
        features: ['Luxury', 'SUV', 'Automatic', 'Diesel'],
        image: '/images/BMW X5/1.jpg',
        pros: ['Excellent comfort', 'Advanced safety features', 'Good fuel economy'],
        cons: ['Higher maintenance cost', 'Premium fuel required']
      },
      {
        id: '2',
        car_name: 'Toyota Land Cruiser V8',
        match_score: 88,
        price_range: 'KES 120,000 - 140,000/day',
        reason: 'Ideal for your off-road adventures and reliability needs',
        features: ['Off-road', 'SUV', 'Automatic', 'Diesel'],
        image: '/images/land-cruiser-v8 1.jpg',
        pros: ['Excellent reliability', 'Great off-road capability', 'Spacious interior'],
        cons: ['Higher fuel consumption', 'Premium pricing']
      },
      {
        id: '3',
        car_name: 'Mercedes S-Class',
        match_score: 82,
        price_range: 'KES 150,000 - 180,000/day',
        reason: 'Matches your preference for luxury and comfort',
        features: ['Luxury', 'Sedan', 'Automatic', 'Petrol'],
        image: '/images/MERCEDES S CLASS/1.jpg',
        pros: ['Ultimate luxury', 'Advanced technology', 'Smooth ride'],
        cons: ['Very expensive', 'High maintenance cost']
      },
      {
        id: '4',
        car_name: 'Toyota Prado',
        match_score: 78,
        price_range: 'KES 70,000 - 85,000/day',
        reason: 'Good balance of comfort and practicality for your needs',
        features: ['SUV', 'Automatic', 'Diesel', '7-seater'],
        image: '/images/PRADO DIESEL/1.jpg',
        pros: ['Reliable', 'Good value', 'Spacious'],
        cons: ['Less luxurious', 'Basic features']
      },
      {
        id: '5',
        car_name: 'Range Rover Sport',
        match_score: 75,
        price_range: 'KES 130,000 - 150,000/day',
        reason: 'Combines luxury with off-road capability',
        features: ['Luxury', 'SUV', 'Automatic', 'Hybrid'],
        image: '/images/RANGE VOLVO/1.jpg',
        pros: ['Luxury and capability', 'Advanced features', 'Good performance'],
        cons: ['Expensive', 'Complex technology']
      }
    ];

    setRecommendations(mockRecommendations);
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setPreferences(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const generateRecommendations = async () => {
    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      generateInitialRecommendations();
      setLoading(false);
    }, 2000);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const availableFeatures = [
    'Luxury', 'SUV', 'Sedan', 'Automatic', 'Manual', 'Diesel', 'Petrol', 'Hybrid', 'Electric',
    '7-seater', 'Off-road', 'Sport', 'Economy', 'Family', 'Business'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Car Match</h1>
          <p className="text-gray-600">Get personalized vehicle recommendations powered by AI</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={generateRecommendations} disabled={loading}>
            <AiOutlineBulb className="mr-2" />
            {loading ? 'Analyzing...' : 'Refresh Recommendations'}
          </Button>
          <Button variant="outline">
            <FiSettings className="mr-2" />
            Preferences
          </Button>
        </div>
      </div>

      {/* AI Analysis Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rental History</p>
                <p className="text-2xl font-bold text-blue-600">12 Cars</p>
              </div>
              <FiTrendingUp className="text-blue-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Preferred Style</p>
                <p className="text-2xl font-bold text-green-600">SUV</p>
              </div>
              <AiFillCar className="text-green-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Budget</p>
                <p className="text-2xl font-bold text-purple-600">KES 85K</p>
              </div>
              <FiDollarSign className="text-purple-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Confidence</p>
                <p className="text-2xl font-bold text-orange-600">92%</p>
              </div>
              <FiTarget className="text-orange-500 text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferences Section */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiSettings />
            Your Preferences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Budget Range (KES/day)</label>
              <Input
                value={preferences.budget}
                onChange={(e) => handlePreferenceChange('budget', e.target.value)}
                placeholder="e.g., 50,000 - 100,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Usage</label>
              <select
                value={preferences.usage}
                onChange={(e) => handlePreferenceChange('usage', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select usage</option>
                <option value="family">Family</option>
                <option value="business">Business</option>
                <option value="leisure">Leisure</option>
                <option value="off-road">Off-road</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Passengers</label>
              <select
                value={preferences.passengers}
                onChange={(e) => handlePreferenceChange('passengers', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select passengers</option>
                <option value="1-2">1-2</option>
                <option value="3-4">3-4</option>
                <option value="5-6">5-6</option>
                <option value="7+">7+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fuel Preference</label>
              <select
                value={preferences.fuel_preference}
                onChange={(e) => handlePreferenceChange('fuel_preference', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any fuel type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Transmission</label>
              <select
                value={preferences.transmission}
                onChange={(e) => handlePreferenceChange('transmission', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any transmission</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-3">Desired Features</label>
            <div className="flex flex-wrap gap-2">
              {availableFeatures.map((feature) => (
                <Button
                  key={feature}
                  variant={preferences.features.includes(feature) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFeatureToggle(feature)}
                >
                  {feature}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AiOutlineBulb className="text-purple-500" />
          AI Recommendations
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((car) => (
            <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={car.image} 
                  alt={car.car_name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/1967-ford-mustang.png';
                  }}
                />
                <Badge className={`absolute top-2 right-2 ${getMatchScoreColor(car.match_score)}`}>
                  {car.match_score}% Match
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 left-2 bg-white/80 hover:bg-white"
                >
                  <FiHeart className="text-red-500" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{car.car_name}</h3>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Price Range</p>
                    <p className="font-semibold text-green-600">{car.price_range}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{car.reason}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {car.features.map((feature: string) => (
                    <Badge key={feature} variant="info" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Pros</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {car.pros.map((pro: string, index: number) => (
                        <li key={index} className="flex items-center gap-1">
                          <FiCheckCircle className="text-green-500 w-3 h-3" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">Cons</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {car.cons.map((con: string, index: number) => (
                        <li key={index} className="flex items-center gap-1">
                          <FiXCircle className="text-red-500 w-3 h-3" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <AiFillCar className="mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline">
                    <FiStar className="mr-2" />
                    Rate Match
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiAward />
            AI Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Based on Your History</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• You prefer SUVs (80% of your rentals)</li>
                  <li>• Average rental duration: 3.2 days</li>
                  <li>• You often travel with 4+ passengers</li>
                  <li>• Luxury features are important to you</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Seasonal Preferences</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• SUVs during rainy season (March-May)</li>
                  <li>• Luxury sedans for business trips</li>
                  <li>• 4x4 vehicles for holiday destinations</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Budget Analysis</h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Average daily spend: KES 85,000</li>
                  <li>• Willing to pay premium for luxury</li>
                  <li>• Prefers all-inclusive pricing</li>
                </ul>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Recommendations</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Consider long-term rentals for better rates</li>
                  <li>• Try hybrid options for fuel efficiency</li>
                  <li>• Book early for peak season availability</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}