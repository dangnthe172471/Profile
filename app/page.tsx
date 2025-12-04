"use client"

import type React from "react"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"

// Import icons đồng bộ
import {
  Github,
  ExternalLink,
  Mail,
  MapPin,
  Code,
  Briefcase,
  User,
  ChevronRight,
  Star,
  GitBranch,
  Facebook,
  Phone,
  Calendar,
  Sparkles,
  Zap,
  Menu,
  X,
  Linkedin,
  ZoomIn,
} from "lucide-react"

// Import UI components đồng bộ
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Image Modal Component
const ImageModal = memo(
  ({
    isOpen,
    onClose,
    imageSrc,
    imageAlt,
  }: {
    isOpen: boolean
    onClose: () => void
    imageSrc: string
    imageAlt: string
  }) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose()
        }
      }

      if (isOpen) {
        document.addEventListener("keydown", handleEscape)
        document.body.style.overflow = "hidden"
      }

      return () => {
        document.removeEventListener("keydown", handleEscape)
        document.body.style.overflow = "unset"
      }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
      <div
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="relative w-full h-full">
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={imageAlt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-lg font-semibold bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              {imageAlt}
            </p>
          </div>
        </div>
      </div>
    )
  },
)

// Memoized components
const MouseFollower = memo(({ mousePosition }: { mousePosition: { x: number; y: number } }) => (
  <>
    <div
      className="fixed w-8 h-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full pointer-events-none z-50 opacity-30 transition-all duration-500 ease-out blur-sm"
      style={{
        left: mousePosition.x - 16,
        top: mousePosition.y - 16,
        transform: "scale(1)",
      }}
    />
    <div
      className="fixed w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full pointer-events-none z-50 opacity-60 transition-all duration-300 ease-out"
      style={{
        left: mousePosition.x - 8,
        top: mousePosition.y - 8,
      }}
    />
  </>
))

const AnimatedBackground = memo(() => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Simplified gradient orbs */}
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-300/30 via-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-300/30 via-blue-300/30 to-cyan-300/30 rounded-full blur-3xl animate-pulse animation-delay-1000" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-200/20 via-pink-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse animation-delay-500" />
  </div>
))

const Navigation = memo(
  ({
    isVisible,
    scrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    handleSmoothScroll,
  }: {
    isVisible: boolean
    scrolled: boolean
    mobileMenuOpen: boolean
    setMobileMenuOpen: (open: boolean) => void
    handleSmoothScroll: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void
  }) => {
    const navItems = useMemo(
      () => [
        { href: "#about", label: "About" },
        { href: "#skills", label: "Skills" },
        { href: "#projects", label: "Projects" },
        { href: "#contact", label: "Contact" },
      ],
      [],
    )

    return (
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/80"
            : "bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/60"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`font-bold text-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-700 hover:scale-105 cursor-pointer ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              <Sparkles className="inline w-6 h-6 mr-2 text-blue-500 animate-spin-slow" />
              Nguyen Tien Dang
            </button>

            {/* Desktop Navigation */}
            <div
              className={`hidden md:flex items-center gap-6 transition-all duration-700 delay-200 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
            >
              {navItems.map((item, index) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  className={`text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 hover:scale-105 transition-all duration-300 relative group animation-delay-${index * 100}`}
                  asChild
                >
                  <a href={item.href} onClick={(e) => handleSmoothScroll(e, item.href)}>
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300" />
                  </a>
                </Button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              mobileMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-2 py-4 border-t border-gray-200/50">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 justify-start"
                  asChild
                >
                  <a href={item.href} onClick={(e) => handleSmoothScroll(e, item.href)}>
                    {item.label}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>
    )
  },
)

// Thay thế SkillBar component bằng SkillCard component mới
const SkillCard = memo(({ skill, index }: { skill: any; index: number }) => (
  <Card
    className={`bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 group hover:scale-105 hover:-translate-y-3 animation-delay-${index * 100} relative overflow-hidden`}
  >
    <div
      className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
    />

    <CardContent className="p-8 text-center relative z-10">
      <div
        className={`w-20 h-20 bg-gradient-to-r ${skill.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-xl`}
      >
        <span className="text-3xl">{skill.icon}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-500 mb-3">
        {skill.name}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{skill.description}</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {skill.technologies.map((tech: string, techIndex: number) => (
          <Badge
            key={tech}
            variant="secondary"
            className={`bg-gray-100 text-gray-700 border-0 hover:bg-gray-200 hover:scale-105 transition-all duration-300 animation-delay-${techIndex * 50} px-2 py-1 text-xs`}
          >
            {tech}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
))

const SkillBar = memo(({ skill, index }: { skill: any; index: number }) => (
  <div className={`group animation-delay-${index * 200}`}>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <span className="text-3xl">{skill.icon}</span> {/* Removed animate-bounce */}
        <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-500">
          {skill.name}
        </span>
      </div>
      <span className="text-xl text-gray-600 font-semibold group-hover:text-blue-600 transition-colors duration-500">
        {skill.level}%
      </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
      <div
        className={`h-full ${skill.color} rounded-full transition-all duration-2000 ease-out group-hover:animate-pulse shadow-lg relative overflow-hidden`}
        style={{ width: `${skill.level}%` }}
      >
        <div className="absolute inset-0 bg-white/30 animate-shimmer" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-slide" />
      </div>
    </div>
  </div>
))

const ProjectCard = memo(
  ({
    project,
    index,
    onImageClick,
  }: {
    project: any
    index: number
    onImageClick: (imageSrc: string, imageAlt: string) => void
  }) => {
    const [imageLoading, setImageLoading] = useState(true)
    const [imageError, setImageError] = useState(false)

    return (
      <Card
        className={`bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 group hover:scale-105 hover:-translate-y-3 animation-delay-${index * 100} relative overflow-hidden`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        />

        {/* Clickable Image with Zoom Effect */}
        <div
          className="relative h-48 overflow-hidden cursor-pointer group/image"
          onClick={() => onImageClick(project.image || "/placeholder.svg", `${project.name} - Demo Screenshot`)}
        >
          <Image
            src={project.image || "/placeholder.svg"}
            alt={`${project.name} - Demo Screenshot`}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoading ? "blur-sm" : "blur-0"
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
            loading="lazy"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Zoom Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover/image:opacity-100 transform scale-50 group-hover/image:scale-100 transition-all duration-300 shadow-lg">
              <ZoomIn className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <Badge
              className={`bg-gradient-to-r ${project.gradient} text-white px-4 py-2 text-base hover:scale-110 transition-transform duration-300 shadow-lg`}
            >
              {project.category}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all duration-300"
              asChild
            >
              <Link href={`https://github.com/${project.repo}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-5 h-5" />
              </Link>
            </Button>
          </div>
          <CardTitle className="text-2xl text-gray-800 group-hover:text-blue-600 transition-colors duration-500 mb-4">
            {project.name}
          </CardTitle>
          <CardDescription className="text-gray-600 leading-relaxed text-base">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-wrap gap-3 mb-6">
            {project.tech.map((tech: string, techIndex: number) => (
              <Badge
                key={tech}
                variant="secondary"
                className={`bg-gray-100 text-gray-700 border-0 hover:bg-gray-200 hover:scale-110 transition-all duration-300 animation-delay-${techIndex * 50} px-3 py-1 text-sm`}
              >
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-6 text-base text-gray-500">
            <div className="flex items-center gap-2 hover:text-yellow-500 transition-colors duration-300">
              <Star className="w-5 h-5 text-yellow-500 animate-pulse" />
              <span>{project.stars}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-300">
              <GitBranch className="w-5 h-5 animate-pulse" />
              <span>{project.forks}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  },
)

export default function ProfilePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null)

  // Image modal handlers
  const handleImageClick = useCallback((imageSrc: string, imageAlt: string) => {
    setModalImage({ src: imageSrc, alt: imageAlt })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModalImage(null)
  }, [])

  // Optimized smooth scroll function
  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId.replace("#", ""))
    if (targetElement) {
      const headerHeight = 80
      const targetPosition = targetElement.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
    setMobileMenuOpen(false)
  }, [])

  // Throttled mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    })
  }, [])

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      const isScrolled = window.scrollY > 50
      setScrolled(isScrolled)
    })
  }, [])

  useEffect(() => {
    const removeV0Branding = () => {
      const v0Elements = document.querySelectorAll('[id*="v0-built-with-button"]')
      v0Elements.forEach((element) => {
        element.remove()
      })
    }

    removeV0Branding()
    const timer = setTimeout(removeV0Branding, 1000)
    setIsVisible(true)

    // Add passive listeners for better performance
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [handleScroll, handleMouseMove])

  // Memoized data
  const projects = useMemo(
    () => [
      {
        name: "CareU - Cleaning Service Platform",
        description:
          "Full-stack cleaning service booking platform with .NET Core API backend and Next.js frontend, featuring JWT authentication, real-time notifications, and comprehensive booking management",
        repo: "dangnthe172471/exe201",
        tech: [".NET Core 8", "Next.js 15", "SQL Server", "JWT", "TypeScript"],
        category: "Full-Stack",
        stars: 25,
        forks: 8,
        gradient: "from-emerald-500 to-teal-600",
        image: "/images/careu.png",
      },
      {
        name: "Watch Shop - E-commerce Platform",
        description:
          "Comprehensive watch retail platform with multi-role system (Admin, Manager, Shipper, Customer), VNPay integration, Google OAuth, and Dialogflow chatbot",
        repo: "dangnthe172471/Watch-Shop",
        tech: ["Java", "JSP", "SQL Server", "VNPay", "Google OAuth", "Bootstrap"],
        category: "E-commerce",
        stars: 32,
        forks: 15,
        gradient: "from-blue-500 to-indigo-600",
        image: "/images/watchshop.png",
      },
      {
        name: "BookingTour - Travel Booking System",
        description:
          "Modern travel booking platform with microservices architecture, featuring .NET Core API backend, Angular frontend, JWT authentication, and comprehensive tour management",
        repo: "trongbinf/BookingTourV1",
        tech: [".NET Core 8", "Angular 18", "SQL Server", "JWT", "TypeScript"],
        category: "Tourism",
        stars: 28,
        forks: 12,
        gradient: "from-orange-500 to-red-600",
        image: "/images/booking-tour.png",
      },
      {
        name: "ShoesShop - Online Shoe Store",
        description:
          "E-commerce platform specializing in branded shoes (Adidas, Nike, Skechers, Converse) with VNPay payment integration, AJAX search, and comprehensive admin dashboard",
        repo: "dangnthe172471/ShoesShop",
        tech: ["Java Servlet", "JSP", "SQL Server", "VNPay", "jQuery", "Bootstrap"],
        category: "E-commerce",
        stars: 22,
        forks: 9,
        gradient: "from-purple-500 to-pink-600",
        image: "/images/shoesshop.png",
      },
      {
        name: "English Exam - Testing System",
        description:
          "Desktop WPF application for English multiple-choice exams with automatic and manual test creation, real-time scoring, and comprehensive question bank management",
        repo: "dangnthe172471/English-Exam",
        tech: [".NET 8", "WPF", "Entity Framework", "SQL Server", "XAML"],
        category: "Education",
        stars: 18,
        forks: 6,
        gradient: "from-cyan-500 to-blue-600",
        image: "/images/english-exam.png",
      },
      {
        name: "GreenShop - Eco E-commerce",
        description:
          "Modern eco-friendly e-commerce platform with ASP.NET Core Razor Pages, SignalR real-time features, Google OAuth, JWT authentication, and comprehensive voucher system",
        repo: "dangnthe172471/prn222",
        tech: ["ASP.NET Core 8", "Razor Pages", "SignalR", "Google OAuth", "SQL Server"],
        category: "E-commerce",
        stars: 20,
        forks: 7,
        gradient: "from-green-500 to-emerald-600",
        image: "/images/greenshop.png",
      },
      {
        name: "Zombie Survival Game",
        description:
          "Unity 2D top-down shooter with multiple enemy types, RPG progression system, A* pathfinding AI, save/load functionality, and procedural difficulty scaling",
        repo: "dangnthe172471/PRU212",
        tech: ["Unity 2022.3", "C#", "A* Pathfinding", "2D Graphics", "Audio System"],
        category: "Game Dev",
        stars: 24,
        forks: 11,
        gradient: "from-amber-500 to-orange-600",
        image: "/images/game2d.png",
      },
      {
        name: "PRM392 - Mobile Development",
        description:
          "Advanced Android application development using modern SDK with Material Design patterns, demonstrating mobile UI/UX best practices and native Android features",
        repo: "dangnthe172471/PRM392",
        tech: ["Android SDK", "Java", "Material Design", "SQLite", "Retrofit"],
        category: "Mobile",
        stars: 16,
        forks: 5,
        gradient: "from-green-500 to-emerald-600",
        image: "/images/prm392.png",
      },
      {
        name: "PRN232 - .NET Advanced",
        description:
          "Advanced .NET programming project demonstrating Entity Framework Core, modern C# patterns, LINQ operations, and enterprise-level application architecture",
        repo: "dangnthe172471/prn232",
        tech: [".NET Core", "Entity Framework", "C#", "LINQ", "SQL Server"],
        category: "Backend",
        stars: 12,
        forks: 4,
        gradient: "from-violet-500 to-purple-600",
        image: "/images/careu.png",
      },
    ],
    [],
  )

  // Cập nhật dữ liệu skills với format mới
  const skills = useMemo(
    () => [
      {
        name: "Backend Development",
        icon: "🔧",
        gradient: "from-blue-500 to-indigo-600",
        description: "Server-side development with robust APIs and database management",
        technologies: ["Java", "C#", ".NET Core", "Spring Boot", "Entity Framework"],
      },
      {
        name: "Frontend Development",
        icon: "🎨",
        gradient: "from-cyan-500 to-blue-500",
        description: "Modern web interfaces with responsive design and user experience",
        technologies: ["React", "Angular", "Next.js", "TypeScript", "Tailwind CSS"],
      },
      {
        name: "Mobile Development",
        icon: "📱",
        gradient: "from-green-500 to-emerald-500",
        description: "Native and cross-platform mobile applications",
        technologies: ["Android SDK", "Java", "Kotlin", "Material Design", "SQLite"],
      },
      {
        name: "Database Management",
        icon: "🗄️",
        gradient: "from-purple-500 to-violet-500",
        description: "Database design, optimization and data management solutions",
        technologies: ["SQL Server", "MySQL", "PostgreSQL", "MongoDB", "Redis"],
      },
      {
        name: "Game Development",
        icon: "🎮",
        gradient: "from-amber-500 to-orange-500",
        description: "Interactive games and multimedia applications",
        technologies: ["Unity", "C#", "2D/3D Graphics", "Game Physics", "Audio Systems"],
      },
      {
        name: "DevOps & Tools",
        icon: "⚙️",
        gradient: "from-gray-600 to-slate-600",
        description: "Development tools, version control and deployment automation",
        technologies: ["Git", "Docker", "CI/CD", "Azure", "Visual Studio"],
      },
      {
        name: "Web Technologies",
        icon: "🌐",
        gradient: "from-rose-500 to-pink-500",
        description: "Full-stack web development with modern frameworks",
        technologies: ["HTML5", "CSS3", "JavaScript", "Node.js", "REST APIs"],
      },
      {
        name: "Software Architecture",
        icon: "🏗️",
        gradient: "from-teal-500 to-cyan-500",
        description: "System design patterns and scalable application architecture",
        technologies: ["Microservices", "MVC", "Clean Architecture", "Design Patterns", "SOLID"],
      },
    ],
    [],
  )

  const personalInfo = useMemo(
    () => [
      {
        icon: Calendar,
        title: "Date of Birth",
        content: "March 19, 2003",
        gradient: "from-blue-500 via-indigo-500 to-purple-500",
        delay: "delay-100",
      },
      {
        icon: MapPin,
        title: "Hometown",
        content: "Dong Nguyen, Tu Son",
        subtitle: "Bac Ninh Province",
        gradient: "from-green-500 via-emerald-500 to-teal-500",
        delay: "delay-300",
      },
      {
        icon: Phone,
        title: "Contact",
        content: "0962900476",
        gradient: "from-purple-500 via-pink-500 to-rose-500",
        delay: "delay-500",
      },
    ],
    [],
  )

  const contactInfo = useMemo(
    () => [
      {
        icon: Mail,
        title: "Email",
        content: "dangntt193@gmail.com",
        href: "mailto:dangntt193@gmail.com",
        gradient: "from-red-500 via-pink-500 to-rose-500",
        hoverColor: "hover:text-red-500",
      },
      {
        icon: Phone,
        title: "Phone",
        content: "0962900476",
        href: "tel:0962900476",
        gradient: "from-green-500 via-emerald-500 to-teal-500",
        hoverColor: "hover:text-green-500",
      },
      {
        icon: MapPin,
        title: "Location",
        content: "Bac Ninh, Vietnam",
        gradient: "from-blue-500 via-indigo-500 to-purple-500",
        hoverColor: "hover:text-blue-500",
      },
    ],
    [],
  )

  const socialLinks = useMemo(
    () => [
      {
        icon: Github,
        href: "https://github.com/dangnthe172471",
        hoverBg: "hover:bg-gray-800",
        gradient: "from-gray-600 to-gray-800",
      },
      {
        icon: Linkedin,
        href: "https://www.linkedin.com/in/%C4%91%C4%83ng-nguy%E1%BB%85n-ti%E1%BA%BFn-b62461374",
        hoverBg: "hover:bg-blue-600",
        gradient: "from-blue-600 to-blue-700",
      },
      {
        icon: Mail,
        href: "mailto:dangntt193@gmail.com",
        hoverBg: "hover:bg-red-500",
        gradient: "from-red-500 to-pink-500",
      },
      {
        icon: Facebook,
        href: "https://facebook.com",
        hoverBg: "hover:bg-blue-600",
        gradient: "from-blue-500 to-indigo-500",
      },
      {
        icon: Phone,
        href: "tel:0962900476",
        hoverBg: "hover:bg-green-500",
        gradient: "from-green-500 to-emerald-500",
      },
    ],
    [],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <MouseFollower mousePosition={mousePosition} />
      <AnimatedBackground />

      {/* Image Modal */}
      <ImageModal
        isOpen={!!modalImage}
        onClose={handleCloseModal}
        imageSrc={modalImage?.src || ""}
        imageAlt={modalImage?.alt || ""}
      />

      <Navigation
        isVisible={isVisible}
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        handleSmoothScroll={handleSmoothScroll}
      />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-6 text-center relative z-10">
            <div
              className={`relative w-64 h-64 mx-auto mb-12 group transition-all duration-1000 ${isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-700 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 rounded-full blur-3xl opacity-20 group-hover:opacity-50 transition-all duration-900 animate-pulse animation-delay-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full blur-xl opacity-25 group-hover:opacity-45 transition-all duration-600 animate-pulse animation-delay-600" />

              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/80 shadow-2xl group-hover:shadow-3xl transition-all duration-700 hover:scale-110">
                {" "}
                {/* Removed hover:rotate-3 */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20" />
                <Image
                  src="/profile.png"
                  alt="Nguyen Tien Dang - Full Stack Developer and Software Engineering Student"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                  sizes="256px"
                  quality={90}
                />
              </div>
            </div>

            <h1
              className={`text-4xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              Nguyen Tien Dang
            </h1>

            <div
              className={`flex items-center justify-center gap-4 mb-10 transition-all duration-1000 delay-500 ${isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-24 animate-pulse" />
              <div className="relative">
                <Code className="w-8 h-8 text-blue-500 animate-bounce" />
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-30 animate-pulse" />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent flex-1 max-w-24 animate-pulse" />
            </div>

            <p
              className={`text-xl md:text-3xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed font-medium transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <Zap className="inline w-7 h-7 mr-3 text-yellow-500 animate-pulse" />
              Full-Stack Developer & Software Engineering Student
            </p>

            <p
              className={`text-lg md:text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-900 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              Passionate about creating innovative solutions with modern technologies. Specialized in enterprise
              applications, mobile development, and web platforms with a focus on scalable and maintainable code.
            </p>

            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-10 text-gray-600 mb-16 transition-all duration-1000 delay-1100 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm px-6 md:px-8 py-4 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
                <MapPin className="w-6 h-6 text-blue-500 animate-pulse group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold text-sm md:text-lg">Dong Nguyen, Tu Son, Bac Ninh</span>
              </div>
              <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm px-6 md:px-8 py-4 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
                <Briefcase className="w-6 h-6 text-green-500 animate-pulse group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold text-sm md:text-lg">Available for opportunities</span>
              </div>
            </div>

            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-8 transition-all duration-1000 delay-1300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 px-8 py-4 text-lg font-semibold"
                asChild
              >
                <Link href="https://github.com/dangnthe172471" target="_blank" rel="noopener noreferrer">
                  <Github className="w-6 h-6 mr-3" />
                  View GitHub
                  <ChevronRight className="w-5 h-5 ml-3 animate-pulse" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 px-8 py-4 text-lg font-semibold"
                asChild
              >
                <a href="#contact" onClick={(e) => handleSmoothScroll(e, "#contact")}>
                  <Mail className="w-6 h-6 mr-3" />
                  Get in Touch
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Personal Info Section */}
        <section className="py-20 bg-white/60 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {personalInfo.map((item, index) => (
                  <Card
                    key={index}
                    className={`bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 group hover:scale-105 hover:-translate-y-3 ${item.delay} relative overflow-hidden`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    />

                    <CardContent className="text-center p-10 relative z-10">
                      <div
                        className={`w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-xl`}
                      >
                        <item.icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-gray-800 font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors duration-500">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 font-semibold text-lg">{item.content}</p>
                      {item.subtitle && <p className="text-gray-500 text-base mt-1">{item.subtitle}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-28">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  About Me
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto rounded-full animate-pulse shadow-lg" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-3 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-18 h-18 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 shadow-xl">
                        <User className="w-9 h-9 text-white" />
                      </div>
                      <CardTitle className="text-3xl text-gray-800 group-hover:text-blue-600 transition-colors duration-500">
                        Background
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-gray-600 leading-relaxed text-xl">
                      I&apos;m a dedicated software engineering student born on March 19, 2003, from Dong Nguyen Ward,
                      Tu Son City, Bac Ninh Province. With a passion for creating innovative and scalable solutions, my
                      journey spans across various domains including enterprise applications, mobile development,
                      e-commerce platforms, and game development. I thrive on solving complex problems and learning new
                      technologies.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 hover:scale-105 hover:-translate-y-3 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-18 h-18 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 shadow-xl">
                        <Code className="w-9 h-9 text-white" />
                      </div>
                      <CardTitle className="text-3xl text-gray-800 group-hover:text-green-600 transition-colors duration-500">
                        Expertise
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-gray-600 leading-relaxed text-xl mb-8">
                      Specialized in full-stack development with strong foundations in both backend and frontend
                      technologies. Experience with enterprise-level applications, mobile development, and modern web
                      frameworks.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {["Java", "C#", ".NET", "Android", "React", "Node.js", "Unity", "MySQL"].map((tech, index) => (
                        <Badge
                          key={tech}
                          className={`bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-4 py-2 text-base hover:scale-110 transition-transform duration-300 cursor-pointer animation-delay-${index * 100} shadow-lg`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-28 bg-white/60 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Technical Skills
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto rounded-full animate-pulse shadow-lg" />
              </div>

              {/* Cập nhật phần Skills Section để sử dụng grid layout */}
              {/* Trong phần Skills Section, thay thế: */}
              {/*
              <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-xl p-12 hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />

                <div className="grid gap-10 relative z-10">
                  {skills.map((skill, index) => (
                    <SkillBar key={skill.name} skill={skill} index={index} />
                  ))}
                </div>
              </Card>
              */}

              {/* Bằng: */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {skills.map((skill, index) => (
                  <SkillCard key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-28">
          <div className="container mx-auto px-6">
            <div className="max-w-8xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Featured Projects
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto rounded-full animate-pulse shadow-lg" />
                <p className="text-gray-600 text-xl mt-8 max-w-3xl mx-auto">
                  A showcase of my development journey across various technologies and domains
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {projects.map((project, index) => (
                  <ProjectCard key={project.name} project={project} index={index} onImageClick={handleImageClick} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-28 bg-white/60 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto text-center">
              <div className="mb-20">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Let&apos;s Work Together
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto rounded-full animate-pulse shadow-lg" />
              </div>

              <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-xl p-12 hover:shadow-2xl transition-all duration-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" />

                <CardContent className="relative z-10">
                  <p className="text-xl md:text-2xl text-gray-700 mb-16 leading-relaxed">
                    I&apos;m always excited about new opportunities and collaborations. Whether you have a project in
                    mind, want to discuss technology, or just want to connect, I&apos;d love to hear from you!
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Button
                      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 py-6 text-lg font-semibold"
                      asChild
                    >
                      <Link href="https://github.com/dangnthe172471" target="_blank" rel="noopener noreferrer">
                        <Github className="w-6 h-6 mr-3" />
                        GitHub
                      </Link>
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 py-6 text-lg font-semibold"
                      asChild
                    >
                      <Link
                        href="https://www.linkedin.com/in/%C4%91%C4%83ng-nguy%E1%BB%85n-ti%E1%BA%BFn-b62461374"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="w-6 h-6 mr-3" />
                        LinkedIn
                      </Link>
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-2 py-6 text-lg font-semibold"
                      asChild
                    >
                      <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <Facebook className="w-6 h-6 mr-3" />
                        Facebook
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-20 border-t border-gray-200/50 bg-gradient-to-b from-white/90 to-gray-50/90 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <div className="mb-12">
                  <h3 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                    Nguyen Tien Dang
                  </h3>
                  <div className="w-40 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 mx-auto rounded-full mb-8 animate-pulse shadow-lg" />
                  <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                    Full-Stack Developer passionate about creating innovative solutions and building the future through
                    code.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {contactInfo.map((item, index) => (
                    <Card
                      key={item.title}
                      className={`bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-700 group hover:scale-105 hover:-translate-y-3 animation-delay-${index * 200} relative overflow-hidden`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                      />

                      <CardContent className="p-8 text-center relative z-10">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-xl`}
                        >
                          <item.icon className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-gray-800 font-bold mb-3 text-lg group-hover:text-blue-600 transition-colors duration-500">
                          {item.title}
                        </h4>
                        {item.href ? (
                          <Link
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className={`text-gray-600 ${item.hoverColor} transition-colors font-semibold hover:scale-105 inline-block transition-transform duration-300 text-base`}
                          >
                            {item.content}
                          </Link>
                        ) : (
                          <p className="text-gray-600 font-semibold text-base">{item.content}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-8 mb-16">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={`w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-gray-600 hover:text-white ${social.hoverBg} border border-gray-200/50 hover:border-gray-300 transition-all duration-500 hover:scale-110 hover:-translate-y-2 shadow-xl hover:shadow-2xl animation-delay-${index * 100} group`}
                    >
                      <social.icon className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                    </Link>
                  ))}
                </div>

                <div className="pt-10 border-t border-gray-200/50">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-gray-500 text-base">&copy; 2024 Nguyen Tien Dang. All rights reserved.</p>
                    <div className="flex items-center gap-8 text-base text-gray-500">
                      <span className="hover:text-red-500 transition-colors duration-300 cursor-pointer">
                        Made with ❤️ in Vietnam
                      </span>
                      <span>•</span>
                      <span className="hover:text-blue-500 transition-colors duration-300 cursor-pointer">
                        Built with Next.js & Tailwind CSS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
