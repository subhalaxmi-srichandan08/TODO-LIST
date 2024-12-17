
import React, { useEffect, useState } from "react";
import "./Todo.css";

function Todo() {
  const [todoList, setTodoList] = useState([]);
  const [editableId, setEditableId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [editedDeadline, setEditedDeadline] = useState("");

  useEffect(() => {
    const storedTasks = localStorage.getItem("todoList");
    if (storedTasks) {
      setTodoList(JSON.parse(storedTasks));
    }
  }, []);

  const saveToLocalStorage = (tasks) => {
    localStorage.setItem("todoList", JSON.stringify(tasks));
  };

  const toggleEditable = (id) => {
    const rowData = todoList.find((data) => data.id === id);
    if (rowData) {
      setEditableId(id);
      setEditedTask(rowData.task);
      setEditedStatus(rowData.status);
      setEditedDeadline(rowData.deadline || "");
    } else {
      setEditableId(null);
      setEditedTask("");
      setEditedStatus("");
      setEditedDeadline("");
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask || !newStatus || !newDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    const newTaskData = {
      id: Date.now(), 
      task: newTask,
      status: newStatus,
      deadline: newDeadline,
    };

    const updatedTasks = [...todoList, newTaskData];
    setTodoList(updatedTasks);
    saveToLocalStorage(updatedTasks);

    setNewTask("");
    setNewStatus("");
    setNewDeadline("");
  };

  const saveEditedTask = (id) => {
    if (!editedTask || !editedStatus || !editedDeadline) {
      alert("All fields must be filled out.");
      return;
    }

    const updatedTasks = todoList.map((task) =>
      task.id === id
        ? { ...task, task: editedTask, status: editedStatus, deadline: editedDeadline }
        : task
    );

    setTodoList(updatedTasks);
    saveToLocalStorage(updatedTasks);
    setEditableId(null);
    setEditedTask("");
    setEditedStatus("");
    setEditedDeadline("");
  };

  const deleteTask = (id) => {
    const updatedTasks = todoList.filter((task) => task.id !== id);
    setTodoList(updatedTasks);
    saveToLocalStorage(updatedTasks);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-5">
          <h2 className="text-center">Add Project</h2>
          <form className="bg-light p-4">
            <div className="mb-3">
              <label>Task</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Status</label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Deadline</label>
              <input
                className="form-control"
                type="datetime-local"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
            </div>
            <button onClick={addTask} className="btn btn-success btn-sm">
              Add Task
            </button>
          </form>
        </div>
        <div className="col-md-7">
          <h2 className="text-center">Todo List</h2>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {todoList.length > 0 ? (
                  todoList.map((data) => (
                    <tr key={data.id}>
                      <td>
                        {editableId === data.id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editedTask}
                            onChange={(e) => setEditedTask(e.target.value)}
                          />
                        ) : (
                          data.task
                        )}
                      </td>
                      <td>
                        {editableId === data.id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editedStatus}
                            onChange={(e) => setEditedStatus(e.target.value)}
                          />
                        ) : (
                          data.status
                        )}
                      </td>
                      <td>
                        {editableId === data.id ? (
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={editedDeadline}
                            onChange={(e) => setEditedDeadline(e.target.value)}
                          />
                        ) : (
                          new Date(data.deadline).toLocaleString()
                        )}
                      </td>
                      <td>
                        {editableId === data.id ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => saveEditedTask(data.id)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => toggleEditable(data.id)}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          className="btn btn-danger btn-sm ml-1"
                          onClick={() => deleteTask(data.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No tasks available. Add one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Todo;
