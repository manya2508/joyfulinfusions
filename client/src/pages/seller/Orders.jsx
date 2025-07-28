import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const Orders = () => {
    const { currency, axios } = useAppContext()
    const [orders, setOrders] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/seller')
            if (data.success) {
                // ✅ Filter out any items with null products
                const cleanedOrders = data.orders.map(order => ({
                    ...order,
                    items: order.items.filter(item => item.product !== null)
                }))
                setOrders(cleanedOrders)

                const total = cleanedOrders.reduce((acc, order) => acc + order.amount, 0)
                setTotalAmount(total)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return (
        <div className='no-scrollbar flex-1 h-[95vh] overflow-y-scroll'>
            <div className="md:p-10 p-4 space-y-6">

                {/* 🔢 Statistics */}
                <div className="p-4 bg-white border border-gray-300 rounded-md max-w-4xl">
                    <h2 className="text-xl font-semibold text-gray-800">📈 Order Statistics</h2>
                    <div className="mt-3 text-lg text-gray-700">
                        <p>Total Orders: <span className='font-medium'>{orders.length}</span></p>
                        <p>Total Revenue: <span className='text-green-600 font-medium'>{currency}{totalAmount}</span></p>
                    </div>
                </div>

                <h2 className="text-lg font-medium">🧾 Orders List</h2>

                {orders.map((order, index) => (
                    <div key={index} className="flex flex-col md:items-center md:flex-row gap-5 justify-between p-5 max-w-4xl rounded-md border border-gray-300 bg-white">

                        <div className="flex gap-5 max-w-80">
                            <img className="w-12 h-12 object-cover" src={assets.box_icon} alt="boxIcon" />
                            <div>
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex flex-col">
                                        <p className="font-medium">
                                            {item.product?.name || <span className="text-red-500">[Unknown Product]</span>}{" "}
                                            <span className="text-primary">x {item.quantity}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-sm md:text-base text-black/60">
                            <p className='text-black/80'>
                                {order.address.firstName} {order.address.lastName}</p>
                            <p>{order.address.street}, {order.address.city}</p>
                            <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                            <p>{order.address.phone}</p>
                        </div>

                        <p className="font-medium text-lg my-auto">
                            {currency}{order.amount}
                        </p>

                        <div className="flex flex-col text-sm md:text-base text-black/60">
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders
