"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

export default function ContactAgentForm({
  propertyTitle,
  propertyId,
}: {
  propertyTitle: string;
  propertyId: number;
}) {
  const t = useTranslations("ContactAgent");
  const [submitted, setSubmitted] = useState(false);

  const schema = z.object({
    name: z.string().min(2, t("errorRequired")),
    email: z.string().email(t("errorEmail")),
    phone: z.string().min(10, t("errorPhone")),
    message: z.string().min(10, t("errorMessage")),
  });

  type FormData = z.infer<typeof schema>;

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
      toast.success(t("toastSuccess"));
    } catch {
      toast.error(t("toastError"));
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="font-bold text-[#0A1628] font-[var(--font-playfair)] mb-2">{t("successTitle")}</h3>
        <p className="text-gray-500 text-sm">
          {t("successCopy")}{" "}
          <span className="font-semibold">{propertyTitle}</span>{t("successCopySuffix")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <h3 className="font-bold text-[#0A1628] font-[var(--font-playfair)] mb-5">{t("title")}</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5 block">{t("fullNameLabel")}</Label>
          <Input id="name" {...register("name")} placeholder={t("fullNamePlaceholder")} className={errors.name ? "border-red-400" : ""} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">{t("emailLabel")}</Label>
          <Input id="email" type="email" {...register("email")} placeholder={t("emailPlaceholder")} className={errors.email ? "border-red-400" : ""} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1.5 block">{t("phoneLabel")}</Label>
          <Input id="phone" {...register("phone")} placeholder={t("phonePlaceholder")} className={errors.phone ? "border-red-400" : ""} />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-1.5 block">{t("messageLabel")}</Label>
          <Textarea
            id="message"
            {...register("message")}
            placeholder={t("messagePlaceholder", { property: propertyTitle })}
            rows={3}
            className={errors.message ? "border-red-400" : ""}
          />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-[#C5A55A] text-[#0A1628] font-bold hover:bg-[#D4B96A] rounded-xl py-5">
          {isSubmitting ? t("sending") : t("sendCta")}
        </Button>
      </form>
    </div>
  );
}
