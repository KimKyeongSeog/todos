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
          message: "Not exist data."
        },
        {
          status: 400
        }
      );
    }

    const existUser = await client.user.findUnique({
      where: {
        account
      }
    });

    if (existUser) {
      return NextResponse.json(
        {
          message: "Already exist user."
        },
        {
          status: 400
        }
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await client.user.create({
      data: {
        account,
        password: hashedPassword
      }
      // select: { // 정보를 토큰화하여 사용하기 떄문에 직접적으로 계정정보를 사용하지 않기 때문에 seletor가 필요없다.
      //   account: true,
      // },
    });

    const token = jwt.sign(
      { account: newUser.account },
      process.env.JWT_SECRET!
    );

    return NextResponse.json(token);
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
