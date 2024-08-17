import db from '@/lib/db'
import { hash } from 'bcrypt'
import { NextResponse as res } from 'next/server'
import { z, ZodError } from 'zod'

const userSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, username, password } = userSchema.parse(body)

    // check email
    const isEmailExist = await db.user.findUnique({
      where: { email },
    })
    if (isEmailExist) {
      return res.json(
        {
          user: null,
          message: 'Email is already exist',
        },
        { status: 409 }
      )
    }

    // check username
    const isUsernameExist = await db.user.findUnique({
      where: { username },
    })
    if (isUsernameExist) {
      return res.json(
        {
          user: null,
          message: 'Username is already exist',
        },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(password, 10)
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })

    return res.json({ user: newUser, message: 'User created successfully' }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.json({ error: error.flatten().fieldErrors, message: 'Create user failed' }, { status: 500 })
    }

    return res.json({ message: 'Create user failed' }, { status: 500 })
  }
}
