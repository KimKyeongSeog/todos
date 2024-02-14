import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const client = new PrismaClient();

export const GET = async (request: NextRequest) => {
  try {
    // 투두를 생성
    //응답

    const token = request.headers.get("authorization");
    const { content } = await request.json();

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
    ); //as <jwt.UserJwtPayload>

    const user = await client.user.findUnique({
      //user의 account는 unique 한 값이기 때문에 findUnique 사용
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
        content,
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
