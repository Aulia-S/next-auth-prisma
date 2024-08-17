import Link from 'next/link'
import { Button } from '../ui/button'

export default function Navbar() {
  return (
    <header className='bg-gray-100 fixed top-0 w-full'>
      <div className='container flex items-center justify-between h-16'>
        <div>
          <Link href='/'>Home</Link>
        </div>
        <div>
          <Button asChild>
            <Link href='/login'>Login</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
