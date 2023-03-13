import React, { useState, useEffect } from "react";
import NewTodoForm from "./components/NewTodoForm";
// import TodoList from "./components/TodoList";
import { useAppDispatch, useAppSelector } from "./hook";
import { fetchTodos, addNewTodo } from "./store/todoSlice";
import TodoList from "components/TodoList";

export default function App() {
  const [title, setTitle] = useState("");
  const { loading, error } = useAppSelector((state) => state.todos);
  const dispatch = useAppDispatch();

  const handleAction = (): void => {
    if (title.trim().length) {
      dispatch(addNewTodo(title));
      setTitle("");
    }
  };

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  return (
    <div className="App">
      <NewTodoForm
        value={title}
        updateTitle={setTitle}
        handleAction={handleAction}
      />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <TodoList />
    </div>
  );
}
