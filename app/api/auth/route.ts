import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const client = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { account, password } = await request.json();

    if (!account || !password) {
      return NextResponse.json(
        {
          message: "Not exist data.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await client.user.findUnique({
      where: {
        account,
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

    const compareResult = bcrypt.compareSync(password, user.password);

    if (!compareResult) {
      return NextResponse.json(
        {
          message: "Not correct password.",
        },
        {
          status: 400,
        }
      );
    }

    const token = jwt.sign({ account: user.account }, process.env.JWT_SECRET!);

    return NextResponse.json(token);
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
