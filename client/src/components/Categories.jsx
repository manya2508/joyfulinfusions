import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {
  const { navigate } = useAppContext()

  return (
    <div className='mt-16 w-full px-4 md:px-12'>
      <p className='text-2xl md:text-3xl font-medium mb-6'>Categories</p>

      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>

        {categories.map((category, index) => (
          <div
            key={index}
            className='group cursor-pointer py-6 px-4 min-h-[220px] gap-4 rounded-xl flex flex-col justify-between items-center shadow-sm hover:shadow-md transition text-center'
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`)
              scrollTo(0, 0)
            }}
          >
            <div className="flex-1 flex items-center justify-center w-full">
              <img
                src={category.image}
                alt={category.text}
                className='group-hover:scale-105 transition-transform duration-300 max-w-24 max-h-24 object-contain'
              />
            </div>

            <p className='text-sm font-medium mt-2'>{category.text}</p>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Categories
