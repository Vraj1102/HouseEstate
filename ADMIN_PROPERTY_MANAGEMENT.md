# Admin Panel - Property Management Guide

## Overview

Admins can now add and manage properties directly from the admin panel with proper handling of rent vs sale properties.

## Features

### 1. Add Property
- Click "Add Property" button in Listings tab
- Fill in property details
- System automatically handles rent vs sale logic

### 2. Property Types

#### **Rent Properties:**
- Only shows "Rent Price (₹/month)" field
- **No offer checkbox visible**
- **No discount price field**
- Automatically sets `offer: false` and `discountPrice: 0`

#### **Sale Properties:**
- Shows "Regular Price (₹)" field
- **Offer checkbox visible**
- When offer checked → "Discounted Price" field appears
- Can set special offers and discounts

## How to Add a Property

### Adding a Rent Property:

1. Go to Admin Panel → Listings tab
2. Click "Add Property" button
3. Fill in details:
   - Property Name
   - Property Owner (username or email)
   - Description
   - Address
   - **Select "Rent" from Property Type dropdown**
   - Enter "Rent Price (₹/month)"
   - Enter Bedrooms & Bathrooms
   - Add Image URLs (at least 1 required)
   - Check Furnished/Parking if applicable
4. Click "Create Property"

**Note**: Offer checkbox will NOT be visible for rent properties.

### Adding a Sale Property:

1. Go to Admin Panel → Listings tab
2. Click "Add Property" button
3. Fill in details:
   - Property Name
   - Property Owner (username or email)
   - Description
   - Address
   - **Select "Sale" from Property Type dropdown**
   - Enter "Regular Price (₹)"
   - Enter Bedrooms & Bathrooms
   - Add Image URLs (at least 1 required)
   - Check Furnished/Parking if applicable
   - **Check "Special Offer" if discount available**
   - If offer checked → Enter "Discounted Price (₹)"
5. Click "Create Property"

## Property Owner Field

The "Property Owner" field accepts:
- **Username**: e.g., "johndoe"
- **Email**: e.g., "john@example.com"

The system will:
1. Search for user by username or email
2. If found → assign property to that user
3. If not found → assign property to admin (you)

## Form Behavior

### When Switching Property Type:

**Rent → Sale:**
- Offer checkbox appears
- Can add discount price

**Sale → Rent:**
- Offer checkbox disappears
- Discount price field disappears
- Offer automatically set to `false`
- Discount price automatically set to `0`

## Backend Handling

### Create Listing:
```javascript
// For rent properties
{
  type: 'rent',
  regularPrice: 50000,
  offer: false,        // Automatically set
  discountPrice: 0     // Automatically set
}

// For sale properties with offer
{
  type: 'sale',
  regularPrice: 10000000,
  offer: true,
  discountPrice: 9500000  // Final price after discount
}
```

### Update Listing:
- Same logic applies
- Rent properties automatically cleaned of offers
- Sale properties can have offers

## Image Management

### Adding Images:
1. Enter image URL in field
2. Click "Add Image" to add more fields
3. At least 1 image required
4. Can add up to 6 images

### Removing Images:
- Click "Remove" button next to image field
- Cannot remove first image (required)

## Quick Actions

### In Listings Table:
- **👁️ View**: View full property details
- **✏️ Edit**: Edit all property details
- **₹ Quick Price**: Update price quickly
- **🗑️ Delete**: Delete property

### In View Modal:
- **Edit Full Details**: Open edit form
- **Enable/Disable Offer**: Toggle offer status (sale only)
- **Add/Remove Images**: Manage property images

## Validation

### Required Fields:
- Property Name
- Property Owner
- Description
- Address
- Price (Rent or Regular)
- At least 1 image URL
- Bedrooms (min: 1)
- Bathrooms (min: 1)

### Optional Fields:
- Discount Price (sale with offer only)
- Furnished checkbox
- Parking checkbox
- Special Offer checkbox (sale only)

## Examples

### Example 1: Rent Property
```
Property Name: Modern 2BHK Apartment
Property Owner: john@example.com
Description: Spacious apartment in prime location
Address: 123 Main Street, Mumbai
Property Type: Rent
Rent Price: ₹45,000/month
Bedrooms: 2
Bathrooms: 2
Image URL: https://example.com/image1.jpg
Furnished: ✓
Parking: ✓
```

**Result**: Property created with no offer, monthly rent ₹45,000

### Example 2: Sale Property with Offer
```
Property Name: Luxury Villa
Property Owner: jane@example.com
Description: Beautiful villa with garden
Address: 456 Park Avenue, Delhi
Property Type: Sale
Regular Price: ₹1,50,00,000
Bedrooms: 4
Bathrooms: 3
Image URL: https://example.com/villa1.jpg
Furnished: ✓
Parking: ✓
Special Offer: ✓
Discounted Price: ₹1,45,00,000
```

**Result**: Property created with ₹5,00,000 discount

## Troubleshooting

### "Property Owner not found"
- System will assign property to admin
- Property still created successfully
- Can edit later to change owner

### "Offer checkbox not visible"
- Check if Property Type is "Rent"
- Rent properties don't have offers
- Switch to "Sale" to see offer option

### "Cannot add discount price"
- Make sure Property Type is "Sale"
- Check "Special Offer" checkbox
- Discount price field will appear

## API Endpoints

### Create Listing:
```
POST /api/admin/listings
Authorization: Admin token required
Body: {
  name, description, address, type,
  regularPrice, discountPrice, bedrooms,
  bathrooms, furnished, parking, offer,
  imageUrls, ownerName
}
```

### Update Listing:
```
PUT /api/admin/listings/:id
Authorization: Admin token required
Body: Same as create
```

### Delete Listing:
```
DELETE /api/admin/listings/:id
Authorization: Admin token required
```

## Summary

✅ **Rent properties**: Simple price field, no offers
✅ **Sale properties**: Can have offers and discounts
✅ **Smart form**: Adapts based on property type
✅ **Owner lookup**: Finds users by name or email
✅ **Auto-cleanup**: Rent properties auto-cleaned of offers
✅ **Full CRUD**: Create, Read, Update, Delete properties

**Admin panel is now fully functional for property management!** 🎉
