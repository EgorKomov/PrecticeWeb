import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '../../../auth/slice/authSlice';
import { fetchBoards, addBoard, updateBoard, deleteBoard, reorderBoardsThunk } from '../../boards/boardsSlice';
import { ENUM_LINK } from '../../../../app/routes/routesConfig';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { Button } from '../../../../shared/ui';


export const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { boards } = useSelector((state) => state.boards);
  
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoard, setEditingBoard] = useState(null);
  const [currentBoard, setCurrentBoard] = useState(null);

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

  function dragStartHandler(e, board) {
    setCurrentBoard(board);
  }

  function dragEndHandler(e) {
    e.target.style.opacity = '1';
  }

  function dragOverHandler(e) {
    e.preventDefault();
    e.target.style.opacity = '0.7';
  }

  async function dropHandler(e, targetBoard) {
    e.preventDefault();
    
    if (!currentBoard || currentBoard.id === targetBoard.id) return;
    
    await dispatch(reorderBoardsThunk({ 
      boardId: currentBoard.id,
      targetOrder: targetBoard.order,
      sourceOrder: currentBoard.order,
      allBoards: boards
    }));
    
    e.target.style.opacity = '1';
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate(ENUM_LINK.MAIN, { replace: true });
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      dispatch(addBoard({ 
        name: newBoardName.trim(),
        order: boards.length + 1 
      }));
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
    navigate(`${ENUM_LINK.DASHBOARD}/${boardId}`);
  };

  const sortBoards = (a, b) => {
    return a.order - b.order;
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
          <Button variant="danger" onClick={handleLogout}>Выйти</Button>
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
        <Button variant="primary" onClick={handleCreateBoard} disabled={!newBoardName.trim()}>+ Создать доску</Button>
      </div>

      <div className={styles.boardsGrid}>
        {boards && boards.length > 0 ? (
          [...boards].sort(sortBoards).map((board) => (
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
                  <Button variant="icon" onClick={handleUpdateBoard}>✓</Button>
                  <Button variant="icon" onClick={() => setEditingBoard(null)}>✗</Button>
                </div>
              ) : (
                <>
                  <div 
                    className={styles.boardCard}
                    onClick={() => handleBoardClick(board.id)}
                    draggable={true}
                    onDragStart={(e) => dragStartHandler(e, board)}
                    onDragLeave={(e) => dragEndHandler(e)}
                    onDragEnd={(e) => dragEndHandler(e)}
                    onDragOver={(e) => dragOverHandler(e)}
                    onDrop={(e) => dropHandler(e, board)}
                  >
                    <h3 className={styles.boardCardTitle}>{board.name}</h3>
                  </div>
                  <div className={styles.boardActions}>
                    <Button 
                      variant="icon" 
                      onClick={(e) => { e.stopPropagation(); handleEditBoard(board); }}
                      className={classNames(styles.actionBtn, styles.editBtn)}>✏️</Button>
                    <Button 
                      variant="icon" 
                      onClick={(e) => { e.stopPropagation(); handleDeleteBoard(board.id); }}
                      className={classNames(styles.actionBtn, styles.deleteBtn)}>✕</Button>
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