import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { logout } from '../../../auth/slice/authSlice';
import { 
  fetchBoardData, 
  addList, 
  addTask,
  updateTask,
  deleteList, 
  deleteTask,
  toggleTaskComplete
} from '../../lists/listsSlice';
import { ENUM_LINK } from '../../../../shared/constants/link';
import { Button } from '../../../../shared/ui/Button';
import styles from './style.module.scss';

export const CreateDashboard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { lists, tasks, loading } = useSelector((state) => state.lists || { lists: [], tasks: {} });
  const { boards } = useSelector((state) => state.boards);
  
  const [newListName, setNewListName] = useState('');
  const [newTaskContent, setNewTaskContent] = useState('');
  const [activeListId, setActiveListId] = useState(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskContent, setEditTaskContent] = useState('');

  const currentBoard = boards.find(b => b.id === Number(id) || b.id === id);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!isAuthenticated || !token) {
      navigate(ENUM_LINK.MAIN, { replace: true });
      return;
    }
    
    document.body.classList.add('board-page');
    if (id) {
      dispatch(fetchBoardData(id));
    }
    
    return () => {
      document.body.classList.remove('board-page');
    };
  }, [isAuthenticated, id, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ENUM_LINK.MAIN, { replace: true });
  };

  const handleAddList = (e) => {
    e.preventDefault();
    if (newListName.trim() && id) {
      dispatch(addList({ boardId: id, name: newListName.trim() }));
      setNewListName('');
      setIsListModalOpen(false);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskContent.trim() && activeListId) {
      dispatch(addTask({ 
        listId: activeListId, 
        content: newTaskContent.trim(),
        boardId: id 
      }));
      setNewTaskContent('');
      setIsTaskModalOpen(false);
      setActiveListId(null);
    }
  };

  const openTaskModal = (listId) => {
    setActiveListId(listId);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setEditTaskContent(task.content);
  };

  const handleUpdateTask = async (task) => {
    if (!editTaskContent.trim()) {
      setEditingTask(null);
      return;
    }
    
    await dispatch(updateTask({
      id: task.id,
      content: editTaskContent,
      listId: task.listId,
      boardId: id,
      completed: task.completed
    }));
    
    setEditingTask(null);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!currentBoard) {
    return <div className={styles.error}>Доска не найдена</div>;
  }

  return (
    <>
      <div 
        className={`${styles.modal} ${isListModalOpen ? styles.modalActive : ''}`}
        onClick={() => setIsListModalOpen(false)}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <span className={styles.closeModal} onClick={() => setIsListModalOpen(false)}>&times;</span>
          <h2 className={styles.modalTitle}>Новый список</h2>
          <form onSubmit={handleAddList}>
            <div className={styles.inputBox}>
              <input 
                type="text" 
                placeholder="Название списка" 
                required 
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                autoFocus
              />
            </div>
            <div className={styles.modalButtons}>
              <Button type="button" variant="secondary" onClick={() => setIsListModalOpen(false)}>Отмена</Button>
              <Button type="submit" variant="success">Создать</Button>
            </div>
          </form>
        </div>
      </div>

      <div 
        className={`${styles.modal} ${isTaskModalOpen ? styles.modalActive : ''}`}
        onClick={() => setIsTaskModalOpen(false)}
      >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <span className={styles.closeModal} onClick={() => setIsTaskModalOpen(false)}>&times;</span>
          <h2 className={styles.modalTitle}>Новая задача</h2>
          <form onSubmit={handleAddTask}>
            <div className={styles.inputBox}>
              <input 
                type="text" 
                placeholder="Содержание задачи" 
                required 
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                autoFocus
              />
            </div>
            <div className={styles.modalButtons}>
              <Button type="button" variant="secondary" onClick={() => setIsTaskModalOpen(false)}>Отмена</Button>
              <Button type="submit" variant="success">Добавить</Button>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.boardContainer}>
        <div className={styles.boardHeader}>
          <a href="/dashboard" className={styles.backBtn} onClick={(e) => { e.preventDefault(); navigate(ENUM_LINK.DASHBOARD); }}>← Назад</a>
          <h1 className={styles.boardTitle}>{currentBoard.name}</h1>
          <Button onClick={handleLogout} variant="danger" className={styles.boardLogoutBtn}>
            Выйти
          </Button>
        </div>

        <div className={styles.listsContainer}>
          {lists.map(list => (
            <div key={list.id} className={styles.list}>
              <div className={styles.listHeader}>
                <h3 className={styles.listTitle}>{list.name}</h3>
                <button 
                  className={styles.deleteListBtn}
                  onClick={() => dispatch(deleteList({ id: list.id, boardId: id }))}
                >
                  ×
                </button>
              </div>
              
              {(tasks[list.id] || []).map(task => (
                <div key={task.id} className={styles.card}>
                  <input 
                    type="checkbox" 
                    className={styles.cardCheckbox} 
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onChange={() => dispatch(toggleTaskComplete({ 
                      id: task.id, 
                      listId: list.id, 
                      boardId: id,
                      completed: task.completed 
                    }))}
                  />
                  
                  {editingTask === task.id ? (
                    <input
                      type="text"
                      value={editTaskContent}
                      onChange={(e) => setEditTaskContent(e.target.value)}
                      onBlur={() => handleUpdateTask(task)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateTask(task)}
                      className={styles.taskEditInput}
                      autoFocus
                    />
                  ) : (
                    <label 
                      htmlFor={`task-${task.id}`} 
                      className={`${styles.cardContent} ${task.completed ? styles.completed : ''}`}
                      onClick={() => handleEditTask(task)}
                    >
                      {task.content}
                    </label>
                  )}
                  
                  <button 
                    className={styles.deleteCardBtn}
                    onClick={() => dispatch(deleteTask({ 
                      id: task.id, 
                      listId: list.id, 
                      boardId: id 
                    }))}
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <a href="#newTaskModal" className={styles.addCardBtn} onClick={(e) => { e.preventDefault(); openTaskModal(list.id); }}>
                + Добавить задачу
              </a>
            </div>
          ))}
          
          <div className={styles.addListContainer}>
            <a href="#newListModal" className={styles.addListBtn} onClick={(e) => { e.preventDefault(); setIsListModalOpen(true); }}>
              + Добавить список
            </a>
          </div>
        </div>
      </div>
    </>
  );
};