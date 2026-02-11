'use client';
import LoginForm from '../../components/Login/LoginForm';
import './login.css';

const login = () => {
  return (
    <div className='login_container'>
      <div className='login_form'>
          <img
          src="https://cdn-icons-png.flaticon.com/512/7541/7541900.png"
          alt="Logo" className='logo'
        />
        <div>
          <LoginForm/>
        </div>
      
      </div>
    </div>
  )
}

export default login