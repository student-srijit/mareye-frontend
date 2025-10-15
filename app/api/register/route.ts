import { NextRequest, NextResponse } from "next/server"
import { getUserCollection } from "@/dbCollections"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, firstName, lastName, dob, avatar } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const users = await getUserCollection()
    const existingUser = await users.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await users.insertOne({
      username,
      email,
      password: hashedPassword,
      firstName: firstName || "",
      lastName: lastName || "",
      dob: dob || "",
      avatar: avatar || "",
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
