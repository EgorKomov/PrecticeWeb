import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../../features/auth/slice/authSlice';
import { useForm } from '../../../../shared/hooks/useForm';
import { Button } from '../../../../shared/ui';
import { ENUM_LINK } from '../../../../app/routes/routesConfig';
import styles from './style.module.scss';
import { Link } from "react-router";

export const Auth = () => {
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ENUM_LINK.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!values.email || !values.password) {
      return;
    }

    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
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
              name="email"
              placeholder="Email" 
              value={values.email}
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

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </Button>
          
          <div className={styles.linkContainer}>
            <Link to={ENUM_LINK.REG} className={styles.link}>
              Нет аккаунта? Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};