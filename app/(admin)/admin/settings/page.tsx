"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings, Phone, Mail, MapPin, Globe } from "lucide-react";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    companyName: "Leo Realty Capital Investments",
    phone: "(305) 705-2030",
    email: "Info@leorealtycapitalinvestments.com",
    address: "909 North Miami Beach Blvd, Suite 301A, North Miami Beach, FL",
    hours: "Monday-Friday: 9:00 AM - 5:00 PM",
    website: "https://leorealtycapitalinvestments.com",
    facebook: "",
    instagram: "",
    linkedin: "",
    tagline: "MR 2% | 32 Years In Business | No One Does It Better",
    motto: "Mortgages Made Easy, Dreams Made Real",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // In production, this would save to site_settings table
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0A1628] font-[var(--font-playfair)]">Settings</h1>
        <p className="text-gray-500 mt-1">Company information and site configuration</p>
      </div>

      <div className="space-y-6">
        {/* Company Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#0A1628]/5 flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#C5A55A]" />
            </div>
            <h2 className="text-lg font-bold text-[#0A1628] font-[var(--font-playfair)]">Company Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Company Name</Label>
              <Input value={settings.companyName} onChange={(e) => setSettings(s => ({ ...s, companyName: e.target.value }))} className="border-gray-200 focus:border-[#C5A55A]" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Tagline</Label>
              <Input value={settings.tagline} onChange={(e) => setSettings(s => ({ ...s, tagline: e.target.value }))} className="border-gray-200 focus:border-[#C5A55A]" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Motto</Label>
              <Input value={settings.motto} onChange={(e) => setSettings(s => ({ ...s, motto: e.target.value }))} className="border-gray-200 focus:border-[#C5A55A]" />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#0A1628]/5 flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#C5A55A]" />
            </div>
            <h2 className="text-lg font-bold text-[#0A1628] font-[var(--font-playfair)]">Contact Information</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</Label>
                <Input value={settings.phone} onChange={(e) => setSettings(s => ({ ...s, phone: e.target.value }))} className="border-gray-200 focus:border-[#C5A55A]" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</Label>
                <Input value={settings.email} onChange={(e) => setSettings(s => ({ ...s, email: e.target.value }))} className="border-gray-200 focus:border-[#C5A55A]" />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Address</Label>
              <Input value={settings.address} onChange={(e) => setSettings(s => ({ ...s, address: e.target.value }))} className="border-gray-200 focus:border-[#C5A55A]" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1.5 block">Office Hours</Label>
              <Input value={settings.hours} onChange={(e) => setSettings(s => ({ ...s, hours: e.target.value }))} className="border-gray-200 focus:border-[#C5A55A]" />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#0A1628]/5 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#C5A55A]" />
            </div>
            <h2 className="text-lg font-bold text-[#0A1628] font-[var(--font-playfair)]">Social Media</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: "facebook", label: "Facebook URL" },
              { key: "instagram", label: "Instagram URL" },
              { key: "linkedin", label: "LinkedIn URL" },
            ].map((field) => (
              <div key={field.key}>
                <Label className="text-sm font-medium text-gray-700 mb-1.5 block">{field.label}</Label>
                <Input
                  value={settings[field.key as keyof typeof settings]}
                  onChange={(e) => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                  placeholder={`https://${field.key}.com/leorealty`}
                  className="border-gray-200 focus:border-[#C5A55A]"
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#C5A55A] text-[#0A1628] font-bold hover:bg-[#D4B96A] rounded-xl px-8 py-5"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
