import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { login } from '../../authSlice';
import styles from './style.module.scss';
import { Link } from "react-router";

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    document.body.classList.add('auth-page');
    
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const result = await dispatch(login({ email, password }));
      
      if (login.fulfilled.match(result)) {
        console.log('Вход успешен');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className={styles.Login}>
        <form onSubmit={handleSubmit}>
          <h1>Вход</h1>
          
          {error && (
            <div className={styles.errorMessage}>
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
              type="password" 
              placeholder="Пароль" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
          
          <div className={styles.linkContainer}>
            <Link to="/register" className={styles.link}>
              Нет аккаунта? Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};