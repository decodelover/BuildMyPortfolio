"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required.").min(2, "Name must be at least 2 characters."),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  subject: z.string().min(1, "Subject is required.").min(4, "Subject must be at least 4 characters."),
  message: z.string().min(1, "Message is required.").min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [localLoading, setLocalLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setLocalLoading(true);
    try {
      // Store contact submission directly inside firestore database
      await addDoc(collection(db, "contactMessages"), {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      toast.success("Your message has been sent successfully!");
      reset();
    } catch (error) {
      console.error("Firestore contact submission error:", error);
      toast.error("Unable to send message. Please try again later.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20 border-b border-border/40 bg-secondary/5">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute top-12 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-60" />
        <div className="absolute top-24 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl opacity-60" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[9px] uppercase tracking-wider font-extrabold text-primary"
          >
            <Mail className="h-3.5 w-3.5 text-accent animate-pulse" />
            Get In Touch
          </motion.div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl leading-tight">
            We&apos;re Here to Help.{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Drop Us a Message.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Have a question about template customization, custom domain linkages, or billing configurations? Send us a ticket.
          </p>
        </div>
      </section>

      {/* Main content grid */}
      <section className="py-20 bg-background flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Side: Contact details */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="rounded-2xl border border-border bg-card/45 p-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Support Channels</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Reach out directly via our support portals or corporate headquarters details.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex gap-4 items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase">General Support</h4>
                      <p className="text-xs font-bold text-foreground mt-0.5">support@buildmyportfolio.com</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0">
                      <MessageSquare className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Live Chat Support</h4>
                      <p className="text-xs font-bold text-foreground mt-0.5">Available on dashboard editor</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Corporate HQ</h4>
                      <p className="text-xs font-bold text-foreground mt-0.5">San Francisco, California</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6 text-left">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-4.5 w-4.5 text-accent" />
                  Developer Submissions
                </h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
                  Have found a layout parsing bug or want to submit design presets? Submit an issue on our GitHub repository.
                </p>
              </div>
            </div>

            {/* Right Side: Contact Form Card */}
            <div className="lg:col-span-7 rounded-2xl border border-border bg-card/65 p-6 sm:p-8 shadow-xl backdrop-blur-md">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 text-left"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-xs font-bold text-muted-foreground">Your Name</label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Grace Hopper"
                          disabled={localLoading}
                          className={cn(
                            "w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/45 disabled:opacity-50",
                            errors.name && "border-destructive focus:ring-destructive/30"
                          )}
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="text-[10px] text-destructive mt-0.5">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-bold text-muted-foreground">Email Address</label>
                        <input
                          id="email"
                          type="email"
                          placeholder="grace@hopper.org"
                          disabled={localLoading}
                          className={cn(
                            "w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/45 disabled:opacity-50",
                            errors.email && "border-destructive focus:ring-destructive/30"
                          )}
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-[10px] text-destructive mt-0.5">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-xs font-bold text-muted-foreground">Subject</label>
                      <input
                        id="subject"
                        type="text"
                        placeholder="Inquiry about custom DNS configuration setup"
                        disabled={localLoading}
                        className={cn(
                          "w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/45 disabled:opacity-50",
                          errors.subject && "border-destructive focus:ring-destructive/30"
                        )}
                        {...register("subject")}
                      />
                      {errors.subject && (
                        <p className="text-[10px] text-destructive mt-0.5">{errors.subject.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-bold text-muted-foreground">Message</label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Please details the inquiries you have..."
                        disabled={localLoading}
                        className={cn(
                          "w-full rounded-xl border border-border/80 bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/45 disabled:opacity-50 resize-none",
                          errors.message && "border-destructive focus:ring-destructive/30"
                        )}
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-[10px] text-destructive mt-0.5">{errors.message.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={localLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50 mt-4 cursor-pointer"
                    >
                      {localLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending Inquiry...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Support Ticket
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10 space-y-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Ticket Created</h3>
                    <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                      Thank you! Your inquiry has been logged in our database system and a support engineer will review it shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-2 rounded-xl bg-secondary px-5 py-2.5 text-xs font-bold text-foreground hover:bg-muted border border-border/80 transition-colors cursor-pointer"
                    >
                      Submit Another Ticket
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
