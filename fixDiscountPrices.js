import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from './api/models/Listing.model.js';

dotenv.config();

const fixDiscountPrices = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB');

    // Find all listings with offers
    const listings = await Listing.find({ offer: true });
    console.log(`Found ${listings.length} listings with offers`);

    let fixedCount = 0;
    let alreadyCorrect = 0;

    for (const listing of listings) {
      // Check if discountPrice is actually a discount amount (less than regularPrice by a large margin)
      // If discountPrice < regularPrice * 0.5, it's likely a discount amount, not final price
      if (listing.discountPrice < listing.regularPrice * 0.5) {
        console.log(`\nFixing: ${listing.name}`);
        console.log(`  Regular Price: ₹${listing.regularPrice.toLocaleString('en-IN')}`);
        console.log(`  Current Discount Price (wrong): ₹${listing.discountPrice.toLocaleString('en-IN')}`);
        
        // Calculate correct discounted price
        const correctDiscountPrice = listing.regularPrice - listing.discountPrice;
        console.log(`  Corrected Discount Price: ₹${correctDiscountPrice.toLocaleString('en-IN')}`);
        console.log(`  Discount Amount: ₹${listing.discountPrice.toLocaleString('en-IN')}`);

        // Update the listing
        await Listing.findByIdAndUpdate(listing._id, {
          discountPrice: correctDiscountPrice
        });
        
        fixedCount++;
      } else {
        console.log(`✓ ${listing.name} - Already correct`);
        alreadyCorrect++;
      }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Total listings checked: ${listings.length}`);
    console.log(`Fixed: ${fixedCount}`);
    console.log(`Already correct: ${alreadyCorrect}`);
    console.log(`\nAll discount prices have been corrected!`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixDiscountPrices();
