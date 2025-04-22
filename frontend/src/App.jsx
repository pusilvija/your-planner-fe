import './App.css';

import TaskBoard from './TaskBoard/TaskBoard.jsx'


// function App() {
//   return (
//     <>
//       <h1>Planner</h1>
//       <TaskBoard></TaskBoard>
//     </>
//   )
// }

// export default App;


import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import TaskBoard from './TaskBoard/TaskBoard';
import TaskDetails from './TaskDetails/TaskDetails.jsx';

function App() {
  return (
    <>
    <h1>Planner</h1>
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
