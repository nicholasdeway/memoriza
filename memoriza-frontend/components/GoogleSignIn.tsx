"use client";

import { motion } from "framer-motion";

const API_BASE_URL = "/api-proxy";

export default function GoogleSignIn() {
  function handleClick() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google/login`;
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      className="w-full relative overflow-hidden group rounded-md border border-zinc-300/70 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-2.5 px-4 text-sm font-medium text-zinc-800 dark:text-zinc-100 flex items-center justify-center gap-3"
      aria-label="Continuar com o Google"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 48 48"
      >
        <path
          fill="#FFC107"
          d="M43.611 20.083H42V20H24v8h11.303C33.602 32.659 29.197 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 28.999 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
        />
        <path
          fill="#FF3D00"
          d="M6.306 14.691l6.571 4.819C14.655 16.163 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 6.053 28.999 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.138 0 9.8-1.977 13.313-5.197l-6.127-5.183C29.197 36 24 36 24 36c-5.179 0-9.599-3.367-11.289-8.043l-6.54 5.036C9.49 39.556 16.227 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.611 20.083H42V20H24v8h11.303c-1.358 3.659-5.53 8-11.303 8 0 0 5.197 0 10.186-4.38.013-.012.026-.023.039-.035 1.869-1.657 4.26-4.238 5.388-7.995.518-1.648.798-3.412.798-5.39 0-1.341-.138-2.651-.389-3.917z"
        />
      </svg>

      <span className="relative z-10">Continuar com o Google</span>

      {/* shine */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    </motion.button>
  );
}