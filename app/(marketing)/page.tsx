import { HeroAB } from "@/components/marketing/HeroAB";
import { BrandsStrip } from "@/components/marketing/BrandsStrip";
import { UspStats } from "@/components/marketing/UspStats";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { LivePriceSection } from "@/components/marketing/LivePriceSection";
import { BeforeAfterCases } from "@/components/marketing/BeforeAfterCases";
import { EquipmentCarousel } from "@/components/marketing/EquipmentCarousel";
import { TeamSection } from "@/components/marketing/TeamSection";
import { VideoTestimonials } from "@/components/marketing/VideoTestimonials";
import { BranchesMapSection } from "@/components/marketing/BranchesMapSection";
import { AccountPromo } from "@/components/marketing/AccountPromo";
import { BookingCta } from "@/components/marketing/BookingCta";
import { FaqSection } from "@/components/marketing/FaqSection";

export default function HomePage() {
  return (
    <>
      <HeroAB />
      <BrandsStrip />
      <UspStats />
      <ServicesGrid />
      <LivePriceSection />
      <BeforeAfterCases />
      <EquipmentCarousel />
      <TeamSection />
      <VideoTestimonials />
      <BranchesMapSection />
      <AccountPromo />
      <BookingCta />
      <FaqSection />
    </>
  );
}
