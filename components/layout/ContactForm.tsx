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

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [submitted, setSubmitted] = useState(false);

  const schema = z.object({
    name: z.string().min(2, t("errorRequired")),
    email: z.string().email(t("errorEmail")),
    phone: z.string().min(10, t("errorPhone")),
    subject: z.string().min(5, t("errorSubject")),
    interest: z.enum(["buying", "selling", "renting", "mortgage", "other"]),
    message: z.string().min(20, t("errorMessage")),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { interest: "buying" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.name.split(" ")[0] || data.name,
          lastName: data.name.split(" ").slice(1).join(" ") || "",
          email: data.email,
          phone: data.phone,
          interest: data.interest,
          message: `Subject: ${data.subject}\n\n${data.message}`,
          source: "contact_form",
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      toast.error(t("errorSubmit"));
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-3">
          {t("successTitle")}
        </h3>
        <p className="text-gray-500 text-lg">{t("successCopy")}</p>
        <p className="text-gray-400 text-sm mt-4">
          {t("successCallPrefix")}{" "}
          <a href="tel:+13057052030" className="text-[#C5A55A] font-medium">
            (305) 705-2030
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t("fullNameLabel")}
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder={t("fullNamePlaceholder")}
            className={errors.name ? "border-red-400" : "border-gray-200 focus:border-[#C5A55A]"}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t("emailLabel")}
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder={t("emailPlaceholder")}
            className={errors.email ? "border-red-400" : "border-gray-200 focus:border-[#C5A55A]"}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t("phoneLabel")}
          </Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder={t("phonePlaceholder")}
            className={errors.phone ? "border-red-400" : "border-gray-200 focus:border-[#C5A55A]"}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="interest" className="text-sm font-medium text-gray-700 mb-1.5 block">
            {t("interestLabel")}
          </Label>
          <select
            id="interest"
            {...register("interest")}
            className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#C5A55A] text-gray-700"
          >
            <option value="buying">{t("interestBuying")}</option>
            <option value="selling">{t("interestSelling")}</option>
            <option value="renting">{t("interestRenting")}</option>
            <option value="mortgage">{t("interestMortgage")}</option>
            <option value="other">{t("interestOther")}</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="subject" className="text-sm font-medium text-gray-700 mb-1.5 block">
          {t("subjectLabel")}
        </Label>
        <Input
          id="subject"
          {...register("subject")}
          placeholder={t("subjectPlaceholder")}
          className={errors.subject ? "border-red-400" : "border-gray-200 focus:border-[#C5A55A]"}
        />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
      </div>

      <div>
        <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-1.5 block">
          {t("messageLabel")}
        </Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder={t("messagePlaceholder")}
          rows={5}
          className={errors.message ? "border-red-400" : "border-gray-200 focus:border-[#C5A55A]"}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#C5A55A] text-[#0A1628] font-bold hover:bg-[#D4B96A] rounded-xl py-6 text-base"
      >
        {isSubmitting ? t("sending") : t("sendCta")}
      </Button>

      <p className="text-gray-400 text-xs text-center">
        {t("consentPrefix")}{" "}
        <a href="/privacy" className="text-[#C5A55A] hover:underline">{t("consentLink")}</a>
        {t("consentSuffix")}
      </p>
    </form>
  );
}
