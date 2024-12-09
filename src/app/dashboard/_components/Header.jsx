"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

const Header = () => {

  const path = usePathname()
  useEffect(()=>{

  },[path])
  return (
    <div className='flex p-4 items-center justify-between bg-secondary'>
      <Image src={"/logo.svg"} width={160} height={100} alt="logo"/>  
        
        <ul className='flex gap-6'>
         {[{name:"Dashboard",path:"/dashboard"},{name:"Questions",path:"/dashboard/questions"},{name:"Upgrade",path:"/dashboard/upgrade"},{name:"How it works?",path:"/dashboard/help"}].map((item,idx)=> <Link href={item.path} className={` hover:text-primary hover:font-bold transition-all duration-500 cursor-pointer ${path==item.path && "  text-primary font-bold "}`} key={idx+item.name}>{item.name}</Link>)}
          


        </ul>
        <UserButton/>
        </div>
  ) 
}

export default Header