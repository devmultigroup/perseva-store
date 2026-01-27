'use client'

import Link from 'next/link'
import type React from 'react'

type AuthCardProps = {
  title: string
  description: string
  children: React.ReactNode
  errorMessage?: string
  footerText: string
  footerLinkHref: string
  footerLinkLabel: string
}

export function AuthCard({
  title,
  description,
  children,
  errorMessage,
  footerText,
  footerLinkHref,
  footerLinkLabel,
}: AuthCardProps) {
  return (
    <div className="rounded-xl bg-white p-8 shadow-xl ring-1 ring-gray-200/50 backdrop-blur-sm">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {children}

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">veya</span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        {footerText}{' '}
        <Link
          href={footerLinkHref}
          className="font-semibold text-black hover:text-gray-700 transition-colors"
        >
          {footerLinkLabel}
        </Link>
      </p>
    </div>
  )
}

