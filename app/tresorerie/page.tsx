'use client';
import { title } from "@/components/primitives";
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Button } from "@nextui-org/react";
Chart.register(...registerables);

// Données simulées
const costData = [
  { date: '2024-05-01', amount: 500 },
  { date: '2024-05-02', amount: 300 },
  // ... autres données
];

const revenueData = [
  { date: '2024-05-01', amount: 1200 },
  { date: '2024-05-02', amount: 1500 },
  // ... autres données
];

const membersData = [
  { date: '2023-01', count: 10 },
  { date: '2023-02', count: 15 },
  { date: '2023-03', count: 12 },
  { date: '2023-04', count: 20 },
  { date: '2023-05', count: 25 },
  { date: '2023-06', count: 18 },
  { date: '2023-07', count: 22 },
  { date: '2023-08', count: 30 },
  { date: '2023-09', count: 15 },
  { date: '2023-10', count: 10 },
  { date: '2023-11', count: 12 },
  { date: '2023-12', count: 20 },
];

const activeAccountsData = [
  { date: '2023-01', count: 50 },
  { date: '2023-02', count: 45 },
  { date: '2023-03', count: 48 },
  { date: '2023-04', count: 52 },
  { date: '2023-05', count: 55 },
  { date: '2023-06', count: 50 },
  { date: '2023-07', count: 53 },
  { date: '2023-08', count: 60 },
  { date: '2023-09', count: 55 },
  { date: '2023-10', count: 50 },
  { date: '2023-11', count: 52 },
  { date: '2023-12', count: 58 },
];
const aggregateData = (data, scale) => {
  const result = {};

  data.forEach(({ date, amount }) => {
    const d = new Date(date);
    let key;
    switch (scale) {
      case 'day':
        key = d.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        break;
      case 'year':
        key = `${d.getFullYear()}`;
        break;
      default:
        key = d.toISOString().split('T')[0];
    }

    if (!result[key]) {
      result[key] = 0;
    }
    result[key] += amount;
  });

  return result;
};

const calculateBalance = (costData, revenueData, scale) => {
  const aggregatedCosts = aggregateData(costData, scale);
  const aggregatedRevenues = aggregateData(revenueData, scale);

  const dates = Array.from(new Set([...Object.keys(aggregatedCosts), ...Object.keys(aggregatedRevenues)])).sort();

  const balanceData = dates.map(date => ({
    date,
    balance: (aggregatedRevenues[date] || 0) - (aggregatedCosts[date] || 0)
  }));

  return balanceData;
};

const calculateTotalBalance = (costData, revenueData) => {
  const totalCosts = costData.reduce((acc, item) => acc + item.amount, 0);
  const totalRevenues = revenueData.reduce((acc, item) => acc + item.amount, 0);
  return totalRevenues - totalCosts;
};

const StatsGraph = () => {
  const [scale, setScale] = useState('day');
  const [balanceData, setBalanceData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const data = calculateBalance(costData, revenueData, scale);
    setBalanceData(data);
    setMemberData(membersData);
    setAccountData(activeAccountsData);
    setTotalBalance(calculateTotalBalance(costData, revenueData));
  }, [scale]);

  const balanceChartData = {
    labels: balanceData.map(data => data.date),
    datasets: [
      {
        label: 'Balance',
        data: balanceData.map(data => data.balance),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const memberChartData = {
    labels: memberData.map(data => data.date),
    datasets: [
      {
        label: 'Nouveaux Membres',
        data: memberData.map(data => data.count),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const accountChartData = {
    labels: accountData.map(data => data.date),
    datasets: [
      {
        label: 'Comptes Actifs',
        data: accountData.map(data => data.count),
        fill: false,
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Nombre',
        },
      },
    },
  };

  return (
    <div className="p-4  ">
      <h2>Statistiques Financières et Membres</h2>
      <div className="text-center my-4">
        <h1 className="text-4xl font-bold">{totalBalance} €</h1>
        <p>Total sur le compte</p>
      </div>
      <div className=" flex justify-center rounded-md  shadow-lg  focus:outline-none mb-4">
        <select value={scale} onChange={(e) => setScale(e.target.value)}>
          <option value="day">Jour</option>
          <option value="month">Mois</option>
          <option value="year">Année</option>
        </select>
      </div >
      <div className="flex justify-center gap-4">
      <div className=" border p-4 flex flex-col justify-between  gap-4 rounded-2xl">
      <h3 >Bénéfices en fonction du temps</h3>
      <Line data={balanceChartData} options={options} /></div>
      <div className=" border p-4 flex flex-col justify-between  gap-4 rounded-2xl">
      <h3>Nombre de Nouveaux Membres par Mois</h3>
      <Line data={memberChartData} options={options} /></div>
      <div className=" border p-4 flex flex-col justify-between  gap-4 rounded-2xl">
        <h3>Nombre de Comptes Actifs par Mois</h3>
      <Line data={accountChartData} options={options} /></div>
      </div>
    </div>
  );
};

export default StatsGraph;
