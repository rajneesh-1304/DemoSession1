'use client'
import Link from 'next/link'
import React from 'react'
import './admin.css';

const Admin = () => {
  return (
    <div className="admin-containerr">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-grid">
        <Link href="/admin/address" className="admin-card users">
          <h2>👤 Address</h2>
          <p>View or add Address</p>
        </Link>

        <Link href="/admin/dishes" className="admin-card products">
          <h2>🍕 Dishes</h2>
          <p>Add or Update dishes</p>
        </Link>

        <Link href="/admin/orders" className="admin-card products">
          <h2>📦 Orders</h2>
          <p>Order List</p>
        </Link>
      </div>
    </div>
  )
}

export default Admin
