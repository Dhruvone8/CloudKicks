"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";

export function SaveButton({ onComplete }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success

  const handleClick = () => {
    if (status !== "idle") return; // Prevent double clicks

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        // Trigger the navigation callback before resetting to idle
        if (onComplete) onComplete();
        setStatus("idle");
      }, 2000);
    }, 2500);
  };

  const text = useMemo(() => {
    switch (status) {
      case "idle":
        return "Add Product";
      case "loading":
        return "Adding Product...";
      case "success":
        return "Product Added!";
      default:
        return "Add Product";
    }
  }, [status]);

  return (
    <div className="relative inline-flex font-sans">
      {/* Hover Scale Wrapper */}
      <motion.div
        whileHover={status === "idle" ? { scale: 1.05 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="inline-block"
      >
        <Button
          onClick={handleClick}
          disabled={status !== "idle"} // Disable button while processing
          variant="default"
          className={cn(
            "relative rounded-lg h-10 mt-3 px-7 min-w-[140px] cursor-pointer text-sm font-medium transition-colors duration-300 disabled:opacity-100",
            status === "idle" && "hover:bg-primary",
            status !== "idle" &&
              "bg-muted text-muted-foreground cursor-not-allowed border-muted shadow-sm"
          )}
        >
          <span className="flex items-center justify-center">
            <AnimatePresence mode="popLayout" initial={false}>
              {text.split("").map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </AnimatePresence>
          </span>
        </Button>
      </motion.div>

      {/* Status Indicator */}
      <div className="absolute -top-1 -right-1 z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          {status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -8, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0, x: -8, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "flex items-center justify-center size-6 rounded-full ring-3 overflow-visible",
                status === "success"
                  ? "bg-primary text-primary-foreground ring-muted"
                  : "bg-muted text-muted-foreground ring-muted"
              )}
            >
              <AnimatePresence mode="popLayout">
                {status === "loading" && (
                  <motion.div
                    key="loader"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                        opacity=".5"
                      />
                      <path
                        fill="currentColor"
                        d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
                      >
                        <animateTransform
                          attributeName="transform"
                          dur="1s"
                          from="0 12 12"
                          to="360 12 12"
                          repeatCount="indefinite"
                          type="rotate"
                        />
                      </path>
                    </svg>
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    exit={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
