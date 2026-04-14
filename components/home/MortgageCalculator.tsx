"use client";

import { useState } from "react";
import { Calculator, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Info */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#C5A55A]/10 rounded-full px-4 py-1.5 mb-4">
              <span className="text-[#C5A55A] text-sm font-semibold uppercase tracking-wider">
                Mortgage Calculator
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A1628] font-[var(--font-playfair)] mb-6">
              Estimate Your Monthly Payment
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Use our mortgage calculator to get an estimate of your monthly payment.
              Our licensed loan originators are ready to help you find the perfect
              financing solution.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "FHA loans from 3.5% down",
                "VA loans with 0% down for veterans",
                "Hometown Heroes program benefits",
                "Conventional loans with competitive rates",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C5A55A]/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#C5A55A]" />
                  </div>
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0A1628] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#162447] transition-colors"
            >
              Speak With A Loan Originator
            </Link>
          </div>

          {/* Right: Calculator */}
          <div className="bg-[#F8F7F4] rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#0A1628] flex items-center justify-center">
                <Calculator className="w-5 h-5 text-[#C5A55A]" />
              </div>
              <h3 className="text-xl font-bold text-[#0A1628] font-[var(--font-playfair)]">
                Payment Estimator
              </h3>
            </div>

            <div className="space-y-5 mb-6">
              <div>
                <Label htmlFor="home-price" className="text-[#0A1628] font-medium mb-1.5 block">
                  Home Price
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="home-price"
                    value={homePrice}
                    onChange={(e) => setHomePrice(e.target.value)}
                    className="pl-9 bg-white border-gray-200 focus:border-[#C5A55A] focus:ring-[#C5A55A]"
                    placeholder="350,000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="down-payment" className="text-[#0A1628] font-medium mb-1.5 block">
                    Down Payment (%)
                  </Label>
                  <Input
                    id="down-payment"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    className="bg-white border-gray-200 focus:border-[#C5A55A]"
                    placeholder="20"
                  />
                </div>
                <div>
                  <Label htmlFor="interest-rate" className="text-[#0A1628] font-medium mb-1.5 block">
                    Interest Rate (%)
                  </Label>
                  <Input
                    id="interest-rate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="bg-white border-gray-200 focus:border-[#C5A55A]"
                    placeholder="7.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="loan-term" className="text-[#0A1628] font-medium mb-1.5 block">
                  Loan Term (years)
                </Label>
                <select
                  id="loan-term"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#C5A55A]"
                >
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                  <option value="20">20 Years</option>
                  <option value="30">30 Years</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleCalculate}
              className="w-full bg-[#C5A55A] text-[#0A1628] font-bold hover:bg-[#D4B96A] rounded-xl py-5"
            >
              Calculate Payment
            </Button>

            {result && (
              <div className="mt-6 p-6 bg-[#0A1628] rounded-2xl text-white">
                <div className="text-center mb-4">
                  <div className="text-white/60 text-sm mb-1">Estimated Monthly Payment</div>
                  <div className="text-4xl font-bold text-[#C5A55A] font-[var(--font-playfair)]">
                    {fmt(result.monthly)}
                  </div>
                  <div className="text-white/40 text-xs mt-1">Principal & Interest only</div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-white/50 text-xs mb-1">Loan Amount</div>
                    <div className="text-white text-sm font-bold">{fmt(result.principal)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/50 text-xs mb-1">Total Interest</div>
                    <div className="text-white text-sm font-bold">{fmt(result.totalInterest)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white/50 text-xs mb-1">Total Payment</div>
                    <div className="text-white text-sm font-bold">{fmt(result.totalPayment)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
