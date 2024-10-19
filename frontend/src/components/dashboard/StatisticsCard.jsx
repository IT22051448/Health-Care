import React from 'react';

const StatisticCard = ({ title, value, percentage, isPositive }) => {
    return (
      <div className="bg-white shadow-sm p-5 rounded-lg flex flex-col gap-2">
        <h3 className="text-sm text-gray-500">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">{value}</p>
          <p className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? `+${percentage}%` : `${percentage}%`}
          </p>
        </div>
      </div>
    );
  };

  export default StatisticCard;
  