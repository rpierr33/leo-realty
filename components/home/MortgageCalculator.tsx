"use client";

import { useState } from "react";
import { Calculator, DollarSign, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function calculateMortgage(
  price: number,
  downPct: number,
  rate: number,
  years: number
): { monthly: number; principal: number; totalInterest: number; totalPayment: number } {
  const principal = price * (1 - downPct / 100);
  const monthlyRate = rate / 100 / 12;
  const numPayments = years * 12;
  const monthly =
    monthlyRate > 0
      ? (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : principal / numPayments;
  const totalPayment = monthly * numPayments;
  const totalInterest = totalPayment - principal;
  return { monthly, principal, totalInterest, totalPayment };
}

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState("350000");
  const [downPayment, setDownPayment] = useState("20");
  const [interestRate, setInterestRate] = useState("7.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [result, setResult] = useState<ReturnType<typeof calculateMortgage> | null>(null);

  const handleCalculate = () => {
    const price = parseFloat(homePrice.replace(/,/g, "")) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseInt(loanTerm) || 30;
    setResult(calculateMortgage(price, down, rate, years));
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <section className="py-24 md:py-32 bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <div className="lg:pt-4">
            <span className="section-label">Mortgage Calculator</span>
            <h2 className="font-playfair text-[clamp(2rem,4vw,3.25rem)] font-bold text-white leading-tight mb-6">
              Estimate Your
              <br />
              <span className="text-[#C5A55A]">Monthly Payment</span>
            </h2>
            <p className="text-white/55 text-lg leading-relaxed mb-8">
              Use our mortgage calculator to get a quick estimate of your monthly payment.
              Our licensed loan originators are ready to help you find the perfect
              financing solution.
            </p>
            <div className="space-y-3 mb-10">
              {[
                "FHA loans from 3.5% down",
                "VA loans with 0% down for veterans",
                "Hometown Heroes program benefits",
                "Conventional loans with competitive rates",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5A55A] flex-shrink-0" />
                  <span className="text-white/55 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 bg-[#C5A55A] text-[#0A1628] font-bold text-sm px-7 py-3.5 rounded-full hover:bg-[#D4BA7A] transition-colors"
            >
              Speak With A Loan Originator
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Calculator */}
          <div className="bg-[#152238] border border-white/8 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-xl bg-[#C5A55A]/15 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-[#C5A55A]" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-white">Payment Estimator</h3>
            </div>

            <div className="space-y-5 mb-6">
              <div>
                <Label htmlFor="home-price" className="text-white/70 font-medium mb-1.5 block text-sm">
                  Home Price
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    id="home-price"
                    value={homePrice}
                    onChange={(e) => setHomePrice(e.target.value)}
                    className="pl-9 bg-[#0A1628]/50 border-white/10 text-white placeholder:text-white/25 focus:border-[#C5A55A] focus-visible:ring-[#C5A55A]/30"
                    placeholder="350,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="down-payment" className="text-white/70 font-medium mb-1.5 block text-sm">
                    Down Payment (%)
                  </Label>
                  <Input
                    id="down-payment"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    className="bg-[#0A1628]/50 border-white/10 text-white placeholder:text-white/25 focus:border-[#C5A55A]"
                    placeholder="20"
                  />
                </div>
                <div>
                  <Label htmlFor="interest-rate" className="text-white/70 font-medium mb-1.5 block text-sm">
                    Interest Rate (%)
                  </Label>
                  <Input
                    id="interest-rate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="bg-[#0A1628]/50 border-white/10 text-white placeholder:text-white/25 focus:border-[#C5A55A]"
                    placeholder="7.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="loan-term" className="text-white/70 font-medium mb-1.5 block text-sm">
                  Loan Term
                </Label>
                <select
                  id="loan-term"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-white/10 bg-[#0A1628]/50 text-white text-sm focus:outline-none focus:border-[#C5A55A]"
                >
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                  <option value="20">20 Years</option>
                  <option value="30">30 Years</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-[#C5A55A] text-[#0A1628] font-bold text-sm py-3.5 rounded-xl hover:bg-[#D4BA7A] transition-colors"
            >
              Calculate Payment
            </button>

            {result && (
              <div className="mt-6 p-6 bg-[#0A1628] rounded-xl border border-white/6">
                <div className="text-center mb-5">
                  <div className="text-white/40 text-xs mb-1 uppercase tracking-wider">Estimated Monthly Payment</div>
                  <div className="font-playfair text-4xl font-bold text-[#C5A55A]">
                    {fmt(result.monthly)}
                  </div>
                  <div className="text-white/30 text-xs mt-1">Principal &amp; Interest only</div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/8">
                  {[
                    { label: "Loan Amount", value: fmt(result.principal) },
                    { label: "Total Interest", value: fmt(result.totalInterest) },
                    { label: "Total Payment", value: fmt(result.totalPayment) },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-white/35 text-[10px] mb-1 uppercase tracking-wide">{s.label}</div>
                      <div className="text-white text-sm font-bold">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
