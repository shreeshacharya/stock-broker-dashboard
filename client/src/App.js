import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

// Make sure this matches your deployed backend URL or localhost
const socket = io.connect("https://stock-broker-dashboard.onrender.com");

const SUPPORTED_STOCKS = [
  'GOOG', 'TSLA', 'AMZN', 'META', 'NVDA', 
  'AAPL', 'MSFT', 'NFLX', 'DIS', 'KO', 
  'PEP', 'SBUX'
];

function App() {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subscribedStocks, setSubscribedStocks] = useState([]); 
  const [prices, setPrices] = useState({});
  
  // We use this to store the PREVIOUS price to calculate trends (Up or Down)
  const prevPrices = useRef({});

  useEffect(() => {
    socket.on("priceUpdate", (data) => {
      // Store current prices as "previous" before updating state
      prevPrices.current = prices; 
      setPrices(data);
    });
  }, [prices]); // Re-run when prices change

  const handleLogin = () => {
    // 1. Simple Regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 2. Test if the current email matches the pattern
    if (emailRegex.test(email)) {
      socket.emit("login", email); // 
      setIsLoggedIn(true);
    } else {
      // 3. Show error if invalid
      alert("⚠️ Access Denied: Please enter a valid email address (e.g., user@example.com)");
    }
  };

  const toggleSubscription = (stock) => {
    if (subscribedStocks.includes(stock)) {
      setSubscribedStocks(subscribedStocks.filter(s => s !== stock));
    } else {
      setSubscribedStocks([...subscribedStocks, stock]);
    }
  };

  // Helper to determine color based on price movement
  const getPriceColor = (stock) => {
    const current = parseFloat(prices[stock]);
    const previous = parseFloat(prevPrices.current[stock]);
    if (!previous || current === previous) return 'white';
    return current > previous ? '#4caf50' : '#f44336'; // Green or Red
  };

  const getArrow = (stock) => {
    const current = parseFloat(prices[stock]);
    const previous = parseFloat(prevPrices.current[stock]);
    if (!previous || current === previous) return '-';
    return current > previous ? '▲' : '▼';
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="navbar">
        <div className="logo">🚀 TradePro <span style={{fontSize:'0.5em'}}>Live</span></div>
        {isLoggedIn && <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>Logout</button>}
      </header>

      {/* LOGIN SCREEN */}
      {!isLoggedIn ? (
        <div className="login-wrapper">
          <div className="login-card">
            <h2>Welcome Back</h2>
            <p>Enter your email to access the live market.</p>
            <input
              type="email"
              placeholder="user@example.com"
              onChange={(event) => setEmail(event.target.value)}
            />
            <button onClick={handleLogin}>Access Dashboard</button>
          </div>
        </div>
      ) : (
        /* DASHBOARD SCREEN */
        <div className="dashboard-grid">
          
          {/* SIDEBAR: SELECTION */}
          <aside className="sidebar">
            <h3>Market Watch</h3>
            <p className="subtitle">Select assets to monitor</p>
            <div className="stock-list">
              {SUPPORTED_STOCKS.map((stock) => (
                <div 
                  key={stock} 
                  className={`stock-item ${subscribedStocks.includes(stock) ? 'active' : ''}`}
                  onClick={() => toggleSubscription(stock)}
                >
                  <span className="ticker">{stock}</span>
                  <span className="status-dot"></span>
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN AREA: LIVE CARDS */}
          <main className="main-content">
            <div className="welcome-banner">
              <h2>Portfolio Overview</h2>
              <p>Real-time updates for <strong>{email}</strong></p>
            </div>

            <div className="cards-container">
              {subscribedStocks.length === 0 ? (
                <div className="empty-state">Select stocks from the left to view prices.</div>
              ) : null}

              {subscribedStocks.map((stock) => (
                <div key={stock} className="ticker-card">
                  <div className="card-header">
                    <span className="card-ticker">{stock}</span>
                    <span className="card-live-badge">LIVE</span>
                  </div>
                  <div className="card-price" style={{ color: getPriceColor(stock) }}>
                    {getArrow(stock)} ${prices[stock] || "Loading..."}
                  </div>
                  <div className="card-footer">
                    Updated just now
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;