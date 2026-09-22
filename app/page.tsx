import Navbar from "@/components/portfolio/Navbar";
import CinematicHero from "@/components/portfolio/CinematicHero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Experience from "@/components/portfolio/Experience";
import Contact from "@/components/portfolio/Contact";

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-[#03040d] text-white">
      <Navbar />

      <CinematicHero />

      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}
