# Stripe Payment Integration Setup

## Step 1: Get Stripe API Keys

1. Go to https://dashboard.stripe.com/register
2. Create a free Stripe account
3. Go to Developers → API Keys
4. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

## Step 2: Add Keys to Environment Files

### Backend (.env in root):
```
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

### Frontend (client/.env):
```
VITE_STRIPE_PUBLIC_KEY=pk_test_your_actual_public_key_here
```

## Step 3: Test Card Numbers

Use these test cards in development:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)

## Step 4: Run the Application

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## Features Implemented:

✅ Stripe payment integration
✅ Token payment (10% of property price)
✅ Booking payment (20% of property price)
✅ Secure payment processing
✅ Payment history tracking
✅ Modern UI with gradient design
✅ Payment success confirmation

## How to Use:

1. Login to the application
2. Browse properties
3. Click "Book Now" on any property
4. Select payment type (Token 10% or Booking 20%)
5. Enter test card details
6. Complete payment
7. View payment history in profile