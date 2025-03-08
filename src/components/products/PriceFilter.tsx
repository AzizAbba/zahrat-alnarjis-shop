
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  priceRange: [number, number];
  onPriceChange: (values: [number, number]) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ 
  minPrice, 
  maxPrice, 
  priceRange, 
  onPriceChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Price Range</h2>
      
      <div className="mb-4">
        <Slider
          defaultValue={priceRange}
          min={minPrice}
          max={maxPrice}
          step={1}
          onValueChange={(values) => onPriceChange(values as [number, number])}
          className="my-6"
        />
      </div>
      
      <div className="flex justify-between">
        <div className="text-sm">
          <span className="text-gray-500">Min:</span>
          <span className="ml-1 font-medium">${priceRange[0]}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Max:</span>
          <span className="ml-1 font-medium">${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
