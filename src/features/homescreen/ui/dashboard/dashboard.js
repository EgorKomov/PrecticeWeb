import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../../../auth/slice/authSlice';
import { fetchBoards, addBoard, updateBoard, deleteBoard } from '../../boards/boardsSlice';
import { ENUM_LINK } from '../../../../shared/constants/link';
import { Button } from '../../../../shared/ui/Button';
import styles from './styles.module.scss';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { boards } = useSelector((state) => state.boards);
  
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoard, setEditingBoard] = useState(null);

  useEffect(() => {
    document.body.classList.add('dashboard-page');
    
    const token = localStorage.getItem('token');
    
    if (!isAuthenticated || !token) {
      navigate(ENUM_LINK.MAIN, { replace: true });
      return;
    }
    
    dispatch(fetchBoards());
    
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ENUM_LINK.MAIN, { replace: true });
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      dispatch(addBoard({ name: newBoardName.trim() }));
      setNewBoardName('');
    }
  };

  const handleEditBoard = (board) => {
    setEditingBoard(board);
  };

  const handleUpdateBoard = () => {
    if (editingBoard && editingBoard.name.trim()) {
      dispatch(updateBoard({
        id: editingBoard.id,
        name: editingBoard.name.trim()
      }));
      setEditingBoard(null);
    }
  };

  const handleDeleteBoard = (boardId) => {
    if (window.confirm('Удалить доску?')) {
      dispatch(deleteBoard(boardId));
    }
  };

  const handleBoardClick = (boardId) => {
    navigate(`/dashboard/${boardId}`);
  };

  const formatDate = (dateString) => {
    if (dateString) {
      try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        }
      } catch (error) {
      }
    }
    
    const today = new Date();
    return today.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
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

      <div className={styles.createBoardSection}>
        <input
          type="text"
          placeholder="Название новой доски"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          className={styles.createBoardInput}
        />
        <button onClick={handleCreateBoard} className={styles.createBoardBtn}>
          + Создать доску
        </button>
      </div>

      <div className={styles.boardsGrid}>
        {boards && boards.length > 0 ? (
          boards.map((board) => (
            <div key={board.id} className={styles.boardCardWrapper}>
              {editingBoard && editingBoard.id === board.id ? (
                <div className={styles.editBoardForm}>
                  <input
                    type="text"
                    value={editingBoard.name}
                    onChange={(e) => setEditingBoard({ ...editingBoard, name: e.target.value })}
                    className={styles.editBoardInput}
                    autoFocus
                  />
                  <button onClick={handleUpdateBoard} className={styles.saveEditBtn}>✓</button>
                  <button onClick={() => setEditingBoard(null)} className={styles.cancelEditBtn}>✗</button>
                </div>
              ) : (
                <>
                  <div 
                    className={styles.boardCard}
                    onClick={() => handleBoardClick(board.id)}
                  >
                    <h3 className={styles.boardCardTitle}>{board.name}</h3>
                    <small className={styles.boardDate}>
                      {formatDate(board.createdAt)}
                    </small>
                  </div>
                  <div className={styles.boardActions}>
                    <button 
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      onClick={(e) => { e.stopPropagation(); handleEditBoard(board); }}
                    >
                      ✏️
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={(e) => { e.stopPropagation(); handleDeleteBoard(board.id); }}
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className={styles.emptyMessage}>
            <p>У вас пока нет досок. Создайте первую!</p>
          </div>
        )}
      </div>
    </div>
  );
};