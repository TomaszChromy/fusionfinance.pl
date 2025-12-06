"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";

type CalculatorType = "compound" | "loan" | "roi" | "inflation";

interface CalculatorProps {
  type?: CalculatorType;
  className?: string;
}

export default function Calculator({ type = "compound", className = "" }: CalculatorProps) {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>(type);

  return (
    <div className={`bg-[#0c0d10] border border-white/5 rounded-xl ${className}`}>
      {/* Calculator Type Selector */}
      <div className="flex border-b border-white/5 overflow-x-auto scrollbar-none">
        {[
          { id: "compound", label: "Procent składany", icon: "📈" },
          { id: "loan", label: "Rata kredytu", icon: "🏦" },
          { id: "roi", label: "ROI", icon: "💰" },
          { id: "inflation", label: "Inflacja", icon: "📊" },
        ].map((calc) => (
          <button
            key={calc.id}
            onClick={() => setCalculatorType(calc.id as CalculatorType)}
            className={`flex-1 min-w-[100px] px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
              calculatorType === calc.id
                ? "bg-[#c9a962]/10 text-[#c9a962] border-b-2 border-[#c9a962]"
                : "text-[#a1a1aa] hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="mr-1">{calc.icon}</span>
            {calc.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {calculatorType === "compound" && <CompoundInterestCalc />}
        {calculatorType === "loan" && <LoanCalc />}
        {calculatorType === "roi" && <ROICalc />}
        {calculatorType === "inflation" && <InflationCalc />}
      </div>
    </div>
  );
}

// Compound Interest Calculator
function CompoundInterestCalc() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);
  const [compounding, setCompounding] = useState(12);

  const result = useMemo(() => {
    const r = rate / 100;
    const n = compounding;
    const t = years;
    const amount = principal * Math.pow(1 + r / n, n * t);
    const interest = amount - principal;
    return { amount: amount.toFixed(2), interest: interest.toFixed(2) };
  }, [principal, rate, years, compounding]);

  return (
    <div className="space-y-4">
      <InputField label="Kapitał początkowy (PLN)" value={principal} onChange={setPrincipal} min={0} />
      <InputField label="Stopa procentowa (%)" value={rate} onChange={setRate} min={0} max={100} step={0.1} />
      <InputField label="Okres (lata)" value={years} onChange={setYears} min={1} max={50} />
      <div>
        <label className="text-xs text-[#71717a] mb-1 block">Kapitalizacja</label>
        <select
          value={compounding}
          onChange={(e) => setCompounding(Number(e.target.value))}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-[#f4f4f5] focus:outline-none focus:border-[#c9a962]/50"
        >
          <option value={1}>Roczna</option>
          <option value={4}>Kwartalna</option>
          <option value={12}>Miesięczna</option>
          <option value={365}>Dzienna</option>
        </select>
      </div>
      <ResultDisplay
        items={[
          { label: "Wartość końcowa", value: `${Number(result.amount).toLocaleString()} PLN`, highlight: true },
          { label: "Zysk z odsetek", value: `${Number(result.interest).toLocaleString()} PLN` },
        ]}
      />
    </div>
  );
}

// Loan Calculator
function LoanCalc() {
  const [amount, setAmount] = useState(300000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(25);

  const result = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const payments = years * 12;
    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
    const totalPayment = monthlyPayment * payments;
    const totalInterest = totalPayment - amount;
    return { monthly: monthlyPayment.toFixed(2), total: totalPayment.toFixed(2), interest: totalInterest.toFixed(2) };
  }, [amount, rate, years]);

  return (
    <div className="space-y-4">
      <InputField label="Kwota kredytu (PLN)" value={amount} onChange={setAmount} min={0} step={1000} />
      <InputField label="Oprocentowanie (%)" value={rate} onChange={setRate} min={0} max={30} step={0.1} />
      <InputField label="Okres spłaty (lata)" value={years} onChange={setYears} min={1} max={35} />
      <ResultDisplay
        items={[
          { label: "Rata miesięczna", value: `${Number(result.monthly).toLocaleString()} PLN`, highlight: true },
          { label: "Suma odsetek", value: `${Number(result.interest).toLocaleString()} PLN` },
          { label: "Całkowity koszt", value: `${Number(result.total).toLocaleString()} PLN` },
        ]}
      />
    </div>
  );
}

// ROI Calculator
function ROICalc() {
  const [investment, setInvestment] = useState(10000);
  const [returnValue, setReturnValue] = useState(12000);

  const roi = useMemo(() => {
    return (((returnValue - investment) / investment) * 100).toFixed(2);
  }, [investment, returnValue]);

  return (
    <div className="space-y-4">
      <InputField label="Kwota inwestycji (PLN)" value={investment} onChange={setInvestment} min={0} />
      <InputField label="Wartość końcowa (PLN)" value={returnValue} onChange={setReturnValue} min={0} />
      <ResultDisplay
        items={[
          { label: "ROI", value: `${roi}%`, highlight: true },
          { label: "Zysk/Strata", value: `${(returnValue - investment).toLocaleString()} PLN` },
        ]}
      />
    </div>
  );
}

// Inflation Calculator
function InflationCalc() {
  const [amount, setAmount] = useState(100000);
  const [inflation, setInflation] = useState(5);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const futureValue = amount / Math.pow(1 + inflation / 100, years);
    const loss = amount - futureValue;
    return { future: futureValue.toFixed(2), loss: loss.toFixed(2) };
  }, [amount, inflation, years]);

  return (
    <div className="space-y-4">
      <InputField label="Obecna kwota (PLN)" value={amount} onChange={setAmount} min={0} />
      <InputField label="Średnia inflacja (%)" value={inflation} onChange={setInflation} min={0} max={50} step={0.1} />
      <InputField label="Okres (lata)" value={years} onChange={setYears} min={1} max={50} />
      <ResultDisplay
        items={[
          { label: "Realna wartość", value: `${Number(result.future).toLocaleString()} PLN`, highlight: true },
          { label: "Utrata wartości", value: `-${Number(result.loss).toLocaleString()} PLN` },
        ]}
      />
    </div>
  );
}

// Shared Input Field
function InputField({ label, value, onChange, min = 0, max, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <div>
      <label className="text-xs text-[#71717a] mb-1 block">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-[#f4f4f5] focus:outline-none focus:border-[#c9a962]/50"
      />
    </div>
  );
}

// Shared Result Display
function ResultDisplay({ items }: { items: { label: string; value: string; highlight?: boolean }[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-[#c9a962]/5 border border-[#c9a962]/20 rounded-lg">
      {items.map((item, i) => (
        <div key={i} className={`flex justify-between ${i > 0 ? "mt-2 pt-2 border-t border-[#c9a962]/10" : ""}`}>
          <span className="text-xs text-[#a1a1aa]">{item.label}</span>
          <span className={`text-sm font-medium ${item.highlight ? "text-[#c9a962]" : "text-[#f4f4f5]"}`}>{item.value}</span>
        </div>
      ))}
    </motion.div>
  );
}

