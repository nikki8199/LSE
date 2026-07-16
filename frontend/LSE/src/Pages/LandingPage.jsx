import Navbar from "../Components/Navbar/Navbar";
import Hero from "../Components/Hero/Hero";
import SkillCategory from "../Components/SkillCategory/SkillCategory";
import FeaturedUsers from "../Components/FeaturedUsers/FeaturedUsers";
import HowItWorks from "../Components/HowitWorks/HowitWorks";
import Statistics from "../Components/Stats/Stats";
import Testimonials from "../Components/TestiMonial/TestiMonial";
import CTA from "../Components/CTA/CTA";
import Footer from "../Components/Footer/Footer";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <SkillCategory />
      <FeaturedUsers/>
      <HowItWorks/>
      <Statistics/>
      <Testimonials/>
      <CTA/>
      <Footer/>
    </>
  );
}

export default LandingPage;