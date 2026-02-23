import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../../../auth/slice/authSlice';
import { addBoard, updateBoard, deleteBoard } from '../../../homeScreen/boards/boardsSlice';
import { ENUM_LINK } from '../../../../shared/constants/link';
import styles from './styles.module.scss';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { boards } = useSelector((state) => state.boards);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoard, setEditingBoard] = useState(null);
  const [deletingBoard, setDeletingBoard] = useState(null);

  useEffect(() => {
    document.body.classList.add('dashboard-page');
    if (!isAuthenticated) {
      navigate(ENUM_LINK.MAIN, { replace: true });
    }
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ENUM_LINK.MAIN, { replace: true });
  };

  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (newBoardName.trim()) {
      dispatch(addBoard({ 
        name: newBoardName.trim(),
      }));
      setNewBoardName('');
      setIsCreateModalOpen(false);
    }
  };

  const handleUpdateBoard = (e) => {
    e.preventDefault();
    if (editingBoard && editingBoard.name.trim()) {
      dispatch(updateBoard({
        id: editingBoard.id,
        name: editingBoard.name.trim()
      }));
      setEditingBoard(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteBoard = () => {
    if (deletingBoard) {
      dispatch(deleteBoard(deletingBoard.id));
      setDeletingBoard(null);
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = (board, e) => {
    e.stopPropagation();
    setEditingBoard({ ...board });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (board, e) => {
    e.stopPropagation();
    setDeletingBoard(board);
    setIsDeleteModalOpen(true);
  };

  const handleBoardClick = (boardId) => {
    navigate(`/dashboard/${boardId}`);
  };

  if (!isAuthenticated) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <>
      <div 
        className={`${styles.modal} ${isCreateModalOpen ? styles.modalActive : ''}`} 
        onClick={() => setIsCreateModalOpen(false)}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <span className={styles.closeModal} onClick={() => setIsCreateModalOpen(false)}>&times;</span>
          <h2 className={styles.modalTitle}>Новая доска</h2>
          <form onSubmit={handleCreateBoard}>
            <div className={styles.inputBox}>
              <input 
                type="text" 
                placeholder="Название доски" 
                required 
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                autoFocus
              />
            </div>
            <div className={styles.modalButtons}>
              <button 
                type="button" 
                className={`${styles.modalBtn} ${styles.modalBtnCancel}`}
                onClick={() => setIsCreateModalOpen(false)}
              >
                Отмена
              </button>
              <button type="submit" className={`${styles.modalBtn} ${styles.modalBtnSave}`}>
                Создать
              </button>
            </div>
          </form>
        </div>
      </div>

      <div 
        className={`${styles.modal} ${isEditModalOpen ? styles.modalActive : ''}`} 
        onClick={() => setIsEditModalOpen(false)}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <span className={styles.closeModal} onClick={() => setIsEditModalOpen(false)}>&times;</span>
          <h2 className={styles.modalTitle}>Редактировать доску</h2>
          <form onSubmit={handleUpdateBoard}>
            <div className={styles.inputBox}>
              <input 
                type="text" 
                placeholder="Название доски" 
                required 
                value={editingBoard?.name || ''}
                onChange={(e) => setEditingBoard({ ...editingBoard, name: e.target.value })}
                autoFocus
              />
            </div>
            <div className={styles.modalButtons}>
              <button 
                type="button" 
                className={`${styles.modalBtn} ${styles.modalBtnCancel}`}
                onClick={() => setIsEditModalOpen(false)}
              >
                Отмена
              </button>
              <button type="submit" className={`${styles.modalBtn} ${styles.modalBtnSave}`}>
                Сохранить
              </button>
            </div>
          </form>
        </div>
      </div>

      <div 
        className={`${styles.modal} ${isDeleteModalOpen ? styles.modalActive : ''}`} 
        onClick={() => setIsDeleteModalOpen(false)}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <span className={styles.closeModal} onClick={() => setIsDeleteModalOpen(false)}>&times;</span>
          <h2 className={styles.modalTitle}>Удалить доску</h2>
          <p className={styles.deleteConfirmText}>
            Вы уверены, что хотите удалить доску "{deletingBoard?.name}"?
          </p>
          <div className={styles.modalButtons}>
            <button 
              type="button" 
              className={`${styles.modalBtn} ${styles.modalBtnCancel}`}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Отмена
            </button>
            <button 
              type="button" 
              className={`${styles.modalBtn} ${styles.modalBtnDelete}`}
              onClick={handleDeleteBoard}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Мои доски</h1>
          <div className={styles.userInfo}>
            {user && <span className={styles.userName}>{user.name || user.email}</span>}
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Выйти
            </button>
          </div>
        </div>

        <div className={styles.newBoardSection}>
          <button onClick={() => setIsCreateModalOpen(true)} className={styles.newBoardBtn}>
            + Новая доска
          </button>
        </div>

        <div className={styles.boardsGrid}>
          {boards.length === 0 ? (
            <div className={styles.emptyMessage}>
              <p>У вас пока нет досок. Создайте первую!</p>
            </div>
          ) : (
            boards.map((board) => (
              <div 
                key={board.id} 
                className={styles.boardCardWrapper}
              >
                <div 
                  className={styles.boardCard}
                  onClick={() => handleBoardClick(board.id)}
                >
                  <h3 className={styles.boardCardTitle}>{board.name}</h3>
                  <small className={styles.boardDate}>
                    {new Date(board.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <div className={styles.boardActions}>
                  <button 
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                    onClick={(e) => openEditModal(board, e)}
                  >
                    ✏️
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={(e) => openDeleteModal(board, e)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};