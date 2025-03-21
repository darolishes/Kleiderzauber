import React from "react";
import { Link } from "react-router-dom";
import { Shirt, Camera, Images } from "lucide-react";

export const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Virtual Clothing Try-On
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Create, combine, and visualize your outfits virtually. Upload your
          clothes and experiment with different combinations.
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <Shirt className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Virtual Try-On
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Try on clothes virtually using our advanced canvas system with
                  intuitive controls.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <Images className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Wardrobe Management
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Organize your virtual wardrobe with easy uploads and
                  categorization.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                  Outfit Creation
                </h3>
                <p className="mt-5 text-base text-gray-500">
                  Create and save outfit combinations for different occasions
                  and seasons.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/auth"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};
