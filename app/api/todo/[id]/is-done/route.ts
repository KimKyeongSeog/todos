import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const client = new PrismaClient();

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const token = request.headers.get("authorization");

    if (!token || isNaN(+id)) {
      return NextResponse.json(
        {
          message: "Not exist data.",
        },
        {
          status: 400,
        }
      );
    }

    const verifiedToken = <jwt.UserJwtPayload>(
      jwt.verify(token.substring(7), process.env.JWT_SECRET!)
    );

    const user = await client.user.findUnique({
      where: {
        account: verifiedToken.account,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Not exist user.",
        },
        {
          status: 400,
        }
      );
    }

    const existTodo = await client.todo.findUnique({
      where: {
        id: +id,
      },
    });

    if (user.id !== existTodo?.userId) {
      return NextResponse.json(
        {
          message: "Can not access.",
        },
        {
          status: 400,
        }
      );
    }

    const updatedTodo = await client.todo.update({
      where: {
        id: +id,
      },
      data: {
        isDone: !existTodo.isDone,
      },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server Error.",
      },
      {
        status: 500,
      }
    );
  }
};
