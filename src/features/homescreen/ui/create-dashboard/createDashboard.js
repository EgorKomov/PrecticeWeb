import { useEffect } from 'react';
import styles from './style.module.scss';

export const CreateDashboard = () => {
  useEffect(() => {
    document.body.classList.add('board-page');
    
    return () => {
      document.body.classList.remove('board-page');
    };
  }, []);

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
            <a href="#" className={`${styles.modalBtn} ${styles.modalBtnCancel}`}>
              Отмена
            </a>
            <a href="/dashboard" className={`${styles.modalBtn} ${styles.modalBtnSave}`}>
              Создать
            </a>
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
            <a href="#" className={`${styles.modalBtn} ${styles.modalBtnCancel}`}>
              Отмена
            </a>
            <a href="/dashboard" className={`${styles.modalBtn} ${styles.modalBtnSave}`}>
              Добавить
            </a>
          </div>
        </div>
      </div>

      <div className={styles.boardContainer}>
        <div className={styles.boardHeader}>
          <a href="/dashboard" className={styles.backBtn}>← Назад</a>
          <h1 className={styles.boardTitle}>Моя доска</h1>
          <a href="/" className={styles.logoutBtn}>Выйти</a>
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
}