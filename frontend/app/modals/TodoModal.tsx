import { useState, useEffect } from 'react';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, priority: number) => void;
  mode: 'create' | 'update';
  initialTitle?: string;
  initialPriority?: number;
}

export default function TodoModal(props: TodoModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(1);

  useEffect(() => {
    if (props.mode === 'update') {
      setTitle(props.initialTitle || '');
      setPriority(props.initialPriority || 1);
    }
  }, [props.mode, props.initialTitle, props.initialPriority]);

  const handleSubmit = () => {
    props.onSubmit(title, priority);
    setTitle('');
    setPriority(1);
    props.onClose();
  };

  return (
    <>
      {props.isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="p-8 rounded-lg w-80" style={{ backgroundColor: 'rgb(230, 235, 224)' }}>
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">
                {props.mode === 'create' ? 'Create New Todo' : 'Edit Todo'}
              </h2>
              <button
                className="p-1 rounded-lg text-sm text-center text-white hover:bg-red-500"
                style={{ backgroundColor: 'rgb(237, 106, 90)' }}
                onClick={props.onClose}>
                <svg
                  width="24"
                  height="24"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="ui-svg-inline"
                  data-darkreader-inline-fill="">
                  <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                </svg>
              </button>
            </div>
            <input
              className="w-full mb-4 mt-4 px-3 py-2 border rounded-md"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              className="w-full mb-4 px-3 py-2 border rounded-md"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value, 10))}>
              {[...Array(10)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            <button
              className="text-white py-2 px-4 rounded-md mr-2"
              style={{ backgroundColor: 'rgb(124, 140, 148)'}}
              onClick={handleSubmit}>
              {props.mode === 'create' ? 'Confirm' : 'Update'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
