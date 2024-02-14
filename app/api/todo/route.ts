import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const client = new PrismaClient();

export const GET = async (request: NextRequest) => {
  try {
    //토큰 확인 (검증)
    // => 사용자로부터 토큰을 받아온다. 헤더 Bearer
    // => 그 토큰이 유효한지 검증한다.

    // 투두를 생성
    //응답

    const token = request.headers.get("authorization");

    console.log(token);

    if (!token) {
      return NextResponse.json(
        {
          message: "Not exist data."
        },
        {
          status: 400
        }
      );
    }

    const verifiedToken = <jwt.UserJwtPayload>(
      jwt.verify(token.substring(7), process.env.JWT_SECRET!)
    );

    const user = await client.user.findUnique({
      where: {
        account: verifiedToken.account
      }
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Not exist user."
        },
        {
          status: 400
        }
      );
    }

    const todos = await client.todo.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error."
      },
      {
        status: 500
      }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { newTodo } = await request.json();
    const token = request.headers.get("authorization");

    if (!newTodo || !token) {
      return NextResponse.json(
        {
          message: "Not exist data."
        },
        {
          status: 400
        }
      );
    }

    const verifiedToken = <jwt.UserJwtPayload>(
      jwt.verify(token.substring(7), process.env.JWT_SECRET!)
    );

    const user = await client.user.findUnique({
      where: {
        account: verifiedToken.account
      }
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Not exist user."
        },
        {
          status: 400
        }
      );
    }

    const todo = await client.todo.create({
      data: {
        content: newTodo,
        userId: user.id
      }
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error."
      },
      {
        status: 500
      }
    );
  }
};
