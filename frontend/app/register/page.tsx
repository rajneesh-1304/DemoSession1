'use client'
import RegisterForm from '@/components/register/RegisterForm'
import './registerpage.css'

const register =() => {
  return (
    <div className='register_container'>
      <div className='register_form'>
        <img
          src="https://cdn-icons-png.flaticon.com/512/7541/7541900.png"
          alt="Logo" className='logo'
        />
        <div>
          <RegisterForm/>
        </div>
      </div>
    </div>
  )
}

export default register

