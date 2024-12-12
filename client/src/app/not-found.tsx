'use client'
import { redirect } from 'next/navigation'
import React, { useEffect } from 'react'

const NotFound = () => {
  useEffect(() => {
    redirect('/')
  }, [])
  return <div></div>
}

export default NotFound
