import React, { useEffect, useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'

type NotificationItem = {
  id: string
  text: string
  state: string
  course: string
  createdAt: string
}

const AddNotification: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [inputState, setInputState] = useState<string>('')
  const [inputCourse, setInputCourse] = useState<string>('')
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const API_BASE = 'http://localhost:3000/api/notifications'

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/all`)
        const json = await res.json()
        if (json?.success && Array.isArray(json.data)) {
          const mapped: NotificationItem[] = json.data.map((n: any) => ({
            id: n._id,
            text: n.description,
            state: n.state,
            course: n.course,
            createdAt: new Date(n.date).toLocaleString(),
          }))
          setNotifications(mapped)
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch notifications', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const onAddOrSave = async () => {
    const trimmed = inputValue.trim()
    const trimmedState = inputState.trim()
    const trimmedCourse = inputCourse.trim()
    if (!trimmed || !trimmedState || !trimmedCourse) return

    if (editingId) {
      setNotifications(prev =>
        prev.map(item => (item.id === editingId ? { ...item, text: trimmed, state: trimmedState, course: trimmedCourse } : item))
      )
      setEditingId(null)
      setInputValue('')
      setInputState('')
      setInputCourse('')
      return
    }

    try {
      setLoading(true)
      const payload = {
        description: trimmed,
        course: trimmedCourse,
        state: trimmedState,
        date: new Date().toISOString(),
      }
      const res = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json?.success && json?.data) {
        const n = json.data
        const added: NotificationItem = {
          id: n._id,
          text: n.description,
          state: n.state,
          course: n.course,
          createdAt: new Date(n.date).toLocaleString(),
        }
        setNotifications(prev => [added, ...prev])
        setInputValue('')
        setInputState('')
        setInputCourse('')
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to add notification', e)
    } finally {
      setLoading(false)
    }
  }

  const onEdit = (id: string) => {
    const item = notifications.find(n => n.id === id)
    if (!item) return
    setEditingId(id)
    setInputValue(item.text)
    setInputState(item.state)
    setInputCourse(item.course)
  }

  const onDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setInputValue('')
      setInputState('')
      setInputCourse('')
    }
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)
  const onStateChange = (e: ChangeEvent<HTMLInputElement>) => setInputState(e.target.value)
  const onCourseChange = (e: ChangeEvent<HTMLInputElement>) => setInputCourse(e.target.value)

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') onAddOrSave()
  }

  const onCancelEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditingId(null)
    setInputValue('')
    setInputState('')
    setInputCourse('')
  }

  return (

    <div className='p-4'>
      <h2 className='text-3xl font-bold m-4'> Add Notification</h2>
      <form className='flex items-center gap-3 mb-6' onSubmit={(e)=>{e.preventDefault(); onAddOrSave()}}>

        <input
          type='text'
          placeholder='Notification description'
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          className='flex-1 rounded-2xl bg-gray-100 p-4 outline-none'
        />
        <input
          type='text'
          placeholder='State'
          value={inputState}
          onChange={onStateChange}
          className='w-48 rounded-2xl bg-gray-100 p-4 outline-none'
        />
        <input
          type='text'
          placeholder='Course'
          value={inputCourse}
          onChange={onCourseChange}
          className='w-48 rounded-2xl bg-gray-100 p-4 outline-none'
        />

        <button
          type='submit'
          className='bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition disabled:opacity-60'
          disabled={loading}
        >
          {editingId ? 'Save' : (loading ? 'Submitting...' : 'Add')}
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
      </form>

      <div className='bg-white shadow rounded-xl overflow-hidden border border-gray-100'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3'>#</th>
              <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3'>Notification</th>
              <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3'>State</th>
              <th className='text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3'>Course</th>
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
                  {/* <td className='px-6 py-4 text-sm text-gray-700'>{notifications.length - index}</td> */}
                  <td className='px-6 py-4 text-sm text-gray-700'>{ index+1}</td>
                  <td className='px-6 py-4 text-sm text-gray-900'>{item.text}</td>
                  <td className='px-6 py-4 text-sm text-gray-900'>{item.state}</td>
                  <td className='px-6 py-4 text-sm text-gray-900'>{item.course}</td>
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