import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../auth/slice/authSlice';
import styles from './style.module.scss';
import { Button } from '../../../../shared/ui/Button';

export const CreateDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.classList.add('board-page');
    
    return () => {
      document.body.classList.remove('board-page');
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  return (
    <>
      <div id="newListModal" className={`${styles.modal} ${styles.listModal}`}>
        <div className={styles.modalContent}>
          <a href="#" className={styles.closeModal}>&times;</a>
          <h2 className={styles.modalTitle}>Новый список</h2>
          <div className={styles.inputBox}>
            <input type="text" placeholder="Название списка" required />
          </div>
          <div className={styles.modalButtons}>
            <Button variant="secondary">Отмена</Button>
            <Button variant="success">Создать</Button>
          </div>
        </div>
      </div>

      <div id="newCardModal" className={`${styles.modal} ${styles.cardModal}`}>
        <div className={styles.modalContent}>
          <a href="#" className={styles.closeModal}>&times;</a>
          <h2 className={styles.modalTitle}>Новая карточка</h2>
          <div className={styles.inputBox}>
            <input type="text" placeholder="Содержание карточки" required />
          </div>
          <div className={styles.modalButtons}>
            <Button variant="secondary">Отмена</Button>
            <Button variant="success">Добавить</Button>
          </div>
        </div>
      </div>

      <div className={styles.boardContainer}>
        <div className={styles.boardHeader}>
          <a href="/dashboard" className={styles.backBtn}>← Назад</a>
          <h1 className={styles.boardTitle}>Моя доска</h1>
          <Button onClick={handleLogout} variant="danger" className={styles.boardLogoutBtn}>
            Выйти
          </Button>
        </div>

        <div className={styles.listsContainer}>
          <div className={styles.list}>
            <div className={styles.listHeader}>
              <h3 className={styles.listTitle}>Список 1</h3>
            </div>
            
            <div className={styles.card}>
              <input type="checkbox" className={styles.cardCheckbox} id="card1-1" />
              <label htmlFor="card1-1" className={styles.cardContent}>
                Элемент списка 1
              </label>
            </div>
            
            <div className={styles.card}>
              <input type="checkbox" className={styles.cardCheckbox} id="card1-2" />
              <label htmlFor="card1-2" className={styles.cardContent}>
                Элемент списка 2
              </label>
            </div>
            
            <div className={styles.card}>
              <input type="checkbox" className={styles.cardCheckbox} id="card1-3" />
              <label htmlFor="card1-3" className={styles.cardContent}>
                Элемент списка 3
              </label>
            </div>
            
            <a href="#newCardModal" className={styles.addCardBtn}>
              + Добавить карточку
            </a>
          </div>
          
          <div className={styles.list}>
            <div className={styles.listHeader}>
              <h3 className={styles.listTitle}>Список 2</h3>
            </div>
            
            <div className={styles.card}>
              <input type="checkbox" className={styles.cardCheckbox} id="card2-1" />
              <label htmlFor="card2-1" className={styles.cardContent}>
                Элемент списка 4
              </label>
            </div>
            
            <div className={styles.card}>
              <input type="checkbox" className={styles.cardCheckbox} id="card2-2" />
              <label htmlFor="card2-2" className={styles.cardContent}>
                Элемент списка 5
              </label>
            </div>
            
            <a href="#newCardModal" className={styles.addCardBtn}>
              + Добавить карточку
            </a>
          </div>
          
          <div className={styles.addListContainer}>
            <a href="#newListModal" className={styles.addListBtn}>
              + Добавить список
            </a>
          </div>
        </div>
      </div>
    </>
  );
};