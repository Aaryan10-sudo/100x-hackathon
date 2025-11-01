import CTA from "@/components/CTA";
import EmblaCarousel from "@/components/Hero";
import TopDestinationsDemo from "@/components/TopDestinations";
import WhyChooseUs from "@/components/WhyChoose";

const page = () => {
  return (
    <div>
      <EmblaCarousel />
      <WhyChooseUs />
      <CTA />
      <TopDestinationsDemo />
    </div>
  );
};

export default page;
