import LandingNavbar from '../components/landing/LandingNavbar'
import Hero from '../components/landing/HeroSection'
import LanguageMarquee from '../components/landing/LanguageMarquee'
import Features from '../components/landing/FeaturesSection'
import HowItWorks from '../components/landing/HowItWorks'
import TranslateDemo from '../components/landing/TranslateDemo'
import Compare from '../components/landing/Compare'
import UseCases from '../components/landing/UseCasesSection'
import LandingCTA from '../components/landing/LandingCTA'
import LandingFooter from '../components/landing/FooterSection'

export default function LandingPage() {
  return (
    <main style={{ 
      background: '#0c0c0b', 
      minHeight: '100vh',
      overflowX: 'hidden',
      width: '100%',
      maxWidth: '100vw',
    }}>
      <LandingNavbar />
      <Hero />
      <LanguageMarquee />
      <Features />
      <HowItWorks />
      <TranslateDemo />
      <Compare />
      <UseCases />
      <LandingCTA />
      <LandingFooter />
    </main>
  )
}
