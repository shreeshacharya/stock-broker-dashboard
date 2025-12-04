import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

// ⚠️ IMPORTANT: Keep your Render URL here! 
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
  const prevPrices = useRef({});

  useEffect(() => {
    socket.on("priceUpdate", (data) => {
      prevPrices.current = prices; 
      setPrices(data);
    });
  }, [prices]);

  const handleLogin = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      socket.emit("login", email);
      setIsLoggedIn(true);
    } else {
      alert("⚠️ Access Denied: Please enter a valid email address.");
    }
  };

  // ✅ NEW: Completely wipes data on logout
  const handleLogout = () => {
    setIsLoggedIn(false);       // 1. Go back to login screen
    setEmail("");               // 2. Clear the email input
    setSubscribedStocks([]);    // 3. Clear selected stocks
    setPrices({});              // 4. Clear old prices
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const getPriceColor = (stock) => {
    const current = parseFloat(prices[stock]);
    const previous = parseFloat(prevPrices.current[stock]);
    if (!previous || current === previous) return 'white';
    return current > previous ? '#00ff88' : '#ff4d4d'; 
  };

  const getArrow = (stock) => {
    const current = parseFloat(prices[stock]);
    const previous = parseFloat(prevPrices.current[stock]);
    if (!previous || current === previous) return '';
    return current > previous ? '▲' : '▼';
  };

  const toggleSubscription = (stock) => {
    if (subscribedStocks.includes(stock)) {
      setSubscribedStocks(subscribedStocks.filter(s => s !== stock));
    } else {
      setSubscribedStocks([...subscribedStocks, stock]);
    }
  };

  return (
    <div className="app-container">
      {/* LOGIN SCREEN */}
      {!isLoggedIn ? (
        <div className="login-overlay">
          <div className="glass-card">
            <h1>🚀 TradePro <span className="highlight">Live</span></h1>
            <p>Institutional Grade Real-Time Data</p>
            
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown} 
              />
              <button onClick={handleLogin}>Enter Market →</button>
            </div>
            <p className="secure-text">🔒 Secured by WebSocket Encryption</p>
          </div>
        </div>
      ) : (
        /* DASHBOARD SCREEN */
        <div className="dashboard-layout">
          <nav className="top-nav">
            <div className="nav-logo">TradePro <span className="highlight">Live</span></div>
            <div className="user-info">
              <span>👤 {email}</span>
              {/* ✅ UPDATE: Calls the new handleLogout function */}
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </nav>

          <div className="main-grid">
            {/* SIDEBAR */}
            <aside className="sidebar">
              <h3>Available Assets</h3>
              <div className="scroll-list">
                {SUPPORTED_STOCKS.map((stock) => (
                  <div 
                    key={stock} 
                    className={`stock-row ${subscribedStocks.includes(stock) ? 'active' : ''}`}
                    onClick={() => toggleSubscription(stock)}
                  >
                    <span>{stock}</span>
                    <span className="add-icon">{subscribedStocks.includes(stock) ? '✓' : '+'}</span>
                  </div>
                ))}
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="content-area">
              {subscribedStocks.length === 0 ? (
                <div className="empty-state">
                  <h2>Your Portfolio is Empty</h2>
                  <p>Select stocks from the sidebar to begin monitoring real-time feeds.</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {subscribedStocks.map((stock) => (
                    <div key={stock} className="live-card">
                      <div className="card-top">
                        <span className="ticker-name">{stock}</span>
                        <span className="live-dot">● LIVE</span>
                      </div>
                      <div className="price-area" style={{ color: getPriceColor(stock) }}>
                        <span className="arrow">{getArrow(stock)}</span>
                        ${prices[stock] || "---"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;