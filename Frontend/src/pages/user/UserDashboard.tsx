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
} from "lucide-react";
import BookNow from "@/components/user/BookNow";
import ContactSupport from "@/components/user/ContactSupport";

type SidebarItem = {
  id: "home" | "booknow" | "contactsupport";
  label: string;
};

const UserDashboard: React.FC = () => {
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
        id: "contactsupport",
        label: "Contact Support",
      },
    ],
    []
  );

  const [activeItem, setActiveItem] = useState<SidebarItem["id"]>("home");
  const [isDarkMode, setIsDarkMode] = useState(false);

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
        <aside
          className={cn(
            "w-full max-w-full border-b backdrop-blur-xl transition-all duration-500 lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[24rem] lg:max-w-[24rem] lg:border-b-0 lg:border-r",
            sidebarBackground
          )}
        >
          <div className="flex h-full flex-col gap-8 p-6">
            <div className="flex flex-col gap-3">
              <Badge
                variant="secondary"
                className={cn(
                  "w-fit border text-xs font-medium",
                  isDarkMode
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-200"
                    : "border-blue-500/30 bg-blue-500/10 text-blue-700"
                )}
              >
                New Experience
              </Badge>
              <div>
                <h1 className="text-2xl font-semibold text-inherit">
                  OCL User Panel
                </h1>
                <p className={cn("mt-1 text-sm", sidebarTextMuted)}>
                  Seamlessly manage your courier needs from one elegant hub.
                </p>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
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
          </div>
        </aside>

        <main className="flex-1 overflow-x-hidden lg:ml-[24rem]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p
                  className={cn(
                    "text-xs uppercase tracking-[0.4em]",
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  Dashboard Overview
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-inherit">
                  Welcome back, here's what's happening today.
                </h2>
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
                    "relative overflow-hidden rounded-3xl border p-8 shadow-[0_25px_80px_rgba(15,23,42,0.15)] transition",
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
                  <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-xl space-y-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs font-medium uppercase tracking-widest",
                          isDarkMode
                            ? "border-blue-500/40 bg-blue-500/10 text-blue-100"
                            : "border-blue-400/40 bg-blue-400/10 text-blue-700"
                        )}
                      >
                        <Sparkles size={14} />
                        Fresh Arrival
                      </span>
                      <h2
                        className={cn(
                          "text-3xl font-semibold leading-tight md:text-4xl",
                          isDarkMode ? "text-white" : "text-slate-900"
                        )}
                      >
                        Welcome to your personalised logistics control centre.
                      </h2>
                      <p
                        className={cn(
                          "text-base md:text-lg",
                          isDarkMode ? "text-slate-300/80" : "text-slate-600"
                        )}
                      >
                        Track shipments, schedule pickups, and stay ahead with
                        proactive insights crafted for modern businesses.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          onClick={() => setActiveItem("booknow")}
                          className="rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                        >
                          Create Booking
                        </Button>
                        <Button
                          variant="outline"
                          className={cn(
                            "rounded-full px-6 py-2 text-sm font-semibold transition",
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
                        "flex w-full max-w-sm flex-col gap-4 rounded-2xl border p-6 transition",
                        isDarkMode
                          ? "border-blue-500/20 bg-slate-900/70"
                          : "border-blue-200/60 bg-white/80 shadow-lg"
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-slate-300" : "text-slate-600"
                        )}
                      >
                        Your next move is just a click away.
                      </p>
                      <div className="space-y-3">
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
                                "mt-1",
                                isDarkMode ? "text-blue-200" : "text-blue-600"
                              )}
                            >
                              {item.icon}
                            </span>
                            <div>
                              <p
                                className={cn(
                                  "text-sm font-medium",
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

                <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                        "relative overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1",
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
                      <div className="relative z-10 space-y-4">
                        <span
                          className={cn(
                            "inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner",
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
                              "text-sm uppercase tracking-[0.2em]",
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            )}
                          >
                            {card.title}
                          </p>
                          <h3
                            className={cn(
                              "mt-2 text-3xl font-semibold",
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

                <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                  <div
                    className={cn(
                      "rounded-3xl border p-6 transition",
                      isDarkMode
                        ? "border-slate-800/60 bg-slate-900/60"
                        : "border-slate-200 bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h3
                        className={cn(
                          "text-lg font-semibold",
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
                    <div className="mt-6 space-y-5">
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
                            "relative rounded-2xl border p-4 transition",
                            isDarkMode
                              ? "border-transparent bg-slate-800/40 hover:border-blue-500/30 hover:bg-blue-500/10"
                              : "border-transparent bg-blue-50/70 hover:border-blue-400/40 hover:bg-blue-100/60"
                          )}
                        >
                          <span
                            className={cn(
                              "absolute left-0 top-4 h-4 w-1 rounded-full bg-gradient-to-b",
                              isDarkMode
                                ? "from-blue-400 to-blue-600"
                                : "from-blue-400 to-blue-500"
                            )}
                          />
                          <div className="pl-4">
                            <p
                              className={cn(
                                "text-sm font-medium",
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
                              {item.time}
                            </p>
                            <p
                              className={cn(
                                "mt-2 text-sm",
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
                      "flex flex-col gap-4 rounded-3xl border p-6 transition",
                      isDarkMode
                        ? "border-slate-800/60 bg-slate-900/60"
                        : "border-slate-200 bg-white"
                    )}
                  >
                    <h3
                      className={cn(
                        "text-lg font-semibold",
                        isDarkMode ? "text-white" : "text-slate-900"
                      )}
                    >
                      Quick actions
                    </h3>
                    <div className="space-y-3">
                      {[
                        "Download latest reports",
                        "Invite your team",
                        "Set delivery preferences",
                      ].map((action) => (
                        <Button
                          key={action}
                          variant="outline"
                          className={cn(
                            "w-full justify-start gap-3 border text-sm transition",
                            isDarkMode
                              ? "border-slate-800 bg-transparent text-slate-200 hover:border-blue-500/40 hover:bg-blue-500/10"
                              : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full",
                              isDarkMode
                                ? "bg-slate-800/70 text-blue-200"
                                : "bg-blue-50 text-blue-600"
                            )}
                          >
                            <Sparkles size={16} />
                          </span>
                          {action}
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
                  "relative overflow-hidden rounded-3xl border p-8 shadow-[0_25px_80px_rgba(15,23,42,0.15)] transition",
                  isDarkMode
                    ? "border-slate-800/60 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90"
                    : "border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-blue-50/20"
                )}
              >
                <BookNow isDarkMode={isDarkMode} />
              </section>
            )}
            {activeItem === "contactsupport" && (
              <section
                className={cn(
                  "relative overflow-hidden rounded-3xl border p-8 shadow-[0_25px_80px_rgba(15,23,42,0.15)] transition",
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

