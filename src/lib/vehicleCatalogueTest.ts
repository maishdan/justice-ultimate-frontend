import { supabase } from './supabaseClient';

export async function testVehicleCatalogueData() {
  console.log('🚗 Testing VehicleCatalogue Data Fetch');
  
  try {
    // Test 1: Fetch cars from database
    console.log('1️⃣ Fetching cars from database...');
    const { data: cars, error: carsError } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (carsError) {
      console.error('❌ Cars fetch failed:', carsError.message);
      return false;
    }
    
    console.log('✅ Cars fetched successfully');
    console.log('📊 Cars found:', cars?.length || 0);
    
    if (cars && cars.length > 0) {
      console.log('📋 Sample car data:');
      console.log('- ID:', cars[0].id);
      console.log('- Name:', cars[0].name || cars[0].title || 'N/A');
      console.log('- Brand:', cars[0].brand || cars[0].make || 'N/A');
      console.log('- Price:', cars[0].price || 'N/A');
      console.log('- Category:', cars[0].category || 'N/A');
      console.log('- Created:', cars[0].created_at || 'N/A');
    }
    
    // Test 2: Fetch rentals from database
    console.log('2️⃣ Fetching rentals from database...');
    const { data: rentals, error: rentalsError } = await supabase
      .from('rentals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (rentalsError) {
      console.error('❌ Rentals fetch failed:', rentalsError.message);
      return false;
    }
    
    console.log('✅ Rentals fetched successfully');
    console.log('📊 Rentals found:', rentals?.length || 0);
    
    // Test 3: Check for any cars with missing required fields
    console.log('3️⃣ Checking for data integrity...');
    if (cars && cars.length > 0) {
      const carsWithIssues = cars.filter(car => 
        !car.name && !car.title || 
        !car.brand && !car.make ||
        !car.price
      );
      
      if (carsWithIssues.length > 0) {
        console.warn('⚠️ Found cars with missing data:', carsWithIssues.length);
        carsWithIssues.forEach((car, index) => {
          console.warn(`  Car ${index + 1}:`, {
            id: car.id,
            name: car.name || car.title || 'MISSING',
            brand: car.brand || car.make || 'MISSING',
            price: car.price || 'MISSING'
          });
        });
      } else {
        console.log('✅ All cars have required data');
      }
    }
    
    console.log('🎉 VehicleCatalogue data test completed!');
    console.log('📋 Database connection is working');
    console.log('🚗 Real data is being fetched');
    
    return true;
    
  } catch (err) {
    console.error('❌ VehicleCatalogue test failed:', err);
    return false;
  }
}

// Auto-run test
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testVehicleCatalogueData();
  }, 3000);
} 