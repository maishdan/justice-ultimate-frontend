import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { supabase } from '../../../lib/supabaseClient';
import Papa from 'papaparse';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-400',
  published: 'bg-green-600',
  sold: 'bg-yellow-500',
};

type CarFormState = {
  name: string;
  brand: string;
  year: string;
  mileage: string;
  fuelType: string;
  price: string;
  installmentAvailable: boolean;
  installmentDetails: string;
  discount: string;
  paymentOptions: string[];
  country: string;
  state: string;
  city: string;
  pickup: string;
  description: string;
  tags: string;
  status: string;
  images: File[];
};

const CarList = () => {
  const { t } = useLanguage();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setCars(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this car?')) return;
    setDeleting(id);
    const { error } = await supabase.from('cars').delete().eq('id', id);
    if (error) setError(error.message);
    else fetchCars();
    setDeleting(null);
  }

  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">{t('allCars') || 'All Cars'}</h3>
      {loading ? <div>Loading...</div> : null}
      {error && <div className="text-red-600">{error}</div>}
      <table className="min-w-full table-auto border rounded shadow bg-white dark:bg-gray-900">
        <thead>
          <tr>
            <th className="p-2">{t('carName') || 'Car Name'}</th>
            <th className="p-2">{t('brandModel') || 'Brand/Model'}</th>
            <th className="p-2">{t('year') || 'Year'}</th>
            <th className="p-2">{t('price') || 'Price'}</th>
            <th className="p-2">{t('status') || 'Status'}</th>
            <th className="p-2">{t('images') || 'Images'}</th>
            <th className="p-2">{t('actions') || 'Actions'}</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id} className="border-t">
              <td className="p-2">{car.name || '-'}</td>
              <td className="p-2">{car.brand || '-'}</td>
              <td className="p-2">{car.year || '-'}</td>
              <td className="p-2">{car.price ? `${car.price} KES` : '-'}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs text-white ${STATUS_COLORS[car.status] || 'bg-gray-500'}`}>{car.status}</span>
              </td>
              <td className="p-2">
                <div className="flex gap-1">
                  {(car.images || []).slice(0, 4).map((img: string, i: number) => (
                    <img key={i} src={img} alt="car" className="w-10 h-10 object-cover rounded shadow" />
                  ))}
                </div>
              </td>
              <td className="p-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => alert('Edit feature coming soon!')}>{t('edit') || 'Edit'}</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(car.id)} disabled={deleting === car.id}>
                  {deleting === car.id ? t('deleting') || 'Deleting...' : t('delete') || 'Delete'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AddCarForm = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState<CarFormState>({
    name: '',
    brand: '',
    year: '',
    mileage: '',
    fuelType: '',
    price: '',
    installmentAvailable: false,
    installmentDetails: '',
    discount: '',
    paymentOptions: [],
    country: '',
    state: '',
    city: '',
    pickup: '',
    description: '',
    tags: '',
    status: 'draft',
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Handle image upload (stub)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArr = Array.from(files).slice(0, 20);
    const previews = fileArr.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    setForm({ ...form, images: fileArr });
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({
        ...form,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // Handle payment options (checkbox list)
  const handlePaymentOption = (option: string) => {
    setForm((prev) => {
      const exists = prev.paymentOptions.includes(option);
      return {
        ...prev,
        paymentOptions: exists
          ? prev.paymentOptions.filter((o) => o !== option)
          : [...prev.paymentOptions, option],
      };
    });
  };

  // Handle form submit (stub Supabase integration)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setSuccess('');
    setError('');
    // TODO: Upload images to Supabase Storage, then save car record
    setTimeout(() => {
      setUploading(false);
      setSuccess('Car uploaded successfully!');
      setForm({
        name: '', brand: '', year: '', mileage: '', fuelType: '', price: '',
        installmentAvailable: false, installmentDetails: '', discount: '', paymentOptions: [],
        country: '', state: '', city: '', pickup: '', description: '', tags: '', status: 'draft', images: [],
      });
      setImagePreviews([]);
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Car Media */}
        <div>
          <label className="block font-semibold mb-1">{t('carImages') || 'Car Images (up to 20)'}</label>
          <input type="file" accept="image/*" multiple max={20} onChange={handleImageChange} className="mb-2" />
          <div className="flex flex-wrap gap-2">
            {imagePreviews.map((src, i) => (
              <img key={i} src={src} alt="preview" className="w-16 h-16 object-cover rounded shadow" />
            ))}
          </div>
        </div>
        {/* Basic Info */}
        <div className="space-y-2">
          <input name="name" value={form.name} onChange={handleChange} placeholder={t('carName') || 'Car Name'} className="w-full p-2 rounded border" />
          <input name="brand" value={form.brand} onChange={handleChange} placeholder={t('brandModel') || 'Brand/Model'} className="w-full p-2 rounded border" />
          <input name="year" value={form.year} onChange={handleChange} placeholder={t('year') || 'Year'} className="w-full p-2 rounded border" type="number" />
          <input name="mileage" value={form.mileage} onChange={handleChange} placeholder={t('mileage') || 'Mileage'} className="w-full p-2 rounded border" type="number" />
          <select name="fuelType" value={form.fuelType} onChange={handleChange} className="w-full p-2 rounded border">
            <option value="">{t('fuelType') || 'Fuel Type'}</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
          </select>
        </div>
      </div>
      {/* Pricing Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <input name="price" value={form.price} onChange={handleChange} placeholder={t('fullPrice') || 'Full Price'} className="w-full p-2 rounded border" type="number" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="installmentAvailable" checked={form.installmentAvailable} onChange={handleChange} />
            {t('installmentAvailable') || 'Installment Available'}
          </label>
          {form.installmentAvailable && (
            <input name="installmentDetails" value={form.installmentDetails} onChange={handleChange} placeholder={t('installmentBreakdown') || 'Installment Breakdown'} className="w-full p-2 rounded border" />
          )}
          <input name="discount" value={form.discount} onChange={handleChange} placeholder={t('discount') || 'Discount %'} className="w-full p-2 rounded border" type="number" />
        </div>
        {/* Payment Options */}
        <div className="space-y-2">
          <label className="block font-semibold mb-1">{t('paymentOptions') || 'Payment Options'}</label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.paymentOptions.includes('mpesa')} onChange={() => handlePaymentOption('mpesa')} /> M-Pesa
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.paymentOptions.includes('bank')} onChange={() => handlePaymentOption('bank')} /> Bank Transfer
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.paymentOptions.includes('cash')} onChange={() => handlePaymentOption('cash')} /> Cash On Delivery
          </label>
        </div>
      </div>
      {/* Location Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <select name="country" value={form.country} onChange={handleChange} className="w-full p-2 rounded border">
            <option value="">{t('country') || 'Country'}</option>
            <option value="Kenya">Kenya</option>
            <option value="Uganda">Uganda</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Other">Other</option>
          </select>
          <input name="state" value={form.state} onChange={handleChange} placeholder={t('state') || 'County/State'} className="w-full p-2 rounded border" />
          <input name="city" value={form.city} onChange={handleChange} placeholder={t('city') || 'City/Town'} className="w-full p-2 rounded border" />
        </div>
        <div className="space-y-2">
          <textarea name="pickup" value={form.pickup} onChange={handleChange} placeholder={t('pickupPoint') || 'Pickup Point'} className="w-full p-2 rounded border" />
        </div>
      </div>
      {/* Car Description */}
      <div>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder={t('carDescription') || 'Car Description'} className="w-full p-2 rounded border" />
      </div>
      {/* Metadata & Settings */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <input name="tags" value={form.tags} onChange={handleChange} placeholder={t('tags') || 'Tags (SUV, Hybrid, etc.)'} className="w-full p-2 rounded border" />
          <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 rounded border">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>
      {/* Actions */}
      <div className="flex gap-4 mt-4">
        <Button type="submit" disabled={uploading}>{uploading ? t('uploading') || 'Uploading...' : t('uploadCar') || 'Upload Car'}</Button>
        <Button type="button" variant="outline" onClick={() => { setForm({ name: '', brand: '', year: '', mileage: '', fuelType: '', price: '', installmentAvailable: false, installmentDetails: '', discount: '', paymentOptions: [], country: '', state: '', city: '', pickup: '', description: '', tags: '', status: 'draft', images: [], }); setImagePreviews([]); }}>{t('reset') || 'Reset'}</Button>
      </div>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

const BulkUpload = () => {
  const { t } = useLanguage();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<string>('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResults('');
    setError('');
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!csvFile) return;
    setParsing(true);
    setResults('');
    setError('');
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: Papa.ParseResult<any>) => {
          setParsing(false);
          const rows = results.data as any[];
          if (!Array.isArray(rows) || rows.length === 0) {
            setError('No valid rows found in CSV.');
            return;
          }
          setUploading(true);
          let successCount = 0;
          let failCount = 0;
          for (const row of rows) {
            // Basic validation: must have car name
            if (!row['Car Name']) {
              failCount++;
              continue;
            }
            // Map CSV columns to DB fields
            const car = {
              name: row['Car Name'] || '',
              brand: row['Brand'] || '',
              year: row['Year'] || '',
              price: row['Price'] || '',
              installments: row['Installments'] || '',
              location: row['Location'] || '',
              description: row['Description'] || '',
              images: [row['ImageURL1'], row['ImageURL2'], row['ImageURL3'], row['ImageURL4']].filter(Boolean),
              status: row['Status'] || 'draft',
            };
            const { error } = await supabase.from('cars').insert([car]);
            if (error) failCount++;
            else successCount++;
          }
          setUploading(false);
          setResults(`Upload complete: ${successCount} cars added, ${failCount} failed.`);
        },
        error: (err: Papa.ParseError) => {
          setParsing(false);
          setError('CSV parsing error: ' + err.message);
        },
      });
    };
    reader.readAsText(csvFile);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">{t('bulkUpload') || 'Bulk Upload'}</h3>
      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-2" />
      <Button onClick={handleUpload} disabled={!csvFile || parsing || uploading}>
        {parsing || uploading ? t('uploading') || 'Uploading...' : t('upload') || 'Upload'}
      </Button>
      <div className="text-xs text-gray-500 mt-2">
        CSV columns: Car Name, Brand, Year, Price, Installments, Location, Description, ImageURL1, ImageURL2, ImageURL3, ImageURL4, Status
      </div>
      {results && <div className="text-green-600 mt-2">{results}</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default function CarManagementPanel() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('all');
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">{t('carsManagement')}</h2>
        <Tabs>
          <TabsList>
            <TabsTrigger label={t('allCars') || 'All Cars'} selected={tab === 'all'} onClick={() => setTab('all')} />
            <TabsTrigger label={t('addCar') || 'Add Car'} selected={tab === 'add'} onClick={() => setTab('add')} />
            <TabsTrigger label={t('bulkUpload') || 'Bulk Upload'} selected={tab === 'bulk'} onClick={() => setTab('bulk')} />
          </TabsList>
          <TabsContent>{tab === 'all' && <CarList />}</TabsContent>
          <TabsContent>{tab === 'add' && <AddCarForm />}</TabsContent>
          <TabsContent>{tab === 'bulk' && <BulkUpload />}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 