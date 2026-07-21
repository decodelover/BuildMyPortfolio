"use client";

import { useState } from "react";
import Navbar from "@/components/layouts/navbar";
import Footer from "@/components/layouts/footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, MessageSquare, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24 text-left">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold uppercase tracking-wider">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">
              We&apos;re Here to Help
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground font-medium leading-relaxed">
              Have questions about enterprise custom domain setups, AI compilation, or billing options? Drop us a message.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Contact Details */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-sm font-extrabold text-foreground">Email Support</h4>
                <p className="text-xs text-muted-foreground">support@buildmyportfolio.com</p>
              </div>

              <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-3">
                <div className="h-9 w-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">
                  <MessageSquare className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-sm font-extrabold text-foreground">Response SLA</h4>
                <p className="text-xs text-muted-foreground">Under 4 hours for Pro &amp; Enterprise users.</p>
              </div>

              <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-2xl space-y-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-sm font-extrabold text-foreground">Headquarters</h4>
                <p className="text-xs text-muted-foreground">San Francisco, CA • Distributed Global Team</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2 rounded-3xl border border-border/60 bg-card/70 p-8 shadow-sm backdrop-blur-2xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-extrabold text-foreground">Message Sent!</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. Our engineering team will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">Your Name</label>
                      <input
                        {...register("name")}
                        type="text"
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                      />
                      {errors.name && <p className="text-[10px] text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">Email Address</label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                      />
                      {errors.email && <p className="text-[10px] text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Subject</label>
                    <input
                      {...register("subject")}
                      type="text"
                      placeholder="Custom domain mapping inquiry"
                      className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45"
                    />
                    {errors.subject && <p className="text-[10px] text-destructive">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Message</label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary/45 resize-none"
                    />
                    {errors.message && <p className="text-[10px] text-destructive">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={localLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-extrabold text-xs shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {localLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
