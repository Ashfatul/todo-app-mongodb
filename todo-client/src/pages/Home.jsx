import { useEffect, useState } from "react";
import * as Toastr from "toastr";
import ToDoItem from "./ToDoItem";

export default function Home() {
   const [todoItem, setToDoItem] = useState("");
   const [update, setUpdate] = useState(false);
   const [updateID, setUpdateID] = useState("");
   const [list, setList] = useState([]);

   useEffect(() => {
      fetch("http://localhost:5000/todos", {
         method: "GET",
         headers: {
            "content-type": "application/json",
         },
      })
         .then((res) => res.json())
         .then((data) => setList(data))
         .catch((err) => console.log(err));
   }, []);

   const handleInputChange = (e) => {
      setToDoItem(e.target.value);
   };
   const addNewToDo = (e) => {
      e.preventDefault();

      if (todoItem.length > 0) {
         fetch("http://localhost:5000/todos", {
            method: "POST",
            headers: {
               "content-type": "application/json",
            },
            body: JSON.stringify({ todoItem }),
         })
            .then((res) => res.json())
            .then(() => {
               Toastr.success("Successfully added new todo");
               setToDoItem("");
            })
            .catch((err) => Toastr.error(err?.message));
      } else {
         Toastr.error("Write something to add todo");
      }
   };

   const handleDelete = (id) => {
      const confirmDelete = confirm("Are you sure you want to delete?");
      if (confirmDelete) {
         fetch(`http://localhost:5000/todos/${id}`, {
            method: "DELETE",
         })
            .then((res) => res.json())
            .then((data) => {
               if (data.deletedCount > 0) {
                  Toastr.success("Delete Successfully");
                  setList(list.filter((item) => item._id !== id));
               } else {
                  Toastr.error("Delete Failed");
               }
            })
            .catch((err) => console.log(err));
      } else {
         Toastr.info("Delete Cancelled");
      }
   };

   const handleUpdate = (id, item) => {
      setUpdate(true);
      setUpdateID(id);
      setToDoItem(item);
      Toastr.info("Update Mode is on");
   };

   const updateToDo = (e) => {
      e.preventDefault();
      if (todoItem.length > 0) {
         fetch(`http://localhost:5000/todos/${updateID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ todoItem }),
         })
            .then((res) => res.json())
            .then(() => {
               Toastr.success("Updated Successfully");
               setUpdate(false);
               setToDoItem("");
            })
            .catch((err) => console.log(err));
      } else {
         Toastr.error("Write Something To Update ToDo");
      }
   };

   return (
      <div className="container">
         <div className="grid">
            <div className="add-todo-area">
               <h3>{update ? "Update ToDo!" : "Add ToDo!"}</h3>
               <form onSubmit={update ? updateToDo : addNewToDo}>
                  {update && (
                     <input
                        type="hidden"
                        name="updateID"
                        defaultValue={updateID}
                     />
                  )}
                  <input
                     type="text"
                     value={todoItem}
                     onChange={handleInputChange}
                     placeholder="Add new todo..."
                  />
                  <input
                     type="submit"
                     value={update ? "Update ToDo" : "Add ToDo"}
                  />
               </form>
            </div>
            <div className="display-todo-area">
               <h3>Todo List</h3>
               {list.map((todo) => (
                  <ToDoItem
                     key={todo?._id}
                     todo={todo}
                     todoDelete={() => handleDelete(todo?._id)}
                     todoUpdate={() => handleUpdate(todo?._id, todo?.todoItem)}
                  />
               ))}
            </div>
         </div>
      </div>
   );
}
