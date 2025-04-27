import React from 'react'
import TopHeroSection from "@/components/Shape-background"
import { NotificationSection } from './smartNotificationSection'
import { TimeSheet } from './timeSheet'
import { Footer } from '@/components/footer'

export default function page() {
  return (
    <div>
        <TopHeroSection/>
        <NotificationSection />
        <TimeSheet />
        <Footer />
    </div>
  )
}
