import React, { useState, useEffect, useRef } from "react";
import { SunMoonThemeToggle } from "@/components/ui/sun-moon-theme-toggle";
import { submitDonation as submitDonationRequest } from "./api";

interface SlideData {
  bg: string;
  eyebrow: string;
  title: string;
  desc: string;
  btnText?: string;
  btnHref?: string;
}

const slidesData: SlideData[] = [
  {
    bg: "/gallery/vivekanand.png",
    eyebrow: "Aligned with Digital India & NEP 2020",
    title: "Empowering Minds Through Education",
    desc: "Advancing digital literacy, research, and innovation for students, educators, and communities across India.",
    // btnText: "Discover Our Mission",
    // btnHref: "#about",
  },
  {
    bg: "/gallery/award-presendation.png",
    eyebrow: "Digital Literacy Initiative",
    title: "Bridging the Digital Divide",
    desc: "From cyber safety workshops to AI awareness programs — equipping every learner with future-ready skills.",
    // btnText: "Explore Programs",
    // btnHref: "#programs",
  },
  {
    bg: "/gallery/Discussion.png",
    eyebrow: "Research & Innovation",
    title: "Building a Knowledge-Driven Society",
    desc: "Aligned with Digital India and NEP 2020, we nurture curiosity, innovation, and lifelong learning.",
    // btnText: "Our Research",
    // btnHref: "#research",
  },
  {
    bg: "/gallery/lecture.png",
    eyebrow: "Teacher Capacity Building",
    title: "Transforming Educators, Transforming India",
    desc: "Comprehensive teacher development programs that multiply impact and inspire the next generation of learners.",
  },
];

interface GalleryItem {
  src: string;
  full: string;
  alt: string;
  caption: string;
  tag: string;
  title: string;
  desc: string;
  isLogo?: boolean;
}

interface DonationFormData {
  transaction_id: string;
  name: string;
  email: string;
  work: string;
  profession: string;
  address: string;
  miscellaneous: string;
}

const fullGalleryItems: GalleryItem[] = [
  {
    src: "/gallery/gallery_bld_2.png",
    full: "/gallery/gallery_bld_2.png",
    alt: "Teachers engaged in a learning session",
    caption: "Interactive classroom learning session engaging teachers and students.",
    tag: "Programs",
    title: "Learning In Action",
    desc: "Study environments and learner participation that align with the foundation's academic support mission.",
  },
  {
    src: "/gallery/teacher-teaching.png",
    full: "/gallery/teacher-teaching.png",
    alt: "Teacher instructing and mentoring students",
    caption: "Educator mentoring students with modern instructional techniques.",
    tag: "Pedagogy",
    title: "Teacher Mentorship",
    desc: "Equipping educators with modern teaching strategies and student-centric classroom methodologies.",
  },
  {
    src: "/Logo_BLD_Institute tranlucent.png",
    full: "/Logo_BLD_Institute tranlucent.png",
    alt: "BLD Institute of Research and Learning Foundation logo",
    caption: "BLD Institute of Research & Learning Foundation identity mark.",
    tag: "Identity",
    title: "Foundation Branding",
    desc: "The institutional mark that ties together programs, outreach, and communication across the website.",
    isLogo: true,
  },
  {
    src: "/gallery/value-at-bld.png",
    full: "/gallery/value-at-bld.png",
    alt: "Values workshop at BLD Institute",
    caption: "Values and character building workshop at BLDIRL Foundation.",
    tag: "Values",
    title: "Ethics & Character",
    desc: "Instilling core values, ethics, and civic responsibility as essential pillars of holistic academic growth.",
  },
  {
    src: "/gallery/Learning-in-rural.jpeg",
    full: "/gallery/Learning-in-rural.jpeg",
    alt: "Rural digital learning program",
    caption: "Rural students participating in foundational digital literacy programs.",
    tag: "Outreach",
    title: "Rural Digital Inclusion",
    desc: "Bridging the digital divide with foundational tech literacy and experiential learning in rural schools.",
  },
  {
    src: "/gallery/celebrations-at-BLD.png",
    full: "/gallery/celebrations-at-BLD.png",
    alt: "Celebrations at BLD",
    caption: "Annual celebrations and student recognitions at BLD Institute.",
    tag: "Community",
    title: "Milestones & Celebrations",
    desc: "Commemorating student milestones, achievements, and collective progress across our partner schools.",
  },
  {
    src: "/gallery/award-presendation.png",
    full: "/gallery/award-presendation.png",
    alt: "Award presentation ceremony",
    caption: "Award ceremony honoring excellence in education and community service.",
    tag: "Recognition",
    title: "Excellence Awards",
    desc: "Honoring educators and learners who demonstrate exemplary dedication to learning and community advancement.",
  },
  {
    src: "/gallery/Discussion.png",
    full: "/gallery/Discussion.png",
    alt: "Academic discourse and roundtable discussion",
    caption: "Academic and research roundtable discussion with faculty and partners.",
    tag: "Research",
    title: "Academic Discourse",
    desc: "Convening educators, researchers, and partners to discuss pedagogical innovation and curriculum development.",
  },
  {
    src: "/gallery/lecture.png",
    full: "/gallery/lecture.png",
    alt: "Guest lecture and masterclass presentation",
    caption: "Specialized guest lecture and seminar session for educators and learners.",
    tag: "Academics",
    title: "Lectures & Masterclasses",
    desc: "Expert-led presentations delivering specialized insights and contemporary knowledge to our learning community.",
  },
  {
    src: "/gallery/vivekanand.png",
    full: "/gallery/vivekanand.png",
    alt: "Inspirational tribute and reflection session",
    caption: "Inspirational ideals and cultural tribute session at BLD Institute.",
    tag: "Heritage",
    title: "Inspirational Ideals",
    desc: "Drawing strength from visionary thinkers whose ideals shape our institution's philosophy and vision.",
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "gallery">("home");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [donationForm, setDonationForm] = useState<DonationFormData>({
    transaction_id: "",
    name: "",
    email: "",
    work: "",
    profession: "",
    address: "",
    miscellaneous: "",
  });
  const [donationStatus, setDonationStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [donationMessage, setDonationMessage] = useState("");
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; caption: string; alt: string }>({
    open: false,
    src: "",
    caption: "",
    alt: "",
  });

  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Slider controls
  const goToSlide = (index: number) => {
    setCurrentSlide((index + slidesData.length) % slidesData.length);
    resetAuto();
  };

  const changeSlide = (dir: number) => {
    goToSlide(currentSlide + dir);
  };

  const resetAuto = () => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 5500);
  };

  useEffect(() => {
    if (currentView === "home") {
      resetAuto();
      return () => {
        if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      };
    }
  }, [currentView]);

  // Keyboard navigation for slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightbox.open) {
        if (e.key === "Escape") setLightbox((prev) => ({ ...prev, open: false }));
        return;
      }
      if (currentView === "home") {
        if (e.key === "ArrowLeft") changeSlide(-1);
        if (e.key === "ArrowRight") changeSlide(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, lightbox.open, currentView]);

  // Scroll listener for progress bar and navbar background
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setNavScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentView]);

  const openLightbox = (item: { full: string; caption: string; alt: string }) => {
    setLightbox({ open: true, src: item.full, caption: item.caption, alt: item.alt });
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, open: false }));
    document.body.classList.remove("lightbox-open");
  };

  const navigateTo = (view: "home" | "gallery", hash?: string) => {
    setCurrentView(view);
    setActiveSection(view === "gallery" ? "gallery" : hash?.replace("#", "") || "home");
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const submitDonation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDonationStatus("submitting");
    setDonationMessage("");

    try {
      await submitDonationRequest(donationForm);

      setDonationForm({
        transaction_id: "",
        name: "",
        email: "",
        work: "",
        profession: "",
        address: "",
        miscellaneous: "",
      });
      setDonationStatus("success");
      setDonationMessage("Thank you. Your transaction details have been submitted for verification.");
    } catch (error) {
      setDonationStatus("error");
      const message = error instanceof Error ? error.message : "Donation submission failed.";
      setDonationMessage(
        message === "Donation API is not configured."
          ? "The donation service is not connected yet. Please email these details to dhirendra.san@gmail.com to confirm your contribution."
          : message,
      );
    }
  };

  return (
    <div className={currentView === "gallery" ? "gallery-page" : ""}>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Main Navigation Bar */}
      <nav
        id="main-nav"
        className={navScrolled ? "nav-scrolled" : ""}
      >
        <a
          href="#home"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("home", "#home");
          }}
        >
          <img
            className="nav-logo-image"
            src="/Logo_BLD_Institute tranlucent.png"
            alt="BLD Institute of Research & Learning Foundation logo"
          />
          <div className="nav-logo-text">
            BLDIRL Foundation
            <span>Empowering Minds</span>
          </div>
        </a>

        <ul className={`nav-links ${mobileMenuOpen ? "open" : ""}`} id="nav-links">
          <li>
            <a
              href="#home"
              className={activeSection === "home" ? "nav-current" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("home", "#home");
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className={activeSection === "about" ? "nav-current" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("home", "#about");
              }}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#programs"
              className={activeSection === "programs" ? "nav-current" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("home", "#programs");
              }}
            >
              Programs
            </a>
          </li>
          <li>
            <a
              href="#impact"
              className={activeSection === "impact" ? "nav-current" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("home", "#impact");
              }}
            >
              Impact
            </a>
          </li>
          <li>
            <a
              href="#research"
              className={activeSection === "research" ? "nav-current" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("home", "#research");
              }}
            >
              Research
            </a>
          </li>
          <li>
            <a
              href="#news"
              className={activeSection === "news" ? "nav-current" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("home", "#news");
              }}
            >
              News
            </a>
          </li>
          <li>
            <a
              href="#gallery"
              className={activeSection === "gallery" ? "nav-current" : ""}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("gallery");
              }}
            >
              Gallery
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className={`nav-cta ${activeSection === "contact" ? "nav-current" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("home", "#contact");
              }}
            >
              Contact Us
            </a>
          </li>
          <li>
            <a
              href="#donate"
              className={`nav-donate ${activeSection === "donate" ? "nav-current" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigateTo("home", "#donate");
              }}
            >
              <span className="nav-donate-heart" aria-hidden="true">♥</span> Donate Now
            </a>
          </li>
          {/* Integrated Sun-Moon Theme Toggle */}
          <li className="flex items-center pl-2">
            <SunMoonThemeToggle size={38} duration={1400} sky={true} />
          </li>
        </ul>

        <div className="hamburger" id="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* FULL GALLERY PAGE (From bldirl-v1/gallery.html) */}
      {currentView === "gallery" && (
        <main className="pt-[68px]">
          {/* Gallery Page Hero */}
          <section id="gallery-page-hero" className="gallery-page-hero">
            <div className="section-inner">
              <div className="gallery-page-grid">
                <div>
                  <div className="section-label">Photo Archive</div>
                  <h1 className="section-title gallery-page-title">Our Gallery</h1>
                  <div className="section-divider"></div>
                  <p className="section-lead">
                    A dedicated space for program visuals, workshop highlights, and moments that reflect the
                    foundation's work in education, research, and digital inclusion.
                  </p>
                  <div className="gallery-page-actions">
                    <a href="#gallery-collection" className="gallery-link-btn">
                      Browse Collection
                    </a>
                    <a
                      href="#home"
                      className="gallery-link-btn gallery-link-btn--ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo("home", "#home");
                      }}
                    >
                      &larr; Back to Home
                    </a>
                  </div>
                </div>

                <div className="gallery-page-stats">
                  <article className="gallery-stat-card">
                    <span className="gallery-stat-number">10+</span>
                    <span className="gallery-stat-label">Curated Moments</span>
                  </article>
                  <article className="gallery-stat-card">
                    <span className="gallery-stat-number">4</span>
                    <span className="gallery-stat-label">Story Themes</span>
                  </article>
                  <article className="gallery-stat-card">
                    <span className="gallery-stat-number">1</span>
                    <span className="gallery-stat-label">Click-To-Preview Lightbox</span>
                  </article>
                </div>
              </div>
            </div>
          </section>

          {/* Spotlight Section */}
          <section id="gallery-spotlight-section" className="gallery-spotlight-section">
            <div className="section-inner">
              <div className="gallery-spotlight">
                <button
                  className="gallery-trigger gallery-spotlight-media"
                  type="button"
                  onClick={() =>
                    openLightbox({
                      full: "/gallery/gallery_bld.png",
                      alt: "Director and leadership team in strategic session",
                      caption: "Director and leadership team engaged in educational planning and strategy at BLD Institute.",
                    })
                  }
                >
                  <img src="/gallery/gallery_bld.png" alt="Director and leadership team in strategic session" />
                </button>

                <div className="gallery-spotlight-copy">
                  <div className="section-label">Featured Frame</div>
                  <h2>Collaboration That Shapes Programs</h2>
                  <p>
                    From planning workshops to reviewing outcomes, the foundation's work is built through
                    collaborative thinking, research-led discussion, and practical action.
                  </p>
                  <div className="gallery-highlight-points">
                    <span>Workshop planning</span>
                    <span>Team dialogue</span>
                    <span>Education strategy</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Collection Grid */}
          <section id="gallery-collection" className="gallery-collection">
            <div className="section-inner">
              <div className="section-label">Collection</div>
              <h2 className="section-title">Programs, Research, and Foundation Moments</h2>
              <div className="section-divider"></div>
              <p className="gallery-section-copy gallery-section-copy--dark">
                Visual documentation capturing our active classrooms, teacher enablement workshops, community
                gatherings, and research seminars across our partner schools.
              </p>

              <div className="gallery-grid-full">
                {fullGalleryItems.map((item, index) => (
                  <article key={index} className="gallery-card">
                    <button
                      className={`gallery-trigger ${item.isLogo ? "gallery-trigger--logo" : ""}`}
                      type="button"
                      onClick={() => openLightbox(item)}
                    >
                      <img src={item.src} alt={item.alt} loading="lazy" />
                    </button>
                    <div className="gallery-card-copy gallery-card-copy--dark">
                      <span className="gallery-card-tag">{item.tag}</span>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* VIEW 3: MAIN HOME WEBSITE (Exact bldirl-v1/index.html sections) */}
      {currentView === "home" && (
        <main>
          {/* ORIGINAL HERO SLIDER */}
          <section id="home">
            <div
              className="slides-track"
              id="slidesTrack"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slidesData.map((slide, index) => (
                <div key={index} className={`slide ${currentSlide === index ? "active" : ""}`}>
                  <div className="slide-bg" style={{ backgroundImage: `url('${slide.bg}')` }}></div>
                  <div className="slide-overlay"></div>
                  <div className="slide-content">
                    <div className="slide-eyebrow">{slide.eyebrow}</div>
                    <h1 className="slide-title">{slide.title}</h1>
                    <p className="slide-desc">{slide.desc}</p>
                    {slide.btnText && (
                      <a href={slide.btnHref} className="slide-btn">
                        {slide.btnText}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="slider-arrow prev"
              onClick={() => changeSlide(-1)}
              aria-label="Previous slide"
            >
              &#8592;
            </button>
            <button
              className="slider-arrow next"
              onClick={() => changeSlide(1)}
              aria-label="Next slide"
            >
              &#8594;
            </button>

            <div className="slider-dots" id="sliderDots">
              {slidesData.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${currentSlide === index ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </section>

          {/* ABOUT SECTION */}
          <section id="about">
            <div className="section-inner">
              <div className="about-grid">
                <div className="about-visual">
                  <div className="about-img-frame">
                    <div className="about-img-placeholder">
                      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="10" width="48" height="38" rx="3" stroke="currentColor" stroke-width="2" />
                        <path d="M8 22h48" stroke="currentColor" stroke-width="2" />
                        <circle cx="16" cy="16" r="2" fill="currentColor" />
                        <circle cx="24" cy="16" r="2" fill="currentColor" />
                        <path d="M20 32h24M20 38h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                      </svg>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", letterSpacing: "1px", opacity: 0.5 }}>
                        BLD FOUNDATION
                      </span>
                    </div>
                  </div>
                  <div className="about-badge">
                    <div className="about-badge-num">§8</div>
                    <div className="about-badge-text">Non-Profit Org</div>
                  </div>
                </div>

                <div>
                  <div className="section-label">Who We Are</div>
                  <h2 className="section-title">BLD Institute of Research & Learning Foundation</h2>
                  <div className="section-divider"></div>
                  <p className="section-lead">
                    The BLD Institute of Research and Learning (BLDIRL) Foundation, established on 14 February 
                    2020 as a not-for-profit Section 8 company, is committed to making education accessible, practical, 
                    and impactful. It promotes scientific thinking, technological innovation, entrepreneurship, skill 
                    development, public health awareness, environmental conservation, and social welfare, particularly 
                    across Delhi NCR and remote areas of Uttar Pradesh.

                    By connecting students and communities with academicians, researchers, and professionals, BLDIRL 
                    strives to foster innovation, empower communities, and build an educated, inclusive, and socially 
                    responsible nation.
                  </p>
                </div>
                <div className="vm-cards">
                  <div className="vm-card">
                    <h4>Our Vision</h4>
                    <p>
                      To contribute towards building an educated, innovative, healthy, environmentally conscious, and socially responsible 
                      India where individuals and communities have greater opportunities to learn,
                       grow, and contribute to national development.
                    </p>
                  </div>
                  <div className="vm-card">
                    <h4>Our Mission</h4>
                    <p>
                      Our Mission
                          <p>1. To promote educational interest, scientific thinking, technological temperament and entrepreneurship awareness among students. </p>
                          <p>2. To promote health literacy, environmental responsibility, animal welfare, and constitutional awareness as social responsibility by knowledge-sharing, expert collaboration, and socially beneficial initiatives. </p>
                          <p>3. To bridge the gap between knowledge and opportunity by encouraging informed participation, creative thinking, and responsible citizenship.</p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PROGRAMS SECTION */}
          <section id="programs">
            <div className="section-inner">
              <div className="section-label">What We Do</div>
              <h2 className="section-title">Our Focus Areas & Programs</h2>
              <div className="section-divider"></div>
              <p className="section-lead">
                Eight interconnected pillars that guide every initiative, workshop, and partnership we undertake.
              </p>
              <div className="focus-grid">
                <div className="focus-card">
                  <div className="focus-icon">💻</div>
                  <h3>Education and Inclusive Learning</h3>
                  <p>We empower underprivileged students through educational opportunities, 
                    academic guidance, and knowledge-sharing initiatives.</p>
                </div>
                <div className="focus-card">
                  <div className="focus-icon">🤖</div>
                  <h3>Entrepreneurship and Career Awareness</h3>
                  <p>We empower undergraduate and postgraduate students through entrepreneurship, 
                    leadership, career guidance, and professional development initiatives.</p>
                </div>
                <div className="focus-card">
                  <div className="focus-icon">📚</div>
                  <h3>Science, Technology and Innovation</h3>
                  <p>We promote science and technology by fostering scientific curiosity, 
                    research, creative thinking, and innovation among students and faculty.</p>
                </div>
                <div className="focus-card">
                  <div className="focus-icon">🎓</div>
                  <h3>Health Awareness</h3>
                  <p>We promote public health awareness through education on cancer, lifestyle-related diseases, and preventive healthcare.</p>
                </div>
                <div className="focus-card">
                  <div className="focus-icon">🔬</div>
                  <h3>Environmental Protection</h3>
                  <p>We promote environmental sustainability through water conservation, clean air, pollution prevention, and responsible resource use.</p>
                </div>
                <div className="focus-card">
                  <div className="focus-icon">📊</div>
                  <h3>Animal Welfare</h3>
                  <p>We promote animal compassion, cow care, animal protection, and responsible welfare initiatives.</p>
                </div>
                <div className="focus-card">
                  <div className="focus-icon">🌱</div>
                  <h3>Constitutional and Legal Literacy</h3>
                  <p>We aim to encourage public understanding of the Constitution of India, fundamental rights and 
                    duties, and relevant legal provisions to promote informed and responsible citizenship.</p>
                </div>
                <div className="focus-card">
                  <div className="focus-icon">🤝</div>
                  <h3>Community Empowerment</h3>
                  <p>Grassroots programs that uplift communities through knowledge, awareness, and inclusion.</p>
                </div>
              </div>
            </div>
          </section>

          {/* IMPACT SECTION */}
          <section id="impact">
            <div className="section-inner">
              <div className="section-label">Our Reach</div>
              <h2 className="section-title">Projects & Impact</h2>
              <div className="section-divider"></div>
              <div className="stats-row">
                <div className="stat-box">
                  <div className="stat-num">1000+</div>
                  <div className="stat-label">Students Reached</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">100+</div>
                  <div className="stat-label">Teachers Trained</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">20+</div>
                  <div className="stat-label">Workshops Conducted</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">10+</div>
                  <div className="stat-label">Schools Partnered</div>
                </div>
              </div>
              <div className="section-label" style={{ marginBottom: "20px" }}>
                Key Initiatives
              </div>
              <div className="initiatives-grid">
                <div className="initiative-item">
                  <div className="initiative-dot"></div>
                  <p>Digital literacy workshops for school and college students</p>
                </div>
                <div className="initiative-item">
                  <div className="initiative-dot"></div>
                  <p>Robotics and coding clubs for school students</p>
                </div>
                <div className="initiative-item">
                  <div className="initiative-dot"></div>
                  <p>IPR and patent filing support for innovators</p>
                </div>
                <div className="initiative-item">
                  <div className="initiative-dot"></div>
                  <p>Teacher professional development programs</p>
                </div>
                <div className="initiative-item">
                  <div className="initiative-dot"></div>
                  <p>School innovation and STEM clubs</p>
                </div>
              </div>
            </div>
          </section>

          {/* NEWS SECTION
          <section id="news">
            <div className="section-inner">
              <div className="section-label">Stay Updated</div>
              <h2 className="section-title">News & Events</h2>
              <div className="section-divider"></div>
              <div className="news-grid">
                <div className="news-card">
                  <div className="news-img">📰</div>
                  <div className="news-body">
                    <div className="news-date">December 2024</div>
                    <h3>Digital Literacy Camp — Winter Edition</h3>
                    <p>
                      A 3-day residential camp for 200 students from rural schools, focused on foundational
                      computing and internet safety.
                    </p>
                    <a href="#news" className="news-link">
                      Read More →
                    </a>
                  </div>
                </div>
                <div className="news-card">
                  <div className="news-img">🎤</div>
                  <div className="news-body">
                    <div className="news-date">October 2024</div>
                    <h3>Teacher's AI Readiness Summit 2024</h3>
                    <p>
                      A full-day summit bringing together 150 educators to explore AI integration in classroom
                      teaching.
                    </p>
                    <a href="#news" className="news-link">
                      Read More →
                    </a>
                  </div>
                </div>
                <div className="news-card">
                  <div className="news-img">🏫</div>
                  <div className="news-body">
                    <div className="news-date">August 2024</div>
                    <h3>Innovation Club Launch — 10 Schools</h3>
                    <p>
                      BLDIRL launched STEM Innovation Clubs in 10 partner schools across the region, engaging 500+
                      students.
                    </p>
                    <a href="#news" className="news-link">
                      Read More →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          {/* GALLERY PREVIEW SECTION */}
          <section id="gallery">
            <div className="section-inner">
              <div className="gallery-section-head">
                <div>
                  <div className="section-label">Moments & Memories</div>
                  <h2 className="section-title">Gallery</h2>
                  <div className="section-divider"></div>
                  <p className="gallery-section-copy">
                    Glimpses into our classrooms, teacher enablement workshops, academic roundtables, and student
                    community milestones.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => navigateTo("gallery")}
                    className="gallery-link-btn"
                  >
                    View Full Gallery &rarr;
                  </button>
                </div>
              </div>

              <div className="gallery-preview-grid">
                <article className="gallery-card gallery-card--feature">
                  <button
                    className="gallery-trigger"
                    type="button"
                    onClick={() =>
                      openLightbox({
                        full: "/gallery/gallery_bld.png",
                        alt: "Director and leadership team at BLD Institute",
                        caption:
                          "Director and leadership team engaged in educational planning and strategy at BLD Institute.",
                      })
                    }
                  >
                    <img
                      src="/gallery/gallery_bld.png"
                      alt="Director and leadership team at BLD Institute"
                      loading="lazy"
                    />
                  </button>
                  <div className="gallery-card-copy">
                    <span className="gallery-card-tag">Leadership</span>
                    <h3>Strategy & Vision</h3>
                    <p>
                      Collaborative dialogues shaping the foundation's academic roadmap, teacher development
                      programs, and research priorities.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* DONATION SECTION */}
          <section id="donate" className="donation-section">
            <div className="section-inner">
              <div className="section-label">Support The Mission</div>
              <h2 className="section-title">Give with purpose</h2>
              <div className="section-divider"></div>
              <div className="donation-grid">
                <div className="donation-copy">
                  <span className="donation-heart" aria-hidden="true">♥</span>
                  <h3>Your support helps learning reach further.</h3>
                  <p>
                    Contributions help us expand digital literacy, teacher development, and research-led
                    learning programs. Transfer your contribution using the details below, then share the
                    transaction ID so our team can verify it.
                  </p>
                  <div className="bank-card">
                    <div className="bank-card-heading">
                      <span>Bank transfer details</span>
                      <span className="placeholder-badge">PLACEHOLDER</span>
                    </div>
                    <dl>
                      <div><dt>Account name</dt><dd>BLD Institute of Research & Learning Foundation</dd></div>
                      <div><dt>Bank name</dt><dd>Example National Bank</dd></div>
                      <div><dt>Account number</dt><dd>0000 0000 0000</dd></div>
                      <div><dt>IFSC / branch</dt><dd>EXMP0000001 · New Delhi</dd></div>
                      <div><dt>UPI ID</dt><dd>donate@example.org</dd></div>
                    </dl>
                    <p className="bank-note">Replace these placeholder values with your verified account details before publishing.</p>
                  </div>
                </div>
                <form className="donation-form" onSubmit={submitDonation}>
                  <div className="donation-form-heading">
                    <h3>Submit your transaction</h3>
                    <p>Required fields are marked <span aria-hidden="true">*</span>.</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="transaction-id">Transaction ID *</label>
                    <input id="transaction-id" required value={donationForm.transaction_id} onChange={(e) => setDonationForm({ ...donationForm, transaction_id: e.target.value })} placeholder="e.g. UTR or payment reference" />
                  </div>
                  <div className="donation-form-row">
                    <div className="form-group">
                      <label htmlFor="donor-name">Name *</label>
                      <input id="donor-name" required value={donationForm.name} onChange={(e) => setDonationForm({ ...donationForm, name: e.target.value })} placeholder="Your full name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="donor-email">Email *</label>
                      <input id="donor-email" type="email" required value={donationForm.email} onChange={(e) => setDonationForm({ ...donationForm, email: e.target.value })} placeholder="you@email.com" />
                    </div>
                  </div>
                  <div className="donation-form-row">
                    <div className="form-group">
                      <label htmlFor="donor-work">Work / organisation</label>
                      <input id="donor-work" value={donationForm.work} onChange={(e) => setDonationForm({ ...donationForm, work: e.target.value })} placeholder="Where you work (optional)" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="donor-profession">Profession</label>
                      <input id="donor-profession" value={donationForm.profession} onChange={(e) => setDonationForm({ ...donationForm, profession: e.target.value })} placeholder="Your profession (optional)" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="donor-address">Address <span>(optional)</span></label>
                    <textarea id="donor-address" value={donationForm.address} onChange={(e) => setDonationForm({ ...donationForm, address: e.target.value })} placeholder="Address details (optional)" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="donor-miscellaneous">Miscellaneous details <span>(optional)</span></label>
                    <textarea id="donor-miscellaneous" value={donationForm.miscellaneous} onChange={(e) => setDonationForm({ ...donationForm, miscellaneous: e.target.value })} placeholder="Anything else you would like us to know" />
                  </div>
                  <button className="btn-submit donation-submit" type="submit" disabled={donationStatus === "submitting"}>
                    {donationStatus === "submitting" ? "Submitting…" : "Submit transaction details"}
                  </button>
                  {donationMessage && (
                    <p className={`donation-status donation-status--${donationStatus}`} role="status">{donationMessage}</p>
                  )}
                </form>
              </div>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section id="contact">
            <div className="section-inner">
              <div className="section-label">Get In Touch</div>
              <h2 className="section-title">Contact Us</h2>
              <div className="section-divider"></div>
              <div className="contact-grid">
                <div className="contact-info">
                  <p style={{ fontSize: "16px", color: "rgba(253, 240, 213, 0.85)", maxWidth: "400px" }}>
                    Whether you're looking to partner, volunteer, or simply learn more about our work — we'd love
                    to hear from you.
                  </p>
                  <div className="contact-item">
                    <div className="contact-item-icon">📍</div>
                    <div>
                      <h4>Address</h4>
                      <p>
                        BLD Institute of Research & Learning Foundation
                        <br />
                        India
                      </p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-item-icon">✉️</div>
                    <div>
                      <h4>Email</h4>
                      <p>info@bldirl.org</p>
                    </div>
                  </div>
                </div>
                <div className="contact-form">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input type="text" placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="you@email.com" />
                  </div>
                  <div className="form-group">
                    <label>I am interested in</label>
                    <select defaultValue="">
                      <option value="">Select an area…</option>
                      <option>CSR Partnership</option>
                      <option>Volunteering</option>
                      <option>Research Collaboration</option>
                      <option>Program Information</option>
                      <option>Media & Press</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea placeholder="How can we help you?"></textarea>
                  </div>
                  <button className="btn-submit" type="button">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">
              <img
                className="nav-logo-image"
                src="/Logo_BLD_Institute tranlucent.png"
                alt="BLDIRL Foundation logo"
              />
              <div className="nav-logo-text" style={{ color: "#fdf0d5" }}>
                BLDIRL Foundation
                <span style={{ color: "#fdf0d5" }}>Empowering Minds</span>
              </div>
            </div>
            <p>Committed to advancing education, digital literacy, and innovation for a knowledge-driven India.</p>
          </div>
          <div className="footer-col">
            <h5>Organisation</h5>
            <ul>
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("home", "#about");
                  }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#programs"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("home", "#programs");
                  }}
                >
                  Programs
                </a>
              </li>
              <li>
                <a
                  href="#impact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("home", "#impact");
                  }}
                >
                  Impact
                </a>
              </li>
              <li>
                <a
                  href="#research"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("home", "#research");
                  }}
                >
                  Research
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Engage</h5>
            <ul>
              <li>
                <a
                  href="#news"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("home", "#news");
                  }}
                >
                  News & Events
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("gallery");
                  }}
                >
                  Gallery
                </a>
              </li>
              <li>
                <a href="#annual-reports">Annual Reports</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Connect</h5>
            <ul>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("home", "#contact");
                  }}
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#">Volunteer</a>
              </li>
              <li>
                <a href="#">Donate</a>
              </li>
              <li>
                <a href="#">Press Kit</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 BLD Institute of Research & Learning Foundation. All rights reserved.</span>
          <span className="footer-tagline">
            "Empowering Minds Through Education, Innovation, and Digital Inclusion."
          </span>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      {lightbox.open && (
        <div className="gallery-lightbox open" onClick={closeLightbox}>
          <button className="gallery-lightbox-close" type="button" aria-label="Close image preview" onClick={closeLightbox}>
            &times;
          </button>
          <div
            className="gallery-lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image preview"
            onClick={(e) => e.stopPropagation()}
          >
            <img className="gallery-lightbox-image" src={lightbox.src} alt={lightbox.alt} />
            <p className="gallery-lightbox-caption">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
}
