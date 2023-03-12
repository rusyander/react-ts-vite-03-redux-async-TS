import { useSelector } from "react-redux";
import TodoItem from "./TodoItem";
import { useAppSelector } from "../hook";

const TodoList = () => {
  const todos = useAppSelector((state) => state.todos.list);

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} {...todo} />
      ))}
    </ul>
  );
};

export default TodoList;
