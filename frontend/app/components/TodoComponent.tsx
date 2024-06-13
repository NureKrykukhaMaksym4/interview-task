import { useState, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import TodoModal from '../modals/TodoModal';

interface TodoComponentProps {
  id: number;
  title: string;
  priority: number;
  isDone: boolean;
  dataCb: () => void;
  onDelete: () => void;
}

export default function TodoComponent(props: TodoComponentProps) {
  const [toggleStatus, setToggleStatus] = useState(props.isDone);
  const [toggleEditModalOpen, setToggleEditModalOpen] = useState(false);

  useEffect(() => {
    props.dataCb();
  }, [toggleStatus]);

  function changeTaskState() {
    axios
      .patch(`http://127.0.0.1:8000/tasks/${props.id}/update/`, { is_done: !toggleStatus })
      .then(() => {
        setToggleStatus(!toggleStatus);
      });
  }

  function editTask(title: string, priority: number) {
    axios
      .patch(`http://127.0.0.1:8000/tasks/${props.id}/update/`, {
        title: title,
        priority: priority,
      })
      .then(() => props.dataCb());
  }

  return (
    <div className="flex justify-between items-center p-2 rounded-lg shadow-md" style={{ backgroundColor: 'rgb(155, 193, 188)' }}>
      <div className="flex gap-2">
        <input type="checkbox" checked={toggleStatus} onChange={() => changeTaskState()} />
        <div className={clsx('text-lg', { 'line-through': toggleStatus })}>
          {props.title} | Priority: {props.priority}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setToggleEditModalOpen(true)}
          className="text-xl shadow-md text-white hover:bg-green-500 rounded-md px-2" style={{ backgroundColor: 'rgb(124, 140, 148)' }}>
          Edit
        </button>
        <button
          onClick={props.onDelete}
          className="text-xl shadow-md text-white hover:bg-red-500 rounded-md px-2" style={{ backgroundColor: 'rgb(237, 106, 90)' }}>
          Delete
        </button>
        <TodoModal
          initialPriority={props.priority}
          initialTitle={props.title}
          mode="update"
          isOpen={toggleEditModalOpen}
          onClose={() => setToggleEditModalOpen(false)}
          onSubmit={editTask}
        />
      </div>
    </div>
  );
}
