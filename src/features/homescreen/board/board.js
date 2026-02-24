import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { 
  fetchBoardData, 
  addList, 
  updateList,
  deleteList, 
  addTask,
  updateTask,
  deleteTask,
  toggleTaskComplete
} from '../lists/listsSlice';
import { ENUM_LINK } from '../../../shared/constants/link';
import { Button } from '../../../shared/ui/Button';
import styles from './style.module.scss';

export const Board = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { lists, tasks } = useSelector((state) => state.lists || { lists: [], tasks: {} });
  const { boards } = useSelector((state) => state.boards);
  
  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState(null);
  
  const [newTaskContent, setNewTaskContent] = useState('');
  const [activeListId, setActiveListId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const currentBoard = boards?.find(b => b.id === Number(id) || b.id === id);

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

  const handleCreateList = () => {
    if (newListName.trim() && id) {
      dispatch(addList({ boardId: id, name: newListName.trim() }));
      setNewListName('');
    }
  };

  const handleEditList = (list) => {
    setEditingList(list);
  };

  const handleUpdateList = () => {
    if (editingList && editingList.name.trim()) {
      dispatch(updateList({
        id: editingList.id,
        name: editingList.name.trim(),
        boardId: id
      }));
      setEditingList(null);
    }
  };

  const handleDeleteList = (listId) => {
    if (window.confirm('Удалить список?')) {
      dispatch(deleteList({ id: listId, boardId: id }));
    }
  };

  const handleCreateTask = (listId) => {
    if (newTaskContent.trim()) {
      dispatch(addTask({ 
        listId: listId, 
        content: newTaskContent.trim(),
        boardId: id 
      }));
      setNewTaskContent('');
      setActiveListId(null);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = () => {
    if (editingTask && editingTask.content?.trim()) {
      dispatch(updateTask({
        id: editingTask.id,
        content: editingTask.content.trim(),
        listId: editingTask.listId,
        boardId: id,
        completed: editingTask.completed
      }));
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (taskId, listId) => {
    if (window.confirm('Удалить задачу?')) {
      dispatch(deleteTask({ id: taskId, listId, boardId: id }));
    }
  };

  const getTaskName = (task) => {
    return task.content || task.name || 'Без названия';
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.boardHeader}>
        <button onClick={() => navigate('/dashboard')} className={styles.backBtn}>
          ← Назад
        </button>
        <h1 className={styles.boardTitle}>{currentBoard?.name || 'Моя доска'}</h1>
      </div>

      <div className={styles.createListSection}>
        <input
          type="text"
          placeholder="Название нового списка"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className={styles.createListInput}
        />
        <button onClick={handleCreateList} className={styles.createListBtn}>
          + Добавить список
        </button>
      </div>

      <div className={styles.listsContainer}>
        {lists && lists.length > 0 ? (
          lists.map(list => (
            <div key={list.id} className={styles.list}>
              <div className={styles.listHeader}>
                {editingList && editingList.id === list.id ? (
                  <div className={styles.editListForm}>
                    <input
                      type="text"
                      value={editingList.name}
                      onChange={(e) => setEditingList({ ...editingList, name: e.target.value })}
                      className={styles.listEditInput}
                      autoFocus
                    />
                    <button onClick={handleUpdateList} className={styles.saveEditBtn}>✓</button>
                    <button onClick={() => setEditingList(null)} className={styles.cancelEditBtn}>✗</button>
                  </div>
                ) : (
                  <>
                    <h3 className={styles.listTitle}>{list.name}</h3>
                    <div className={styles.listActions}>
                      <button 
                        className={styles.editListBtn}
                        onClick={() => handleEditList(list)}
                      >
                        ✏️
                      </button>
                      <button 
                        className={styles.deleteListBtn}
                        onClick={() => handleDeleteList(list.id)}
                      >
                        ×
                      </button>
                    </div>
                  </>
                )}
              </div>
              
              <div className={styles.cardsContainer}>
                {activeListId === list.id ? (
                  <div className={styles.createTaskSection}>
                    <input
                      type="text"
                      placeholder="Содержание задачи"
                      value={newTaskContent}
                      onChange={(e) => setNewTaskContent(e.target.value)}
                      className={styles.createTaskInput}
                      autoFocus
                    />
                    <div className={styles.taskFormButtons}>
                      <button onClick={() => handleCreateTask(list.id)} className={styles.createTaskBtn}>
                        Добавить
                      </button>
                      <button onClick={() => setActiveListId(null)} className={styles.cancelTaskBtn}>
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {tasks && tasks[list.id] && tasks[list.id].length > 0 ? (
                      tasks[list.id].map(task => (
                        <div key={task.id} className={styles.card}>
                          <input 
                            type="checkbox" 
                            className={styles.cardCheckbox}
                            checked={task.completed || false}
                            onChange={() => dispatch(toggleTaskComplete({ 
                              id: task.id, 
                              listId: list.id, 
                              boardId: id,
                              completed: task.completed 
                            }))}
                          />
                          
                          {editingTask && editingTask.id === task.id ? (
                            <div className={styles.editTaskForm}>
                              <input
                                type="text"
                                value={editingTask.content || editingTask.name || ''}
                                onChange={(e) => setEditingTask({ ...editingTask, content: e.target.value })}
                                className={styles.taskEditInput}
                                autoFocus
                              />
                              <button onClick={handleUpdateTask} className={styles.saveEditBtn}>✓</button>
                              <button onClick={() => setEditingTask(null)} className={styles.cancelEditBtn}>✗</button>
                            </div>
                          ) : (
                            <>
                              <span 
                                className={`${styles.cardContent} ${task.completed ? styles.completed : ''}`}
                              >
                                {getTaskName(task)}
                              </span>
                              <div className={styles.taskActions}>
                                <button 
                                  className={styles.editTaskBtn}
                                  onClick={() => handleEditTask(task)}
                                >
                                  ✏️
                                </button>
                                <button 
                                  className={styles.deleteCardBtn}
                                  onClick={() => handleDeleteTask(task.id, list.id)}
                                >
                                  ✕
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className={styles.noTasks}>Нет задач</div>
                    )}
                    
                    <button 
                      className={styles.addCardBtn}
                      onClick={() => setActiveListId(list.id)}
                    >
                      + Добавить задачу
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noLists}>В этой доске пока нет списков</div>
        )}
        
        <div className={styles.addListPlaceholder}></div>
      </div>
    </div>
  );
};