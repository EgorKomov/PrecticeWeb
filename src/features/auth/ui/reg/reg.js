import { useState, useEffect } from 'react';
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

  useEffect(() => {
    document.body.classList.add('auth-page');
    
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

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
    <div className="auth-container">
      <div className={styles.Register}>
        <form onSubmit={handleSubmit}>
          <h1>Регистрация</h1>
          
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
              type="text" 
              placeholder="Имя" 
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
              placeholder="Повторите пароль" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          
          <div className={styles.linkContainer}>
            <Link to="/" className={styles.link}>
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};