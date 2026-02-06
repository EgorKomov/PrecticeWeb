import { useState } from 'react';
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
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    console.log('🎯 Отправка формы входа...');
    
    try {
      const result = await dispatch(login({ email, password }));
      console.log('🎯 Результат dispatch:', result);
      
      // Проверяем тип результата
      if (login.fulfilled.match(result)) {
        console.log('✅ Вход успешен, перенаправление...');
        navigate('/dashboard');
      } else if (login.rejected.match(result)) {
        console.log('❌ Ошибка входа (из match):', result.error);
        // Ошибка уже в состоянии Redux, не нужно показывать alert
      }
    } catch (error) {
      console.error('🎯 Ошибка в catch:', error);
      alert('Ошибка: ' + error.message);
    }
  };

  return (
    <div className={styles.Login}>
      <form onSubmit={handleSubmit}>
        <h1>Вход</h1>
        
        {/* Отображаем ошибку из Redux состояния */}
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
            placeholder="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputBox}>
          <input 
            type="password" 
            placeholder="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
        
        {/* Исправляем ссылку на регистрацию */}
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button type="button" className={styles.btn}>
              Регистрация
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};