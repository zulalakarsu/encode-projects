"use client";

import { useState, useEffect } from 'react';

interface PackingItem {
  item: string;
  category: string;
  essential: boolean;
  quantity: number;
  reason: string;
}

interface PackingListProps {
  items: PackingItem[];
  missingItems: string[];
  detectedItems: string[];
}

export default function PackingList({ items, missingItems, detectedItems }: PackingListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Update checked items when detectedItems changes
  useEffect(() => {
    setCheckedItems(new Set(detectedItems));
  }, [detectedItems]);

  const handleCheckItem = (item: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(item)) {
      newCheckedItems.delete(item);
    } else {
      newCheckedItems.add(item);
    }
    setCheckedItems(newCheckedItems);
  };

  const categories = Array.from(new Set(items.map(item => item.category)));

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category} className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {category}
          </h3>
          <div className="space-y-1">
            {items
              .filter(item => item.category === category)
              .map(item => (
                <div
                  key={item.item}
                  className={`flex p-2 rounded-md ${
                    missingItems.includes(item.item)
                      ? 'bg-red-50 dark:bg-red-900/30'
                      : detectedItems.includes(item.item)
                      ? 'bg-green-50 dark:bg-green-900/30'
                      : ''
                  }`}
                >
                  <div className="flex items-center w-2/3 space-x-3">
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item.item)}
                      onChange={() => handleCheckItem(item.item)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {item.item}
                      {item.quantity > 1 && ` (${item.quantity})`}
                      {item.essential && ' *'}
                    </span>
                  </div>

                  {item.reason && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 w-1/3">
                      {item.reason}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
      
      <div className="text-sm text-gray-500 dark:text-gray-400">
        * Essential items
      </div>
    </div>
  );
} 