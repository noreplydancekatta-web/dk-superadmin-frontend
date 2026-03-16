import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/RevenueChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueChart = ({ transactions }) => {

  // Months for chart
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Initialize monthly revenue array
  const monthlyRevenue = new Array(12).fill(0);

  // Filter successful transactions
  const successfulTransactions = transactions.filter(t => t.status === "Success");

  // Aggregate revenue by month
  successfulTransactions.forEach(t => {
    const date = new Date(t.transactionDate);
    const monthIndex = date.getMonth();

    const amount = t.paymentDetails?.amountPaid || 0;

    monthlyRevenue[monthIndex] += amount;
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Total Turnover (₹)',
        data: monthlyRevenue,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#007bff',
        pointBorderColor: '#007bff'
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
          callback: (value) => '₹' + value
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