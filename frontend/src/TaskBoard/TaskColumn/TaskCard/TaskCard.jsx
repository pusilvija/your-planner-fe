import './TaskCard.css';


function TaskCard({ task, isDragging }) {
  return (
    <div className={`task-card ${isDragging ? 'dragging' : ''}`}>
      {task.name}
    </div>
  );
}

export default TaskCard;


// import { Link } from 'react-router-dom';
// import './TaskCard.css';

// function TaskCard({ task, isDragging }) {
  
//   return (
//     <Link to={`/tasks/${task.id}`} className="task-card-link">
//       <div className={`task-card ${isDragging ? 'dragging' : ''}`}>
//         <div className="task-content">
//           {task.name}
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default TaskCard;




// import { Link } from 'react-router-dom'; // Assuming you're using React Router
// import editIcon from '../../../assets/edit-icon.png'; // Update path as needed
// import trashIcon from '../../../assets/trash-icon.png'; // Update path as needed

// function TaskCard({ task, isDragging }) {
//   const handleDelete = (e) => {
//     if (!window.confirm('Are you sure you want to delete this task?')) {
//       e.preventDefault(); // Cancel navigation
//     }
//   };

//   return (
//     <div className={`task-card ${isDragging ? 'dragging' : ''}`}>
//       <div className="task-content">
//         {task.name}
//       </div>

//       <div className="task-buttons">
//         <Link
//           to={`/tasks/${task.id}/edit`}
//           id="edit-task-name"
//           data-task-id={task.id}
//         >
//           <img src={editIcon} alt="Edit" />
//         </Link>

//         <Link
//           to={`/tasks/${task.id}/delete`}
//           id="delete-task"
//           onClick={handleDelete}
//         >
//           <img src={trashIcon} alt="Delete" />
//         </Link>
//       </div>
//     </div>
//   );
// // }

// export default TaskCard;
