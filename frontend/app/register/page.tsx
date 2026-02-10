'use client'
import RegisterForm from '@/components/register/RegisterForm'
import './registerpage.css'

const register =() => {
  return (
    <div className='register_container'>
      <div className='register_form'>
        <div>
          <RegisterForm/>
        </div>
      </div>
    </div>
  )
}

export default register

