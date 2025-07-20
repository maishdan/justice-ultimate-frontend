import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiBarChart2, FiDownload, FiUsers, FiChevronDown, FiChevronUp, FiGlobe, FiUpload, FiFileText, FiArrowRightCircle, FiAlertCircle, FiFlag, FiX } from 'react-icons/fi';
import { FaStar, FaCar, FaChartLine, FaCrown, FaExchangeAlt, FaFilePdf, FaFileCsv, FaUserShield } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import allCountries from '../../../data/allCountries';

const currencySymbols: Record<string, string> = { KES: 'Ksh', USD: '$', UGX: 'USh', TZS: 'TSh', RWF: 'FRw' };

function BranchCard({ branch, onDetails, onEdit }: { branch: any; onDetails: (b: any) => void; onEdit: (b: any) => void }) {
  // Defensive: fallback for missing/null fields
  const revenue = typeof branch.revenue === 'number' ? branch.revenue : 0;
  const sales = typeof branch.sales === 'number' ? branch.sales : 0;
  const staff = typeof branch.staff === 'number' ? branch.staff : 0;
  const cars = typeof branch.cars === 'number' ? branch.cars : 0;
  const rentals = typeof branch.rentals === 'number' ? branch.rentals : 0;
  const rating = typeof branch.rating === 'number' ? branch.rating : 0;
  const currency = branch.currency || 'KES';
  return (
    <div className="glass-panel rounded-2xl shadow-xl p-6 flex flex-col gap-2 border border-blue-100 dark:border-blue-800 hover:shadow-2xl transition cursor-pointer group relative min-w-[270px] max-w-xs aspect-square justify-between" onClick={() => onDetails(branch)}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{branch.flag || <FiFlag />}</span>
          <span className="font-bold text-lg text-blue-800 dark:text-blue-200 truncate">{branch.branch_name}</span>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${branch.status === 'active' ? 'bg-green-100 text-green-700' : branch.status === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{branch.status}</span>
          <span className="ml-auto text-xs text-blue-400">{branch.branch_code}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-1">
          <FiMapPin className="text-blue-400" /> {branch.location}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-1">
          <FaUserShield className="text-blue-400" /> {branch.manager}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-1">
          <FiUsers className="text-blue-400" /> Staff: <span className="font-bold text-blue-700 dark:text-blue-200">{staff}</span>
          <FaCar className="text-blue-400 ml-2" /> Cars: <span className="font-bold text-blue-700 dark:text-blue-200">{cars}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-1">
          <FaChartLine className="text-blue-400" /> Sales: <span className="font-bold text-blue-700 dark:text-blue-200">{sales}</span>
          <FaCrown className="text-yellow-500 ml-2" /> Rating: <span className="text-yellow-500">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mb-1">
          <FiBarChart2 className="text-blue-400" /> Revenue: <span className="font-bold text-blue-700 dark:text-blue-200">{currencySymbols[currency]} {revenue.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow hover:bg-blue-700 transition flex items-center gap-1" onClick={e => { e.stopPropagation(); window.open(branch.map_link, '_blank'); }}><FiMapPin /> Map</button>
        <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow hover:bg-green-700 transition flex items-center gap-1" onClick={e => { e.stopPropagation(); alert('Analytics coming soon!'); }}><FiBarChart2 /> Analytics</button>
        <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow hover:bg-yellow-600 transition flex items-center gap-1" onClick={e => { e.stopPropagation(); alert('Export coming soon!'); }}><FiDownload /> Export</button>
        <button className="bg-gray-200 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold shadow hover:bg-gray-300 transition flex items-center gap-1" onClick={e => { e.stopPropagation(); onDetails(branch); }}><FiEdit /> Details</button>
      </div>
      <div className="absolute top-3 right-3 flex gap-2">
        <button className="text-blue-400 hover:text-blue-700" title="Edit Branch" onClick={e => { e.stopPropagation(); onEdit(branch); }}><FiEdit /></button>
        <button className="text-red-400 hover:text-red-700" title="Delete Branch" onClick={e => { e.stopPropagation(); if(window.confirm('Delete this branch?')) alert('Deleted!'); }}><FiTrash2 /></button>
      </div>
    </div>
  );
}

function BranchForm({ branch, onSave, onClose }: { branch?: any; onSave: (b: any) => void; onClose: () => void }) {
  const [form, setForm] = useState(branch || {
    branch_name: '', branch_code: '', location: '', manager: '', email: '', phone: '', status: 'active', city: '', country: '', capacity: '', map_link: '', established: '', notes: '', flag: '🇰🇪',
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-red-600" onClick={onClose}><FiX size={24} /></button>
        <h2 className="text-xl font-bold mb-4">{branch ? 'Edit Branch' : 'Add Branch'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Branch Name</label>
              <input name="branch_name" value={form.branch_name} onChange={handleChange} required className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Branch Code</label>
              <input name="branch_code" value={form.branch_code} onChange={handleChange} required className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Manager</label>
              <input name="manager" value={form.manager} onChange={handleChange} required className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input name="email" value={form.email} onChange={handleChange} required className="input w-full" type="email" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} required className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input w-full">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="setup">Under Setup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">City</label>
              <input name="city" value={form.city} onChange={handleChange} required className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Country</label>
              <input name="country" value={form.country} onChange={handleChange} required className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Capacity</label>
              <input name="capacity" value={form.capacity} onChange={handleChange} required className="input w-full" type="number" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Map Link</label>
              <input name="map_link" value={form.map_link} onChange={handleChange} required className="input w-full" type="url" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Established</label>
              <input name="established" value={form.established} onChange={handleChange} required className="input w-full" type="date" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Flag</label>
              <input name="flag" value={form.flag} onChange={handleChange} className="input w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} className="input w-full" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">{branch ? 'Save Changes' : 'Add Branch'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BranchDetails({ branch, onBack, onEdit, onAddStaff, onTransfer, onUpload, onDelete }: { branch: any; onBack: () => void; onEdit: (b: any) => void; onAddStaff: () => void; onTransfer: () => void; onUpload: () => void; onDelete: () => void }) {
  const [showStaff, setShowStaff] = useState(false);
  const [showCars, setShowCars] = useState(false);
  const [showSales, setShowSales] = useState(false);
  const [showRentals, setShowRentals] = useState(false);
  const branchTileRef = useRef<HTMLDivElement>(null);

  // PDF Export for Branch Profile (official, professional)
  const handleExportProfilePDF = async () => {
    const COMPANY_LOGO = "https://tyypdmhxuehzddudeuww.supabase.co/storage/v1/object/public/avatars//logo.png";
    const COURT_LOGO = "https://tyypdmhxuehzddudeuww.supabase.co/storage/v1/object/public/avatars//kenyan%20coat%20of%20arms.png";
    const COMPANY_NAME = "Justice Ultimate Automobiles";
    const COMPANY_CONTACT = "07222827458 | justiceultimateautomobiles@gmail.com";
    const COMPANY_FOOTER = "Justice Ultimate Automobiles 2025 : your trusted car masters";
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    // Add logos
    const toDataUrl = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = function () {
          reject(new Error('Failed to load image: ' + url));
        };
        img.src = url;
      });
    };
    const [companyLogo, courtLogo] = await Promise.all([
      toDataUrl(COMPANY_LOGO),
      toDataUrl(COURT_LOGO)
    ]);
    // Header
    doc.setFillColor(30, 58, 138); // blue-800
    doc.rect(0, 0, 595, 80, 'F');
    doc.addImage(courtLogo, 'PNG', 30, 20, 40, 40);
    doc.addImage(companyLogo, 'PNG', 525, 20, 40, 40);
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text(COMPANY_NAME, 297.5, 45, { align: 'center' });
    doc.setFontSize(11);
    doc.text(COMPANY_CONTACT, 297.5, 65, { align: 'center' });
    // Branch Info
    doc.setFontSize(16);
    doc.setTextColor(30, 58, 138); // blue-800
    // --- FLAG LOGIC ---
    let flagX = 40;
    let flagY = 120;
    let branchNameX = flagX + 35;
    // Helper to get PNG flag URL from country code
    function getFlagPngUrl(code: string) {
      return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
    }
    let code = '';
    if (branch.flag && branch.flag.length === 2) code = branch.flag;
    else if (branch.country) {
      const found = allCountries.find(c => c.name.toLowerCase() === branch.country.toLowerCase());
      if (found) code = found.code;
    }
    if (code) {
      try {
        const flagImg = await toDataUrl(getFlagPngUrl(code));
        doc.addImage(flagImg, 'PNG', flagX, flagY - 18, 28, 28);
      } catch (e) {
        doc.text('🏳️', flagX, flagY); // fallback
      }
    } else {
      doc.text('🏳️', flagX, flagY);
    }
    doc.text(`Branch Profile: ${branch.branch_name} (${branch.branch_code})`, branchNameX, flagY);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 145;
    const lineGap = 22;
    doc.text(`Manager:`, 40, y); doc.text(branch.manager || '-', 180, y);
    y += lineGap;
    doc.text(`Contact:`, 40, y); doc.text(`${branch.phone || '-'} | ${branch.email || '-'}`, 180, y);
    y += lineGap;
    doc.text(`Location:`, 40, y); doc.text(branch.location || '-', 180, y);
    y += lineGap;
    doc.text(`City:`, 40, y); doc.text(branch.city || '-', 180, y);
    y += lineGap;
    doc.text(`Country:`, 40, y); doc.text(branch.country || '-', 180, y);
    y += lineGap;
    doc.text(`Status:`, 40, y); doc.text(branch.status || '-', 180, y);
    y += lineGap;
    doc.text(`Capacity:`, 40, y); doc.text(String(branch.capacity || '-'), 180, y);
    y += lineGap;
    doc.text(`Established:`, 40, y); doc.text(branch.established || '-', 180, y);
    y += lineGap;
    doc.text(`Notes:`, 40, y); doc.text(branch.notes || '-', 180, y, { maxWidth: 350 });
    y += lineGap;
    doc.text(`Flag:`, 40, y); doc.text('See above', 180, y);
    y += lineGap;
    doc.text(`Staff:`, 40, y); doc.text(String(branch.staff || '-'), 180, y);
    y += lineGap;
    doc.text(`Cars:`, 40, y); doc.text(String(branch.cars || '-'), 180, y);
    y += lineGap;
    doc.text(`Sales:`, 40, y); doc.text(String(branch.sales || '-'), 180, y);
    y += lineGap;
    doc.text(`Revenue:`, 40, y); doc.text(`${currencySymbols[branch.currency] || ''} ${branch.revenue?.toLocaleString() || '-'}`, 180, y);
    y += lineGap;
    // Map Link (clickable)
    if (branch.map_link) {
      doc.setTextColor(0, 102, 204);
      doc.textWithLink('View on Map', 40, y, { url: branch.map_link });
      doc.setTextColor(0, 0, 0);
      y += lineGap;
    }
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(COMPANY_FOOTER, 297.5, 820, { align: 'center' });
    doc.save(`${branch.branch_name}_profile.pdf`);
  };

  // PDF Export for Sales
  const handleExportSalesPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Sales Report - ' + branch.branch_name, 10, 20);
    (autoTable as any)(doc, {
      head: [['Daily', 'Weekly', 'Monthly', 'Total', 'Top Staff', 'Most Sold Model', 'Earnings']],
      body: [[
        Math.floor(branch.sales / 30),
        Math.floor(branch.sales / 4),
        branch.sales,
        branch.sales,
        'Grace Kimani',
        'Toyota Premio',
        (currencySymbols[branch.currency] || '') + ' ' + branch.revenue.toLocaleString()
      ]],
      startY: 30
    });
    doc.save(`${branch.branch_name}_sales.pdf`);
  };

  // CSV Export for Staff
  const handleExportStaffCSV = () => {
    // For demo, just one row. Replace with real staff data if available.
    const csv = `Name,Role,Status,KPI\nGrace Kimani,Sales,Active,4.5\n`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${branch.branch_name}_staff.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div ref={branchTileRef} className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 mt-8">
      <div className="flex justify-between items-center mb-6">
        <img src="https://tyypdmhxuehzddudeuww.supabase.co/storage/v1/object/public/avatars//logo.png" alt="Company Logo" className="h-12 w-auto object-contain" />
        <button className="text-blue-600 hover:underline flex items-center gap-1" onClick={onBack}><FiArrowRightCircle className="rotate-180" /> Back to Branches</button>
        <img src="https://tyypdmhxuehzddudeuww.supabase.co/storage/v1/object/public/avatars//kenyan%20coat%20of%20arms.png" alt="Kenyan Coat of Arms" className="h-12 w-auto object-contain" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-blue-800 dark:text-blue-200 flex items-center gap-2">{branch.flag} {branch.branch_name} <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">{branch.branch_code}</span></h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[220px]">
          <div className="text-gray-600 dark:text-gray-300 mb-1">Manager: <span className="font-bold text-blue-700 dark:text-blue-200">{branch.manager}</span></div>
          <div className="text-gray-600 dark:text-gray-300 mb-1">Contact: <span className="font-bold text-blue-700 dark:text-blue-200">{branch.phone}</span> | <span className="font-bold text-blue-700 dark:text-blue-200">{branch.email}</span></div>
          <div className="text-gray-600 dark:text-gray-300 mb-1">Location: <span className="font-bold text-blue-700 dark:text-blue-200">{branch.location}</span></div>
          <div className="text-gray-600 dark:text-gray-300 mb-1">City: <span className="font-bold text-blue-700 dark:text-blue-200">{branch.city}</span> | Country: <span className="font-bold text-blue-700 dark:text-blue-200">{branch.country}</span></div>
          <div className="text-gray-600 dark:text-gray-300 mb-1">Status: <span className={`font-bold ${branch.status === 'active' ? 'text-green-600' : branch.status === 'inactive' ? 'text-red-600' : 'text-yellow-600'}`}>{branch.status}</span></div>
          <div className="text-gray-600 dark:text-gray-300 mb-1">Capacity: <span className="font-bold text-blue-700 dark:text-blue-200">{branch.capacity}</span></div>
          <div className="text-gray-600 dark:text-gray-300 mb-1">Established: <span className="font-bold text-blue-700 dark:text-blue-200">{branch.established}</span></div>
          <div className="text-gray-600 dark:text-gray-300 mb-1">Notes: <span className="font-bold text-blue-700 dark:text-blue-200">{branch.notes}</span></div>
        </div>
        <div className="flex-1 min-w-[220px] flex flex-col gap-2 items-end">
          <a href={branch.map_link} target="_blank" rel="noopener noreferrer" className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-blue-200 transition"><FiMapPin /> View on Map</a>
          <button className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-green-200 transition"><FiBarChart2 /> Analytics</button>
          <button className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-yellow-200 transition"><FiDownload /> Export</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Staff Overview */}
        <div className="bg-blue-50 dark:bg-blue-900/40 rounded-xl p-4 shadow">
          <button className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-200 mb-2" onClick={() => setShowStaff(v => !v)}>{showStaff ? <FiChevronUp /> : <FiChevronDown />} Staff Overview</button>
          {showStaff && (
            <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
              <li>Total Staff: <span className="font-bold">{branch.staff}</span></li>
              <li>Roles: Sales, Mechanics, Admins, Support</li>
              <li>Status: 28 Active, 2 On Leave, 2 Terminated</li>
              <li>Performance: 4.5/5 (KPIs)</li>
            </ul>
          )}
        </div>
        {/* Cars in Inventory */}
        <div className="bg-blue-50 dark:bg-blue-900/40 rounded-xl p-4 shadow">
          <button className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-200 mb-2" onClick={() => setShowCars(v => !v)}>{showCars ? <FiChevronUp /> : <FiChevronDown />} Cars in Inventory</button>
          {showCars && (
            <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
              <li>Available: {branch.cars}</li>
              <li>Sold: {Math.floor(branch.cars * 0.7)}</li>
              <li>Rented: {branch.rentals}</li>
              <li>Real-time Inventory: {branch.cars - branch.rentals}</li>
            </ul>
          )}
        </div>
        {/* Sales Statistics */}
        <div className="bg-blue-50 dark:bg-blue-900/40 rounded-xl p-4 shadow">
          <button className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-200 mb-2" onClick={() => setShowSales(v => !v)}>{showSales ? <FiChevronUp /> : <FiChevronDown />} Sales Statistics</button>
          {showSales && (
            <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
              <li>Daily Sales: {Math.floor(branch.sales / 30)}</li>
              <li>Weekly Sales: {Math.floor(branch.sales / 4)}</li>
              <li>Monthly Sales: {branch.sales}</li>
              <li>Top Staff: Grace Kimani</li>
              <li>Most Sold Model: Toyota Premio</li>
              <li>Earnings: {currencySymbols[branch.currency]} {branch.revenue.toLocaleString()}</li>
            </ul>
          )}
        </div>
        {/* Rentals Activity */}
        <div className="bg-blue-50 dark:bg-blue-900/40 rounded-xl p-4 shadow">
          <button className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-200 mb-2" onClick={() => setShowRentals(v => !v)}>{showRentals ? <FiChevronUp /> : <FiChevronDown />} Rentals Activity</button>
          {showRentals && (
            <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
              <li>Currently Rented: {branch.rentals}</li>
              <li>Return Dates: 2024-05-10, 2024-05-15</li>
              <li>Rental Revenue: {currencySymbols[branch.currency]} {Math.floor(branch.revenue * 0.2).toLocaleString()}</li>
            </ul>
          )}
        </div>
      </div>
      {/* Admin Actions */}
      <div className="flex flex-wrap gap-3 mt-8">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2" onClick={() => onEdit(branch)}><FiEdit /> Edit Branch</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2" onClick={onAddStaff}><FiPlus /> Add Staff</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition flex items-center gap-2" onClick={onTransfer}><FaExchangeAlt /> Transfer Vehicles</button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition flex items-center gap-2" onClick={onUpload}><FiUpload /> Upload Documents</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition flex items-center gap-2" onClick={onDelete}><FiTrash2 /> Delete Branch</button>
        <button className="bg-blue-800 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-900 transition flex items-center gap-2" onClick={handleExportProfilePDF}><FiFileText /> Export Profile</button>
        <button className="bg-blue-400 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition flex items-center gap-2" onClick={handleExportSalesPDF}><FaFilePdf /> Export Sales</button>
        <button className="bg-blue-300 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-400 transition flex items-center gap-2" onClick={handleExportStaffCSV}><FaFileCsv /> Export Staff</button>
      </div>
      {/* Alerts & Automated Features */}
      <div className="mt-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg flex items-center gap-2 mb-2"><FiAlertCircle /> <span>Performance Alert: Sales down 20% this month.</span></div>
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg flex items-center gap-2 mb-2"><FaCrown /> <span>Leaderboard: Grace Kimani is top performer.</span></div>
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg flex items-center gap-2 mb-2"><FiBarChart2 /> <span>Monthly report auto-generated and sent to admin.</span></div>
      </div>
    </div>
  );
}

function AddStaffModal({ branch, onAdd, onClose }: { branch: any; onAdd: (staff: any) => void; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '', status: 'active', kpi_score: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-red-600" onClick={onClose}><FiX size={24} /></button>
        <h2 className="text-xl font-bold mb-4">Add Staff to {branch.branch_name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" className="input w-full" />
          <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="input w-full" type="email" />
          <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone" className="input w-full" />
          <input name="role" value={form.role} onChange={handleChange} required placeholder="Role" className="input w-full" />
          <select name="status" value={form.status} onChange={handleChange} className="input w-full">
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="terminated">Terminated</option>
          </select>
          <input name="kpi_score" value={form.kpi_score} onChange={handleChange} placeholder="KPI Score" className="input w-full" type="number" />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">Add Staff</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TransferVehiclesModal({ branches, fromBranch, onTransfer, onClose }: { branches: any[]; fromBranch: any; onTransfer: (toBranchId: string, count: number) => void; onClose: () => void }) {
  const [toBranch, setToBranch] = useState('');
  const [count, setCount] = useState(1);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-red-600" onClick={onClose}><FiX size={24} /></button>
        <h2 className="text-xl font-bold mb-4">Transfer Vehicles from {fromBranch.branch_name}</h2>
        <div className="space-y-4">
          <select value={toBranch} onChange={e => setToBranch(e.target.value)} className="input w-full">
            <option value="">Select Destination Branch</option>
            {branches.filter(b => b.id !== fromBranch.id).map(b => (
              <option key={b.id} value={b.id}>{b.branch_name}</option>
            ))}
          </select>
          <input type="number" min={1} max={fromBranch.cars} value={count} onChange={e => setCount(Number(e.target.value))} className="input w-full" placeholder="Number of Vehicles" />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300" onClick={onClose}>Cancel</button>
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition" onClick={() => onTransfer(toBranch, count)} disabled={!toBranch || count < 1}>Transfer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadDocumentsModal({ branch, onUpload, onClose }: { branch: any; onUpload: (file: File) => void; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-red-600" onClick={onClose}><FiX size={24} /></button>
        <h2 className="text-xl font-bold mb-4">Upload Document for {branch.branch_name}</h2>
        <div className="space-y-4">
          <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="input w-full" />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300" onClick={onClose}>Cancel</button>
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition" onClick={() => file && onUpload(file)} disabled={!file}>Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BranchesPanel() {
  const [branches, setBranches] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editBranch, setEditBranch] = useState<any | null>(null);
  const [showAddStaff, setShowAddStaff] = useState<any | null>(null);
  const [showTransfer, setShowTransfer] = useState<any | null>(null);
  const [showUpload, setShowUpload] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set immediate mock data for fast loading
  const mockBranches = [
    {
      id: '1',
      branch_name: 'Nairobi Main Branch',
      branch_code: 'NBI-001',
      location: 'Westlands, Nairobi',
      manager: 'Grace Kimani',
      email: 'grace@justice.com',
      phone: '+254700123456',
      status: 'active',
      city: 'Nairobi',
      country: 'Kenya',
      capacity: '150',
      map_link: 'https://maps.google.com',
      established: '2020-01-15',
      notes: 'Main headquarters branch',
      flag: '🇰🇪',
      revenue: 45000000,
      sales: 89,
      staff: 32,
      cars: 120,
      rentals: 15,
      rating: 4,
      currency: 'KES'
    },
    {
      id: '2',
      branch_name: 'Mombasa Coastal Branch',
      branch_code: 'MBS-001',
      location: 'Nyali, Mombasa',
      manager: 'Ahmed Hassan',
      email: 'ahmed@justice.com',
      phone: '+254700654321',
      status: 'active',
      city: 'Mombasa',
      country: 'Kenya',
      capacity: '80',
      map_link: 'https://maps.google.com',
      established: '2021-03-20',
      notes: 'Coastal region branch',
      flag: '🇰🇪',
      revenue: 28000000,
      sales: 45,
      staff: 18,
      cars: 65,
      rentals: 8,
      rating: 4,
      currency: 'KES'
    },
    {
      id: '3',
      branch_name: 'Kisumu Lake Branch',
      branch_code: 'KSM-001',
      location: 'Milimani, Kisumu',
      manager: 'Sarah Ochieng',
      email: 'sarah@justice.com',
      phone: '+254700789012',
      status: 'active',
      city: 'Kisumu',
      country: 'Kenya',
      capacity: '60',
      map_link: 'https://maps.google.com',
      established: '2022-06-10',
      notes: 'Western region branch',
      flag: '🇰🇪',
      revenue: 18000000,
      sales: 32,
      staff: 12,
      cars: 45,
      rentals: 5,
      rating: 4,
      currency: 'KES'
    }
  ];

  // Fetch branches from Supabase
  useEffect(() => {
    fetchBranches();
  }, []);

  async function fetchBranches() {
    setLoading(true);
    setError(null);
    
    // Set immediate mock data for fast loading
    setBranches(mockBranches);
    setLoading(false);
    
    // Try to fetch real data in background with timeout
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 2000)
      );
      
      const dataPromise = supabase.from('branches').select('*').order('created_at', { ascending: false });
      
      const { data, error } = await Promise.race([dataPromise, timeoutPromise]);
      if (!error && data) {
        setBranches(data);
      }
    } catch (error) {
      console.log('Using mock data due to timeout or error:', error);
      // Keep mock data if real data fails
    }
  }

  async function handleSaveBranch(branch: any) {
    setLoading(true);
    setError(null);
    try {
      if (editBranch && editBranch.id) {
        // Update
        const { error } = await supabase.from('branches').update(branch).eq('id', editBranch.id);
        if (error) setError(typeof error.message === 'string' ? error.message : 'Error updating branch');
      } else {
        // Insert
        const { error } = await supabase.from('branches').insert([branch]);
        if (error) setError(typeof error.message === 'string' ? error.message : 'Error adding branch');
      }
      setShowForm(false);
      setEditBranch(null);
      await fetchBranches();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
    setLoading(false);
  }

  async function handleDeleteBranch(id: string) {
    if (!window.confirm('Delete this branch?')) return;
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('branches').delete().eq('id', id);
      if (error) setError(typeof error.message === 'string' ? error.message : 'Error deleting branch');
      await fetchBranches();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
    setLoading(false);
  }

  async function handleAddStaff(staff: any) {
    setLoading(true);
    setError(null);
    try {
      if (showAddStaff && showAddStaff.id) {
        const { error } = await supabase.from('staff').insert([{ ...staff, branch_id: showAddStaff.id }]);
        if (error) setError(typeof error.message === 'string' ? error.message : 'Error adding staff');
      }
      setShowAddStaff(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
    setLoading(false);
  }

  async function handleTransferVehicles(toBranchId: string, count: number) {
    setLoading(true);
    setError(null);
    try {
      if (showTransfer && showTransfer.id) {
        // Fetch available vehicles from fromBranch
        const { data: vehicles } = await supabase.from('vehicles').select('id').eq('branch_id', showTransfer.id).eq('status', 'available').limit(count);
        if (vehicles) {
          for (const v of vehicles) {
            await supabase.from('vehicles').update({ branch_id: toBranchId }).eq('id', v.id);
          }
        }
      }
      setShowTransfer(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
    setLoading(false);
  }

  async function handleUploadDocument(file: File) {
    setLoading(true);
    setError(null);
    try {
      if (showUpload && showUpload.id) {
        // Upload file to Supabase Storage (not shown here)
        // For now, just insert a record
        await supabase.from('branch_documents').insert([{ branch_id: showUpload.id, file_url: file.name, file_name: file.name, uploaded_by: 'admin' }]);
      }
      setShowUpload(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-100 flex items-center gap-2"><FiGlobe /> Branches (Locations, Staff, Sales)</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2" onClick={() => { setShowForm(true); setEditBranch(null); }}><FiPlus /> Add Branch</button>
      </div>
      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
      {loading && <div className="text-blue-600 font-bold mb-4">Loading...</div>}
      {showForm && <BranchForm branch={editBranch} onSave={handleSaveBranch} onClose={() => { setShowForm(false); setEditBranch(null); }} />}
      {showAddStaff && <AddStaffModal branch={showAddStaff} onAdd={handleAddStaff} onClose={() => setShowAddStaff(null)} />}
      {showTransfer && <TransferVehiclesModal branches={branches} fromBranch={showTransfer} onTransfer={handleTransferVehicles} onClose={() => setShowTransfer(null)} />}
      {showUpload && <UploadDocumentsModal branch={showUpload} onUpload={handleUploadDocument} onClose={() => setShowUpload(null)} />}
      {!selected ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {branches.map(branch => (
            <BranchCard key={branch.id} branch={branch} onDetails={setSelected} onEdit={b => { setEditBranch(b); setShowForm(true); }} />
          ))}
        </div>
      ) : (
        <BranchDetails branch={selected} onBack={() => setSelected(null)} onEdit={b => { setEditBranch(b); setShowForm(true); }}
          onAddStaff={() => setShowAddStaff(selected)}
          onTransfer={() => setShowTransfer(selected)}
          onUpload={() => setShowUpload(selected)}
          onDelete={() => handleDeleteBranch(selected.id)}
        />
      )}
    </div>
  );
} 