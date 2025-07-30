import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { supabase } from '../../../lib/supabaseClient';
import SimpleConnectionTest from '../../SimpleConnectionTest';
import { RealtimeChannel } from '@supabase/supabase-js';
import { carsData } from '../../../data/carData';

// Type definition matching the SQL schema exactly
type CarFormState = {
  name: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  cash_price: string;
  tax_inclusive_price: string;
  status: string;
  is_sold: boolean;
  sold_out_date: string;
  main_image: string;
  additional_images: string[];
  colors: string[];
  engine_type: string;
  engine_size: string;
  transmission: string;
  drive_type: string;
  fuel_type: string;
  fuel_consumption: string;
  interior_features: string;
  safety_features: string;
  warranty_period: string;
  optional_addons: string;
  down_payment: string;
  monthly_installment: string;
  repayment_period: string;
  financing_partner: string;
  loan_processing_fee: string;
  logbook_status: string;
  ntas_account_linked: boolean;
  ownership_transfer: string;
  import_docs: string;
  inspection_cert: string;
  kra_docs: string;
  sales_contract: string;
  valuation_report: string;
  insurance_provider: string;
  insurance_type: string;
  insurance_cost: string;
  excess_info: string;
  included_addons: string;
  after_sales: string;
  service_centers: string;
  parts_availability: boolean;
  emergency_support: string;
  free_accessories: string;
  anti_theft_features: string;
  tracking_device: boolean;
  keyless_entry: boolean;
  showroom_name: string;
  reputation_score: string;
  location: string;
  location_link: string;
  whatsapp_number: string;
  email: string;
  sms: string;
  description: string;
  tags: string[];
  images: File[];
};

const COLORS = ['White', 'Black', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Yellow', 'Orange', 'Brown', 'Beige', 'Gold', 'Purple', 'Pink'];
const YEARS = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'CVT', 'Semi-Automatic'];
const DRIVE_TYPES = ['FWD', 'RWD', 'AWD', '4WD'];

// Quick Add Car Component for bulk uploads
function QuickAddCar({ onCarAdded }: { onCarAdded: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const carTemplates = [
    {
      name: 'Toyota Land Cruiser V8',
      brand: 'Toyota',
      model: 'Land Cruiser',
      year: '2023',
      price: '8500000',
      cash_price: '8000000',
      tax_inclusive_price: '8500000',
      description: 'Luxury SUV with premium features and advanced technology'
    },
    {
      name: 'Mercedes-Benz S-Class',
      brand: 'Mercedes-Benz',
      model: 'S-Class',
      year: '2023',
      price: '12000000',
      cash_price: '11500000',
      tax_inclusive_price: '12000000',
      description: 'Ultimate luxury sedan with cutting-edge features'
    },
    {
      name: 'BMW X5',
      brand: 'BMW',
      model: 'X5',
      year: '2023',
      price: '9500000',
      cash_price: '9000000',
      tax_inclusive_price: '9500000',
      description: 'Sporty luxury SUV with dynamic performance'
    },
    {
      name: 'Range Rover Sport',
      brand: 'Land Rover',
      model: 'Range Rover Sport',
      year: '2023',
      price: '11000000',
      cash_price: '10500000',
      tax_inclusive_price: '11000000',
      description: 'Premium SUV with exceptional off-road capability'
    },
    {
      name: 'Porsche Cayenne',
      brand: 'Porsche',
      model: 'Cayenne',
      year: '2023',
      price: '13500000',
      cash_price: '13000000',
      tax_inclusive_price: '13500000',
      description: 'High-performance luxury SUV with sports car DNA'
    }
  ];

  async function addQuickCar(template: any) {
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const carData = {
        name: template.name,
        brand: template.brand,
        model: template.model,
        year: template.year,
        price: parseFloat(template.price),
        cash_price: parseFloat(template.cash_price),
        tax_inclusive_price: parseFloat(template.tax_inclusive_price),
        status: 'published',
        is_sold: false,
        description: template.description,
        main_image: `/images/${template.brand.toLowerCase()}-${template.model.toLowerCase().replace(' ', '-')}/1.jpg`,
        additional_images: [],
        colors: ['White', 'Black', 'Silver'],
        engine_type: 'V8',
        engine_size: '4.0L',
        transmission: 'Automatic',
        drive_type: 'AWD',
        fuel_type: 'Petrol',
        fuel_consumption: '12.5 L/100km',
        interior_features: 'Leather seats, Navigation, Climate control',
        safety_features: 'ABS, Airbags, Traction control',
        warranty_period: '3 years',
        optional_addons: 'Sunroof, Premium audio',
        down_payment: '2000000',
        monthly_installment: '150000',
        repayment_period: '60 months',
        financing_partner: 'Bank of Kenya',
        loan_processing_fee: '50000',
        logbook_status: 'Available',
        ntas_account_linked: true,
        ownership_transfer: 'Included',
        import_docs: 'Complete',
        inspection_cert: 'Valid',
        kra_docs: 'Up to date',
        sales_contract: 'Standard',
        valuation_report: 'Current',
        insurance_provider: 'AAR Insurance',
        insurance_type: 'Comprehensive',
        insurance_cost: '150000',
        excess_info: '50,000 KES',
        included_addons: 'Floor mats, Tool kit',
        after_sales: '3 years warranty',
        service_centers: 'Nairobi, Mombasa, Kisumu',
        parts_availability: true,
        emergency_support: '24/7 roadside assistance',
        free_accessories: 'Car cover, Umbrella',
        anti_theft_features: 'Immobilizer, Alarm',
        tracking_device: true,
        keyless_entry: true,
        showroom_name: 'Premium Auto Showroom',
        reputation_score: 4.8,
        location: 'Nairobi',
        location_link: 'https://maps.google.com',
        whatsapp_number: '254700000000',
        email: 'sales@premiumauto.com',
        sms: '254700000000',
        tags: ['Luxury', 'SUV', 'Premium']
      };

      const { data, error } = await supabase.from('cars').insert([carData]).select();
      
      if (error) {
        console.error('Quick add error:', error);
        setError(error.message);
      } else {
        console.log('Quick car added successfully:', data);
        setSuccess(`${template.name} added successfully!`);
        onCarAdded();
      }
    } catch (err: any) {
      console.error('Error in quick add:', err);
      setError('Quick add failed: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">🚀 Quick Add Cars (For Bulk Upload)</h3>
        <p className="text-white/80 mb-4">Click any button below to instantly add a car with all required fields pre-filled.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carTemplates.map((template, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addQuickCar(template)}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:from-green-400 hover:to-blue-500 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Adding...' : `Add ${template.name}`}
            </button>
                  ))}
                </div>
        {success && <div className="text-green-400 mt-4 text-center font-bold">{success}</div>}
        {error && <div className="text-red-400 mt-4 text-center font-bold">{error}</div>}
      </div>
    </div>
  );
}

// Manual Add Car Component with full schema
function ManualAddCar({ onCarAdded }: { onCarAdded: () => void }) {
  const [form, setForm] = useState<CarFormState>({
    name: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    cash_price: '',
    tax_inclusive_price: '',
    status: 'published',
    is_sold: false,
    sold_out_date: '',
    main_image: '',
    additional_images: [],
    colors: [],
    engine_type: '',
    engine_size: '',
    transmission: '',
    drive_type: '',
    fuel_type: '',
    fuel_consumption: '',
    interior_features: '',
    safety_features: '',
    warranty_period: '',
    optional_addons: '',
    down_payment: '',
    monthly_installment: '',
    repayment_period: '',
    financing_partner: '',
    loan_processing_fee: '',
    logbook_status: '',
    ntas_account_linked: false,
    ownership_transfer: '',
    import_docs: '',
    inspection_cert: '',
    kra_docs: '',
    sales_contract: '',
    valuation_report: '',
    insurance_provider: '',
    insurance_type: '',
    insurance_cost: '',
    excess_info: '',
    included_addons: '',
    after_sales: '',
    service_centers: '',
    parts_availability: false,
    emergency_support: '',
    free_accessories: '',
    anti_theft_features: '',
    tracking_device: false,
    keyless_entry: false,
    showroom_name: '',
    reputation_score: '',
    location: '',
    location_link: '',
    whatsapp_number: '',
    email: '',
    sms: '',
    description: '',
    tags: [],
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    
    setForm(prev => ({ ...prev, [name]: fieldValue }));
  }

  function handleColorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const color = e.target.value;
    if (color && !form.colors.includes(color)) {
      setForm(prev => ({ ...prev, colors: [...prev.colors, color] }));
    }
  }

  function removeColor(color: string) {
    setForm(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      // Convert string values to appropriate types
      const carData = {
        ...form,
        price: form.price ? parseFloat(form.price) : null,
        cash_price: form.cash_price ? parseFloat(form.cash_price) : null,
        tax_inclusive_price: form.tax_inclusive_price ? parseFloat(form.tax_inclusive_price) : null,
        down_payment: form.down_payment ? parseFloat(form.down_payment) : null,
        monthly_installment: form.monthly_installment ? parseFloat(form.monthly_installment) : null,
        loan_processing_fee: form.loan_processing_fee ? parseFloat(form.loan_processing_fee) : null,
        insurance_cost: form.insurance_cost ? parseFloat(form.insurance_cost) : null,
        reputation_score: form.reputation_score ? parseFloat(form.reputation_score) : null,
        sold_out_date: form.sold_out_date || null
      };

      const { data, error } = await supabase.from('cars').insert([carData]).select();
      
      if (error) {
        console.error('Add car error:', error);
        setError(error.message);
      } else {
        console.log('Car added successfully:', data);
        setSuccess('Car added successfully!');
        // Reset form
        setForm({
          name: '',
          brand: '',
          model: '',
          year: '',
          price: '',
          cash_price: '',
          tax_inclusive_price: '',
          status: 'published',
          is_sold: false,
          sold_out_date: '',
          main_image: '',
          additional_images: [],
          colors: [],
          engine_type: '',
          engine_size: '',
          transmission: '',
          drive_type: '',
          fuel_type: '',
          fuel_consumption: '',
          interior_features: '',
          safety_features: '',
          warranty_period: '',
          optional_addons: '',
          down_payment: '',
          monthly_installment: '',
          repayment_period: '',
          financing_partner: '',
          loan_processing_fee: '',
          logbook_status: '',
          ntas_account_linked: false,
          ownership_transfer: '',
          import_docs: '',
          inspection_cert: '',
          kra_docs: '',
          sales_contract: '',
          valuation_report: '',
          insurance_provider: '',
          insurance_type: '',
          insurance_cost: '',
          excess_info: '',
          included_addons: '',
          after_sales: '',
          service_centers: '',
          parts_availability: false,
          emergency_support: '',
          free_accessories: '',
          anti_theft_features: '',
          tracking_device: false,
          keyless_entry: false,
          showroom_name: '',
          reputation_score: '',
          location: '',
          location_link: '',
          whatsapp_number: '',
          email: '',
          sms: '',
          description: '',
          tags: [],
          images: []
        });
        onCarAdded();
      }
    } catch (err: any) {
      console.error('Error adding car:', err);
      setError('Add car failed: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
      <h3 className="text-xl font-bold text-yellow-400 mb-6">📝 Add New Car (Full Schema)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Information */}
        <div className="lg:col-span-3">
          <h4 className="text-lg font-semibold text-white mb-3">Basic Information</h4>
            </div>
            <input 
          name="name" 
          placeholder="Car Name" 
          value={form.name} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
          required
        />
        <input 
          name="brand" 
          placeholder="Brand" 
          value={form.brand} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
              required 
            />
            <input 
              name="model" 
              placeholder="Model" 
          value={form.model} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
              required 
            />
        <select 
              name="year" 
          value={form.year} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 h-12 px-3 rounded-lg" 
              required 
        >
          <option value="">Year</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
            <select 
          name="status" 
          value={form.status} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 h-12 px-3 rounded-lg" 
          required
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="sold">Sold</option>
            </select>
        <label className="flex items-center gap-2 text-white">
            <input 
            type="checkbox" 
            name="is_sold" 
            checked={form.is_sold} 
            onChange={handleInputChange} 
            className="bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
          />
          Is Sold
        </label>

        {/* Pricing */}
        <div className="lg:col-span-3">
          <h4 className="text-lg font-semibold text-white mb-3">Pricing</h4>
        </div>
        <input 
          name="price" 
          placeholder="Price" 
          value={form.price} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
          type="number" 
            />
            <input 
          name="cash_price" 
          placeholder="Cash Price" 
          value={form.cash_price} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
          type="number" 
        />
              <input 
          name="tax_inclusive_price" 
          placeholder="Tax Inclusive Price" 
          value={form.tax_inclusive_price} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
          type="number" 
        />

        {/* Technical Specifications */}
        <div className="lg:col-span-3">
          <h4 className="text-lg font-semibold text-white mb-3">Technical Specifications</h4>
        </div>
              <input 
          name="engine_type" 
          placeholder="Engine Type" 
          value={form.engine_type} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
        />
        <input 
          name="engine_size" 
          placeholder="Engine Size" 
          value={form.engine_size} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
        />
        <select 
          name="transmission" 
          value={form.transmission} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 h-12 px-3 rounded-lg" 
        >
          <option value="">Transmission</option>
          {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select 
          name="drive_type" 
          value={form.drive_type} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 h-12 px-3 rounded-lg" 
        >
          <option value="">Drive Type</option>
          {DRIVE_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select 
          name="fuel_type" 
          value={form.fuel_type} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 h-12 px-3 rounded-lg" 
        >
          <option value="">Fuel Type</option>
          {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <input 
          name="fuel_consumption" 
          placeholder="Fuel Consumption" 
          value={form.fuel_consumption} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
        />

        {/* Colors */}
        <div className="lg:col-span-3">
          <h4 className="text-lg font-semibold text-white mb-3">Colors</h4>
        </div>
        <div className="lg:col-span-2">
          <select 
            onChange={handleColorChange} 
            className="input bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 h-12 px-3 rounded-lg" 
          >
            <option value="">Add Color</option>
            {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.colors.map((color, index) => (
            <span key={index} className="bg-yellow-500 text-black px-2 py-1 rounded text-sm flex items-center gap-1">
              {color}
              <button type="button" onClick={() => removeColor(color)} className="text-black hover:text-red-600">×</button>
            </span>
          ))}
            </div>
            
        {/* Contact & Location */}
        <div className="lg:col-span-3">
          <h4 className="text-lg font-semibold text-white mb-3">Contact & Location</h4>
        </div>
            <input 
          name="location" 
          placeholder="Location" 
          value={form.location} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
            />
            <input 
          name="whatsapp_number" 
          placeholder="WhatsApp Number" 
          value={form.whatsapp_number} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
            />
            <input 
          name="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={handleInputChange} 
          className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" 
        />

        {/* Description */}
        <div className="lg:col-span-3">
            <textarea 
              name="description" 
              placeholder="Description" 
            value={form.description} 
            onChange={handleInputChange} 
            className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 w-full" 
            rows={4} 
          />
        </div>
      </div>
      
      <button 
                type="submit" 
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 rounded-lg mt-6 shadow-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300" 
        disabled={loading}
      >
        {loading ? 'Adding Car...' : 'Add Car'}
      </button>
      
      {success && <div className="text-green-400 mt-4 text-center font-bold">{success}</div>}
      {error && <div className="text-red-400 mt-4 text-center font-bold">{error}</div>}
          </form>
  );
}

// All Cars Panel
function AllCarsPanel({ fetchCars }: { fetchCars: () => Promise<void> }) {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

    async function fetchAll() {
      setLoading(true);
      setError('');
      try {
      // Fetch database cars
      const { data: dbCars, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
      if (error) setError(error.message);
      
      // Convert showcase cars to match database format
      const showcaseCars = carsData.map(car => ({
        id: car.id || `showcase-${Math.random()}`,
        name: car.name || 'Unknown Car',
        brand: (car.name || '').split(' ')[0] || 'Unknown',
        model: (car.name || '').split(' ').slice(1).join(' ') || 'Unknown',
        year: (car.specs?.year || 2023).toString(),
        price: car.price || 0,
        status: car.featured ? 'published' : 'draft',
        is_sold: car.availability === 'Sold',
        description: car.description || 'No description available',
        fuel_type: car.specs?.fuel || 'Petrol',
        transmission: car.specs?.transmission || 'Automatic',
        drive_type: car.specs?.drivetrain || 'FWD',
        colors: [car.specs?.color || 'White'],
        location: car.location || 'Nairobi, Kenya',
        main_image: car.image?.[0] || '/images/default-car.jpg',
        additional_images: car.image?.slice(1) || [],
        tags: car.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source: 'showcase'
      }));
      
      // Combine database and showcase cars
      const allCars = [...(dbCars || []), ...showcaseCars];
      setCars(allCars);
    } catch (error) {
      setError('Failed to fetch cars');
      }
      setLoading(false);
    }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this car?')) return;
    const { error } = await supabase.from('cars').delete().eq('id', id);
    if (error) console.error('Error deleting car:', error);
    else fetchAll();
  }

  async function handleToggleSold(car: any) {
    const newStatus = car.status === 'sold' ? 'published' : 'sold';
    await supabase.from('cars').update({ status: newStatus }).eq('id', car.id);
    fetchAll();
  }

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <div className="text-center py-8 text-white">Loading cars...</div>;
  if (error) return <div className="text-center py-8 text-red-400">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-yellow-400">All Cars ({cars.length})</h3>
        <Button onClick={fetchAll} className="bg-blue-600 hover:bg-blue-700">Refresh</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
          <Card key={car.id} className="bg-white/10 border border-white/20">
            <CardContent className="p-4">
              <h4 className="font-bold text-white mb-2">{car.name}</h4>
              <p className="text-gray-300 text-sm mb-2">{car.brand} {car.model} {car.year}</p>
              <p className="text-yellow-400 font-bold mb-2">KES {car.price?.toLocaleString()}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  car.status === 'sold' ? 'bg-red-500 text-white' : 
                  car.status === 'published' ? 'bg-green-500 text-white' : 
                  'bg-gray-500 text-white'
                }`}>
                  {car.status}
              </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleToggleSold(car)}
                  className="text-xs"
                >
                  {car.status === 'sold' ? 'Mark Available' : 'Mark Sold'}
                </Button>
                <Button 
                  size="sm" 
                  variant="danger" 
                  onClick={() => handleDelete(car.id)}
                  className="text-xs bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Main Component
export default function CarManagementPanel() {
  const { t } = useLanguage();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('quick');
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  async function fetchCars() {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
      if (data) setCars(data);
      if (error) setError(error.message);
    } catch (error) {
      setError('Failed to fetch cars');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCars();
    // Set up real-time subscription
    const ch = supabase.channel('realtime-cars-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cars' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCars(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCars(prev => prev.map(car => car.id === payload.new.id ? payload.new : car));
          } else if (payload.eventType === 'DELETE') {
            setCars(prev => prev.filter(car => car.id !== payload.old.id));
          }
        }
      )
      .subscribe();
    setChannel(ch);
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return (
    <div className="glass-panel w-full max-w-6xl mx-auto p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-4 text-white">Car Management</h2>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'quick' 
              ? 'bg-yellow-500 text-black shadow-lg' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          onClick={() => setActiveTab('quick')}
        >
          Quick Add (Bulk)
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'manual' 
              ? 'bg-yellow-500 text-black shadow-lg' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          onClick={() => setActiveTab('manual')}
        >
          Manual Add
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'all' 
              ? 'bg-yellow-500 text-black shadow-lg' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All Cars ({cars.length})
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === 'test' 
              ? 'bg-yellow-500 text-black shadow-lg' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          onClick={() => setActiveTab('test')}
        >
          Connection Test
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'quick' && <QuickAddCar onCarAdded={fetchCars} />}
        {activeTab === 'manual' && <ManualAddCar onCarAdded={fetchCars} />}
        {activeTab === 'all' && <AllCarsPanel fetchCars={fetchCars} />}
        {activeTab === 'test' && <SimpleConnectionTest />}
      </div>
    </div>
  );
} 