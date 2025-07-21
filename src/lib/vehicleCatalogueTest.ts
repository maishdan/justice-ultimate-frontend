import { supabase } from './supabaseClient';

// Add SHOW_PRIVATE_LOGS to window type
declare global {
  interface Window {
    SHOW_PRIVATE_LOGS?: boolean;
  }
}

export async function testVehicleCatalogueData() {
  try {
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (carsError) {
      if (typeof window !== 'undefined' && (window as any).SHOW_PRIVATE_LOGS) {
        console.error('❌ Cars fetch failed:', carsError.message);
      }
      return false;
    }
    const { error: rentalsError } = await supabase
      .from('rentals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (rentalsError) {
      if (typeof window !== 'undefined' && (window as any).SHOW_PRIVATE_LOGS) {
        console.error('❌ Rentals fetch failed:', rentalsError.message);
      }
      return false;
    }
    if (cars && cars.length > 0) {
      const carsWithIssues = cars.filter((car: Record<string, any>) => 
        (!car.name && !car.title) || 
        (!car.brand && !car.make) ||
        !car.price
      );
      if (carsWithIssues.length > 0 && typeof window !== 'undefined' && (window as any).SHOW_PRIVATE_LOGS) {
        console.warn('⚠️ Found cars with missing data:', carsWithIssues.length);
      }
    }
    return true;
  } catch (err) {
    if (typeof window !== 'undefined' && (window as any).SHOW_PRIVATE_LOGS) {
      console.error('❌ VehicleCatalogue test failed:', err);
    }
    return false;
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => {
    testVehicleCatalogueData();
  }, 3000);
} 