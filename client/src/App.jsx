import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Listing from "./pages/Listing";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Search from "./pages/Search";
import About from "./pages/About";
import AdminPanel from "./pages/AdminPanel";
import Payment from "./pages/Payment";
import Header from "./components/Header";
import Footers from "./components/Footers";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import FloatingActionButton from "./components/FloatingActionButton";
import ScrollToTop from "./components/ScrollToTop";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Header />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
          <Route path="/payment/:listingId" element={<Payment />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footers />}
      {!isAdminRoute && <FloatingActionButton />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AppContent />
    </BrowserRouter>
  );
}
