'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

const schema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    password_confirmation: z.string().min(6, { message: 'Passwords do not match' }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

type FormData = z.infer<typeof schema>

export default function RegisterForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    })

    if (response.ok) {
      router.push('login')
    } else {
      console.error('Registration failed.')
    }
  }

  return (
    <div className='flex items-center justify-center'>
      <Card className='mx-auto w-96'>
        <CardHeader>
          <CardTitle className='text-2xl'>Register</CardTitle>
          <CardDescription>Fill in information below to create your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='username'>Username</Label>
              <Input id='username' type='username' placeholder='brother123' required {...register('username')} />
              {errors.username && <p className='text-red-400 text-sm'>{errors.username.message}</p>}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='m@example.com' required {...register('email')} />
              {errors.email && <p className='text-red-400 text-sm'>{errors.email.message}</p>}
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password'>Password</Label>
                {/* <Link href='#' className='ml-auto inline-block text-sm underline'>
                Forgot your password?
              </Link> */}
              </div>
              <Input id='password' type='password' required {...register('password')} />
              {errors.password && <p className='text-red-400 text-sm'>{errors.password.message}</p>}
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password_confirmation'>Re-enter Password</Label>
                {/* <Link href='#' className='ml-auto inline-block text-sm underline'>
                Forgot your password?
              </Link> */}
              </div>
              <Input id='password_confirmation' type='password' required {...register('password_confirmation')} />
              {errors.password_confirmation && <p className='text-red-400 text-sm'>{errors.password_confirmation.message}</p>}
            </div>
            <Button type='submit' className='w-full' onClick={handleSubmit(onSubmit)}>
              Register
            </Button>
            <Button variant='outline' className='w-full'>
              Login with Google
            </Button>
          </div>
          <div className='mt-4 text-center text-sm'>
            Have an account?{' '}
            <Link href='/login' className='underline'>
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
