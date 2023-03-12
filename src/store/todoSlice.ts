import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AnyAction,
} from "@reduxjs/toolkit";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type TodosState = {
  list: Todo[];
  loading: boolean;
  error: string | null;
};

export const fetchTodos = createAsyncThunk<
  Todo[],
  undefined,
  { rejectValue: string }
>("todos/fetchTodos", async function (_, { rejectWithValue }) {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos?_limit=10"
    );

    if (!response.ok) {
      throw new Error("Server Error!");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
  }
});

export const addNewTodo = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string }
>("todos/addNewTodo", async function (text, { rejectWithValue, dispatch }) {
  const todo = {
    title: text,
    userId: 1,
    completed: false,
  };

  const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    return rejectWithValue("Can't add task. Server error.");
  }

  return (await response.json()) as Todo;
});

export const toggleStatus = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string; state: { todos: TodosState } }
>(
  "todos/toggleStatus",
  async function (id, { rejectWithValue, dispatch, getState }) {
    const todo = getState().todos.list.find((todo) => todo.id === id);

    if (todo) {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: !todo.completed,
          }),
        }
      );
      if (!response.ok) {
        return rejectWithValue("Can't toggle status. Server error.");
      }

      return (await response.json()) as Todo;
    }
    return rejectWithValue("Can't toggle status. Task not found.");
  }
);

export const deleteTodo = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: { todos: TodosState } }
>("todos/deleteTodo", async function (id, { rejectWithValue, dispatch }) {
  console.log(id);

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    return rejectWithValue("Can't delete task. Server error.");
  }

  return id as string;
});

const initialState: TodosState = {
  list: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(addNewTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(addNewTodo.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(toggleStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleStatus.fulfilled, (state, action) => {
        const todleTodo = state.list.find(
          (todo) => todo.id === action.payload.id
        );
        if (todleTodo) {
          todleTodo.completed = !todleTodo.completed;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        console.log(action.payload);

        const todleTodo = state.list.filter(
          (todo) => todo.id !== action.payload
        );
        console.log(todleTodo);

        state.list = todleTodo;
      })
      .addMatcher(asError, (state, action: PayloadAction<string>) => {
        state.error = action.payload as string;
      });
  },
});

export default todoSlice.reducer;

function asError(action: AnyAction) {
  return action.type.endsWith("rejected");
}
