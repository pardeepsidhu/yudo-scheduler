import React from 'react'
import Headings from './Headings'
import StaticScroll from './StaticScroll'
import { Footer } from '@/components/footer'
import { TimeSheet } from './timeSheet'

const HomePage : React.FC =()=> {
  return (
    <div className=''>
        <Headings />
        <StaticScroll />
        <TimeSheet/>
        <Footer />
    </div>
  )
}

export default HomePage