import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowRight,
  BookOpen,
  CookingPot,
  Droplets,
  LucideAnchor,
  LucideCode,
  LucideWallet,
  MessageCircleQuestion,
} from 'lucide-react'
import React from 'react'
import { AppHero } from '@/components/app-hero'

export default function DashboardFeature() {
  return (
    <div>
      <AppHero title="t3flip" subtitle="How well do you know your fellow Turbin3rs?" />
    </div>
  )
}
