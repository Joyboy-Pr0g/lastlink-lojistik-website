import { useEffect } from "react";
import { initSmoothScroll } from "@/lib/smoothScroll";
import { useDocumentMeta } from "@/lib/seo";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SplashScreen from "@/components/layout/SplashScreen";
import Hero from "@/components/hero/Hero";
import JourneySection from "@/components/journey/JourneySection";
import Track from "@/components/sections/Track";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Coverage from "@/components/sections/Coverage";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";

const App = () => {
  useDocumentMeta();
  useEffect(() => initSmoothScroll(), []);

  return (
    <>
      <SplashScreen />
      <Header />
      <main>
        <Hero />
        <JourneySection />
        <Track />
        <Stats />
        <Services />
        <Coverage />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;
