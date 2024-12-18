"use client";

import { useState } from 'react';

interface TripDetailsFormProps {
  onSubmit: (details: {
    destination: string;
    dates: {
      startDate: string;
      endDate: string;
    };
    activities: string[];
  }) => void;
  isLoading?: boolean;
}

export default function TripDetailsForm({ onSubmit, isLoading }: TripDetailsFormProps) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activities, setActivities] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      destination,
      dates: {
        startDate,
        endDate
      },
      activities: activities.split(',').map(a => a.trim())
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Destination
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          placeholder="e.g., Paris, France"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Activities
        </label>
        <textarea
          value={activities}
          onChange={(e) => setActivities(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          placeholder="e.g., hiking, swimming, sightseeing"
          rows={3}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 
                   rounded-md transition-colors duration-200 disabled:opacity-50
                   disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Packing List'}
      </button>
    </form>
  );
} 