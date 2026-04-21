"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TimelineStep } from "@/store/chatStore";
import { ELECTION_TIMELINE } from "@/lib/electionData";
import { useState } from "react";

interface Props {
  activeStepId?: string;
  onStepClick?: (step: TimelineStep) => void;
}

export default function ElectionTimeline({ activeStepId, onStepClick }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const steps = ELECTION_TIMELINE.map((step) => {
    const stepIndex = ELECTION_TIMELINE.findIndex((s) => s.id === step.id);
    const activeIndex = ELECTION_TIMELINE.findIndex((s) => s.id === activeStepId);
    let status: "done" | "active" | "pending" = "pending";
    if (activeStepId) {
      if (stepIndex < activeIndex) status = "done";
      else if (stepIndex === activeIndex) status = "active";
    }
    return { ...step, status };
  });

  const handleStepClick = (step: typeof steps[0]) => {
    setExpandedId(expandedId === step.id ? null : step.id);
    if (onStepClick) onStepClick(step);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glow-card p-6 mb-4"
    >
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
        Election Process Timeline
      </h3>

      {/* Desktop horizontal timeline */}
      <div className="hidden md:flex items-start justify-between gap-0 mb-4">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-start flex-1 relative">
            <div
              className={`timeline-step cursor-pointer group flex-1 ${step.status}`}
              onClick={() => handleStepClick(step)}
            >
              <motion.div
                className="dot relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {step.icon}
              </motion.div>
              <span className={`text-xs font-medium mt-2 text-center ${
                step.status === "active" ? "text-primary-400 font-bold" :
                step.status === "done" ? "text-accent-400" : "text-slate-500"
              }`}>
                {step.title}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div className={`timeline-connector mt-5 mx-1 ${step.status === "done" ? "done" : ""}`} />
            )}
          </div>
        ))}
      </div>

      {/* Expanded details (Desktop & Mobile) */}
      <AnimatePresence mode="wait">
        {expandedId && (
          <motion.div
            key={expandedId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-xl bg-chat-bubble border border-primary-500/20">
              <h4 className="text-sm font-bold text-white mb-2">
                {steps.find((s) => s.id === expandedId)?.title}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                {steps.find((s) => s.id === expandedId)?.description}
              </p>
              <div className="bg-primary-900/30 p-3 rounded-lg border border-primary-500/10">
                <p className="text-xs font-semibold text-primary-400 mb-1">💡 Why it matters:</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {steps.find((s) => s.id === expandedId)?.whyItMatters}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile vertical timeline */}
      <div className="md:hidden space-y-4 mt-2">
        {steps.map((step, idx) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`flex items-start gap-3 cursor-pointer group`}
            onClick={() => handleStepClick(step)}
          >
            <div className="flex flex-col items-center">
              <div className={`timeline-step ${step.status}`}>
                <div className="dot relative">
                  {step.icon}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-0.5 h-full min-h-[32px] mt-1 ${step.status === "done" ? "bg-accent-500" : "bg-chat-border"}`} />
              )}
            </div>
            <div className="pt-1.5 flex-1 pb-2">
              <span className={`text-sm ${
                step.status === "active" ? "text-primary-400 font-bold text-base" :
                step.status === "done" ? "text-accent-400 font-semibold" : "text-slate-400 font-semibold"
              }`}>
                {step.title}
              </span>
              
              {/* Only show basic description if not expanded */}
              {expandedId !== step.id && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                  {step.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
