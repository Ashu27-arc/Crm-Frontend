import { useNavigate } from 'react-router-dom'
import NotificationCards from './NotificationCards'

const Home = () => {
  const Navigate = useNavigate()
  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-row justify-between items-center'>
        <h1 className='text-3xl font-bold'>Notifications</h1>
        <button
          onClick={() => Navigate('/login')}
          className='p-3 bg-gray-400 w-40 hover:bg-gray-700 text-white hover:scale-110 rounded-2xl '>
          Login
        </button>
      </div>
      <NotificationCards />
    </div>
  )
}

export default Home