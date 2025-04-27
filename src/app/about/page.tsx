import React from 'react'
import TopHeroSection from "@/components/Shape-background"
import { NotificationSection } from './smartNotificationSection'
import { TimeSheet } from './timeSheet'
import { DynamicBackground } from '@/components/dynatic-backgroud'

export default function page() {
  return (
    <div>
        <TopHeroSection/>
        <NotificationSection />
        <TimeSheet />
       
    </div>
  )
}
