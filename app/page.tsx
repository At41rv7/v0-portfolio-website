"use client"

import { useState, useEffect, useRef } from "react"
import {
  Code2,
  Cpu,
  Globe,
  ArrowRight,
  Github,
  Mail,
  Sparkles,
  ExternalLink,
  Layers,
  Terminal,
  Zap,
  LayoutTemplate,
  Send,
  Check,
} from "lucide-react"

// --- Utility: useScroll Hook for Parallax ---
const useScroll = () => {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  return scrollY
}

// --- Component: Fade In on Scroll ---
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsVisible(entry.isIntersecting))
      },
      { threshold: 0.1 },
    )
    const currentElement = domRef.current
    if (currentElement) observer.observe(currentElement)
    return () => {
      if (currentElement) observer.unobserve(currentElement)
    }
  }, [])

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
    >
      {children}
    </div>
  )
}

// --- Component: Cyber Scramble Text Effect ---
const ScrambleText = ({ text, className = "" }) => {
  const [displayText, setDisplayText] = useState(text)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&"

  useEffect(() => {
    let iterations = 0
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iterations) return text[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join(""),
      )

      if (iterations >= text.length) clearInterval(interval)
      iterations += 1 / 3
    }, 30)
    return () => clearInterval(interval)
  }, [text])

  return <span className={className}>{displayText}</span>
}

// --- Component: Magnetic Button ---
const MagneticButton = ({ children, primary = false, href = "#", icon: Icon }) => {
  const btnRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = btnRef.current.getBoundingClientRect()
    const x = (clientX - (left + width / 2)) * 0.35 // Strength of magnet
    const y = (clientY - (top + height / 2)) * 0.35
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : "_self"}
      rel="noreferrer"
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      className={`
        group relative inline-flex items-center justify-center px-8 py-4 
        rounded-full overflow-hidden transition-transform duration-200 ease-out font-medium
        ${
          primary
            ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
            : "bg-white text-slate-700 border border-slate-200"
        }
      `}
    >
      {primary && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
      )}
      <span className="relative z-10 flex items-center gap-2 tracking-wide text-sm md:text-base">
        {Icon && <Icon size={18} className={primary ? "text-slate-300" : "text-slate-500"} />}
        {children}
      </span>
    </a>
  )
}

// --- Component: Spotlight Card ---
const SpotlightCard = ({ children, className = "", onClick }) => {
  const divRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200/60
        transition-all duration-500 ease-out
        hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] hover:border-slate-300
        ${className}
      `}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99,102,241,0.06), transparent 40%)`,
        }}
      />
      {children}
    </div>
  )
}

const PillTag = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-slate-50 border border-slate-100 rounded-full text-xs md:text-sm text-slate-600 font-medium whitespace-nowrap font-mono">
    <Icon size={14} className="text-indigo-500" />
    <span>{text}</span>
  </div>
)

const GradientText = ({ children, className = "" }) => (
  <span
    className={`bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 ${className}`}
  >
    {children}
  </span>
)

export default function Portfolio() {
  const scrollY = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      const handleMouseMove = (e) => {
        requestAnimationFrame(() => {
          setMousePosition({ x: e.clientX, y: e.clientY })
        })
      }
      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleCopyEmail = (e) => {
    e.preventDefault()
    navigator.clipboard.writeText("at41rv@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const projects = [
    {
      title: "A7 AI",
      url: "https://a7-ai.vercel.app/",
      desc: "Next-generation AI interface featuring fluid interactions, advanced LLM integration, and hyper-clean UI.",
      tags: ["AI", "Next.js", "Vercel"],
      color: "from-blue-50 to-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "AgEnv Tech",
      url: "https://www.agenv.tech",
      desc: "Revolutionizing agricultural environments with scalable AI-driven data visualization solutions.",
      tags: ["AgriTech", "Data Vis", "React"],
      color: "from-emerald-50 to-teal-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "A4F",
      url: "https://www.a4f.co",
      desc: "A premium digital architecture platform tailored for high-performance functionality and design.",
      tags: ["Design", "Arch", "Minimal"],
      color: "from-orange-50 to-amber-50",
      iconColor: "text-orange-600",
    },
  ]

  const skills = [
    "Artificial Intelligence",
    "Graphic Web Design",
    "Full Stack Development",
    "React.js",
    "Next.js",
    "UI/UX",
    "Motion Graphics",
    "Database Arch",
    "Prompt Engineering",
    "Cloud Computing",
  ]

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-indigo-500/10 selection:text-indigo-700 overflow-x-hidden">
      {/* --- Grainy Overlay (Unique Texture) --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* --- Parallax Background --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#FAFAFA]">
        {/* Technical Grid - Moves slowly */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px), 
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 100%)",
          }}
        ></div>

        {/* Ambient Top Light */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-white via-white/80 to-transparent"></div>

        {/* Interactive Mouse Blob (Desktop Only) */}
        <div
          className="hidden md:block absolute w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[100px] transition-transform duration-100 ease-out will-change-transform mix-blend-multiply"
          style={{
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
          }}
        />
      </div>

      {/* --- Navbar --- */}
      <nav
        className={`fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? "translate-y-0 px-2 md:px-4" : "translate-y-0 px-4 md:px-6"}`}
      >
        <div
          className={`
          backdrop-blur-xl border transition-all duration-500 rounded-full flex items-center gap-3 md:gap-10 shadow-sm
          ${
            scrolled
              ? "bg-white/90 border-slate-200/80 px-4 py-2 md:px-6 md:py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              : "bg-white/80 border-slate-100 px-4 py-2 md:px-7 md:py-3.5"
          }
        `}
        >
          {/* Updated logo to use the provided image and matched header style to the reference pill design */}
          <a href="#" className="flex items-center gap-1.5 group relative">
            <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform duration-300">
              <img src="/images/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0.5 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a href="#about" className="hover:text-slate-900 transition-colors">
              About
            </a>
            <a href="#projects" className="hover:text-slate-900 transition-colors">
              Projects
            </a>
            <a href="#skills" className="hover:text-slate-900 transition-colors">
              Stack
            </a>
          </div>
          <a
            href="#contact"
            className="px-4 py-2 md:px-6 md:py-2.5 bg-[#0A0F1C] hover:bg-black text-white rounded-full text-xs md:text-sm font-medium transition-all hover:shadow-lg hover:shadow-slate-900/20 active:scale-95 tracking-wide"
          >
            Let's Talk
          </a>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 md:pt-40 text-center">
        <FadeIn delay={100}>
          <div className="relative mb-10 group cursor-default">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 via-blue-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-100 transition duration-700 blur-2xl scale-150"></div>
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden ring-1 ring-slate-100">
              <img
                src="https://avatars.githubusercontent.com/u/201381760?s=400&u=9efd1be6d842fc8097f5c15e998280ba88e51989&v=4"
                alt="Atharvsinh Jadav"
                className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            </div>

            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm whitespace-nowrap z-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold tracking-wide uppercase text-slate-500 font-mono">
                Open to Collaborate
              </span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 max-w-5xl mx-auto leading-[0.95] text-slate-900 font-playfair italic">
            <span className="not-italic font-sans tracking-tight">Designing the</span>{" "}
            <br className="hidden md:block" />
            <span>Future</span>
            <span className="text-3xl md:text-6xl lg:text-7xl block mt-4 text-slate-400 font-sans not-italic font-medium tracking-tight">
              with Code & AI.
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={300}>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            I'm Atharvsinh Jadav. A Full Stack Developer & AI Specialist. I build{" "}
            <span className="text-slate-900 font-semibold border-b-2 border-indigo-100 hover:border-indigo-300 transition-colors pb-0.5 cursor-none font-playfair italic pr-1">
              liquid-smooth
            </span>{" "}
            digital experiences.
          </p>
        </FadeIn>

        <FadeIn delay={400} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center px-4">
          <MagneticButton primary href="#projects">
            View My Work <ArrowRight size={18} />
          </MagneticButton>
          <MagneticButton href="https://github.com/Atharvsinh-codez" icon={Github}>
            GitHub
          </MagneticButton>
        </FadeIn>
      </section>

      {/* --- About / Stats --- */}
      <section id="about" className="relative z-10 px-4 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FadeIn delay={0} className="col-span-1 lg:col-span-2 h-full">
            <SpotlightCard className="p-8 md:p-14 h-full flex flex-col justify-center">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 text-indigo-600 border border-slate-100 shadow-sm">
                <Sparkles size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 tracking-tight font-playfair">
                The Intersection of <br />
                Art & Intelligence
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed max-w-2xl">
                I don't just write code; I craft systems. Leveraging{" "}
                <span className="text-slate-900 font-semibold decoration-indigo-200 underline underline-offset-4 decoration-2">
                  Generative AI
                </span>{" "}
                and <span className="text-slate-900 font-semibold">Next-Gen Web Standards</span>, I build interfaces
                that feel alive—minimalist, responsive, and unmistakably premium.
              </p>
            </SpotlightCard>
          </FadeIn>

          <FadeIn delay={100} className="col-span-1 h-full">
            <SpotlightCard className="p-8 md:p-10 h-full flex flex-col justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-slate-900 font-mono">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <Cpu size={20} className="text-indigo-500" />
                  </div>
                  Core Stack
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  <PillTag icon={Code2} text="React 18" />
                  <PillTag icon={Terminal} text="Next.js" />
                  <PillTag icon={Layers} text="Tailwind" />
                  <PillTag icon={Zap} text="OpenAI" />
                  <PillTag icon={Globe} text="Vercel" />
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-slate-200/60">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-slate-900 tracking-tighter font-playfair">3+</span>
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
                    Major Ships
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </FadeIn>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section id="projects" className="relative z-10 px-4 py-24 max-w-7xl mx-auto">
        <FadeIn className="flex flex-col items-center mb-20 text-center">
          <div className="mb-6 p-3 bg-white rounded-2xl text-slate-600 border border-slate-200 shadow-sm">
            <LayoutTemplate size={24} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight font-playfair">
            Featured Works
          </h2>
          <p className="text-slate-500 max-w-xl text-lg">
            Scalable applications built with modern architecture and precision design.
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 gap-3 md:gap-8">
          {projects.map((project, index) => (
            <FadeIn key={index} delay={index * 100}>
              <SpotlightCard className="group h-full flex flex-col">
                <div className="relative flex-1 p-4 md:p-10 flex flex-col justify-between">
                  {/* Hover Gradient Blob */}
                  <div
                    className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity duration-700 pointer-events-none`}
                  ></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4 md:mb-10">
                      <div className="p-2 md:p-3.5 bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
                        <Globe size={16} className={`md:w-[26px] md:h-[26px] ${project.iconColor}`} />
                      </div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 md:p-3 bg-white hover:bg-slate-50 rounded-full transition-all border border-slate-100 hover:border-slate-300 shadow-sm group-hover:shadow-md"
                      >
                        <ExternalLink size={14} className="md:w-5 md:h-5 text-slate-400 hover:text-slate-900" />
                      </a>
                    </div>

                    <h3 className="text-base md:text-3xl font-bold mb-2 md:mb-4 text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs md:text-lg text-slate-500 mb-4 md:mb-8 leading-relaxed line-clamp-3 md:line-clamp-none">
                      {project.desc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 md:px-3 md:py-1 bg-slate-100 rounded-full text-[10px] md:text-sm font-medium text-slate-600 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* --- Skills Infinite Marquee --- */}
      <section id="skills" className="relative z-10 py-24 overflow-hidden">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-playfair">Technical Arsenal</h2>
          </div>

          <div className="relative w-full overflow-hidden py-10">
            {/* Fade Gradients at Edges */}
            <div className="absolute top-0 left-0 h-full w-20 md:w-40 bg-gradient-to-r from-[#FDFDFD] to-transparent z-10"></div>
            <div className="absolute top-0 right-0 h-full w-20 md:w-40 bg-gradient-to-l from-[#FDFDFD] to-transparent z-10"></div>

            <div className="flex gap-6 animate-marquee whitespace-nowrap">
              {[...skills, ...skills, ...skills].map((skill, i) => (
                <div
                  key={i}
                  className="px-6 py-3 bg-white border border-slate-100 rounded-full shadow-sm text-slate-600 font-medium text-sm md:text-base tracking-wide flex-shrink-0 font-mono"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* --- Contact Section --- */}
      <section id="contact" className="relative z-10 px-4 py-24 max-w-5xl mx-auto text-center">
        <FadeIn>
          <div className="relative overflow-hidden p-10 md:p-20 rounded-[3rem] bg-gradient-to-b from-white to-indigo-50/50 border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-100/40 to-transparent blur-[80px] -z-10"></div>

            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-slate-900 tracking-tighter">
              Let's build the <br />
              <span className="text-indigo-600 italic">future.</span>
            </h2>
            <p className="text-slate-500 mb-12 text-lg font-medium max-w-xl mx-auto">
              Whether it's an AI-driven platform or a high-end graphic website.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Email Card with Magnetic & Clipboard */}
              <button
                onClick={handleCopyEmail}
                className="group relative flex flex-col items-center justify-center gap-4 bg-white hover:bg-slate-50 border border-slate-100 hover:border-indigo-200 p-8 rounded-[2.5rem] transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-green-100 rounded-full scale-150 transition-all duration-300 ${copied ? "opacity-100" : "opacity-0"}`}
                  ></div>
                  <div className="relative p-4 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                    {copied ? <Check size={24} className="text-green-600" /> : <Mail size={24} />}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-lg tracking-tight">Email</div>
                  <div className="text-sm text-slate-400 mt-1 font-medium group-hover:text-indigo-500 transition-colors font-mono">
                    {copied ? "Copied!" : "at41rv@gmail.com"}
                  </div>
                </div>
              </button>

              <a
                href="https://t.me/at41rv"
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center justify-center gap-4 bg-white hover:bg-slate-50 border border-slate-100 hover:border-sky-200 p-8 rounded-[2.5rem] transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="p-4 bg-sky-50 rounded-full text-sky-500 group-hover:scale-110 transition-transform duration-300">
                  <Send size={24} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-lg tracking-tight">Telegram</div>
                  <div className="text-sm text-slate-400 mt-1 font-medium group-hover:text-sky-500 transition-colors font-mono">
                    @at41rv
                  </div>
                </div>
              </a>

              <a
                href="https://github.com/Atharvsinh-codez"
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center justify-center gap-4 bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-300 p-8 rounded-[2.5rem] transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="p-4 bg-slate-100 rounded-full text-slate-700 group-hover:scale-110 transition-transform duration-300">
                  <Github size={24} />
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900 text-lg tracking-tight">GitHub</div>
                  <div className="text-sm text-slate-400 mt-1 font-medium group-hover:text-slate-600 transition-colors font-mono">
                    Atharvsinh-codez
                  </div>
                </div>
              </a>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* --- Footer --- */}
      <footer className="relative z-10 py-12 text-center text-slate-400 text-sm font-medium border-t border-slate-100/50">
        <p className="tracking-tight">© {new Date().getFullYear()} Atharvsinh Jadav. All rights reserved.</p>
        <p className="mt-2 text-slate-300 text-xs uppercase tracking-widest flex justify-center items-center gap-2 font-mono">
          Dev From <Zap size={10} className="text-indigo-400" /> India
        </p>
      </footer>

      {/* Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        * {
            -webkit-tap-highlight-color: transparent;
        }
        html {
            scroll-behavior: smooth;
        }
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  )
}
