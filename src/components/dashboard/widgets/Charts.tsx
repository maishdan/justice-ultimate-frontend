// 📊 Charts.tsx - International Business Dashboard Charts

import React from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
  Legend
} from 'recharts';

type ChartProps = { title: string };

const barData = [
  { name: 'Jan', Sales: 2400 },
  { name: 'Feb', Sales: 1398 },
  { name: 'Mar', Sales: 9800 },
  { name: 'Apr', Sales: 3908 },
  { name: 'May', Sales: 4800 },
  { name: 'Jun', Sales: 3800 },
  { name: 'Jul', Sales: 4300 },
];

const pieData = [
  { name: 'Kenya', value: 400 },
  { name: 'Uganda', value: 300 },
  { name: 'Tanzania', value: 300 },
  { name: 'Rwanda', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const lineData = [
  { name: 'Week 1', Revenue: 4000 },
  { name: 'Week 2', Revenue: 3000 },
  { name: 'Week 3', Revenue: 2000 },
  { name: 'Week 4', Revenue: 2780 },
  { name: 'Week 5', Revenue: 1890 },
];

export const BarChart: React.FC<ChartProps> = ({ title }) => (
  <div>
    <h3>{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Sales" fill="#8884d8" barSize={40} radius={[8, 8, 0, 0]} />
      </ReBarChart>
    </ResponsiveContainer>
  </div>
);

export const PieChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <RePieChart>
      <Pie
        data={pieData}
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
        dataKey="value"
      >
        {pieData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </RePieChart>
  </ResponsiveContainer>
);

export const LineChart: React.FC<ChartProps> = ({ title }) => (
  <div>
    <h3>{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart
        data={lineData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Revenue" stroke="#82ca9d" strokeWidth={3} />
      </ReLineChart>
    </ResponsiveContainer>
  </div>
);

export default { BarChart, PieChart, LineChart };
