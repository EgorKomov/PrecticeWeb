import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../slice/authSlice';
import { useForm } from '../../../../shared/hooks/useForm';
import { Button } from '../../../../shared/ui';
import { ENUM_LINK } from '../../../../shared/constants/link';
import styles from './styles.module.scss';
import { Link } from "react-router";

export const Reg = () => {
  const { values, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    document.body.classList.add('auth-page');
    
    if (isAuthenticated) {
      navigate(ENUM_LINK.DASHBOARD, { replace: true });
    }
    
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!values.name || !values.email || !values.password || !values.confirmPassword) {
      return;
    }

    if (values.password !== values.confirmPassword) {
      return;
    }

    const userData = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    await dispatch(register(userData));
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
              name="email"
              placeholder="Email" 
              value={values.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className={styles.inputBox}>
            <input 
              type="text" 
              name="name"
              placeholder="Имя" 
              value={values.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className={styles.inputBox}>
            <input 
              type="password" 
              name="password"
              placeholder="Пароль" 
              value={values.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className={styles.inputBox}>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="Повторите пароль" 
              value={values.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className={styles.passwordHint}>
            Пароль должен содержать минимум 6 символов
          </div>

          <Button type="submit" variant="success" fullWidth disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
          
          <div className={styles.linkContainer}>
            <Link to={ENUM_LINK.MAIN} className={styles.link}>
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};