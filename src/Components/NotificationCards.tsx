import React, { useEffect, useState } from 'react'

type NotificationDto = {
  _id: string
  description: string
  state: string
  date: string
}

const API_BASE = 'http://localhost:3000/api/notifications'

const CalendarIcon: React.FC<{ title?: string }> = ({ title }) => (
  <svg
    className="w-6 h-6 text-blue-600"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <title>{title || 'Date'}</title>
    <path d="M7 2v2M17 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const NotificationCards: React.FC = () => {
  const [items, setItems] = useState<NotificationDto[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_BASE}/all`)
        const json = await res.json()
        if (json?.success && Array.isArray(json.data)) {
          setItems(json.data as NotificationDto[])
        } else {
          setItems([])
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load notifications')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) {
    return <div className="p-4 text-gray-600">Loading notifications...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>
  }

  if (!items.length) {
    return <div className="p-4 text-gray-500">No notifications to show</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((n) => {
        const dateLabel = n.date ? new Date(n.date).toLocaleDateString() : ''
        return (
          <div key={n._id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-start gap-3">
            <div className="shrink-0" title={dateLabel}>
              <CalendarIcon title={dateLabel} />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-1">{n.state}</div>
              <div className="text-gray-900 font-medium">{n.description}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NotificationCards


