import { useState } from 'react';
import './App.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CSVLink } from 'react-csv';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [product, setProduct] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [issues, setIssues] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'Free' | 'Pro' | 'Max'>('Free');
  const [history, setHistory] = useState<{ product: string; issues: string[] }[]>([]);
  const [duplicatesRemoved, setDuplicatesRemoved] = useState(false);

  const handleGenerate = async () => {
    setError('');
    if (!product) return;
    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/askGemini', {
        method: 'POST',
        body: JSON.stringify({ product }),
      });

      const data = await res.json();

      if (data.error) {
        setError('AI failed to respond.');
      } else {
        const list = data.issues
          .split(/\d+\.\s+/)
          .filter((item: string) => item.trim());

        const uniqueIssues = Array.from(new Set(list.map(i => i.toLowerCase().trim())));
        setIssues(uniqueIssues);
        setDuplicatesRemoved(true);
        setHistory([{ product, issues: uniqueIssues }, ...history]);
      }
    } catch (err) {
      setError('Something went wrong.');
    }

    setLoading(false);
  };

  const issueCounts = issues.reduce(
    (acc, issue) => {
      if (issue.includes('crash')) acc.Critical++;
      else if (issue.includes('slow')) acc.Medium++;
      else acc.Minor++;
      return acc;
    },
    { Critical: 0, Medium: 0, Minor: 0 }
  );

  const chartData = {
    labels: ['Critical', 'Medium', 'Minor'],
    datasets: [
      {
        label: 'Issue Severity',
        data: [issueCounts.Critical, issueCounts.Medium, issueCounts.Minor],
        backgroundColor: ['#f87171', '#facc15', '#60a5fa'],
      },
    ],
  };

  const emoji = (text: string) => {
    if (text.includes('crash')) return '💥';
    if (text.includes('slow')) return '🐢';
    if (text.includes('bug')) return '🐞';
    if (text.includes('request')) return '📩';
    return '💬';
  };

  const csvData = issues.map((issue, i) => ({ id: i + 1, issue }));

  return (
    <div className="app">
      <div className="sidebar">
        <h2>ProductHolmes</h2>
        <ul>
          <li onClick={() => setActiveTab('Free')}>Free</li>
          <li onClick={() => setActiveTab('Pro')}>Pro</li>
          <li onClick={() => setActiveTab('Max')}>Max</li>
        </ul>
      </div>

      <div className="main-panel">
        <h1>{activeTab} Dashboard</h1>
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Enter your product name"
          className="input-field"
        />
        <input
          value={competitor}
          onChange={(e) => setCompetitor(e.target.value)}
          placeholder="Optional: Competitor product"
          className="input-field"
        />
        <button onClick={handleGenerate} className="generate-button" disabled={loading}>
          {loading ? 'Analyzing...' : 'Generate Issues'}
        </button>

        {error && <p className="error-message">{error}</p>}

        {issues.length > 0 && (
          <>
            <div className="card">
              <h3>Issues for {product}</h3>
              <ul className="issue-list">
                {issues.map((issue, i) => (
                  <li key={i}>{emoji(issue)} {issue}</li>
                ))}
              </ul>
              <CSVLink data={csvData} filename={`issues-${product}.csv`} className="csv-export">
                📤 Export to CSV
              </CSVLink>
              {duplicatesRemoved && <p className="note">🧠 Semantic duplicates removed</p>}
            </div>

            <div className="card">
              <h3>Issue Severity Chart</h3>
              <Bar data={chartData} />
            </div>
          </>
        )}

        {history.length > 1 && (
          <div className="card">
            <h3>Previous Feedback</h3>
            <ul>
              {history.slice(1).map((entry, i) => (
                <li key={i}>
                  <strong>{entry.product}</strong>: {entry.issues.length} issues
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
