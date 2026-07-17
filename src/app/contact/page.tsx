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

      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20 border-b border-border bg-gradient-to-b from-background to-secondary/10">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-12 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-24 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary"
          >
            <Mail className="h-4 w-4 text-accent animate-pulse" />
            Get In Touch
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground"
          >
            We&apos;re Here to Help.
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Drop Us a Message.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Have a question about templates, API pricing, or custom domains? Send us a ticket and our support team will respond within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* Main Form content */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Side: Contact Information Cards */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="rounded-2xl border border-border p-6 bg-card/45 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-foreground">Contact Channels</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Reach out directly via our specialized corporate support portals or use our coordinates below.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex gap-4 items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">General Support</h4>
                      <p className="text-sm font-bold text-foreground mt-0.5">support@buildmyportfolio.com</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">Live Chat Support</h4>
                      <p className="text-sm font-bold text-foreground mt-0.5">Available on dashboard editor</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase">Location Headquarters</h4>
                      <p className="text-sm font-bold text-foreground mt-0.5">San Francisco, California</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border p-6 bg-gradient-to-br from-primary/5 to-accent/5 shadow-sm text-left">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-accent" />
                  Are you a developer?
                </h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  If you have found a rendering bug or want to submit custom template layouts, submit a pull request on our GitHub repository.
                </p>
              </div>
            </div>

            {/* Right Side: Interactive Form Container */}
            <div className="lg:col-span-7 rounded-2xl border border-border bg-card/60 p-6 sm:p-8 shadow-xl backdrop-blur-md">
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
                        <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Your Name</label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Linus Torvalds"
                          disabled={localLoading}
                          className={cn(
                            "w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary disabled:opacity-50",
                            errors.name && "border-destructive focus:ring-destructive/30"
                          )}
                          {...register("name")}
                        />
                        {errors.name && (
                          <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email Address</label>
                        <input
                          id="email"
                          type="email"
                          placeholder="linus@git.org"
                          disabled={localLoading}
                          className={cn(
                            "w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary disabled:opacity-50",
                            errors.email && "border-destructive focus:ring-destructive/30"
                          )}
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-xs font-semibold text-muted-foreground">Message Subject</label>
                      <input
                        id="subject"
                        type="text"
                        placeholder="Inquiry about API pricing tier integrations"
                        disabled={localLoading}
                        className={cn(
                          "w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary disabled:opacity-50",
                          errors.subject && "border-destructive focus:ring-destructive/30"
                        )}
                        {...register("subject")}
                      />
                      {errors.subject && (
                        <p className="text-xs font-medium text-destructive">{errors.subject.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-semibold text-muted-foreground">Message Details</label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Describe the details of your inquiry here..."
                        disabled={localLoading}
                        className={cn(
                          "w-full rounded-lg border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/45 focus:border-primary disabled:opacity-50 resize-none",
                          errors.message && "border-destructive focus:ring-destructive/30"
                        )}
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className="text-xs font-medium text-destructive">{errors.message.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={localLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/95 transition-all disabled:opacity-50 mt-4"
                    >
                      {localLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message Ticket
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
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Message Sent Successfully</h3>
                    <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                      Thank you for contacting us. Your ticket has been registered in our database system and a support engineer will review it shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-2 rounded-lg bg-secondary px-5 py-2 text-xs font-semibold text-foreground hover:bg-muted border border-border transition-colors"
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
