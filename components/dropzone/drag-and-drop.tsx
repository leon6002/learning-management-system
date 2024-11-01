import React, { useReducer } from 'react';
import DropZone from './dropzone';

interface DragAndDropProps {
  callback: (ossUrl: string | null) => void;
}

type state = {
  inDropZone: boolean;
  fileList: File[];
};

type action = {
  type: string;
  data: any;
};

// reducer function to handle state changes
const reducer = (state: state, action: action) => {
  switch (action.type) {
    case 'SET_IN_DROP_ZONE':
      return { ...state, inDropZone: action.data.inDropZone };
    case 'ADD_FILE_TO_LIST':
      return { ...state, fileList: state.fileList.concat(action.data.files) };
    case 'REMOVE_FILE':
      return { ...state, fileList: action.data.files };
    default:
      return state;
  }
};

const DragAndDrop = ({ callback }: DragAndDropProps) => {
  // destructuring state and dispatch, initializing fileList to empty array
  const [state, dispatch] = useReducer(reducer, {
    inDropZone: false,
    fileList: [],
  });

  return (
    <div className='p-2'>
      <DropZone state={state} dispatch={dispatch} callback={callback} />
    </div>
  );
};

export default DragAndDrop;
