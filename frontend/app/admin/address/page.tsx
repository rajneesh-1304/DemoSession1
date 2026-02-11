'use client'
import Address from '@/components/Admin/Address'
import React, { useEffect, useState } from 'react'
import './address.css'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { getAddressThunk } from '@/app/redux/features/address/addressSlice'

const page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const address = useAppSelector((state: any) => state.address.currentAddress);
  const user=useAppSelector((state: any) => state.users.currentUser);
  useEffect(()=>{
    dispatch(getAddressThunk(user.id));
  },[])
  console.log(address)
  return (
    <div className='main-form'>

      <div className='address'>
        <p className='address-name'><b>Restaurant Name:</b> {address?.name}</p>
        <p className='add-desc'><b>Restaurant Description:</b> {address?.description}</p>
        <img className="add-image" src={address?.images}/> 
      </div>

      {!address &&
        <button className="cart_button" onClick={() => setIsModalOpen(true)}>
          Add Address
        </button>
      }

      {isModalOpen && <Address onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}

export default page
