"use client";

/**
 * @fileoverview ElectionTimeline component — interactive visual representation
 * of the 5-step election process.
 *
 * Renders a horizontal timeline on desktop and a vertical list on mobile.
 * Each step is clickable to expand details and trigger a chat query.
 * Supports an active step indicator driven by the conversation context.
 *
 * @module components/ElectionTimeline
 */

import { motion, AnimatePresence } from "framer-motion";
import { TimelineStep } from "@/store/chatStore";
import { ELECTION_TIMELINE } from "@/lib/electionData";
import { useState, useCallback } from "react";

interface Props {
  /** The ID of the currently active/highlighted step */
  activeStepId?: string;
  /** Callback invoked when a step is clicked by the user */
  onStepClick?: (step: TimelineStep) => void;
}

/**
 * ElectionTimeline displays the 5-step election process as an interactive,
 * accessible timeline component. Steps can be clicked to reveal educational
 * details and trigger follow-up chat conversations.
 *
 * @param {Props} props - Component props
 * @returns {JSX.Element} Interactive election timeline
 */
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

  /**
   * Handles clicking on a timeline step.
   * Toggles the expanded detail panel and notifies the parent.
   *
   * @param {typeof steps[0]} step - The step that was clicked
   */
  const handleStepClick = useCallback(
    (step: typeof steps[0]) => {
      setExpandedId((prev) => (prev === step.id ? null : step.id));
      if (onStepClick) onStepClick(step);
    },
    [onStepClick]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glow-card p-6 mb-4"
      role="region"
      aria-label="Election Process Timeline"
    >
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
        Election Process Timeline
      </h3>

      {/* Desktop horizontal timeline */}
      <div
        className="hidden md:flex items-start justify-between gap-0 mb-4"
        role="list"
        aria-label="Election steps"
      >
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-start flex-1 relative" role="listitem">
            <div
              className={`timeline-step cursor-pointer group flex-1 ${step.status}`}
              onClick={() => handleStepClick(step)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleStepClick(step);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={expandedId === step.id}
              aria-label={`${step.title} — ${step.status}. Press to ${expandedId === step.id ? "collapse" : "expand"} details`}
            >
              <motion.div
                className="dot relative focus:outline-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-hidden="true"
              >
                {step.icon}
              </motion.div>
              <span
                className={`text-xs font-medium mt-2 text-center ${
                  step.status === "active"
                    ? "text-primary-400 font-bold"
                    : step.status === "done"
                    ? "text-accent-400"
                    : "text-slate-500"
                }`}
              >
                {step.title}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`timeline-connector mt-5 mx-1 ${step.status === "done" ? "done" : ""}`}
                role="presentation"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>

      {/* Expanded details panel */}
      <AnimatePresence mode="wait">
        {expandedId && (
          <motion.div
            key={expandedId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            role="region"
            aria-label={`Details for ${steps.find((s) => s.id === expandedId)?.title}`}
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
      <div className="md:hidden space-y-4 mt-2" role="list" aria-label="Election steps">
        {steps.map((step, idx) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="flex items-start gap-3 cursor-pointer group"
            onClick={() => handleStepClick(step)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStepClick(step);
              }
            }}
            role="listitem button"
            tabIndex={0}
            aria-expanded={expandedId === step.id}
            aria-label={`${step.title} — ${step.status}`}
          >
            <div className="flex flex-col items-center">
              <div className={`timeline-step ${step.status}`} aria-hidden="true">
                <div className="dot relative">{step.icon}</div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-0.5 h-full min-h-[32px] mt-1 ${
                    step.status === "done" ? "bg-accent-500" : "bg-chat-border"
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="pt-1.5 flex-1 pb-2">
              <span
                className={`text-sm ${
                  step.status === "active"
                    ? "text-primary-400 font-bold text-base"
                    : step.status === "done"
                    ? "text-accent-400 font-semibold"
                    : "text-slate-400 font-semibold"
                }`}
              >
                {step.title}
              </span>

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
