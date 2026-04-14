"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Phone number required"),
  message: z.string().min(10, "Please write a brief message"),
});

type FormData = z.infer<typeof schema>;

export default function ContactAgentForm({
  propertyTitle,
  propertyId,
}: {
  propertyTitle: string;
  propertyId: number;
}) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          interest: "buying",
          source: `property_inquiry:${propertyId}`,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
      toast.success("Message sent! We'll be in touch shortly.");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="font-bold text-[#0A1628] font-[var(--font-playfair)] mb-2">
          Message Sent!
        </h3>
        <p className="text-gray-500 text-sm">
          We received your inquiry about{" "}
          <span className="font-semibold">{propertyTitle}</span>. An agent
          will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="font-bold text-[#0A1628] font-[var(--font-playfair)] mb-5">
        Contact About This Property
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5 block">
            Full Name
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Your name"
            className={errors.name ? "border-red-400" : ""}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="your@email.com"
            className={errors.email ? "border-red-400" : ""}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1.5 block">
            Phone
          </Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="(305) 000-0000"
            className={errors.phone ? "border-red-400" : ""}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-1.5 block">
            Message
          </Label>
          <Textarea
            id="message"
            {...register("message")}
            placeholder={`I'm interested in ${propertyTitle}...`}
            rows={3}
            className={errors.message ? "border-red-400" : ""}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#C5A55A] text-[#0A1628] font-bold hover:bg-[#D4B96A] rounded-xl py-5"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
