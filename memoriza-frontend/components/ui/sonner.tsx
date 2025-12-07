'use client'

import type React from 'react'
import { useTheme } from 'next-themes'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

const Toaster = (props: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  const { toastOptions, ...rest } = props

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      closeButton
      position="top-right"
      {...rest}
      toastOptions={{
        ...toastOptions,
        unstyled: true,
        classNames: {
          ...(toastOptions?.classNames ?? {}),
          toast: [
            "relative flex w-full max-w-[380px] items-start gap-3",
            "rounded-xl border bg-primary border-zinc-800 text-zinc-50",
            "px-4 py-3 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:slide-in-from-right-3 data-[state=closed]:slide-out-to-right-3",
            toastOptions?.classNames?.toast ?? "",
          ].join(" "),
          title: [
            "font-semibold text-[15px]",
            toastOptions?.classNames?.title ?? "",
          ].join(" "),
          description: [
            "text-sm text-zinc-300",
            toastOptions?.classNames?.description ?? "",
          ].join(" "),
          icon: [
            "mt-0.5 h-4 w-4 text-zinc-200",
            toastOptions?.classNames?.icon ?? "",
          ].join(" "),
          closeButton: [
            "!absolute !top-3 !right-3 !left-auto !transform-none",
            "inline-flex h-6 w-6 items-center justify-center",
            "!rounded-md !border !border-zinc-700 !bg-zinc-900/80",
            "!text-white",
            "hover:!bg-white hover:!text-zinc-900",
            "transition-colors duration-200 ease-in-out",
            toastOptions?.classNames?.closeButton ?? "",
          ].join(" "),
        },
      }}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
    />
  )
}

export { Toaster }