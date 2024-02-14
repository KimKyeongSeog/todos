"use client";

import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const SignIn: NextPage = () => {
  const [account, setAccount] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const onSignIn = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!account || !password) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/auth`,
        {
          account,
          password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data);

        router.replace("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container flex flex-col justify-center items-center">
      <h1 className="text-xl font-semibold">To do list - Sign In</h1>
      <form className="flex mt-4" onSubmit={onSignIn}>
        <div className="flex flex-col gap-2">
          <input
            className="input-style"
            type="text"
            placeholder="Account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <input
            className="input-style"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input
          className="self-end ml-2 btn-style"
          type="submit"
          value="Sign In"
        />
      </form>
    </div>
  );
};

export default SignIn;
