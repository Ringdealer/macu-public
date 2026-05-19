// frontend/src/components/icons/HamburgerIcon.jsx
import React from "react";

export default function HamburgerIcon({ darkMode }) {
  const strokeColor = darkMode ? "#e2e8f0" : "#1d4ed8"; // light/dark-safe colors
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="20" y2="6" stroke={strokeColor} strokeWidth="2" />
      <line x1="4" y1="12" x2="20" y2="12" stroke={strokeColor} strokeWidth="2" />
      <line x1="4" y1="18" x2="20" y2="18" stroke={strokeColor} strokeWidth="2" />
    </svg>
  );
}