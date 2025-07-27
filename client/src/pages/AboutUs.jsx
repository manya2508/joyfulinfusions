import React from "react";
import teaImage from "/src/assets/teachoco.jpg"; // Replace with your actual image path

const About = () => {
  return (
    <div className="bg-[#FDF7DD] min-h-screen px-6 md:px-16 py-10">
      <h1 className="text-4xl md:text-5xl font-bold text-[#5c4433] mb-10 text-center">
        About Joyful Infusions
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Text Section */}
        <div className="space-y-8 text-[#4b3b2b] text-lg leading-relaxed">
          <div>
            <h3 className="font-semibold text-xl text-[#3e2f23]">
              100% Organic & Health-Friendly:
            </h3>
            <p>
              All our products are organic, gluten-free, sugar-free, and diabetic-friendly — made with care to support your well-being in every bite and sip.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl text-[#3e2f23]">
              Authentic Tea Spice Mix:
            </h3>
            <p>
              We source our condiments directly from Kerala and craft our tea masala fresh, ensuring unmatched flavor and purity.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl text-[#3e2f23]">
              Customer Satisfaction First:
            </h3>
            <p>
              We use only the finest ingredients and uphold high standards because your satisfaction and trust matter the most to us.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-xl text-[#3e2f23]">
              Long Shelf Life, No Refrigeration:
            </h3>
            <p>
              Our products stay fresh for up to 3 months without refrigeration — ideal for everyday use and long storage.
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={teaImage}
            alt="Tea plantation"
            className="rounded-xl shadow-md max-h-[400px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
