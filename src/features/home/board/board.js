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
  toggleTaskComplete,
  reorderListsThunk,
  reorderTasksThunk
} from '../lists/listsSlice';
import { ENUM_LINK } from '../../../app/routes/routesConfig';
import styles from './style.module.scss';
import { Button } from '../../../shared/ui';
import { Input } from '../../../shared/ui';

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

  const [currentList, setCurrentList] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

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

  const sortLists = (a, b) => {
    return (a.order - b.order);
  };

  const sortTasks = (tasksArray) => {
    if (!tasksArray) return [];
    return [...tasksArray].sort((a, b) => (a.order - b.order));
  };

  const resetAllOpacity = () => {
    document.querySelectorAll(`.${styles.list}, .${styles.card}`).forEach(el => {
      el.style.opacity = '1';
    });
  };

  function dragStartListHandler(e, list) {
    if (draggedTaskId) return;
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'list', list }));
    setCurrentList(list);
  }

  function dragStartTaskHandler(e, task, listId) {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ 
      type: 'task', 
      taskId: task.id,
      sourceListId: listId
    }));
    setDraggedTaskId(task.id);
    setCurrentTask(task);
  }

  function dragEndHandler(e) {
    e.target.style.opacity = '1';
    resetAllOpacity();
    setDraggedTaskId(null);
    setCurrentTask(null);
    setCurrentList(null);
  }

  function dragOverHandler(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const target = e.target.closest(`.${styles.list}, .${styles.card}`);
    if (target) {
      target.style.opacity = '0.7';
    }
  }

  function dragLeaveHandler(e) {
    const target = e.target.closest(`.${styles.list}, .${styles.card}`);
    if (target) {
      target.style.opacity = '1';
    }
  }

  async function dropListHandler(e, targetList) {
    e.preventDefault();
    e.stopPropagation();
    
    resetAllOpacity();
    
    const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    if (draggedData?.type === 'list' && currentList?.id !== targetList.id) {
      await dispatch(reorderListsThunk({ 
        boardId: id, 
        listId: currentList.id,
        order: targetList.order
      }));
    }
    
    e.target.style.opacity = '1';
  }

  async function dropTaskHandler(e, targetListId, targetTask) {
    e.preventDefault();
    e.stopPropagation();
    
    resetAllOpacity();
    
    const draggedData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    if (draggedData.type === 'task' && currentTask) {
      let targetOrder;
      if (targetTask) {
        targetOrder = targetTask.order;
      } else {
        targetOrder = tasks[targetListId]?.length || 0;
      }
      
      await dispatch(reorderTasksThunk({
        taskId: currentTask.id,
        boardId: id,
        order: targetOrder,
        newListId: targetListId
      }));
    }
    
    e.target.style.opacity = '1';
    setDraggedTaskId(null);
    setCurrentTask(null);
  }

  function dropOnListHandler(e, targetListId) {
    dropTaskHandler(e, targetListId, null);
  }

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
    setEditingTask({
      id: task.id,
      content: task.name,
      listId: task.listId,
      completed: task.completed
    });
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

  const handleToggleTaskComplete = (task, listId) => {
    dispatch(toggleTaskComplete({ 
      id: task.id, 
      listId: listId, 
      boardId: id,
      completed: task.completed
    }));
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.boardHeader}>
        <Button variant="back" onClick={() => navigate(ENUM_LINK.DASHBOARD)}>← Назад</Button>
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
          <Button variant="primary" onClick={handleCreateList} disabled={!newListName.trim()}>+ Добавить список</Button>
      </div>

      <div className={styles.listsContainer}>
        {lists?.length > 0 ? (
          [...lists].sort(sortLists).map(list => (
            <div 
              key={list.id} 
              className={`${styles.list} ${draggedTaskId ? styles.listDraggable : ''}`}
              draggable={!draggedTaskId}
              onDragStart={(e) => dragStartListHandler(e, list)}
              onDragLeave={dragLeaveHandler}
              onDragEnd={dragEndHandler}
              onDragOver={dragOverHandler}
              onDrop={(e) => dropListHandler(e, list)}
            >
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
                    <Button variant="icon" onClick={handleUpdateList}>✓</Button>
                    <Button variant="icon" onClick={() => setEditingList(null)}>✗</Button>
                  </div>
                ) : (
                  <>
                    <h3 className={styles.listTitle}>{list.name}</h3>
                    <div className={styles.listActions}>
                      <Button variant="icon" onClick={() => handleEditList(list)}>✏️</Button>
                      <Button variant="icon" onClick={() => handleDeleteList(list.id)}>×</Button>
                    </div>
                  </>
                )}
              </div>
              
              <div 
                className={styles.cardsContainer}
                onDragOver={dragOverHandler}
                onDragLeave={dragLeaveHandler}
                onDrop={(e) => dropOnListHandler(e, list.id)}
              >
                {activeListId === list.id ? (
                  <div className={styles.createTaskSection}>
                      <Input
                        value={newTaskContent}
                        onChange={setNewTaskContent}
                      />
                    <div className={styles.taskFormButtons}>
                      <Button variant="success" onClick={() => handleCreateTask(list.id)} disabled={!newTaskContent.trim()}>Добавить</Button>
                      <Button variant="secondary" onClick={() => setActiveListId(null)}>Отмена</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {tasks?.[list.id]?.length > 0 ? (
                      sortTasks(tasks[list.id]).map(task => (
                        <div 
                          key={task.id} 
                          className={`${styles.card} ${draggedTaskId === task.id ? styles.dragging : ''}`}
                          draggable={true}
                          onDragStart={(e) => dragStartTaskHandler(e, task, list.id)}
                          onDragLeave={dragLeaveHandler}
                          onDragEnd={dragEndHandler}
                          onDragOver={dragOverHandler}
                          onDrop={(e) => dropTaskHandler(e, list.id, task)}
                        >
                          <input 
                            type="checkbox" 
                            className={styles.cardCheckbox}
                            checked={task.completed || false}
                            onChange={() => handleToggleTaskComplete(task, list.id)}
                          /> 
                          {editingTask?.id === task.id ? (
                            <div className={styles.editTaskForm}>
                              <input
                                type="text"
                                value={editingTask?.content || ''}
                                onChange={(e) => setEditingTask({ ...editingTask, content: e.target.value })}
                                className={styles.taskEditInput}
                                autoFocus
                              />
                              <Button variant="icon" onClick={handleUpdateTask}>✓</Button>
                              <Button variant="icon" onClick={() => setEditingTask(null)}>✗</Button>
                            </div>
                          ) : (
                            <>
                              <span 
                                className={`${styles.cardContent} ${task.completed ? styles.completed : ''}`}
                              >
                                {task.name}
                              </span>
                              <div className={styles.taskActions}>
                                <Button variant="icon" onClick={() => handleEditTask(task)}>✏️</Button>
                                <Button variant="icon" onClick={() => handleDeleteTask(task.id, list.id)}>✕</Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className={styles.noTasks}>Нет задач</div>
                    )} 
                    <Button variant="secondary" onClick={() => setActiveListId(list.id)}>+ Добавить задачу</Button>
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