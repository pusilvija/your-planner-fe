import './App.css';

import TaskBoard from './TaskBoard/TaskBoard.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskDetails from './TaskDetails/TaskDetails.jsx';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskBoard />} />
        <Route path="/tasks/:taskId" element={<TaskDetails />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
