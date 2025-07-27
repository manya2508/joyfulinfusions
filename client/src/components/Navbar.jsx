import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const [open, setOpen] = React.useState(false)
  const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios } = useAppContext()

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout')
      if (data.success) {
        toast.success(data.message)
        setUser(null)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products')
    }
  }, [searchQuery])

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all font-medium text-[#3F2E2E]">
      {/* Logo */}
      <NavLink to='/' onClick={() => setOpen(false)}>
        <img className="h-16" src="logo.jpg" alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to='/' className={({ isActive }) =>
          `hover:text-[#7AA874] transition ${isActive ? 'text-[#7AA874]' : ''}`
        }>Home</NavLink>

        <NavLink to='/products' className={({ isActive }) =>
          `hover:text-[#7AA874] transition ${isActive ? 'text-[#7AA874]' : ''}`
        }>Products</NavLink>

        <NavLink to='/about' className={({ isActive }) =>
          `hover:text-[#7AA874] transition ${isActive ? 'text-[#7AA874]' : ''}`
        }>About Us</NavLink>

        {/* Search */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt='search' className='w-4 h-4' />
        </div>

        {/* Cart */}
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-[#7AA874] w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>

        {/* Login / Profile */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-6 py-2 bg-[#7AA874] hover:bg-green-600 transition text-white rounded-full text-sm"
          >
            Login
          </button>
        ) : (
          <div className='relative group'>
            <img src={assets.profile_icon} className='w-10' alt="" />
            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
              <li onClick={() => navigate("my-orders")} className='p-1.5 pl-3 hover:bg-[#F5ECD7] cursor-pointer'>My Orders</li>
              <li onClick={logout} className='p-1.5 pl-3 hover:bg-[#F5ECD7] cursor-pointer'>Logout</li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Icons */}
      <div className='flex items-center gap-6 sm:hidden'>
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-[#7AA874] w-[18px] h-[18px] rounded-full">
            {getCartCount()}
          </button>
        </div>
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          <img src={assets.menu_icon} alt='menu' />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm md:hidden">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>Products</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>About Us</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-[#7AA874] hover:bg-green-600 transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 mt-2 bg-[#7AA874] hover:bg-green-600 transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
