interface NewTodoFormProps {
  value: string;
  updateTitle: (value: string) => void;
  handleAction: () => void;
}

const NewTodoForm: React.FC<NewTodoFormProps> = ({
  value,
  updateTitle,
  handleAction,
}): JSX.Element => {
  return (
    <label>
      <input
        placeholder="new todo"
        value={value}
        onChange={(e) => updateTitle(e.target.value)}
      />
      <button onClick={handleAction}>Add todo</button>
    </label>
  );
};

export default NewTodoForm;
