'use client';
import TodoModal from './modals/TodoModal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDebounce } from './hooks/hooks';
import TodoComponent from './components/TodoComponent';

interface Task {
  id: number;
  title: string;
  priority: number;
  is_done: boolean;
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [filterQuery, setFilterQuerry] = useState('all');
  const [toggleModal, setToggleModal] = useState(false);
  const debounceSearch = useDebounce(search);
  
  function fetchData() {
    axios
      .get(
        `http://127.0.0.1:8000/tasks/get_all/?sort=${sort}&search=${debounceSearch}&filter=${filterQuery}`,)
      .then((res) => {
        setTasks(res.data);
      });
  }

  function addTask(title: string, priority: number) {
    const data = { title: title, 
                is_done: false, 
                priority: priority };
    if (title === '') {
      return;
    }
    axios.post('http://127.0.0.1:8000/tasks/add/', data).then(() => {
      fetchData();
    });
  }
  
  function deleteTask(id: number) {
    axios.delete(`http://127.0.0.1:8000/tasks/${id}/delete/`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  }
  
  useEffect(
    () => {
      fetchData();
  }, 
  [sort, filterQuery, debounceSearch]
);

  return (
      <div className="h-screen flex flex-col items-center gap-8 pt-8 pb-32" style={{ backgroundColor: 'rgb(244, 241, 187)' }}>
        <div className="text-2xl">TODO List</div>
          <div className="flex gap-16">
            <div className="flex gap-2">
              <button
                onClick={() => setToggleModal(true)}
                className="text-xl shadow-md text-white hover:bg-blue-500 rounded-md px-3 py-1" style={{ backgroundColor: 'rgb(200, 217, 188)' }}>
                Create task
              </button>
              <TodoModal
                mode='create'
                isOpen={toggleModal}
                onClose={() => setToggleModal(false)}
                onSubmit={addTask}
              />
            </div>
            <input
              className="text-xl rounded-md shadow-md"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <label htmlFor="sort">Sort by priority:</label>
            <select onChange={(e) => setSort(e.target.value)} name="sort" id="sort">
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
            <label htmlFor="filter">Status:</label>
            <select onChange={(e) => setFilterQuerry(e.target.value)} name="filter" id="filter">
              <option value="all">All</option>
              <option value="done">Done</option>
              <option value="undone">Undone</option>
            </select>
          </div>
        <div className="w-3/6 flex flex-col gap-2">
        
      {tasks.length === 0 ? (
        <div className="text-2xl ta-c" style={{ color: 'rgb(237, 106, 90)' }}>There are no created tasks</div>
      ) : (
        tasks.map((task) => {
          return (
            <TodoComponent
              key={task.id}
              id={task.id}
              title={task.title}
              priority={task.priority}
              dataCb={() => fetchData()}
              isDone={task.is_done}
              onDelete={() => deleteTask(task.id)}
            />
          );
        })
      )}       
      </div>
    </div>
  );
}
