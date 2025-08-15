'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

export function SignInButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Signed in as {session.user.email}</p>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    )
  }

  return <Button onClick={() => signIn('google')}>Sign in with Google</Button>
}
