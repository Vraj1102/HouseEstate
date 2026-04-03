import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from './api/models/Listing.model.js';

dotenv.config();

const cleanRentPropertyOffers = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');

    // Find all rent properties with offers
    const rentListings = await Listing.find({ type: 'rent', offer: true });
    console.log(`Found ${rentListings.length} rent properties with offers`);

    if (rentListings.length === 0) {
      console.log('No rent properties with offers found. All clean!');
      await mongoose.disconnect();
      return;
    }

    let cleanedCount = 0;

    for (const listing of rentListings) {
      console.log(`\nCleaning: ${listing.name}`);
      console.log(`  Type: ${listing.type}`);
      console.log(`  Had offer: ${listing.offer}`);
      console.log(`  Discount Price: ₹${listing.discountPrice.toLocaleString('en-IN')}`);
      
      // Remove offer and set discountPrice to 0 for rent properties
      await Listing.findByIdAndUpdate(listing._id, {
        offer: false,
        discountPrice: 0
      });
      
      console.log(`  ✓ Removed offer and discount`);
      cleanedCount++;
    }

    console.log(`\n=== Summary ===`);
    console.log(`Total rent properties checked: ${rentListings.length}`);
    console.log(`Cleaned: ${cleanedCount}`);
    console.log(`\nAll rent properties are now clean (no offers)!`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

cleanRentPropertyOffers();
