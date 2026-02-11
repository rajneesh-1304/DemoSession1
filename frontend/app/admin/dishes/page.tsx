'use client'
import React, { useState } from 'react'
import './dishes.css'
import { useAppSelector } from '@/app/redux/hooks'
import Dish from '@/components/Dishes/Dish'
import AllDish from '@/components/Admin/AllDish'

const page = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const address = useAppSelector((state: any)=> state.address.currentAddress);
   console.log(address)
  return (
    <div className='main-form'>
        <button className="cart_button" onClick={() => setIsModalOpen(true)}>
          Add Dishes
        </button>

        <AllDish/>
      {isModalOpen && <Dish onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default page
