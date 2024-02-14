"use client";

import { Todo } from "@prisma/client";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import CreateTodo from "./components/CreateTodo";
import axios from "axios";
import TodoCard from "./components/TodoCard";

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const getTodos = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/todo`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getTodos();
    }
  }, []);

  return (
    <div className="container text-center">
      <h1 className="my-4 text-xl font-semibold">To do list</h1>
      <CreateTodo todos={todos} setTodos={setTodos} />
      <ul className="mt-4 flex flex-col gap-2">
        {todos.map((v, i) => (
          <TodoCard key={i} todo={v} todos={todos} setTodos={setTodos} />
        ))}
      </ul>
    </div>
  );
};

export default Home;
