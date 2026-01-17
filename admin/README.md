# Admin Components

This folder serves as documentation and reference for admin-related functionality.

**IMPORTANT: The actual admin components are in the client/src folder for proper import resolution.**

## Admin Components Location

- **AdminPanel**: `client/src/pages/AdminPanel.jsx`
- **AdminLayout**: `client/src/components/AdminLayout.jsx`
- **AdminRoute**: `client/src/components/AdminRoute.jsx`

## Usage

To access the admin panel:

1. Run `npm run dev:all` from root directory
2. Login as admin user
3. Access `http://localhost:5173/admin`

## Admin Features

- Dashboard with user and listing statistics
- User management (view, delete users)
- Listing management (view, delete listings)
- Separate admin layout without main site header/footer
- Role-based access control