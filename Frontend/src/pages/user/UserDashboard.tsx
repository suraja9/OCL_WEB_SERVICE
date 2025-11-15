import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Compass,
  LayoutDashboard,
  Mail,
  MoonStar,
  PackageSearch,
  Sparkles,
  Sun,
  Headphones,
  Menu,
  LogOut,
} from "lucide-react";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { useToast } from "@/hooks/use-toast";
import BookNow from "@/components/user/BookNow";
import ContactSupport from "@/components/user/ContactSupport";
import MyBooking from "@/components/user/MyBooking";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

type SidebarItem = {
  id: "home" | "booknow" | "mybooking" | "contactsupport";
  label: string;
};

const UserDashboard: React.FC = () => {
  const { isAuthenticated, customer, logout } = useUserAuth();
  const { toast } = useToast();

  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      {
        id: "home",
        label: "Home",
      },
      {
        id: "booknow",
        label: "Book now",
      },
      {
        id: "mybooking",
        label: "My Booking",
      },
      {
        id: "contactsupport",
        label: "Contact Support",
      },
    ],
    []
  );

  const [activeItem, setActiveItem] = useState<SidebarItem["id"]>("home");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
    setActiveItem("home");
  };

  const pageBackground = isDarkMode
    ? "bg-slate-950 text-slate-50"
    : "bg-slate-50 text-slate-900";
  const accentGradient = isDarkMode
    ? "from-blue-500/20 via-blue-400/10 to-transparent"
    : "from-blue-400/15 via-blue-300/10 to-transparent";
  const accentGradientAlt = isDarkMode
    ? "from-purple-500/25 via-indigo-400/10 to-transparent"
    : "from-purple-400/15 via-violet-300/10 to-transparent";
  const sidebarBackground = isDarkMode
    ? "bg-slate-900/80 border-slate-800/60"
    : "bg-white/90 border-slate-200/60";
  const sidebarTextMuted = isDarkMode ? "text-slate-300/80" : "text-slate-500";

  const handleItemClick = (itemId: SidebarItem["id"]) => {
    setActiveItem(itemId);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Reusable Sidebar Content Component
  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-8 p-6">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-inherit">
            Ship Consignments :
          </h1>
        </div>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "group w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isDarkMode
                ? "border-transparent hover:border-blue-500/20 hover:bg-blue-500/5"
                : "border-transparent hover:border-blue-400/25 hover:bg-blue-400/10",
              activeItem === item.id
                ? isDarkMode
                  ? "border-blue-500/40 bg-blue-500/15 text-white shadow-[0_12px_35px_rgba(37,99,235,0.18)]"
                  : "border-blue-400/40 bg-blue-400/15 text-blue-800 shadow-[0_18px_45px_rgba(59,130,246,0.18)]"
                : isDarkMode
                ? "text-slate-300"
                : "text-slate-600"
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition",
                  isDarkMode
                    ? "bg-slate-800/60 text-slate-200 group-hover:bg-blue-500/20"
                    : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                )}
              >
                {item.id === "home" ? (
                  <LayoutDashboard size={18} />
                ) : item.id === "booknow" ? (
                  <CalendarDays size={18} />
                ) : item.id === "mybooking" ? (
                  <PackageSearch size={18} />
                ) : item.id === "contactsupport" ? (
                  <Headphones size={18} />
                ) : (
                  <LayoutDashboard size={18} />
                )}
              </span>
              <span className="block text-sm font-medium text-inherit">
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </nav>

      <div
        className={cn(
          "mt-auto rounded-2xl border p-5 transition",
          isDarkMode
            ? "border-slate-800/50 bg-slate-900/80"
            : "border-slate-200/70 bg-white/60"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              isDarkMode
                ? "bg-blue-500/20 text-blue-200"
                : "bg-blue-100 text-blue-600"
            )}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-inherit">
              Need something specific?
            </p>
            <p className={cn("text-xs", sidebarTextMuted)}>
              Tell us the features you want to see next.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className={cn(
            "mt-4 w-full text-sm transition",
            isDarkMode
              ? "border-blue-500/40 bg-transparent text-blue-100 hover:bg-blue-500/10"
              : "border-blue-500/40 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20"
          )}
        >
          Share Feedback
        </Button>
      </div>

      {/* Logout Button - Only show if logged in */}
      {isAuthenticated && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={handleLogout}
            className={cn(
              "w-full text-sm transition",
              isDarkMode
                ? "border-red-500/40 bg-transparent text-red-200 hover:bg-red-500/10"
                : "border-red-500/40 bg-red-500/10 text-red-700 hover:bg-red-500/20"
            )}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "relative min-h-screen transition-colors duration-500 ease-out",
        pageBackground
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute -right-24 top-[-10%] h-[280px] w-[280px] rounded-full blur-3xl",
            `bg-gradient-to-br ${accentGradient}`
          )}
        />
        <div
          className={cn(
            "absolute bottom-[-15%] left-[-10%] h-[340px] w-[340px] rounded-full blur-3xl",
            `bg-gradient-to-tr ${accentGradientAlt}`
          )}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside
          className={cn(
            "hidden lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen lg:w-[24rem] lg:max-w-[24rem] lg:border-r backdrop-blur-xl transition-all duration-500",
            sidebarBackground
          )}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar - Sheet Drawer */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent
            side="left"
            className={cn(
              "w-[85vw] max-w-sm p-0 backdrop-blur-xl",
              sidebarBackground
            )}
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-x-hidden lg:ml-[24rem]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-10">
            {/* Mobile Header with Hamburger Menu */}
            <div className="flex items-center justify-between gap-4 lg:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                className={cn(
                  "h-10 w-10 rounded-xl border transition",
                  isDarkMode
                    ? "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800/70"
                    : "border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                )}
              >
                <Menu size={20} />
                <span className="sr-only">Open menu</span>
              </Button>
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-inherit">
                  OCL User Panel
                </h1>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDarkMode((prev) => !prev)}
                className={cn(
                  "h-10 w-10 rounded-xl border transition",
                  isDarkMode
                    ? "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800/70"
                    : "border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                )}
              >
                {isDarkMode ? (
                  <Sun size={18} />
                ) : (
                  <MoonStar size={18} />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>

            {/* Desktop Header */}
            <div className="hidden flex-col items-start justify-between gap-4 sm:flex-row sm:items-center lg:flex">
              <div>
                <p
                  className={cn(
                    "text-xs uppercase tracking-[0.4em]",
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsDarkMode((prev) => !prev)}
                className={cn(
                  "flex items-center gap-2 rounded-full border transition",
                  isDarkMode
                    ? "border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800/70"
                    : "border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                )}
              >
                {isDarkMode ? (
                  <>
                    <Sun size={16} />
                    <span className="text-sm font-medium">Light mode</span>
                  </>
                ) : (
                  <>
                    <MoonStar size={16} />
                    <span className="text-sm font-medium">Dark mode</span>
                  </>
                )}
              </Button>
            </div>
            {activeItem === "home" && (
              <>
                <section
                  className={cn(
                    "relative overflow-hidden rounded-2xl border p-4 shadow-[0_25px_80px_rgba(15,23,42,0.15)] transition sm:rounded-3xl sm:p-6 lg:p-8",
                    isDarkMode
                      ? "border-slate-800/60 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90"
                      : "border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/20"
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute -right-32 top-10 h-64 w-64 rounded-full blur-3xl",
                      isDarkMode
                        ? "bg-blue-500/20"
                        : "bg-blue-400/20"
                    )}
                  />
                  <div
                    className={cn(
                      "pointer-events-none absolute -bottom-28 left-0 h-64 w-64 rounded-full blur-3xl",
                      isDarkMode
                        ? "bg-purple-500/10"
                        : "bg-purple-400/15"
                    )}
                  />
                  <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                    <div className="max-w-xl space-y-3 sm:space-y-4">
                      
                      <h2
                        className={cn(
                          "text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl",
                          isDarkMode ? "text-white" : "text-slate-900"
                        )}
                      >
                        Welcome to Your personalised Booking centre.
                      </h2>
                      
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Button 
                          onClick={() => handleItemClick("booknow")}
                          className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 sm:px-6 sm:text-sm"
                        >
                          Create Booking
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.location.href = "/services/logistics"}
                          className={cn(
                            "rounded-full px-4 py-2 text-xs font-semibold transition sm:px-6 sm:text-sm",
                            isDarkMode
                              ? "border-slate-700 bg-transparent text-slate-200 hover:border-blue-500/40 hover:bg-blue-500/10"
                              : "border-blue-200 bg-white text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                          )}
                        >
                          Explore Services
                        </Button>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex w-full flex-col gap-4 rounded-2xl border p-4 transition sm:p-6 lg:max-w-sm",
                        isDarkMode
                          ? "border-blue-500/20 bg-slate-900/70"
                          : "border-blue-200/60 bg-white/80 shadow-lg"
                      )}
                    >
                      <p
                        className={cn(
                          "text-xs sm:text-sm",
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        )}
                      >
                        Your next move is just a click away.
                      </p>
                      <div className="space-y-2 sm:space-y-3">
                        {[
                          {
                            icon: <CalendarDays size={18} />,
                            title: "Schedule a pickup",
                            detail: "Book a slot in under 60 seconds.",
                          },
                          {
                            icon: <PackageSearch size={18} />,
                            title: "Track live consignments",
                            detail: "Check real-time progress and ETAs.",
                          },
                          {
                            icon: <Mail size={18} />,
                            title: "Alerts & updates",
                            detail: "Stay informed with smart notifications.",
                          },
                        ].map((item) => (
                          <div
                            key={item.title}
                            className={cn(
                              "flex items-start gap-3 rounded-xl border p-3 transition",
                              isDarkMode
                                ? "border-transparent bg-slate-800/40 hover:border-blue-500/30 hover:bg-blue-500/10"
                                : "border-transparent bg-blue-50/60 hover:border-blue-400/40 hover:bg-blue-100/60"
                            )}
                          >
                            <span
                              className={cn(
                                "mt-1 flex-shrink-0",
                                isDarkMode ? "text-blue-200" : "text-blue-600"
                              )}
                            >
                              {item.icon}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p
                                className={cn(
                                  "text-xs font-medium sm:text-sm",
                                  isDarkMode ? "text-white" : "text-slate-800"
                                )}
                              >
                                {item.title}
                              </p>
                              <p
                                className={cn(
                                  "text-xs",
                                  isDarkMode ? "text-slate-400" : "text-slate-500"
                                )}
                              >
                                {item.detail}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {[
                    {
                      title: "Active Shipments",
                      value: "12",
                      trend: "+2 this week",
                      icon: <PackageSearch size={20} />,
                      accent: "from-blue-500/60 to-blue-400/20",
                    },
                    {
                      title: "Upcoming Pickups",
                      value: "4",
                      trend: "Next pickup in 3h",
                      icon: <CalendarDays size={20} />,
                      accent: "from-purple-500/60 to-purple-400/20",
                    },
                    {
                      title: "Service Coverage",
                      value: "23 cities",
                      trend: "Expanding network",
                      icon: <Compass size={20} />,
                      accent: "from-emerald-500/60 to-emerald-400/20",
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      className={cn(
                        "relative overflow-hidden rounded-2xl border p-4 transition duration-300 hover:-translate-y-1 sm:rounded-3xl sm:p-6",
                        isDarkMode
                          ? "border-slate-800/50 bg-slate-900/70 hover:border-blue-500/40 hover:shadow-[0_20px_45px_rgba(37,99,235,0.18)]"
                          : "border-slate-200/80 bg-white hover:border-blue-300/50 hover:shadow-[0_22px_55px_rgba(59,130,246,0.15)]"
                      )}
                    >
                      <div
                        className={cn(
                          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70",
                          isDarkMode ? card.accent : card.accent.replace("/20", "/25")
                        )}
                      />
                      <div className="relative z-10 space-y-3 sm:space-y-4">
                        <span
                          className={cn(
                            "inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-inner sm:h-12 sm:w-12 sm:rounded-2xl",
                            isDarkMode
                              ? "bg-slate-900/70 text-white shadow-slate-950/40"
                              : "bg-blue-50 text-blue-600 shadow-blue-200/60"
                          )}
                        >
                          {card.icon}
                        </span>
                        <div>
                          <p
                            className={cn(
                              "text-xs uppercase tracking-[0.2em] sm:text-sm",
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            )}
                          >
                            {card.title}
                          </p>
                          <h3
                            className={cn(
                              "mt-1 text-2xl font-semibold sm:mt-2 sm:text-3xl",
                              isDarkMode ? "text-white" : "text-slate-900"
                            )}
                          >
                            {card.value}
                          </h3>
                          <p
                            className={cn(
                              "mt-1 text-xs",
                              isDarkMode ? "text-slate-300/70" : "text-slate-600"
                            )}
                          >
                            {card.trend}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>

                <section className="grid gap-4 sm:gap-6 lg:grid-cols-[2fr_1fr]">
                  <div
                    className={cn(
                      "rounded-2xl border p-4 transition sm:rounded-3xl sm:p-6",
                      isDarkMode
                        ? "border-slate-800/60 bg-slate-900/60"
                        : "border-slate-200 bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h3
                        className={cn(
                          "text-base font-semibold sm:text-lg",
                          isDarkMode ? "text-white" : "text-slate-900"
                        )}
                      >
                        Activity timeline
                      </h3>
                      <Badge
                        className={cn(
                          "text-xs",
                          isDarkMode
                            ? "border border-slate-700 bg-slate-800 text-slate-200"
                            : "border border-slate-200 bg-slate-100 text-slate-600"
                        )}
                      >
                        Live
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-5">
                      {[
                        {
                          title: "Shipment OCL-8421 was dispatched",
                          time: "12 mins ago",
                          status: "In transit to Delhi hub",
                        },
                        {
                          title: "Pickup scheduled for tomorrow",
                          time: "3 hours ago",
                          status: "Warehouse team confirmed slot",
                        },
                        {
                          title: "Corporate invoice generated",
                          time: "Yesterday",
                          status: "Awaiting payment confirmation",
                        },
                      ].map((item, index) => (
                        <div
                          key={item.title}
                          className={cn(
                            "relative rounded-xl border p-3 transition sm:rounded-2xl sm:p-4",
                            isDarkMode
                              ? "border-transparent bg-slate-800/40 hover:border-blue-500/30 hover:bg-blue-500/10"
                              : "border-transparent bg-blue-50/70 hover:border-blue-400/40 hover:bg-blue-100/60"
                          )}
                        >
                          <span
                            className={cn(
                              "absolute left-0 top-3 h-3 w-1 rounded-full bg-gradient-to-b sm:top-4 sm:h-4",
                              isDarkMode
                                ? "from-blue-400 to-blue-600"
                                : "from-blue-400 to-blue-500"
                            )}
                          />
                          <div className="pl-3 sm:pl-4">
                            <p
                              className={cn(
                                "text-xs font-medium sm:text-sm",
                                isDarkMode ? "text-white" : "text-slate-800"
                              )}
                            >
                              {item.title}
                            </p>
                            <p
                              className={cn(
                                "mt-1 text-xs",
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              )}
                            >
                              {item.time}
                            </p>
                            <p
                              className={cn(
                                "mt-1 text-xs sm:mt-2 sm:text-sm",
                                isDarkMode
                                  ? "text-slate-300/80"
                                  : "text-slate-600"
                              )}
                            >
                              {item.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex flex-col gap-4 rounded-2xl border p-4 transition sm:rounded-3xl sm:p-6",
                      isDarkMode
                        ? "border-slate-800/60 bg-slate-900/60"
                        : "border-slate-200 bg-white"
                    )}
                  >
                    <h3
                      className={cn(
                        "text-base font-semibold sm:text-lg",
                        isDarkMode ? "text-white" : "text-slate-900"
                      )}
                    >
                      Quick actions
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        "Download latest reports",
                        "Invite your team",
                        "Set delivery preferences",
                      ].map((action) => (
                        <Button
                          key={action}
                          variant="outline"
                          className={cn(
                            "w-full justify-start gap-2 border text-xs transition sm:gap-3 sm:text-sm",
                            isDarkMode
                              ? "border-slate-800 bg-transparent text-slate-200 hover:border-blue-500/40 hover:bg-blue-500/10"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8",
                              isDarkMode
                                ? "bg-slate-800/70 text-blue-200"
                                : "bg-blue-50 text-blue-600"
                            )}
                          >
                            <Sparkles size={14} className="sm:w-4 sm:h-4" />
                          </span>
                          <span className="truncate">{action}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}
            {activeItem === "booknow" && (
              <section
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-4 shadow-[0_25px_80px_rgba(15,23,42,0.15)] transition sm:rounded-3xl sm:p-6 lg:p-8",
                  isDarkMode
                    ? "border-slate-800/60 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90"
                    : "border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/20"
                )}
              >
                <BookNow isDarkMode={isDarkMode} />
              </section>
            )}
            {activeItem === "mybooking" && (
              <section
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-4 shadow-[0_25px_80px_rgba(15,23,42,0.15)] transition sm:rounded-3xl sm:p-6 lg:p-8",
                  isDarkMode
                    ? "border-slate-800/60 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90"
                    : "border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/20"
                )}
              >
                <MyBooking isDarkMode={isDarkMode} />
              </section>
            )}
            {activeItem === "contactsupport" && (
              <section
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-4 shadow-[0_25px_80px_rgba(15,23,42,0.15)] transition sm:rounded-3xl sm:p-6 lg:p-8",
                  isDarkMode
                    ? "border-slate-800/60 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90"
                    : "border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/20"
                )}
              >
                <ContactSupport isDarkMode={isDarkMode} />
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;

