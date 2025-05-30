
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
    <div className="bg-white rounded-lg shadow-sm p-5 border border-yellow-200 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-right arabic">نطاق السعر</h2>
      
      <div className="mb-6">
        <Slider
          defaultValue={priceRange}
          value={priceRange}
          min={minPrice}
          max={maxPrice}
          step={1}
          onValueChange={(values) => onPriceChange(values as [number, number])}
          className="mt-2"
        />
      </div>
      
      <div className="flex justify-between mt-4">
        <div className="text-sm">
          <span className="text-gray-500 arabic">الحد الأقصى:</span>
          <span className="mr-1 font-medium">{priceRange[1]} ريال</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-500 arabic">الحد الأدنى:</span>
          <span className="mr-1 font-medium">{priceRange[0]} ريال</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
