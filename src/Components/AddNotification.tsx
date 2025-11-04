import React, { useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'

type NotificationItem = {
  id: string
  text: string
  createdAt: string
}

const AddNotification: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const onAddOrSave = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    if (editingId) {
      setNotifications(prev =>
        prev.map(item => (item.id === editingId ? { ...item, text: trimmed } : item))
      )
      setEditingId(null)
      setInputValue('')
      return
    }

    const newItem: NotificationItem = {
      id: crypto.randomUUID(),
      text: trimmed,
      createdAt: new Date().toLocaleString(),
    }
    setNotifications(prev => [newItem, ...prev])
    setInputValue('')
  }

  const onEdit = (id: string) => {
    const item = notifications.find(n => n.id === id)
    if (!item) return
    setEditingId(id)
    setInputValue(item.text)
  }

  const onDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setInputValue('')
    }
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') onAddOrSave()
  }

  const onCancelEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditingId(null)
    setInputValue('')
  }

  return (
    <div className='p-6'>
      <div className='flex items-center gap-3 mb-6'>
        <input
          type='text'
          placeholder='Add notification'
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          className='flex-1 rounded-2xl bg-gray-100 p-4 outline-none'
        />

        <button
          type='button'
          onClick={onAddOrSave}
          className='bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition'
        >
          {editingId ? 'Save' : 'Add'}
        </button>
        {editingId && (
          <button
            type='button'
            onClick={onCancelEdit}
            className='bg-gray-200 text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-300 active:scale-95 transition'
          >
            Cancel
          </button>
        )}
      </div>

      <div className='bg-white shadow rounded-xl overflow-hidden border border-gray-100'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3'>#</th>
              <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3'>Notification</th>
              <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3'>Created</th>
              <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3'>Actions</th>
            </tr>
          </thead>
        {/*notification Table */}
          <tbody className='divide-y divide-gray-100'>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan={4} className='px-6 py-6 text-center text-gray-500'>No notifications yet</td>
              </tr>
            ) : (
              notifications.map((item, index) => (
                <tr key={item.id} className={index % 2 === 1 ? 'bg-gray-50' : ''}>
                  <td className='px-6 py-4 text-sm text-gray-700'>{notifications.length - index}</td>
                  <td className='px-6 py-4 text-sm text-gray-900'>{item.text}</td>
                  <td className='px-6 py-4 text-sm text-gray-500'>{item.createdAt}</td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-3'>
                      <button
                        className='px-3 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        onClick={() => onEdit(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className='px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200'
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AddNotification