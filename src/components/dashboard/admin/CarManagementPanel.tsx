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

const CarList = ({ cars, loading, error, fetchCars }: { cars: any[], loading: boolean, error: string, fetchCars: () => Promise<void> }) => {
  const { t } = useLanguage();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingCar, setEditingCar] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this car?')) return;
    setDeleting(id);
    const { error } = await supabase.from('cars').delete().eq('id', id);
    if (error) console.error('Error deleting car:', error);
    else fetchCars();
    setDeleting(null);
  }

  function openEdit(car: any) {
    setEditingCar(car);
    setEditForm(car);
    setEditError('');
  }
  function closeEdit() {
    setEditingCar(null);
    setEditForm({});
    setEditError('');
  }
  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setEditForm((prev: any) => ({ ...prev, [name]: fieldValue }));
  }
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    const { error } = await supabase.from('cars').update(editForm).eq('id', editingCar.id);
    setEditLoading(false);
    if (error) setEditError(error.message);
    else {
      closeEdit();
      fetchCars();
    }
  }
  async function handleToggleSold(car: any) {
    const newStatus = car.status === 'sold' ? 'published' : 'sold';
    await supabase.from('cars').update({ status: newStatus }).eq('id', car.id);
    fetchCars();
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
                <button className="ml-2 text-xs px-2 py-1 rounded bg-yellow-200 text-yellow-800" onClick={() => handleToggleSold(car)}>
                  {car.status === 'sold' ? 'Mark Available' : 'Mark Sold'}
                </button>
              </td>
              <td className="p-2">
                <div className="flex gap-1">
                  {(car.additional_images || car.images || []).slice(0, 4).map((img: string, i: number) => (
                    <img key={i} src={img} alt="car" className="w-10 h-10 object-cover rounded shadow" />
                  ))}
                </div>
              </td>
              <td className="p-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(car)}>{t('edit') || 'Edit'}</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(car.id)} disabled={deleting === car.id}>
                  {deleting === car.id ? t('deleting') || 'Deleting...' : t('delete') || 'Delete'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Edit Modal */}
      {editingCar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-xl p-8 shadow-xl w-full max-w-lg space-y-4">
            <h3 className="text-xl font-bold mb-4">Edit Car</h3>
            <input name="name" placeholder="Name" value={editForm.name || ''} onChange={handleEditChange} className="input" />
            <input name="brand" placeholder="Brand" value={editForm.brand || ''} onChange={handleEditChange} className="input" />
            <input name="year" placeholder="Year" value={editForm.year || ''} onChange={handleEditChange} className="input" />
            <input name="price" placeholder="Price" value={editForm.price || ''} onChange={handleEditChange} className="input" />
            <input name="status" placeholder="Status" value={editForm.status || ''} onChange={handleEditChange} className="input" />
            {/* Add more fields as needed */}
            <div className="flex gap-2 mt-4">
              <Button type="submit" size="sm" variant="primary" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</Button>
              <Button type="button" size="sm" variant="outline" onClick={closeEdit}>Cancel</Button>
            </div>
            {editError && <div className="text-red-600 mt-2">{editError}</div>}
          </form>
        </div>
      )}
    </div>
  );
};


const COLORS = [
  'Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green', 'Yellow', 'Orange', 'Brown', 'Beige', 'Gold', 'Purple', 'Pink', 'Other'
];
const YEARS = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);

function AddCarFormV2({ onCarAdded }: { onCarAdded: () => void }) {
  const [form, setForm] = useState<any>({});
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm((prev: any) => ({
      ...prev,
      [name]: fieldValue
    }));
  }
  function handleColorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setForm((prev: any) => ({ ...prev, colors: options }));
  }
  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) setMainImage(e.target.files[0]);
  }
  function handleAdditionalImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) setAdditionalImages(Array.from(e.target.files));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    let mainImageUrl = '';
    let additionalImageUrls: string[] = [];
    try {
      // Upload main image if present
      if (mainImage) {
        const ext = mainImage.name.split('.').pop();
        const fileName = `main_${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('car-images').upload(fileName, mainImage, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('car-images').getPublicUrl(fileName);
        mainImageUrl = publicUrlData.publicUrl;
      }
      // Upload additional images if present
      for (const img of additionalImages) {
        const ext = img.name.split('.').pop();
        const fileName = `additional_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('car-images').upload(fileName, img, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('car-images').getPublicUrl(fileName);
        additionalImageUrls.push(publicUrlData.publicUrl);
      }
      // Insert car with image URLs
      const { data, error } = await supabase.from('cars').insert([{ ...form, main_image: mainImageUrl, additional_images: additionalImageUrls }]);
      setLoading(false);
      if (error) setError(error.message);
      else {
        setSuccess('Car added!');
        setForm({});
        setMainImage(null);
        setAdditionalImages([]);
        onCarAdded();
      }
    } catch (err: any) {
      setLoading(false);
      setError('Image upload failed: ' + (err.message || err));
    }
  }
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl mb-8">
      <input name="make" placeholder="Make" value={form.make || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="model" placeholder="Model" value={form.model || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <select name="year" value={form.year || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 h-12 px-3 rounded-lg">
        <option value="">Year</option>
        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      <select name="colors" value={form.colors || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 h-12 px-3 rounded-lg">
        <option value="">Select Color</option>
        {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input name="engine_type" placeholder="Engine Type" value={form.engine_type || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="engine_size" placeholder="Engine Size" value={form.engine_size || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="transmission" placeholder="Transmission" value={form.transmission || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="drive_type" placeholder="Drive Type" value={form.drive_type || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="fuel_consumption" placeholder="Fuel Consumption" value={form.fuel_consumption || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="interior_features" placeholder="Interior Features" value={form.interior_features || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="safety_features" placeholder="Safety Features" value={form.safety_features || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="warranty_period" placeholder="Warranty Period" value={form.warranty_period || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="cash_price" placeholder="Cash Price" value={form.cash_price || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" type="number" />
      <input name="tax_inclusive_price" placeholder="Tax Inclusive Price" value={form.tax_inclusive_price || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" type="number" />
      <input name="optional_addons" placeholder="Optional Addons" value={form.optional_addons || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="down_payment" placeholder="Down Payment" value={form.down_payment || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" type="number" />
      <input name="monthly_installment" placeholder="Monthly Installment" value={form.monthly_installment || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" type="number" />
      <input name="repayment_period" placeholder="Repayment Period" value={form.repayment_period || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="financing_partner" placeholder="Financing Partner" value={form.financing_partner || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="loan_processing_fee" placeholder="Loan Processing Fee" value={form.loan_processing_fee || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" type="number" />
      <input name="logbook_status" placeholder="Logbook Status" value={form.logbook_status || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <label className="flex items-center gap-2"><input type="checkbox" name="ntas_account_linked" checked={form.ntas_account_linked || false} onChange={handleInputChange} className="bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />NTSA Account Linked</label>
      <input name="ownership_transfer" placeholder="Ownership Transfer" value={form.ownership_transfer || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="import_docs" placeholder="Import Docs" value={form.import_docs || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="inspection_cert" placeholder="Inspection Cert" value={form.inspection_cert || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="kra_docs" placeholder="KRA Docs" value={form.kra_docs || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="sales_contract" placeholder="Sales Contract" value={form.sales_contract || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="valuation_report" placeholder="Valuation Report" value={form.valuation_report || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="insurance_provider" placeholder="Insurance Provider" value={form.insurance_provider || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="insurance_type" placeholder="Insurance Type" value={form.insurance_type || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="insurance_cost" placeholder="Insurance Cost" value={form.insurance_cost || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" type="number" />
      <input name="excess_info" placeholder="Excess Info" value={form.excess_info || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="included_addons" placeholder="Included Addons" value={form.included_addons || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="after_sales" placeholder="After Sales" value={form.after_sales || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="service_centers" placeholder="Service Centers" value={form.service_centers || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <label className="flex items-center gap-2"><input type="checkbox" name="parts_availability" checked={form.parts_availability || false} onChange={handleInputChange} className="bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />Parts Availability</label>
      <input name="emergency_support" placeholder="Emergency Support" value={form.emergency_support || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="free_accessories" placeholder="Free Accessories" value={form.free_accessories || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="anti_theft_features" placeholder="Anti-Theft Features" value={form.anti_theft_features || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <label className="flex items-center gap-2"><input type="checkbox" name="tracking_device" checked={form.tracking_device || false} onChange={handleInputChange} className="bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />Tracking Device</label>
      <label className="flex items-center gap-2"><input type="checkbox" name="keyless_entry" checked={form.keyless_entry || false} onChange={handleInputChange} className="bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />Keyless Entry</label>
      <input name="showroom_name" placeholder="Showroom Name" value={form.showroom_name || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="reputation_score" placeholder="Reputation Score" value={form.reputation_score || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" type="number" />
      <input name="location" placeholder="Location" value={form.location || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="location_link" placeholder="Location Link" value={form.location_link || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="whatsapp_number" placeholder="WhatsApp Number" value={form.whatsapp_number || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="email" placeholder="Email" value={form.email || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <input name="sms" placeholder="SMS" value={form.sms || ''} onChange={handleInputChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
      <label className="flex items-center gap-2"><input type="checkbox" name="is_sold" checked={form.is_sold || false} onChange={handleInputChange} className="bg-white/10 border border-yellow-400/30 text-white focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />Is Sold</label>
      {/* Main Image Upload */}
      <div className="col-span-2">
        <label className="block font-semibold mb-1">Main Image</label>
        <input type="file" accept="image/*" onChange={handleMainImageChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
        {mainImage && <div className="text-xs text-gray-500 mt-1">{mainImage.name}</div>}
      </div>
      {/* Additional Images Upload */}
      <div className="col-span-2">
        <label className="block font-semibold mb-1">Additional Images</label>
        <input type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} className="input bg-white/10 border border-yellow-400/30 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50" />
        {additionalImages.length > 0 && <div className="text-xs text-gray-500 mt-1">{additionalImages.map(img => img.name).join(', ')}</div>}
      </div>
      <button type="submit" className="col-span-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-2 rounded-lg mt-4 shadow-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300" disabled={loading}>{loading ? 'Adding...' : 'Add Car'}</button>
      {success && <div className="text-green-600 col-span-2">{success}</div>}
      {error && <div className="text-red-600 col-span-2">{error}</div>}
    </form>
  );
}
// --- END NEW ADD CAR FORM ---

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
      Papa.parse(text as string, {
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

// Add TradeInsPanel component
function TradeInsPanel() {
  const [tradeIns, setTradeIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  useEffect(() => {
    async function fetchTradeIns() {
      setLoading(true);
      const { data, error } = await supabase.from('trade_ins').select('*').order('created_at', { ascending: false });
      if (error) setError(error.message);
      else setTradeIns(data || []);
      setLoading(false);
    }
    fetchTradeIns();
    const channel = supabase.channel('realtime-tradeins')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trade_ins' }, (payload) => {
        if (payload.eventType === 'INSERT') setTradeIns(prev => [payload.new, ...prev]);
        else if (payload.eventType === 'UPDATE') setTradeIns(prev => prev.map(ti => ti.id === payload.new.id ? payload.new : ti));
        else if (payload.eventType === 'DELETE') setTradeIns(prev => prev.filter(ti => ti.id !== payload.old.id));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
  async function handleStatus(id: string, status: string) {
    setUpdating(id);
    await supabase.from('trade_ins').update({ status }).eq('id', id);
    setUpdating(null);
  }
  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">Trade-In Requests</h3>
      {loading ? <div>Loading...</div> : null}
      {error && <div className="text-red-600">{error}</div>}
      <table className="min-w-full table-auto border rounded shadow bg-white dark:bg-gray-900">
        <thead>
          <tr>
            <th className="p-2">User</th>
            <th className="p-2">Contact</th>
            <th className="p-2">Car</th>
            <th className="p-2">Images</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tradeIns.map((ti) => (
            <tr key={ti.id} className="border-t">
              <td className="p-2">{ti.user_name}<br/>{ti.user_email}<br/>{ti.user_phone}</td>
              <td className="p-2">{ti.user_email}<br/>{ti.user_phone}</td>
              <td className="p-2">{ti.car_make} {ti.car_model} {ti.car_year}<br/>Mileage: {ti.car_mileage}<br/>Condition: {ti.car_condition}<br/>{ti.notes}</td>
              <td className="p-2">
                <div className="flex gap-1">
                  {(ti.car_images || []).map((img: string, i: number) => (
                    <img key={i} src={img} alt="car" className="w-10 h-10 object-cover rounded shadow" />
                  ))}
                </div>
              </td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs text-white ${ti.status === 'approved' ? 'bg-green-600' : ti.status === 'rejected' ? 'bg-red-600' : 'bg-yellow-500'}`}>{ti.status}</span>
              </td>
              <td className="p-2 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleStatus(ti.id, 'approved')} disabled={updating === ti.id || ti.status === 'approved'}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => handleStatus(ti.id, 'rejected')} disabled={updating === ti.id || ti.status === 'rejected'}>Reject</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Add RentalsPanel component
function RentalsPanel() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editingRental, setEditingRental] = useState<any>(null);
  const [addForm, setAddForm] = useState({
    make: '',
    model: '',
    year: '',
    price_per_day: '',
    available: true,
    location: '',
    description: '',
    features: ''
  });
  const [editForm, setEditForm] = useState<any>({});
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');
  const [addError, setAddError] = useState('');
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchRentals();
  }, []);

  async function fetchRentals() {
    setLoading(true);
    const { data, error } = await supabase.from('rentals').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setRentals(data || []);
    setLoading(false);
  }

  function openEdit(rental: any) {
    setEditingRental(rental);
    setEditForm({
      make: rental.make,
      model: rental.model,
      year: rental.year,
      price_per_day: rental.price_per_day,
      description: rental.description
    });
  }

  function closeEdit() {
    setEditingRental(null);
    setEditForm({});
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEditLoading(true);
    const { error } = await supabase.from('rentals').update(editForm).eq('id', editingRental.id);
    if (error) setEditError(error.message);
    else {
      closeEdit();
      fetchRentals();
    }
    setEditLoading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this rental?')) return;
    const { error } = await supabase.from('rentals').delete().eq('id', id);
    if (error) setError(error.message);
    else fetchRentals();
  }

  function handleAddChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setAddForm({ ...addForm, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value });
  }

  function handleMainImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Handle main image upload
  }

  function handleAdditionalImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Handle additional images upload
  }

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setAddSuccess('');
    setAddError('');
    const { error } = await supabase.from('rentals').insert([addForm]);
    if (error) setAddError(error.message);
    else {
      setAddSuccess('Rental added successfully!');
      setAddForm({
        make: '',
        model: '',
        year: '',
        price_per_day: '',
        available: true,
        location: '',
        description: '',
        features: ''
      });
      setShowAdd(false);
      fetchRentals();
    }
    setAddLoading(false);
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <Button className="bg-gradient-to-r from-green-500 to-blue-400 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:from-green-400 hover:to-blue-300 transition-all duration-300" onClick={() => setShowAdd(true)}>
          Add Rental
        </Button>
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white">Rental Cars</h3>
      {loading ? <div className="text-white">Loading...</div> : null}
      {error && <div className="text-red-400">{error}</div>}
      <div className="backdrop-blur-md bg-gray-800/60 border border-gray-400/20 rounded-xl shadow-2xl overflow-hidden">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-700/60 border-b border-gray-600">
              <th className="p-4 text-left text-white font-semibold">Make</th>
              <th className="p-4 text-left text-white font-semibold">Model</th>
              <th className="p-4 text-left text-white font-semibold">Year</th>
              <th className="p-4 text-left text-white font-semibold">Price/Day</th>
              <th className="p-4 text-left text-white font-semibold">Available</th>
              <th className="p-4 text-left text-white font-semibold">Images</th>
              <th className="p-4 text-left text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental.id} className="border-b border-gray-600 hover:bg-gray-700/30 transition-colors">
                <td className="p-4 text-white">{rental.make}</td>
                <td className="p-4 text-white">{rental.model}</td>
                <td className="p-4 text-white">{rental.year}</td>
                <td className="p-4 text-white">KES {rental.price_per_day?.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    rental.available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {rental.available ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {(rental.additional_images || [rental.main_image]).map((img: string, i: number) => (
                      <img key={i} src={img} alt="car" className="w-10 h-10 object-cover rounded shadow" />
                    ))}
                  </div>
                </td>
                <td className="p-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(rental)} className="bg-blue-600/20 border-blue-400 text-blue-300 hover:bg-blue-600/40">Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(rental.id)} className="bg-red-600/20 border-red-400 text-red-300 hover:bg-red-600/40">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Add Rental Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <form onSubmit={handleAddSubmit} className="backdrop-blur-md bg-gray-800/80 border border-gray-400/20 rounded-xl p-8 shadow-2xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Add Rental Car</h3>
              <button type="button" onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <input 
              name="make" 
              placeholder="Make" 
              value={addForm.make} 
              onChange={handleAddChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              required 
            />
            <input 
              name="model" 
              placeholder="Model" 
              value={addForm.model} 
              onChange={handleAddChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              required 
            />
            <input 
              name="year" 
              placeholder="Year" 
              value={addForm.year} 
              onChange={handleAddChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              required 
            />
            <input 
              name="price_per_day" 
              placeholder="Price/Day" 
              value={addForm.price_per_day} 
              onChange={handleAddChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              required 
            />
            <select 
              name="available" 
              value={addForm.available ? 'true' : 'false'} 
              onChange={handleAddChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
            <input 
              name="location" 
              placeholder="Location" 
              value={addForm.location} 
              onChange={handleAddChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            <textarea 
              name="description" 
              placeholder="Description" 
              value={addForm.description} 
              onChange={handleAddChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              rows={3}
            />
            <input 
              name="features" 
              placeholder="Features (comma separated)" 
              value={addForm.features} 
              onChange={handleAddChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            
            <div className="space-y-2">
              <label className="block font-semibold mb-1 text-white">Main Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleMainImageChange} 
                className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="block font-semibold mb-1 text-white">Additional Images</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleAdditionalImagesChange} 
                className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" 
              />
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                type="submit" 
                size="sm" 
                variant="primary" 
                disabled={addLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {addLoading ? 'Adding...' : 'Add Rental'}
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={() => setShowAdd(false)}
                className="bg-gray-600/20 border-gray-400 text-gray-300 hover:bg-gray-600/40 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
            
            {addSuccess && <div className="text-green-400 mt-2 bg-green-900/20 p-2 rounded">{addSuccess}</div>}
            {addError && <div className="text-red-400 mt-2 bg-red-900/20 p-2 rounded">{addError}</div>}
          </form>
        </div>
      )}
      
      {/* Edit Modal */}
      {editingRental && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <form onSubmit={handleEditSubmit} className="backdrop-blur-md bg-gray-800/80 border border-gray-400/20 rounded-xl p-8 shadow-2xl w-full max-w-lg space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Edit Rental</h3>
              <button type="button" onClick={closeEdit} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <input 
              name="make" 
              placeholder="Make" 
              value={editForm.make || ''} 
              onChange={handleEditChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            <input 
              name="model" 
              placeholder="Model" 
              value={editForm.model || ''} 
              onChange={handleEditChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            <input 
              name="year" 
              placeholder="Year" 
              value={editForm.year || ''} 
              onChange={handleEditChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            <input 
              name="price_per_day" 
              placeholder="Price/Day" 
              value={editForm.price_per_day || ''} 
              onChange={handleEditChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            />
            <textarea 
              name="description" 
              placeholder="Description" 
              value={editForm.description || ''} 
              onChange={handleEditChange} 
              className="w-full p-3 bg-gray-700/60 border border-gray-500/50 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              rows={3}
            />
            
            <div className="flex gap-2 mt-6">
              <Button 
                type="submit" 
                size="sm" 
                variant="primary" 
                disabled={editLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {editLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={closeEdit}
                className="bg-gray-600/20 border-gray-400 text-gray-300 hover:bg-gray-600/40 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
            </div>
            
            {editError && <div className="text-red-400 mt-2 bg-red-900/20 p-2 rounded">{editError}</div>}
          </form>
        </div>
      )}
    </div>
  );
}

const AllCarsPanel = ({ fetchCars }: { fetchCars: () => Promise<void> }) => {
  const [cars, setCars] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [tradeIns, setTradeIns] = useState<any[]>([]);
  const [soldCars, setSoldCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError('');
      try {
        const [{ data: carsData }, { data: rentalsData }, { data: tradeInsData }] = await Promise.all([
          supabase.from('cars').select('*'),
          supabase.from('rentals').select('*'),
          supabase.from('trade_ins').select('*').eq('status', 'approved'),
        ]);
        setCars((carsData || []).filter((c: any) => !c.is_sold));
        setSoldCars((carsData || []).filter((c: any) => c.is_sold));
        setRentals(rentalsData || []);
        setTradeIns(tradeInsData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      }
      setLoading(false);
    }
    fetchAll();
    // Real-time updates for all tables
    const carCh = supabase.channel('realtime-cars').on('postgres_changes', { event: '*', schema: 'public', table: 'cars' }, fetchAll).subscribe();
    const rentalCh = supabase.channel('realtime-rentals').on('postgres_changes', { event: '*', schema: 'public', table: 'rentals' }, fetchAll).subscribe();
    const tradeInCh = supabase.channel('realtime-tradeins').on('postgres_changes', { event: '*', schema: 'public', table: 'trade_ins' }, fetchAll).subscribe();
    return () => {
      supabase.removeChannel(carCh);
      supabase.removeChannel(rentalCh);
      supabase.removeChannel(tradeInCh);
    };
  }, []);
  function handleView(item: any, type: string) {
    if (type === 'For Sale') window.location.hash = '#addCar';
    else if (type === 'Rental') window.location.hash = '#rentals';
    else if (type === 'Trade-In') window.location.hash = '#tradeins';
  }
  async function handleDelete(item: any, type: string) {
    if (!window.confirm('Delete this item?')) return;
    if (type === 'For Sale' || type === 'Sold') await supabase.from('cars').delete().eq('id', item.id);
    else if (type === 'Rental') await supabase.from('rentals').delete().eq('id', item.id);
    else if (type === 'Trade-In') await supabase.from('trade_ins').delete().eq('id', item.id);
  }
  async function handleApprove(item: any) {
    await supabase.from('trade_ins').update({ status: 'approved' }).eq('id', item.id);
  }
  async function handleToggleSold(item: any) {
    const newStatus = item.status === 'sold' ? 'published' : 'sold';
    await supabase.from('cars').update({ status: newStatus }).eq('id', item.id);
  }
  return (
    <div className="space-y-10">
      <div className="overflow-x-auto glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-4 text-yellow-500">Cars for Sale</h3>
        <TableSection items={cars} type="For Sale" handleView={handleView} handleDelete={handleDelete} handleToggleSold={handleToggleSold} />
      </div>
      <div className="overflow-x-auto glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-4 text-blue-500">Rentals</h3>
        <TableSection items={rentals} type="Rental" handleView={handleView} handleDelete={handleDelete} />
      </div>
      <div className="overflow-x-auto glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
        <h3 className="text-2xl font-bold mb-4 text-green-500">Trade-Ins</h3>
        <TableSection items={tradeIns} type="Trade-In" handleView={handleView} handleDelete={handleDelete} handleApprove={handleApprove} />
      </div>
      {soldCars.length > 0 && (
        <div className="overflow-x-auto glass-panel rounded-2xl p-6 shadow-xl border border-white/20 backdrop-blur-xl">
          <h3 className="text-2xl font-bold mb-4 text-gray-500">Sold Cars</h3>
          <TableSection items={soldCars} type="Sold" handleView={handleView} handleDelete={handleDelete} />
        </div>
      )}
    </div>
  );
};

function TableSection({ items, type, handleView, handleDelete, handleToggleSold, handleApprove }: any) {
  return (
    <table className="min-w-full table-auto border rounded shadow bg-white dark:bg-gray-900">
      <thead>
        <tr>
          <th className="p-2">Type</th>
          <th className="p-2">Name/Make</th>
          <th className="p-2">Model</th>
          <th className="p-2">Year</th>
          <th className="p-2">Price</th>
          <th className="p-2">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item: any) => (
          <tr key={item.id} className="border-t">
            <td className="p-2">{type}</td>
            <td className="p-2">{item.name || item.make || item.car_make}</td>
            <td className="p-2">{item.model || item.car_model}</td>
            <td className="p-2">{item.year || item.car_year}</td>
            <td className="p-2">{item.price?.toLocaleString() || item.price_per_day?.toLocaleString() || '-'}</td>
            <td className="p-2">{item.status || (item.available ? 'Available' : 'Not Available')}</td>
            <td className="p-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleView(item, type)}>View</Button>
              {type === 'For Sale' && <Button size="sm" variant="outline" onClick={() => handleToggleSold(item)}>{item.status === 'sold' ? 'In Stock' : 'Sold Out'}</Button>}
              {type === 'Trade-In' && <Button size="sm" variant="outline" onClick={() => handleApprove(item)} disabled={item.status === 'approved'}>Approve</Button>}
              <Button size="sm" variant="danger" onClick={() => handleDelete(item, type)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function CarManagementPanel() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('all');
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchCars() {
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false }).limit(100);
      if (data) setCars(data);
      if (error) setError(error.message);
    } catch (error) {
      setError('Failed to fetch cars');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="glass-panel w-full max-w-6xl mx-auto p-8 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-4">{t('carsManagement')}</h2>
      <Tabs>
        <TabsList>
          <TabsTrigger label={String(t('allCars') || 'All Cars')} selected={tab === 'all'} onClick={() => setTab('all')} />
          <TabsTrigger label={String(t('addCar') || 'Add Car')} selected={tab === 'add'} onClick={() => setTab('add')} />
          <TabsTrigger label={String(t('bulkUpload') || 'Bulk Upload')} selected={tab === 'bulk'} onClick={() => setTab('bulk')} />
          <TabsTrigger label={"Rentals"} selected={tab === 'rentals'} onClick={() => setTab('rentals')} />
          <TabsTrigger label={"Trade-Ins"} selected={tab === 'tradeins'} onClick={() => setTab('tradeins')} />
        </TabsList>
        <TabsContent>{tab === 'all' && <AllCarsPanel fetchCars={fetchCars} />}</TabsContent>
        <TabsContent>{tab === 'add' && <AddCarFormV2 onCarAdded={fetchCars} />}</TabsContent>
        <TabsContent>{tab === 'bulk' && <BulkUpload />}</TabsContent>
        <TabsContent>{tab === 'rentals' && <RentalsPanel />}</TabsContent>
        <TabsContent>{tab === 'tradeins' && <TradeInsPanel />}</TabsContent>
      </Tabs>
    </div>
  );
} 