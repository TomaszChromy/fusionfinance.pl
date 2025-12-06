"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export default function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = "horizontal",
  className = "",
}: StepperProps) {
  if (orientation === "vertical") {
    return (
      <div className={`space-y-0 ${className}`}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && index <= currentStep;

          return (
            <div key={step.id} className="flex gap-4">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <motion.button
                  onClick={isClickable ? () => onStepClick(index) : undefined}
                  disabled={!isClickable}
                  whileHover={isClickable ? { scale: 1.1 } : undefined}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCompleted
                      ? "bg-[#4ade80] text-[#08090c]"
                      : isCurrent
                      ? "bg-[#c9a962] text-[#08090c]"
                      : "bg-[#0c0d10] border border-white/10 text-[#71717a]"
                  } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    index + 1
                  )}
                </motion.button>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-12 ${isCompleted ? "bg-[#4ade80]" : "bg-white/10"}`} />
                )}
              </div>

              {/* Step content */}
              <div className="pb-12">
                <h4 className={`text-sm font-medium ${isCurrent ? "text-[#c9a962]" : isCompleted ? "text-[#f4f4f5]" : "text-[#71717a]"}`}>
                  {step.title}
                </h4>
                {step.description && (
                  <p className="text-xs text-[#71717a] mt-0.5">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && index <= currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Step */}
            <div className="flex flex-col items-center">
              <motion.button
                onClick={isClickable ? () => onStepClick(index) : undefined}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.1 } : undefined}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isCompleted
                    ? "bg-[#4ade80] text-[#08090c]"
                    : isCurrent
                    ? "bg-[#c9a962] text-[#08090c]"
                    : "bg-[#0c0d10] border border-white/10 text-[#71717a]"
                } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.icon ? (
                  step.icon
                ) : (
                  index + 1
                )}
              </motion.button>
              <span className={`text-xs mt-2 text-center max-w-[80px] ${
                isCurrent ? "text-[#c9a962]" : isCompleted ? "text-[#f4f4f5]" : "text-[#71717a]"
              }`}>
                {step.title}
              </span>
            </div>

            {/* Connector */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? "bg-[#4ade80]" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Simple Step Indicator (dots)
export function StepIndicator({
  total,
  current,
  onStepClick,
  className = "",
}: {
  total: number;
  current: number;
  onStepClick?: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, index) => (
        <motion.button
          key={index}
          onClick={onStepClick ? () => onStepClick(index) : undefined}
          whileHover={onStepClick ? { scale: 1.2 } : undefined}
          className={`rounded-full transition-all ${
            index === current
              ? "w-6 h-2 bg-[#c9a962]"
              : "w-2 h-2 bg-white/20 hover:bg-white/40"
          } ${onStepClick ? "cursor-pointer" : "cursor-default"}`}
        />
      ))}
    </div>
  );
}

