/* eslint-disable react/prop-types */
export default function ToDoItem({ todo, todoDelete, todoUpdate }) {
   return (
      <div className="todo-item grid" key={todo?._id}>
         <div className="todo">{todo.todoItem}</div>
         <div className="todo-actions grid">
            <button className="Update" onClick={todoUpdate}>
               Update
            </button>
            <button className="Delete danger" onClick={todoDelete}>
               Delete
            </button>
         </div>
      </div>
   );
}
