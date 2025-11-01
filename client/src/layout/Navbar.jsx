"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlignJustify,
  CircleX,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import FormModal from "./FormModal";
import NavBarTeam from "./NavbarTeam";

// --- DUMMY DATA FOR PLATFORM CONTEXT ---
const DUMMY_CATEGORIES = [
  {
    _id: "cat1",
    name: "Explore Nepal", // Changed to reflect tourist action
    slug: "explore-book",
    subCategories: [
      { _id: "sub1a", name: "Trekking Packages", slug: "trekking-packages" },
      { _id: "sub1b", name: "Cultural Tours", slug: "cultural-tours" },
      { _id: "sub1c", name: "Adventure Sports", slug: "adventure-sports" },
    ],
  },
  {
    _id: "cat2",
    name: "Local Product", // Changed to reflect local business promotion
    slug: "store",
    subCategories: [
      { _id: "sub2a", name: "Local Crafts & Goods", slug: "local-crafts" },
      { _id: "sub2b", name: "Homestays & Lodges", slug: "homestays" },
    ],
  },
];

const DUMMY_PACKAGES = [
  {
    id: "pkg1",
    _id: "pkg1",
    name: "Everest Trekking Package",
    slug: "everest-trekking-package",
    coverImage: "/scenery.jpg",
    overview: "Book a classic trek with local guides.",
  },
  {
    id: "pkg2",
    _id: "pkg2",
    name: "Annapurna Homestay Experience",
    slug: "annapurna-homestay",
    coverImage: "/hero.jpg",
    overview: "Stay with a local family in the Annapurna region.",
  },
  {
    id: "pkg3",
    _id: "pkg3",
    name: "Handmade Pashmina Shawl",
    slug: "pashmina-shawl",
    coverImage: "/about.webp",
    overview: "Finest quality Pashmina from local artisans.",
  },
  {
    id: "pkg4",
    _id: "pkg4",
    name: "Pottery Workshop Pass",
    slug: "pottery-workshop",
    coverImage: "/gear.jpeg",
    overview: "Learn traditional Newari pottery techniques.",
  },
];

const fetchCategories = async () => {
  return DUMMY_CATEGORIES;
};

const fetchPackagesBySubcategory = async (subcategoryId) => {
  if (!subcategoryId) return [];
  // Mock filtering logic for the new platform context
  const packages =
    subcategoryId.includes("trekking") || subcategoryId.includes("tours")
      ? DUMMY_PACKAGES.slice(0, 2)
      : DUMMY_PACKAGES.slice(2, 4);

  return packages.map((pkg) => ({
    ...pkg,
    id: pkg.id || pkg._id,
    name: pkg.name || "Unnamed Item/Service",
    slug: pkg.slug || pkg.id || pkg._id,
  }));
};

// Custom hook for scroll behavior (UNCHANGED)
const useScrollBehavior = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 50) return;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setShowNavbar(true);
      }

      setScrolled(currentScrollY > 0);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return { showNavbar, scrolled };
};

// Sub-components (LOGO & NAVITEM UNCHANGED)
const Logo = () => (
  <Link href="/" className="cursor-pointer">
    <Image
      priority
      height={100}
      width={300}
      src="/logo1.png"
      alt="Flyeast Adventures"
      className="h-10 w-auto"
    />
  </Link>
);

const NavItem = ({
  children,
  onClick,
  hasDropdown = false,
  isActive = false,
  onMouseEnter,
}) => (
  <button
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={`flex items-center gap-1 transition-colors duration-300 ${
      isActive ? "text-[#FF4E58]" : "text-white hover:text-[#FF4E58]"
    }`}
  >
    <span className="relative inline-block cursor-pointer">{children}</span>
    {hasDropdown && <ChevronDown className="w-4 h-4" />}
  </button>
);

const DropdownSkeleton = () => (
  <div className="animate-pulse">
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <li
            key={i}
            className="flex gap-4 items-center bg-zinc-800/50 p-2 rounded-2xl"
          >
            <div className="h-24 w-24 bg-zinc-700 rounded-lg shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <div className="h-5 w-1/2 bg-zinc-700 rounded" />
              <div className="h-4 w-full bg-zinc-700 rounded" />
              <div className="h-4 w-3/4 bg-zinc-700 rounded" />
            </div>
          </li>
        ))}
    </ul>
  </div>
);

const Navbar = () => {
  const router = useRouter();
  // Changed isFormOpen to control a "Promote Business" modal/flow
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const { showNavbar, scrolled } = useScrollBehavior();
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [navOpen, setNavOpen] = useState(false);
  const dropdownTimerRef = useRef(null);

  // Fetch categories with React Query
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Fetch packages/listings for active subcategory with React Query
  const {
    data: packages = [], // Renamed data to "listings" might be better in a real refactor, but kept 'packages' to minimize changes
    isLoading: packagesLoading,
    error: packagesError,
  } = useQuery({
    queryKey: ["packages", activeSubCategory?._id],
    queryFn: () => fetchPackagesBySubcategory(activeSubCategory?._id || ""),
    enabled: !!activeSubCategory?._id,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const loading = packagesLoading;

  // Update subcategories when active category changes (UNCHANGED)
  useEffect(() => {
    if (activeCategory) {
      const subs = activeCategory.subCategories || [];
      setSubCategories(subs);

      if (subs.length > 0) {
        const shouldUpdate =
          !activeSubCategory ||
          !subs.some((sc) => sc._id === activeSubCategory._id);
        if (shouldUpdate) setActiveSubCategory(subs[0]);
      } else {
        setActiveSubCategory(null);
      }
    } else {
      setSubCategories([]);
      setActiveSubCategory(null);
    }
  }, [activeCategory, activeSubCategory]);

  // Toggle mobile navigation (UNCHANGED)
  const toggleNav = useCallback(() => {
    const isOpening = !navOpen;
    setNavOpen(isOpening);
    document.body.classList.toggle("overflow-hidden", isOpening);
  }, [navOpen]);

  // Toggle mobile dropdowns (UNCHANGED)
  const toggleMobileDropdown = useCallback((dropdown) => {
    setMobileDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  }, []);

  // Handle category selection (UNCHANGED)
  const handleCategoryClick = useCallback(
    (category) => {
      router.push(`${category.slug}`);
      setActiveCategory(category);
      setActiveDropdown(null);
    },
    [router]
  );

  // Handle category hover (UNCHANGED)
  const handleCategoryHover = useCallback((category) => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    setActiveCategory(category);
    setActiveDropdown(category.name);
  }, []);

  // Handle company hover (UNCHANGED)
  const handleCompanyHover = useCallback(() => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    setActiveDropdown("about");
  }, []);

  // Handle subcategory selection (UNCHANGED)
  const handleSubCategoryClick = useCallback((subCategory) => {
    setActiveSubCategory(subCategory);
  }, []);

  // Close dropdowns when clicking outside (UNCHANGED)
  useEffect(() => {
    const handleClickOutside = (e) => {
      const navbar = document.getElementById("navbar-container");
      if (navbar && !navbar.contains(e.target)) {
        setActiveDropdown(null);
        setActiveCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle mouse leave for dropdowns (UNCHANGED)
  const handleMouseLeave = useCallback(() => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setActiveCategory(null);
    }, 300);
  }, []);

  // Handle mouse enter for dropdown container (UNCHANGED)
  const handleDropdownMouseEnter = useCallback(() => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
  }, []);

  // Determine navbar background (UNCHANGED)
  const navbarBg = useMemo(() => {
    if (activeDropdown) return "bg-[url('/navbg.svg')]";
    if (showNavbar && scrolled) return "bg-black backdrop-blur-2xl";
    return "bg-transparent";
  }, [activeDropdown, showNavbar, scrolled]);

  return (
    <div id="navbar-container" className="relative z-[9999999]">
      {/* Main Navbar */}
      <div
        className={`fixed top-0 z-50 w-full transition-transform duration-300 ease-in-out
          ${showNavbar ? "translate-y-0" : "-translate-y-full"}
          ${navbarBg} bg-cover py-4 px-4 md:px-20 flex items-center justify-between
          font-sans font-medium text-[1rem] text-white`}
      >
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center gap-8">
          <Link href="/">
            <NavItem>Home</NavItem>
          </Link>

          {categories?.map((category) => (
            <div key={category._id} className="relative">
              <NavItem
                hasDropdown
                onClick={() => {
                  handleCategoryClick(category);
                }}
                onMouseEnter={() => handleCategoryHover(category)}
              >
                {category.name}
              </NavItem>
            </div>
          ))}

          {/* Company Dropdown */}
          <div className="relative">
            <NavItem
              hasDropdown
              onClick={() => setActiveDropdown("about")}
              onMouseEnter={handleCompanyHover}
            >
              About
            </NavItem>
          </div>

          <Link href="/blogs">
            <NavItem>Community Feed</NavItem> {/* Changed to Community Feed */}
          </Link>

          <Link href="/contact-us">
            <NavItem>Contact</NavItem> {/* Shortened */}
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {/* Promote Business Button */}
          <div className="hidden md:block">
            <button
              onClick={() => {
                // Navigate to a 'promote' page or open a different modal
                router.push("/promote-business");
              }}
              className="px-4 py-2 bg-[#FF4E58] cursor-pointer text-white font-semibold rounded-full transition-colors duration-300 hover:bg-[#d62a4e]"
            >
              Promote Your Business
            </button>
          </div>

          {/* Book Trip Button (Tourist Action) */}

          {/* Mobile Menu Button (UNCHANGED) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleNav}
              className="p-2 hover:bg-gray-800 rounded-md transition-colors duration-300"
            >
              {navOpen ? <CircleX size={24} /> : <AlignJustify size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Dropdown (UNCHANGED, but content is now platform-focused) */}
      {activeCategory && (
        <CategoryDropdown
          noActive={() => setActiveDropdown(null)}
          activeCategory={activeCategory}
          activeSubCategory={activeSubCategory}
          subCategories={subCategories}
          packages={packages}
          loading={loading}
          onSubCategoryClick={handleSubCategoryClick}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleDropdownMouseEnter}
          visible={activeDropdown === activeCategory.name}
          showNavbar={showNavbar}
        />
      )}

      {/* Company Dropdown (UNCHANGED) */}
      <CompanyDropdown
        visible={activeDropdown === "about"}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleDropdownMouseEnter}
        showNavbar={showNavbar}
      />

      {/* Mobile Navigation (Content updated below) */}
      <MobileNav
        open={navOpen}
        categories={categories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        mobileDropdowns={mobileDropdowns}
        onToggleDropdown={toggleMobileDropdown}
        onClose={toggleNav}
        setIsFormOpen={setIsFormOpen} // Pass setIsFormOpen to mobile nav
        router={router}
      />

      {/* Form Modal (For tourist trip booking/enquiry) */}
      <FormModal isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} />
    </div>
  );
};

// Category Dropdown Component (UNCHANGED)
const CategoryDropdown = ({
  noActive,
  activeCategory,
  activeSubCategory,
  subCategories,
  packages,
  loading,
  onSubCategoryClick,
  onMouseLeave,
  onMouseEnter,
  visible,
  showNavbar,
}) => {
  const handleSubCategoryHover = useCallback(
    (subCategory) => {
      if (activeSubCategory?._id !== subCategory._id) {
        onSubCategoryClick(subCategory);
      }
    },
    [onSubCategoryClick, activeSubCategory]
  );

  return (
    <div
      className={`fixed left-0 w-full bg-[#1E1E1E] text-white shadow-lg transition-all duration-300 z-40
      bg-[url('/navbg.svg')] bg-cover border-b-4 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      } ${showNavbar ? "top-16" : "top-0"}`}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <div className="container mx-auto py-8 px-18">
        <div className="flex h-96">
          {/* Left Categories Column */}
          <div className="w-1/4 border-r-2 border-r-zinc-800 px-8 py-8">
            <h3 className="text-xl font-sora mb-6 text-white">
              {activeCategory.name}
            </h3>
            <ul className="space-y-4 overflow-y-auto max-h-64 pr-2">
              {subCategories.length > 0 ? (
                subCategories.map((subCat) => (
                  <li
                    key={subCat._id}
                    className={`cursor-pointer transition-all duration-300 ${
                      activeSubCategory?._id === subCat._id
                        ? "text-[#FF4E58] font-semibold translate-x-2"
                        : "text-white hover:text-[#FF4E58]"
                    }`}
                    onClick={() => onSubCategoryClick(subCat)}
                    onMouseEnter={() => handleSubCategoryHover(subCat)}
                  >
                    {subCat.name}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No subcategories found</li>
              )}
            </ul>
          </div>

          {/* Content Column */}
          <div className="w-3/4 px-8 overflow-hidden">
            <div className="h-full" key={activeSubCategory?._id || "default"}>
              <h2 className="text-2xl font-sora mb-6 text-white font-medium">
                {activeSubCategory?.name || "Select a service/category"}
              </h2>

              {loading ? (
                <>
                  <DropdownSkeleton />
                  <Link
                    href={`/packages/${activeCategory.slug}`}
                    className="w-full flex justify-start items-center"
                  >
                    <div className="hover:bg-zinc-100 bg-zinc-800 py-2 px-4 font-normal rounded-full text-[#FF4E58] flex items-center gap-2 mt-6 cursor-pointer hover:text-[#d62a4e] transition-colors duration-300">
                      <p>View All {activeCategory.name}</p>
                      <ChevronRight strokeWidth={3} size={15} />
                    </div>
                  </Link>
                </>
              ) : packages.length > 0 ? (
                <>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packages.slice(0, 4).map((pkg) => (
                      <Link
                        href={`/listing-details/${pkg.slug}`} // Changed to /listing-details
                        key={pkg.id}
                        onClick={noActive}
                      >
                        <li className="flex gap-4 items-center bg-zinc-800/50 p-2 rounded-2xl group border border-transparent hover:border-[#FF4E58]/40">
                          <div className="h-24 w-24 shrink-0 relative rounded-lg overflow-hidden">
                            <Image
                              fill
                              src={pkg.coverImage}
                              alt={pkg.name}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <h1 className="text-lg font-semibold capitalize group-hover:text-[#FF4E58]">
                              {pkg.name}
                            </h1>
                            <p
                              className="line-clamp-2 text-sm font-normal"
                              dangerouslySetInnerHTML={{ __html: pkg.overview }}
                            />
                          </div>
                        </li>
                      </Link>
                    ))}
                  </ul>
                  <Link
                    href={`/packages/${activeCategory.slug}`}
                    className="w-full flex justify-start items-center"
                  >
                    <div className="hover:bg-zinc-100 bg-zinc-800 py-2 px-4 font-normal rounded-full text-[#FF4E58] flex items-center gap-2 mt-6 cursor-pointer hover:text-[#d62a4e] transition-colors duration-300">
                      <p>View All {activeCategory.name}</p>
                      <ChevronRight strokeWidth={3} size={15} />
                    </div>
                  </Link>
                </>
              ) : (
                <div className="text-gray-400">
                  {activeSubCategory
                    ? "No listings available for this service."
                    : "Select a service to view listings."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Company Dropdown Component (UNCHANGED for this level of refactor)
const CompanyDropdown = ({
  visible,
  onMouseLeave,
  onMouseEnter,
  showNavbar,
}) => {
  const [activeSection, setActiveSection] = useState("company");
  const aboutUsData = {
    values: {
      items: [
        {
          name: "Safety First",
          description:
            "We always prioritize your safety in every adventure journey.",
          tag: "Core",
        },
        {
          name: "Sustainable Tourism",
          description:
            "We promote eco-friendly travel through responsible tourism practices.",
          tag: "Ethics",
        },
        {
          name: "Authentic Experiences",
          description:
            "We offer genuine cultural immersion with local traditions and people.",
          tag: "Value",
        },
        {
          name: "Expert Guidance",
          description:
            "Our journeys are led by highly experienced local travel guides.",
          tag: "Quality",
        },
      ],
    },
  };

  return (
    <div
      className={`fixed left-0 w-full bg-[#1E1E1E] text-white shadow-lg transition-all duration-300 z-40
        bg-[url('/navbg.svg')] bg-cover border-b-4 ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        } ${showNavbar ? "top-[60px]" : "top-0"}`}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <div className="container mx-auto py-8 px-18">
        <div className="flex h-80">
          {/* Left Categories Column */}
          <div className="w-1/4 border-r border-r-zinc-800 px-8 py-8">
            <h3 className="text-xl font-sora mb-6 text-white">Platform Info</h3>
            <ul className="space-y-4">
              {[
                { id: "company", label: "About Us", href: "/about" },
                { id: "team", label: "Our Team", href: "/team" },
                { id: "values", label: "Core Values", href: "/values" },
                {
                  id: "useful-info",
                  label: "For Local Businesses",
                  href: "/business-guide", // Renamed link
                },
              ].map((section) => (
                <li
                  key={section.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeSection === section.id
                      ? "text-[#FF4E58] font-semibold translate-x-2"
                      : "text-white hover:text-[#FF4E58]"
                  }`}
                  onMouseEnter={() => setActiveSection(section.id)}
                >
                  {section.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Content Column (UNCHANGED) */}
          <div className="w-3/4 px-8 overflow-hidden">
            <div className="h-full animate-fade-in" key={activeSection}>
              {activeSection === "company" && (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-3xl font-semibold text-white mb-4">
                      Since 2013
                    </h3>
                    <p className="text-white mb-4">
                      Founded in 2010 with a passion for Himalayan adventures,
                      HighFive Adventures has been providing exceptional
                      mountaineering and trekking experiences for adventure
                      enthusiasts from around the world.
                    </p>
                    <Link
                      href="/about"
                      className="text-[#ff4e69d3] hover:text-[#ff4e4e]"
                    >
                      <div className="flex items-center gap-2">
                        <p>Learn More</p>
                        <ChevronRight strokeWidth={3} size={15} />
                      </div>
                    </Link>
                  </div>
                  <div className="flex-1">
                    <div className="h-48 overflow-hidden rounded-lg">
                      <Image
                        height={500}
                        width={500}
                        src="/about.webp"
                        alt="Flyest Nepal"
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "team" && (
                <NavBarTeam setActiveDropdown={() => {}} />
              )}

              {activeSection === "values" && (
                <div>
                  <h2 className="text-2xl font-sora mb-6 text-white">
                    Our Core Values
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aboutUsData.values.items.map((value, index) => (
                      <div
                        key={index}
                        className="border border-zinc-800 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 bg-[#FF4E58] rounded-full items-center justify-center text-white hidden">
                            {index === 0 && <MapPin />}
                            {index === 1 && <Mail />}
                            {index === 2 && <Phone />}
                            {index === 3 && <ChevronRight />}
                          </div>
                          <div>
                            <div className="flex gap-2 items-center mb-2 flex-wrap w-full justify-between ">
                              <h3 className="text-lg font-semibold  text-[#FF4E58]">
                                {value.name}
                              </h3>
                              <span className="inline-block  text-xs px-4 py-1  bg-white/20 rounded-md text-white">
                                {value.tag}
                              </span>
                            </div>
                            <p className="text-white text-sm">
                              {value.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "useful-info" && (
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-3xl font-semibold text-white mb-4">
                      Promote Your Local Business
                    </h3>
                    <p className="text-white mb-4">
                      Connect directly with international tourists looking for
                      authentic local goods and services. Learn how to list your
                      business and grow your market.
                    </p>
                    <Link
                      href="/business-guide"
                      className="text-[#ff4e69d3] hover:text-[#ff4e4e]"
                    >
                      <div className="flex items-center gap-2">
                        <p>Get Started Selling</p>
                        <ChevronRight strokeWidth={3} size={15} />
                      </div>
                    </Link>
                  </div>
                  <div className="flex-1">
                    <div className="h-48 overflow-hidden rounded-lg">
                      <Image
                        height={500}
                        width={500}
                        src="/gear.jpeg"
                        alt="Promote Business"
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Mobile Navigation Component (UPDATED)
const MobileNav = ({
  open,
  categories,
  categoriesLoading,
  categoriesError,
  mobileDropdowns,
  onToggleDropdown,
  onClose,
  setIsFormOpen,
  router,
}) => {
  const companyItems = [
    { id: "about", label: "About Us", href: "/about" },
    { id: "team", label: "Our Team", href: "/team" },
    { id: "values", label: "Core Values", href: "/values" },
    {
      id: "business-guide",
      label: "For Local Businesses",
      href: "/business-guide",
    },
  ];

  return (
    <div
      className={`lg:hidden fixed inset-0 bg-black bg-opacity-95 z-50 transition-all duration-300 transform ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <Image
              priority
              height={120}
              width={140}
              src="/logo1.png"
              alt="Flyeast Nepal"
            />
            <button
              onClick={onClose}
              className="text-white hover:text-[#FF4E58]"
            >
              <CircleX size={28} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="container mx-auto px-4">
            <nav className="text-white">
              <ul className="space-y-0">
                <li className="border-b border-zinc-800">
                  <Link
                    href="/"
                    onClick={onClose}
                    className="block w-full py-4"
                  >
                    <span className="text-xl hover:text-[#FF4E58] transition-colors duration-300">
                      Home
                    </span>
                  </Link>
                </li>

                {/* Categories */}
                {categories?.map((category) => (
                  <li key={category._id} className="border-b border-zinc-800">
                    <div
                      className="block w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        onToggleDropdown(`category-${category._id}`);
                      }}
                    >
                      <div className="flex justify-between items-center py-4">
                        <span className="text-xl hover:text-[#FF4E58] transition-colors duration-300">
                          {category.name}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            mobileDropdowns[`category-${category._id}`]
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                    {mobileDropdowns[`category-${category._id}`] && (
                      <div className="mt-2 ml-4 mb-4 space-y-3">
                        {category.subCategories?.map((subcategory) => (
                          <Link
                            href={`/listing-details/${subcategory.slug}`} // Changed link format
                            key={subcategory._id}
                            onClick={onClose}
                          >
                            <div className="flex items-center text-gray-300 hover:text-[#FF4E58] py-2">
                              <ChevronRight className="w-4 h-4 mr-2" />
                              <span>{subcategory.name}</span>
                            </div>
                          </Link>
                        ))}
                        <Link
                          href={`/packages/${category.slug}`}
                          onClick={onClose}
                          className="flex py-2 pl-6 text-[#FF4E58] hover:text-[#d62a4e] items-center"
                        >
                          <span>View All {category.name}</span>
                        </Link>
                      </div>
                    )}
                  </li>
                ))}

                {/* Company Dropdown */}
                <li className="border-b border-zinc-800">
                  <div
                    className="block w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleDropdown("company");
                    }}
                  >
                    <div className="flex justify-between items-center py-4">
                      <span className="text-xl hover:text-[#FF4E58] transition-colors duration-300">
                        About
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          mobileDropdowns["company"] ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                  {mobileDropdowns["company"] && (
                    <div className="mt-2 ml-4 mb-4 space-y-3">
                      {companyItems.map((item) => (
                        <Link href={item.href} key={item.id} onClick={onClose}>
                          <div className="flex items-center text-gray-300 hover:text-[#FF4E58] py-2">
                            <ChevronRight className="w-4 h-4 mr-2" />
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </li>

                {/* Community Feed */}
                <li className="border-b border-zinc-800">
                  <Link
                    href="/blogs"
                    onClick={onClose}
                    className="block w-full py-4"
                  >
                    <span className="text-xl hover:text-[#FF4E58] transition-colors duration-300">
                      Community Feed
                    </span>
                  </Link>
                </li>

                {/* Contact Us */}
                <li className="border-b border-zinc-800">
                  <Link
                    href="/contact-us"
                    onClick={onClose}
                    className="block w-full py-4"
                  >
                    <span className="text-xl hover:text-[#FF4E58] transition-colors duration-300">
                      Contact
                    </span>
                  </Link>
                </li>
              </ul>

              {/* Promote Business Button */}
              <div className="mt-8">
                <button
                  onClick={() => {
                    onClose();
                    router.push("/promote-business");
                  }}
                  className="w-full py-4 bg-[#EA3359] text-white rounded-xl flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-[#d62a4e]"
                >
                  <span>Promote Your Business</span>
                </button>
              </div>

              {/* Book Trip Button */}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
