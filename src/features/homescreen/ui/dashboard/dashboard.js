import { useDispatch } from 'react-redux';
import { logout } from '../../../auth/authSlice';
import styles from './styles.module.scss';

export const Dashboard = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  const handleCreateBoard = (e) => {
    e.preventDefault();
    const boardName = document.querySelector('#boardName')?.value;
    if (boardName) {
      console.log('Создаем доску:', boardName);
      const modal = document.getElementById('newBoardModal');
      if (modal) modal.style.display = 'none';
    }
  };

  const openModal = () => {
    const modal = document.getElementById('newBoardModal');
    if (modal) modal.style.display = 'flex';
  };

  const closeModal = () => {
    const modal = document.getElementById('newBoardModal');
    if (modal) modal.style.display = 'none';
  };

  return (
    <>
      <div id="newBoardModal" className={styles.modal} onClick={closeModal}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <span className={styles.closeModal} onClick={closeModal}>&times;</span>
          <h2 className={styles.modalTitle}>Новая доска</h2>
          <form onSubmit={handleCreateBoard}>
            <div className={styles.inputBox}>
              <input 
                type="text" 
                id="boardName"
                placeholder="Название доски" 
                required 
              />
            </div>
            <div className={styles.modalButtons}>
              <button type="button" className={`${styles.modalBtn} ${styles.modalBtnCancel}`} onClick={closeModal}>
                Отмена
              </button>
              <button type="submit" className={`${styles.modalBtn} ${styles.modalBtnSave}`}>
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Мои доски</h1>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Выйти
          </button>
        </div>

        <div className={styles.newBoardSection}>
          <button onClick={openModal} className={styles.newBoardBtn}>
            + Новая доска
          </button>
        </div>

        <div className={styles.boardsGrid}>
          <a href="/create-dashboard" className={`${styles.boardCard} ${styles.boardCard1}`}>
            <h3 className={styles.boardCardTitle}>Моя доска</h3>
            <p className={styles.boardCardDescription}>3 списка</p>
          </a>
          
          <a href="/create-dashboard" className={`${styles.boardCard} ${styles.boardCard2}`}>
            <h3 className={styles.boardCardTitle}>Рабочие задачи</h3>
            <p className={styles.boardCardDescription}>5 списков</p>
          </a>
          
          <a href="/create-dashboard" className={`${styles.boardCard} ${styles.boardCard3}`}>
            <h3 className={styles.boardCardTitle}>Личные проекты</h3>
            <p className={styles.boardCardDescription}>2 списка</p>
          </a>
          
          <a href="/create-dashboard" className={`${styles.boardCard} ${styles.boardCard4}`}>
            <h3 className={styles.boardCardTitle}>Планы на год</h3>
            <p className={styles.boardCardDescription}>4 списка</p>
          </a>
          
          <a href="/create-dashboard" className={`${styles.boardCard} ${styles.boardCard1}`}>
            <h3 className={styles.boardCardTitle}>Идеи для проектов</h3>
            <p className={styles.boardCardDescription}>1 список</p>
          </a>
          
          <a href="/create-dashboard" className={`${styles.boardCard} ${styles.boardCard2}`}>
            <h3 className={styles.boardCardTitle}>Обучение</h3>
            <p className={styles.boardCardDescription}>3 списка</p>
          </a>
        </div>
      </div>
    </>
  );
};