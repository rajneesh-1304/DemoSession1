'use client';
import LoginForm from '../../components/Login/LoginForm';
import './login.css';

const login = () => {
  return (
    <div className='login_container'>
      <div className='login_form'>
        <div>
          <LoginForm/>
        </div>
      
      </div>
    </div>
  )
}

export default login