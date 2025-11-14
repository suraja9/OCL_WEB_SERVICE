import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import companyData from "@/data/company.json";

interface ContactSupportProps {
  isDarkMode: boolean;
}

const ContactSupport: React.FC<ContactSupportProps> = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Message Sent Successfully!",
      description: "Thank you for contacting us. We'll respond to your message within 24 hours.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      category: "",
      message: "",
    });

    setIsLoading(false);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our customer service team",
      contact: companyData.contact.phone,
      action: `tel:${companyData.contact.phone}`,
      actionText: "Call Now",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      description: "Get instant help via WhatsApp",
      contact: "+91-98765-43210",
      action: "https://wa.me/919876543210",
      actionText: "Chat on WhatsApp",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your queries and we'll respond within 24 hours",
      contact: companyData.contact.email,
      action: `mailto:${companyData.contact.email}`,
      actionText: "Send Email",
    },
  ];

  const officeHours = [
    { day: "Mon - Sat", hours: "10:00 AM - 7:00 PM" },
    { day: "Sunday", hours: "HOLIDAY" },
  ];

  const categories = [
    "General Inquiry",
    "Booking Issue",
    "Tracking Issue",
    "Payment Issue",
    "Complaint",
    "Feedback",
    "Other",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2
          className={cn(
            "text-3xl font-semibold",
            isDarkMode ? "text-white" : "text-slate-900"
          )}
        >
          Contact Support
        </h2>
        <p
          className={cn(
            "text-base",
            isDarkMode ? "text-slate-300/80" : "text-slate-600"
          )}
        >
          Get in touch with our support team. We're here to help you 24/7.
        </p>
      </div>

      {/* Contact Form and Office Details */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Contact Form */}
        <Card
          className={cn(
            "transition",
            isDarkMode
              ? "border-slate-800/60 bg-slate-900/70"
              : "border-slate-200 bg-white"
          )}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  isDarkMode
                    ? "bg-blue-500/20 text-blue-200"
                    : "bg-blue-100 text-blue-600"
                )}
              >
                <Headphones size={20} />
              </div>
              <CardTitle
                className={cn(
                  "text-xl",
                  isDarkMode ? "text-white" : "text-slate-900"
                )}
              >
                Send us a Message
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className={cn(
                      "peer pt-6",
                      isDarkMode
                        ? "border-slate-700 bg-slate-800 text-white"
                        : "border-slate-200 bg-white"
                    )}
                  />
                  <Label
                    htmlFor="name"
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-all duration-200 pointer-events-none",
                      "peer-focus:top-0 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:px-1",
                      formData.name ? "top-0 text-xs -translate-y-1/2 px-1" : "",
                      isDarkMode
                        ? "peer-focus:text-blue-200 peer-focus:bg-slate-900/70"
                        : "peer-focus:text-blue-600 peer-focus:bg-white",
                      isDarkMode
                        ? formData.name
                          ? "text-blue-200 bg-slate-900/70"
                          : "text-slate-400"
                        : formData.name
                          ? "text-blue-600 bg-white"
                          : "text-slate-500"
                    )}
                  >
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className={cn(
                      "peer pt-6",
                      isDarkMode
                        ? "border-slate-700 bg-slate-800 text-white"
                        : "border-slate-200 bg-white"
                    )}
                  />
                  <Label
                    htmlFor="email"
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-all duration-200 pointer-events-none",
                      "peer-focus:top-0 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:px-1",
                      formData.email ? "top-0 text-xs -translate-y-1/2 px-1" : "",
                      isDarkMode
                        ? "peer-focus:text-blue-200 peer-focus:bg-slate-900/70"
                        : "peer-focus:text-blue-600 peer-focus:bg-white",
                      isDarkMode
                        ? formData.email
                          ? "text-blue-200 bg-slate-900/70"
                          : "text-slate-400"
                        : formData.email
                          ? "text-blue-600 bg-white"
                          : "text-slate-500"
                    )}
                  >
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={cn(
                      "peer pt-6",
                      isDarkMode
                        ? "border-slate-700 bg-slate-800 text-white"
                        : "border-slate-200 bg-white"
                    )}
                  />
                  <Label
                    htmlFor="phone"
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-all duration-200 pointer-events-none",
                      "peer-focus:top-0 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:px-1",
                      formData.phone ? "top-0 text-xs -translate-y-1/2 px-1" : "",
                      isDarkMode
                        ? "peer-focus:text-blue-200 peer-focus:bg-slate-900/70"
                        : "peer-focus:text-blue-600 peer-focus:bg-white",
                      isDarkMode
                        ? formData.phone
                          ? "text-blue-200 bg-slate-900/70"
                          : "text-slate-400"
                        : formData.phone
                          ? "text-blue-600 bg-white"
                          : "text-slate-500"
                    )}
                  >
                    Phone Number
                  </Label>
                </div>
                <div>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger
                      className={cn(
                        "h-10",
                        isDarkMode
                          ? "border-slate-700 bg-slate-800 text-white"
                          : "border-slate-200 bg-white"
                      )}
                    >
                      <SelectValue placeholder="Category *" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="relative">
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                  className={cn(
                    "peer pt-6",
                    isDarkMode
                      ? "border-slate-700 bg-slate-800 text-white"
                      : "border-slate-200 bg-white"
                  )}
                />
                <Label
                  htmlFor="subject"
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-all duration-200 pointer-events-none",
                    "peer-focus:top-0 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:px-1",
                    formData.subject ? "top-0 text-xs -translate-y-1/2 px-1" : "",
                    isDarkMode
                      ? "peer-focus:text-blue-200 peer-focus:bg-slate-900/70"
                      : "peer-focus:text-blue-600 peer-focus:bg-white",
                    isDarkMode
                      ? formData.subject
                        ? "text-blue-200 bg-slate-900/70"
                        : "text-slate-400"
                      : formData.subject
                        ? "text-blue-600 bg-white"
                        : "text-slate-500"
                  )}
                >
                  Subject <span className="text-red-500">*</span>
                </Label>
              </div>

              <div className="relative">
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={5}
                  className={cn(
                    "peer pt-6 resize-none",
                    isDarkMode
                      ? "border-slate-700 bg-slate-800 text-white"
                      : "border-slate-200 bg-white"
                  )}
                />
                <Label
                  htmlFor="message"
                  className={cn(
                    "absolute left-3 top-4 text-sm transition-all duration-200 pointer-events-none",
                    "peer-focus:top-0 peer-focus:text-xs peer-focus:-translate-y-1/2 peer-focus:px-1",
                    formData.message ? "top-0 text-xs -translate-y-1/2 px-1" : "",
                    isDarkMode
                      ? "peer-focus:text-blue-200 peer-focus:bg-slate-900/70"
                      : "peer-focus:text-blue-600 peer-focus:bg-white",
                    isDarkMode
                      ? formData.message
                        ? "text-blue-200 bg-slate-900/70"
                        : "text-slate-400"
                      : formData.message
                        ? "text-blue-600 bg-white"
                        : "text-slate-500"
                  )}
                >
                  Message <span className="text-red-500">*</span>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Office Hours & Address */}
        <div className="space-y-6">
          <Card
            className={cn(
              "transition",
              isDarkMode
                ? "border-slate-800/60 bg-slate-900/70"
                : "border-slate-200 bg-white"
            )}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    isDarkMode
                      ? "bg-blue-500/20 text-blue-200"
                      : "bg-blue-100 text-blue-600"
                  )}
                >
                  <Clock size={20} />
                </div>
                <CardTitle
                  className={cn(
                    "text-lg",
                    isDarkMode ? "text-white" : "text-slate-900"
                  )}
                >
                  Office Hours
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {officeHours.map((schedule) => (
                  <div
                    key={schedule.day}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3",
                      isDarkMode
                        ? "border-slate-800 bg-slate-800/40"
                        : "border-slate-200 bg-slate-50"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isDarkMode ? "text-slate-200" : "text-slate-700"
                      )}
                    >
                      {schedule.day}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-slate-300" : "text-slate-600"
                      )}
                    >
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "transition",
              isDarkMode
                ? "border-slate-800/60 bg-slate-900/70"
                : "border-slate-200 bg-white"
            )}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    isDarkMode
                      ? "bg-blue-500/20 text-blue-200"
                      : "bg-blue-100 text-blue-600"
                  )}
                >
                  <MapPin size={20} />
                </div>
                <CardTitle
                  className={cn(
                    "text-lg",
                    isDarkMode ? "text-white" : "text-slate-900"
                  )}
                >
                  Office Address
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                )}
              >
                {companyData.contact.address}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Methods Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card
              key={method.title}
              className={cn(
                "transition-all duration-300 hover:shadow-lg",
                isDarkMode
                  ? "border-slate-800/60 bg-slate-900/70 hover:border-blue-500/40"
                  : "border-slate-200 bg-white hover:border-blue-300/50"
              )}
            >
              <CardHeader>
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl mb-3",
                    isDarkMode
                      ? "bg-blue-500/20 text-blue-200"
                      : "bg-blue-100 text-blue-600"
                  )}
                >
                  <Icon size={24} />
                </div>
                <CardTitle
                  className={cn(
                    "text-lg",
                    isDarkMode ? "text-white" : "text-slate-900"
                  )}
                >
                  {method.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  {method.description}
                </p>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-blue-200" : "text-blue-600"
                  )}
                >
                  {method.contact}
                </p>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full",
                    isDarkMode
                      ? "border-blue-500/40 bg-transparent text-blue-100 hover:bg-blue-500/10"
                      : "border-blue-500/40 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20"
                  )}
                  onClick={() => window.open(method.action, "_blank")}
                >
                  {method.actionText}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ContactSupport;

