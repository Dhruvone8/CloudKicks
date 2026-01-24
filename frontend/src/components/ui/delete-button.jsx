// frontend/src/components/ui/delete-button.jsx
// Update the handleClick function and add a ref to prevent multiple calls:

"use client";

import { Undo03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState, useRef } from "react";

const DARK_BLUE = "#0B1C2D";

const DeleteButton = ({ id, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [count, setCount] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasConfirmedRef = useRef(false);

  useEffect(() => {
    if (!isDeleting || count === 0) return;
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [isDeleting, count]);

  useEffect(() => {
    if (isDeleting && count === 0 && !hasConfirmedRef.current) {
      hasConfirmedRef.current = true;
      const timeout = setTimeout(() => {
        if (onConfirm) onConfirm();
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [count, isDeleting, onConfirm]);

  const handleClick = (state) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsDeleting(state);
    if (state) {
      setCount(3);
      hasConfirmedRef.current = false; // Reset on new deletion attempt
    }
    setTimeout(() => setIsAnimating(false), 400);
  };

  return (
    <div className="relative h-10 w-full flex items-center justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        {!isDeleting ? (
          <motion.button
            key="delete"
            layoutId={`deleteButton-${id}`}
            onClick={() => handleClick(true)}
            whileTap={{ scale: 0.95 }}
            style={{ pointerEvents: isAnimating ? "none" : "auto" }}
            className="cursor-pointer text-white px-5 h-11 rounded-full flex items-center justify-center overflow-hidden border border-[#0B1C2D] shadow-sm bg-[#0B1C2D] z-10"
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ layout: { duration: 0.3 } }}
          >
            <motion.span layoutId={`buttonText-${id}`} className="flex font-medium text-sm">
              {"Delete Product".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.015 }}
                  style={{ display: "inline-block", minWidth: char === " " ? "4px" : "auto" }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          </motion.button>
        ) : (
          <motion.button
            key="cancel"
            layoutId={`deleteButton-${id}`}
            onClick={() => handleClick(false)}
            whileTap={{ scale: 0.95 }}
            style={{ pointerEvents: isAnimating ? "none" : "auto" }}
            className="cursor-pointer px-3 h-10 rounded-full flex items-center gap-2 overflow-hidden bg-white border border-[#0B1C2D] shadow-sm z-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ layout: { duration: 0.3 } }}
          >
            <div className="bg-[#0B1C2D] p-1.5 rounded-full">
              <HugeiconsIcon icon={Undo03Icon} className="h-3 w-3 text-white" />
            </div>

            <motion.span
              layoutId={`buttonText-${id}`}
              className="text-[#0B1C2D] font-medium text-sm"
            >
              Cancel
            </motion.span>

            <motion.div className="bg-[#0B1C2D] text-white h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold">
              {count}
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeleteButton;