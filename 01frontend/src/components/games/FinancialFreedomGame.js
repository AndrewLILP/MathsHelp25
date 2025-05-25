import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Button, Form, Alert, ProgressBar } from 'react-bootstrap';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const FinancialFreedomGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState({
    name: '',
    job: '',
    savings: 0,
    week: 1,
    portfolio: [],
    businesses: [],
    salary: 0,
    savingsHistory: [],
    portfolioHistory: [],
    passiveIncome: 0,
    activeIncome: 0,
    totalIncome: 0,
    roi: 0,
    freedomProgress: 0
  });

  const [formData, setFormData] = useState({
    playerName: '',
    selectedJob: 'teacher',
    businessName: '',
    missionStatement: ''
  });

  const savingsChartRef = useRef(null);
  const portfolioChartRef = useRef(null);
  const savingsChartInstance = useRef(null);
  const portfolioChartInstance = useRef(null);

  const jobSalaries = {
    teacher: { salary: 800, label: 'Teacher ($800/week)' },
    programmer: { salary: 1200, label: 'Programmer ($1200/week)' },
    nurse: { salary: 1000, label: 'Nurse ($1000/week)' },
    salesperson: { salary: 900, label: 'Salesperson ($900 + commissions/week)' },
    mechanic: { salary: 850, label: 'Mechanic ($850/week)' }
  };

  const investments = {
    tech: { cost: 1000, label: 'Tech Stock', risk: 'Medium', weeklyReturn: 0.02 },
    real_estate: { cost: 2000, label: 'Real Estate Fund', risk: 'Low', weeklyReturn: 0.015 },
    startup: { cost: 1500, label: 'Startup Fund', risk: 'High', weeklyReturn: 0.03 }
  };

  // Initialize charts
  useEffect(() => {
    if (gameStarted && savingsChartRef.current && portfolioChartRef.current) {
      initializeCharts();
    }
    return () => {
      // Cleanup charts
      if (savingsChartInstance.current) savingsChartInstance.current.destroy();
      if (portfolioChartInstance.current) portfolioChartInstance.current.destroy();
    };
  }, [gameStarted]);

  // Update charts when game state changes
  useEffect(() => {
    if (gameStarted) {
      updateCharts();
    }
  }, [gameState.savingsHistory, gameState.portfolioHistory, gameStarted]);

  const initializeCharts = () => {
    const savingsCtx = savingsChartRef.current.getContext('2d');
    savingsChartInstance.current = new Chart(savingsCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Savings ($)',
          data: [],
          borderColor: '#6f42c1',
          backgroundColor: 'rgba(111, 66, 193, 0.1)',
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => '$' + value.toLocaleString()
            }
          }
        }
      }
    });

    const portfolioCtx = portfolioChartRef.current.getContext('2d');
    portfolioChartInstance.current = new Chart(portfolioCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Portfolio Value ($)',
          data: [],
          borderColor: '#ffd700',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => '$' + value.toLocaleString()
            }
          }
        }
      }
    });
  };

  const updateCharts = () => {
    if (savingsChartInstance.current && portfolioChartInstance.current) {
      const labels = Array.from({length: gameState.week}, (_, i) => `Week ${i + 1}`);
      
      savingsChartInstance.current.data.labels = labels;
      savingsChartInstance.current.data.datasets[0].data = gameState.savingsHistory;
      savingsChartInstance.current.update();

      portfolioChartInstance.current.data.labels = labels;
      portfolioChartInstance.current.data.datasets[0].data = gameState.portfolioHistory;
      portfolioChartInstance.current.update();
    }
  };

  const startGame = () => {
    if (!formData.playerName.trim()) {
      alert('Please enter your name!');
      return;
    }

    const selectedJobData = jobSalaries[formData.selectedJob];
    setGameState(prev => ({
      ...prev,
      name: formData.playerName,
      job: formData.selectedJob,
      salary: selectedJobData.salary,
      activeIncome: selectedJobData.salary,
      totalIncome: selectedJobData.salary
    }));
    setGameStarted(true);
  };

  const workWeek = () => {
    let weeklyEarnings = gameState.salary;
    
    // Add random commission for salesperson
    if (gameState.job === 'salesperson') {
      weeklyEarnings += Math.floor(Math.random() * 300);
    }

    // Update portfolio values with random fluctuations
    const updatedPortfolio = gameState.portfolio.map(investment => {
      const chance = Math.random();
      let profit = 0;

      switch(investment.type) {
        case 'tech':
          if (chance > 0.5) {
            profit = investment.amount * 0.15;
          } else if (chance < 0.2) {
            profit = -investment.amount * 0.1;
          }
          break;
        case 'real_estate':
          if (chance > 0.3) {
            profit = investment.amount * 0.08;
          }
          break;
        case 'startup':
          if (chance > 0.7) {
            profit = investment.amount * 0.25;
          } else if (chance < 0.3) {
            profit = -investment.amount * 0.15;
          }
          break;
        default:
          break;
      }

      return { ...investment, amount: investment.amount + profit };
    });

    const newSavings = gameState.savings + weeklyEarnings;
    const newWeek = gameState.week + 1;
    const portfolioValue = updatedPortfolio.reduce((sum, inv) => sum + inv.amount, 0);

    setGameState(prev => ({
      ...prev,
      savings: newSavings,
      week: newWeek,
      portfolio: updatedPortfolio,
      savingsHistory: [...prev.savingsHistory, newSavings],
      portfolioHistory: [...prev.portfolioHistory, portfolioValue]
    }));

    calculateFinancialMetrics();
  };

  const invest = (type) => {
    const investment = investments[type];
    
    if (gameState.savings >= investment.cost) {
      setGameState(prev => ({
        ...prev,
        savings: prev.savings - investment.cost,
        portfolio: [...prev.portfolio, {
          type: type,
          amount: investment.cost,
          weeklyReturn: investment.weeklyReturn
        }]
      }));
      calculateFinancialMetrics();
    } else {
      alert('Not enough savings!');
    }
  };

  const startBusiness = () => {
    const businessCost = 10000;
    
    if (gameState.savings >= businessCost && formData.businessName && formData.missionStatement) {
      setGameState(prev => ({
        ...prev,
        savings: prev.savings - businessCost,
        businesses: [...prev.businesses, {
          name: formData.businessName,
          mission: formData.missionStatement,
          weeklyProfit: 1000
        }]
      }));
      
      setFormData(prev => ({
        ...prev,
        businessName: '',
        missionStatement: ''
      }));
      
      calculateFinancialMetrics();
    } else {
      alert('Not enough savings or missing business details!');
    }
  };

  const calculateFinancialMetrics = () => {
    setTimeout(() => {
      setGameState(prev => {
        // Calculate investment income
        const investmentIncome = prev.portfolio.reduce((sum, investment) => {
          return sum + (investment.amount * (investment.weeklyReturn || 0));
        }, 0);

        // Calculate business income
        const businessIncome = prev.businesses.reduce(
          (sum, business) => sum + business.weeklyProfit, 0
        );

        const passiveIncome = investmentIncome + businessIncome;
        const totalIncome = prev.activeIncome + passiveIncome;

        // Calculate ROI
        const totalInvestment = prev.portfolio.reduce((sum, inv) => sum + inv.amount, 0) +
                              (prev.businesses.length * 10000);
        
        const roi = totalInvestment > 0 ? 
          ((passiveIncome * 52) / totalInvestment * 100) : 0;
        
        const freedomProgress = Math.min(100, 
          (passiveIncome / prev.activeIncome * 100) || 0);

        return {
          ...prev,
          passiveIncome,
          totalIncome,
          roi: parseFloat(roi.toFixed(1)),
          freedomProgress: parseFloat(freedomProgress.toFixed(1))
        };
      });
    }, 100);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameState({
      name: '',
      job: '',
      savings: 0,
      week: 1,
      portfolio: [],
      businesses: [],
      salary: 0,
      savingsHistory: [],
      portfolioHistory: [],
      passiveIncome: 0,
      activeIncome: 0,
      totalIncome: 0,
      roi: 0,
      freedomProgress: 0
    });
    setFormData({
      playerName: '',
      selectedJob: 'teacher',
      businessName: '',
      missionStatement: ''
    });
  };

  if (!gameStarted) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Header style={{ backgroundColor: '#6f42c1', color: 'white' }}>
          <h3 className="mb-0">🎯 Financial Freedom Game</h3>
          <small>Learn budgeting and investment through interactive gameplay</small>
        </Card.Header>
        <Card.Body className="p-4">
          <Alert variant="info" className="mb-4">
            <strong>Learning Objectives:</strong> Understand budgeting, saving, investing, and passive income through hands-on simulation.
          </Alert>
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Your Name:</Form.Label>
              <Form.Control
                type="text"
                value={formData.playerName}
                onChange={(e) => setFormData(prev => ({ ...prev, playerName: e.target.value }))}
                placeholder="Enter your name"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Choose Your Job:</Form.Label>
              <Form.Select
                value={formData.selectedJob}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedJob: e.target.value }))}
              >
                {Object.entries(jobSalaries).map(([key, job]) => (
                  <option key={key} value={key}>{job.label}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button 
              onClick={startGame}
              style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1' }}
              size="lg"
              className="w-100"
            >
              Start Your Financial Journey! 🚀
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  const passiveIncomeRatio = (gameState.passiveIncome / gameState.totalIncome * 100) || 0;
  const totalAssets = gameState.portfolio.reduce((sum, inv) => sum + inv.amount, 0) +
                    (gameState.businesses.length * 10000);

  return (
    <div className="financial-game">
      {/* Game Header */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header style={{ background: 'linear-gradient(135deg, #6f42c1, #ffd700)', color: 'white' }}>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">🎯 {gameState.name}'s Financial Journey</h4>
              <small>{jobSalaries[gameState.job].label} • Week {gameState.week}</small>
            </Col>
            <Col xs="auto">
              <Button variant="outline-light" size="sm" onClick={resetGame}>
                Reset Game
              </Button>
            </Col>
          </Row>
        </Card.Header>
      </Card>

      <Row>
        {/* Status Panel */}
        <Col md={4}>
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body>
              <h5 style={{ color: '#6f42c1' }}>💰 Your Status</h5>
              <div className="mb-3">
                <p className="mb-1"><strong>Savings:</strong> ${Math.floor(gameState.savings).toLocaleString()}</p>
                <p className="mb-1"><strong>Portfolio Value:</strong> ${Math.floor(gameState.portfolio.reduce((sum, inv) => sum + inv.amount, 0)).toLocaleString()}</p>
                <p className="mb-3"><strong>Total Assets:</strong> ${Math.floor(totalAssets).toLocaleString()}</p>
              </div>
              
              <Button 
                onClick={workWeek}
                style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                className="w-100 mb-2"
              >
                Work for a Week 💼
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Investment Panel */}
        <Col md={4}>
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body>
              <h5 style={{ color: '#6f42c1' }}>📈 Investments</h5>
              {Object.entries(investments).map(([key, investment]) => (
                <div key={key} className="mb-3 p-2 border rounded">
                  <h6>{investment.label}</h6>
                  <p className="small mb-2">Cost: ${investment.cost.toLocaleString()} | Risk: {investment.risk}</p>
                  <Button
                    onClick={() => invest(key)}
                    variant="outline-primary"
                    size="sm"
                    disabled={gameState.savings < investment.cost}
                  >
                    Buy {investment.label}
                  </Button>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Business Panel */}
        <Col md={4}>
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body>
              <h5 style={{ color: '#6f42c1' }}>🏢 Business Empire</h5>
              
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Mission Statement"
                  value={formData.missionStatement}
                  onChange={(e) => setFormData(prev => ({ ...prev, missionStatement: e.target.value }))}
                />
              </Form.Group>
              
              <Button
                onClick={startBusiness}
                variant="warning"
                size="sm"
                disabled={gameState.savings < 10000}
                className="w-100 mb-3"
              >
                Start Business ($10,000)
              </Button>

              {gameState.businesses.map((business, index) => (
                <div key={index} className="card p-2 mb-2" style={{ backgroundColor: '#f8f9fa' }}>
                  <h6 className="mb-1">{business.name}</h6>
                  <p className="small mb-1">{business.mission}</p>
                  <p className="small text-success mb-0">Weekly Profit: ${business.weeklyProfit}</p>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 style={{ color: '#6f42c1' }}>💰 Savings History</h5>
              <div style={{ height: '300px' }}>
                <canvas ref={savingsChartRef}></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 style={{ color: '#ffd700' }}>📊 Portfolio Value</h5>
              <div style={{ height: '300px' }}>
                <canvas ref={portfolioChartRef}></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Financial Dashboard */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h4 className="mb-4" style={{ color: '#6f42c1' }}>🎯 Financial Intelligence Dashboard</h4>
          
          <Row>
            <Col md={4}>
              <Card className="text-white h-100" style={{ backgroundColor: '#28a745' }}>
                <Card.Body>
                  <h5>💼 Income Streams</h5>
                  <p className="mb-1">Active Income: ${Math.floor(gameState.activeIncome)}/week</p>
                  <p className="mb-1">Investment Income: ${Math.floor(gameState.passiveIncome * 0.6)}/week</p>
                  <p className="mb-1">Business Income: ${Math.floor(gameState.passiveIncome * 0.4)}/week</p>
                  <p className="mb-2"><strong>Total Passive: ${Math.floor(gameState.passiveIncome)}/week</strong></p>
                  <ProgressBar 
                    now={passiveIncomeRatio} 
                    variant="light"
                    className="mb-1"
                  />
                  <small>Passive Income: {passiveIncomeRatio.toFixed(1)}%</small>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="text-white h-100" style={{ backgroundColor: '#17a2b8' }}>
                <Card.Body>
                  <h5>📊 Financial Metrics</h5>
                  <p className="mb-1">Cash Flow: ${Math.floor(gameState.passiveIncome)}/week</p>
                  <p className="mb-1">ROI: {gameState.roi}%</p>
                  <p className="mb-2">Total Assets: ${Math.floor(totalAssets).toLocaleString()}</p>
                  <ProgressBar 
                    now={gameState.freedomProgress} 
                    variant="warning"
                    className="mb-1"
                  />
                  <small>Financial Freedom: {gameState.freedomProgress}%</small>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="h-100" style={{ backgroundColor: '#ffd700', color: '#1a1a1a' }}>
                <Card.Body>
                  <h5>🏆 Achievements</h5>
                  {gameState.savings > 5000 && <p className="small">✅ First $5K Saved!</p>}
                  {gameState.portfolio.length > 0 && <p className="small">✅ First Investment!</p>}
                  {gameState.businesses.length > 0 && <p className="small">✅ Business Owner!</p>}
                  {gameState.passiveIncome > gameState.activeIncome && <p className="small">🎉 Financial Freedom!</p>}
                  {gameState.freedomProgress < 25 && <p className="small">🎯 Goal: 25% Passive Income</p>}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FinancialFreedomGame;