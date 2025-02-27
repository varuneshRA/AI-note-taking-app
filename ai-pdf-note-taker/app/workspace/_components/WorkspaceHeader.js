import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function WorkspaceHeader({ fileName }) {
  return (
    <div className='p-4 flex justify-between shadow-md'>
      <Image src={'/logo.svg'} alt='logo' width={40} height={40} />
      <h2 className='font-bold text-lg'>{fileName}</h2>
      <div className='flex gap-3 items-center'>
        <Link href="/dashboard">
          <Button asChild className='cursor-pointer hover:scale-105 transition-all'>
            <span>Home</span>
          </Button>
        </Link>
        <UserButton />
      </div>
    </div>
  )
}

export default WorkspaceHeader
