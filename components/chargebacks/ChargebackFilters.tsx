'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useCallback, useState } from 'react'

interface Props {
  searchParams: {
    status?: string
    search?: string
  }
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
]

export default function ChargebackFilters({ searchParams }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(searchParams.search || '')

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams as Record<string, string>)
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search)
  }

  const clearFilters = () => {
    setSearch('')
    router.push(pathname)
  }

  const hasFilters = searchParams.status || searchParams.search

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9 pr-4 py-2"
        />
      </form>

      {/* Status filter */}
      <select
        value={searchParams.status || ''}
        onChange={(e) => updateFilter('status', e.target.value)}
        className="input w-auto min-w-[140px]"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-danger-600 bg-danger-50 border border-danger-200 hover:bg-danger-100 hover:border-danger-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear filters
        </button>
      )}
    </div>
  )
}
