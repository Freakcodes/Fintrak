import HeroSection from "@/components/hero"
import HomeContent from "@/components/homecontent"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="mt-30">
      <HeroSection/>
      <HomeContent/>
    </div>
  )
}