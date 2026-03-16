import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/RevenueChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueChart = ({ transactions }) => {

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const monthlyTurnover = new Array(12).fill(0);
  const monthlyPlatformRevenue = new Array(12).fill(0);

  const successfulTransactions = transactions.filter(t => t.status === "Success");

  successfulTransactions.forEach(t => {
    const date = new Date(t.transactionDate);
    const monthIndex = date.getMonth();

    const amount = t.paymentDetails?.amountPaid || 0;

    const feePercent =
      t.platformFeePercent ??
      t.paymentDetails?.platformFeePercent ??
      0;

    const platformRevenue = (amount * feePercent) / 100;

    monthlyTurnover[monthIndex] += amount;
    monthlyPlatformRevenue[monthIndex] += platformRevenue;
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Total Turnover',
        data: monthlyTurnover,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#007bff'
      },
      {
        label: 'Platform Revenue',
        data: monthlyPlatformRevenue,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40,167,69,0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#28a745'
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => '₹' + value
        }
      }
    }
  };

  return (
    <div className="revenue-chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueChart;