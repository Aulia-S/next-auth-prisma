'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signIn } from '@/auth'
import { login } from './action'

interface IFormInput {
  email: string
  password: string
}

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export default function LoginForm() {
  // return (
  //   <form
  //     action={async (formData) => {
  //       'use server'
  //       await signIn('credentials', formData)
  //     }}
  //   >
  //     <label>
  //       Email
  //       <input name='email' type='email' />
  //     </label>
  //     <label>
  //       Password
  //       <input name='password' type='password' />
  //     </label>
  //     <button type='submit'>Sign In</button>
  //   </form>
  // )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'cba123@gmail.com',
      password: '11111111',
    },
  })

  const onSubmit = () => {
    const callback = handleSubmit(login)
    callback()
  }

  return (
    <div className='h-full flex items-center justify-center'>
      <Card className='mx-auto w-96'>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
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
            <form action={onSubmit}>
              <Button className='w-full' type='submit'>
                Login
              </Button>
            </form>
            <Button variant='outline' className='w-full'>
              Login with Google
            </Button>
          </div>
          <div className='mt-4 text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Link href='/register' className='underline'>
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
