import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const MainBanner = () => {
  return (
    <section className="bg-[#fdf5dc] w-full px-4 md:px-12 pt-8 md:pt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8 md:gap-16">

        {/* Text Section */}
        <div className="flex-1 text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4b2f28] leading-tight">
            Welcome to <br /> Joyful Infusions
          </h1>
          <p className="mt-4 text-lg text-[#7c4828] max-w-md">
            Discover the perfect blend of tea, treats, and tranquility
          </p>
          <Link to="/products">
            <button className="mt-6 bg-[#7eaa5d] hover:bg-[#6f9b4f] text-white px-6 py-3 rounded-lg font-semibold">
              Explore Products
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src={assets.main_banner_bg_sm}
            alt="Main Banner"
            className="rounded-2xl w-full max-w-[520px] md:max-w-[600px] object-cover shadow-md"
          />
        </div>

      </div>
    </section>
  );
};

export default MainBanner;
