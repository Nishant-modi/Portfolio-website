import { BrowserRouter } from "react-router-dom";
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas} from "./components";
import { ScrollControls, Scroll } from "@react-three/drei";
import { ComputersCanvas } from './components/canvas';

const App = () => {

  return (
    
    <BrowserRouter>
     
        <div className = "relative z-0 bg-primary">
        <div className = "bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar/>
          <Hero/>
          
        </div>
        <About/>
        <Experience/>
        <Tech/>
        <Works/>
        <Feedbacks/>
        <div className = "relative z-0">
          <Contact/>
          <StarsCanvas/>
        </div>
      </div>
      
    </BrowserRouter>
    
  )
}

function Overlay() {
  return (
    <section className="relative w-full h-screen mx-auto">
      
      <div className={`${styles.paddingX} absolute inset-0 top-[150px] max-w-7x1 mx-auto flex flex-row items-start gap-5 `}>
         <div className ="flex flex-col justify-center items-center mt-5" >
          <div className="w-5 h-5 bg-[#915eff]"/>
          <div className="w-1 sm:h-80 h-40 violet-gradient"/>
        </div>
        
        <div>

          <h1 className={`${styles.heroHeadText} text-white`}>Hi, I'm <span className="text-[#915eff]">Nishant</span></h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
          I build digital games <br className="sm:block hidden"/>
          and 3D visuals
          </p>
        </div>
        </div>
        <ComputersCanvas/>
        
      <div className="absolute xs:bottom-10 bottom 32 w-full flex justify-center items-center">
        <a href = "#about">
          <div className=" w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.dev
            animate={{
              y:[0,24,0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  )
}

export default App
