import { Todo } from "@prisma/client";
import axios from "axios";
import { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";

interface CreateTodoProps {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
}

const CreateTodo: FC<CreateTodoProps> = ({ todos, setTodos }) => {
  const [newTodo, setNewTodo] = useState<string>("");

  const onCreateTodo = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const token = localStorage.getItem("token");

      if (!newTodo || !token) return;

      const response = await axios.post<Todo>(
        `${process.env.NEXT_PUBLIC_URL}/api/todo`,
        {
          newTodo
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status !== 200) return;

      setNewTodo("");
      setTodos([response.data, ...todos]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={onCreateTodo}>
        <input
          className="input-style"
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <input className="btn-style ml-2" type="submit" value="Create" />
      </form>
    </div>
  );
};

export default CreateTodo;
