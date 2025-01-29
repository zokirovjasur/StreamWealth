'use client';
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ categoryTotals }) {
  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          'rgba(52, 152, 219, 0.5)',
          'rgba(46, 204, 113, 0.5)',
          'rgba(155, 89, 182, 0.5)',
          'rgba(231, 76, 60, 0.5)',
          'rgba(241, 196, 15, 0.5)',
        ],
        borderColor: [
          'rgb(52, 152, 219)',
          'rgb(46, 204, 113)',
          'rgb(155, 89, 182)',
          'rgb(231, 76, 60)',
          'rgb(241, 196, 15)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expenses by Category'
      }
    }
  };

  return <Pie data={data} options={options} />;
}