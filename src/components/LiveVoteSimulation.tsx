"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LiveVoteSimulation() {
  const [votes, setVotes] = useState([0, 0, 0]);
  const [isCounting, setIsCounting] = useState(true);

  useEffect(() => {
    // Target final percentages
    const targets = [45, 35, 20]; // Party A wins, Party B second, Party C third
    const totalDuration = 4000; // 4 seconds of counting

    let startTime: number;
    let animationFrame: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / totalDuration, 1);
      
      // Easing function for smoother slowdown at the end
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setVotes([
        Math.floor(targets[0] * easeOutQuart),
        Math.floor(targets[1] * easeOutQuart),
        Math.floor(targets[2] * easeOutQuart),
      ]);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsCounting(false);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="my-4 p-5 rounded-2xl bg-chat-surface border border-chat-border shadow-lg w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          📊 Live Vote Counting
        </h4>
        {isCounting ? (
          <span className="text-[10px] font-bold text-accent-500 animate-pulse uppercase tracking-widest bg-accent-500/10 px-2 py-1 rounded">
            Live
          </span>
        ) : (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-chat-border px-2 py-1 rounded">
            Final
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Candidate 1 */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-200 font-medium">Candidate A</span>
            <span className="text-white font-bold">{votes[0]}%</span>
          </div>
          <div className="w-full h-2.5 bg-chat-bg rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${votes[0]}%` }}
              transition={{ duration: 0.1 }} // Immediate follow of state
            />
          </div>
        </div>

        {/* Candidate 2 */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-200 font-medium">Candidate B</span>
            <span className="text-white font-bold">{votes[1]}%</span>
          </div>
          <div className="w-full h-2.5 bg-chat-bg rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${votes[1]}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Candidate 3 */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-200 font-medium">Candidate C</span>
            <span className="text-white font-bold">{votes[2]}%</span>
          </div>
          <div className="w-full h-2.5 bg-chat-bg rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-slate-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${votes[2]}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      {!isCounting && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-chat-border text-center"
        >
          <p className="text-xs font-bold text-primary-400">🎉 Candidate A Wins!</p>
        </motion.div>
      )}
    </div>
  );
}
