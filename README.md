# Real Estate MERN Application

## Project Structure

- `client/` - Main React frontend application
- `admin/` - Admin components (imported by client, no separate installation needed)
- `api/` - Express.js backend server

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client && npm install && cd ..
```

3. Create `.env` file in root directory with:
```
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Run the application:

### Development Mode (Both server and client):
```bash
npm run dev:all
```

### Server Only:
```bash
npm run dev
```

### Client Only:
```bash
npm run client
```

## Access Points

- **Main Application**: http://localhost:5173 (Vite dev server)
- **API Server**: http://localhost:3000
- **Admin Panel**: http://localhost:5173/admin (after logging in as admin)

## Admin Access

1. Create an admin user using the setupAdmin.js script or through the database
2. Login with admin credentials
3. You'll be automatically redirected to the admin panel
4. Admin panel has a separate layout without the main site header/footer

## Features

- User authentication and authorization
- Property listings management
- Admin panel for managing users and listings
- Separate admin interface with dedicated layout
- Role-based access control