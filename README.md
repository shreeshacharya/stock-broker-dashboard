# 🚀 TradePro Live - Real-Time Stock Broker Dashboard

A full-stack, real-time stock market dashboard that allows users to subscribe to live stock feeds and receive sub-second price updates without refreshing the page. Built to demonstrate proficiency in **WebSockets**, **State Management**, and **Distributed Cloud Architecture**.

🔗 **[View Live Demo](https://stock-broker-dashboard.vercel.app/)** *(Note: The backend is hosted on a free instance. Please allow up to 60 seconds for the server to wake up on the first load.)*

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Contact](#-contact)

---

## ✨ Features

* [cite_start]**Real-Time Data:** Utilizes `Socket.io` to stream random stock price updates every second. [cite: 6, 8]
* [cite_start]**Live Subscriptions:** Users can select/deselect specific stocks ('GOOG', 'TSLA', 'AMZN', etc.) to customize their dashboard view. [cite: 4, 5]
* **Multi-User Synchronization:** Supports multiple concurrent users. [cite_start]User A and User B can track different stocks simultaneously on different devices. [cite: 7]
* **Smart UI/UX:**
    * **Glassmorphism Design:** Modern, high-end Fintech aesthetic.
    * **Trend Indicators:** Visual cues (Green/Red colors and ▲/▼ arrows) indicating price movement.
    * **State Persistence:** Handles user logout and session clearing securely.
* [cite_start]**Secure Access:** Client-side email validation and "Enter key" login support. [cite: 3]

---

## 🛠 Tech Stack

* **Frontend:** React.js, CSS3 (Glassmorphism), Hooks (useState, useEffect, useRef).
* **Backend:** Node.js, Express.js.
* **Real-Time Engine:** Socket.io (WebSockets).
* **Deployment:**
    * **Frontend:** Vercel (CDN Edge Network).
    * **Backend:** Render (Cloud Application Hosting).

---

## 🏗 Architecture

The application follows a **Client-Server** architecture using bidirectional communication:

1.  **Server (Node.js):** Generates mock stock prices for 12 major corporations every second and broadcasts the entire data payload via a `priceUpdate` event.
2.  **Client (React):** Connects to the WebSocket server. It maintains a local `subscribedStocks` array. When data arrives, the client filters and renders only the stocks the user has chosen to watch.
3.  **State Management:** React `useRef` is used to track "Previous Prices" to calculate live trends (up/down) without causing unnecessary re-renders.

---

## 🚀 Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites
* Node.js installed (v14 or higher)
* Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/shreeshacharya/stock-broker-dashboard.git](https://github.com/shreeshacharya/stock-broker-dashboard.git)
    cd stock-broker-dashboard
    ```

2.  **Setup the Backend (Server)**
    Open a terminal and run:
    ```bash
    cd server
    npm install
    node index.js
    ```
    *The server will start running on port 3001.*

3.  **Setup the Frontend (Client)**
    Open a **second** terminal and run:
    ```bash
    cd client
    npm install
    npm start
    ```
    *The application will open in your browser at `http://localhost:3000`.*

---

## 📂 Project Structure

```bash
stock-broker-dashboard/
├── server/                 # Backend Node.js Application
│   ├── index.js            # Main server entry point (Socket.io logic)
│   └── package.json        # Backend dependencies
│
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── App.js          # Main Dashboard Logic & State
│   │   ├── App.css         # Styling (Dark Mode & Animations)
│   │   └── index.js        # React DOM entry
│   └── package.json        # Frontend dependencies
│
└── README.md               # Project Documentation
