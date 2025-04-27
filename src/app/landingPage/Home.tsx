import React from 'react'
import Headings from './Headings'
import StaticScroll from './StaticScroll'
import { Footer } from '@/components/footer'

const HomePage : React.FC =()=> {
  return (
    <div className=''>
        <Headings />
        <StaticScroll />
        <Footer />
    </div>
  )
}

export default HomePage