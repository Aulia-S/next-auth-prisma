import { auth } from '@/auth'
// import { ModeToggle } from '@/components/theme/theme-switcher'
// import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()
  // if (!session) redirect('/login')

  return (
    <div>
      <pre>{JSON.stringify(session)}</pre>
    </div>
  )
}
