import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { register } from '../../authSlice';
import styles from './styles.module.scss';
import { Link } from "react-router";

export const Reg = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    try {
      const userData = {
        name: username,
        email,
        password,
      };
      
      const result = await dispatch(register(userData));
      
      if (register.fulfilled.match(result)) {
        alert('Регистрация успешна! Теперь войдите в систему.');
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className={styles.Register}>
      <form onSubmit={handleSubmit}>
        <h1>Регистрация</h1>
        
        {error && (
          <div style={{ 
            color: 'red', 
            textAlign: 'center', 
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: 'rgba(255,0,0,0.1)',
            borderRadius: '5px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <div className={styles.inputBox}>
          <input 
            type="email" 
            placeholder="Email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputBox}>
          <input 
            type="text" 
            placeholder="Name" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.inputBox}>
          <input 
            type="password" 
            placeholder="Пароль" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.inputBox}>
          <input 
            type="password" 
            placeholder="Повторить пароль" 
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button type="button" className={styles.btn}>
              Вернуться
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};