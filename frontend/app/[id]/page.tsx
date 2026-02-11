'use client'
import { useParams } from 'next/navigation'
import Dishes from "@/components/Customer/Dishes";
import React from 'react'

const page = () => {
    const id =useParams();
  return (
    <div>
      <Dishes id={id.id}/> 
    </div>
  )
}

export default page
