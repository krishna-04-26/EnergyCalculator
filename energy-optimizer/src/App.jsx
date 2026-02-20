import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import CountUp from "react-countup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [result, setResult] = useState(null);

  const [power, setPower] = useState("");
  const [hours, setHours] = useState("");
  const [appliances, setAppliances] = useState("");
  const [tariff, setTariff] = useState(6);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const calculateEnergy = () => {
    let p = Number(power);
    const h = Number(hours);
    const a = Number(appliances);
    const t = Number(tariff);

    if (!p || !h || !a) {
      alert("Fill all fields");
      return;
    }

    if (p > 50) p = p / 1000;

    const monthlyUnits = p * h * 30 * a;
    const recommendedUnits = p * 6 * 30 * a;

    const actualCost = monthlyUnits * t;
    const recommendedCost = recommendedUnits * t;
    const excessCost = Math.max(actualCost - recommendedCost, 0);
    const yearlySavings = excessCost * 12;

    const inflation = 0.05;
    let growth = [];
    let monthlyGraph = [];
    let total5Year = 0;

    for (let i = 1; i <= 5; i++) {
      const inflated = yearlySavings * Math.pow(1 + inflation, i - 1);
      total5Year += inflated;
      growth.push({ year: `Year ${i}`, savings: inflated });
    }

    for (let m = 1; m <= 12; m++) {
      monthlyGraph.push({ month: `Month ${m}`, cost: actualCost / 12 });
    }

    const pieData = [
      { name: "Actual Cost", value: actualCost },
      { name: "Recommended Cost", value: recommendedCost },
    ];

    setResult({ actualCost, yearlySavings, total5Year, growth, monthlyGraph, pieData });
  };

  const COLORS = ["#f5b301", "#ff7a00"];

  return (
    <>
      {/* Scroll progress */}
      <motion.div className="progress-bar" style={{ scaleX }} />

      {/* Navbar */}
      <nav className="navbar container">
        <ul>
          <li>
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section (Original Tagline Restored) */}
      <section>
        <div className="container split">
          <div>
            <h1>
              Energy Intelligence <br />
              <span className="highlight">Built for Growth.</span>
            </h1>
            <p>
              Predict costs, model savings, and optimize efficiency with long-term projections.
            </p>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1509395176047-4a66953fd231"
              alt="energy"
              style={{ width: "100%", borderRadius: "20px" }}
            />
          </div>
        </div>

        <svg className="wave" viewBox="0 0 1440 320">
          <path
            fill="#f5b301"
            d="M0,160L80,144C160,128,320,96,480,106.7C640,117,800,171,960,186.7C1120,203,1280,181,1360,170.7L1440,160V320H0Z"
          />
        </svg>
      </section>

      {/* Calculator Section */}
      <section id="calculator">
        <div className="glass full-width" style={{ padding: "30px 50px", maxWidth: "1200px", margin: "0 auto" }}>
          <h2>Energy Calculator</h2>
          <input placeholder="Power (W or kW)" onChange={(e) => setPower(e.target.value)} />
          <input placeholder="Hours per Day" onChange={(e) => setHours(e.target.value)} />
          <input placeholder="Number of Appliances" onChange={(e) => setAppliances(e.target.value)} />
          <input placeholder="Tariff (₹)" value={tariff} onChange={(e) => setTariff(e.target.value)} />
          <button onClick={calculateEnergy}>Calculate</button>
        </div>
      </section>

      {/* Post-Calculator Results & Insights */}
      {result && (
        <section>
          <div className="glass full-width" style={{ padding: "30px 50px", maxWidth: "1200px", margin: "40px auto", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
            <h2 style={{ textAlign: "center", marginBottom: "25px", color: "#f5b301" }}>Projected Impact & Insights</h2>

            {/* Cost & Savings Cards */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "space-between" }}>
              <div className="card" style={{ flex: "1 1 250px", background: "rgba(255,255,255,0.15)", padding: "20px", borderRadius: "15px" }}>
                <h3>Monthly Cost</h3>
                <p>₹<CountUp end={result.actualCost} duration={2} decimals={2} /></p>
              </div>
              <div className="card" style={{ flex: "1 1 250px", background: "rgba(255,255,255,0.15)", padding: "20px", borderRadius: "15px" }}>
                <h3>Yearly Savings</h3>
                <p>₹<CountUp end={result.yearlySavings} duration={2} decimals={2} /></p>
              </div>
              <div className="card" style={{ flex: "1 1 250px", background: "rgba(255,255,255,0.15)", padding: "20px", borderRadius: "15px" }}>
                <h3>5-Year Savings</h3>
                <p>₹<CountUp end={result.total5Year} duration={2} decimals={2} /></p>
              </div>
            </div>

            {/* Charts */}
            <div style={{ marginTop: "40px" }}>
              <h3 style={{ marginBottom: "10px", color: "#ff7a00" }}>Cost Breakdown</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={result.pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {result.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <h3 style={{ marginTop: "30px", color: "#f5b301" }}>Monthly Costs</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={result.monthlyGraph}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cost" stroke="#f5b301" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <h3 style={{ marginTop: "30px", color: "#ff7a00" }}>5-Year Savings Growth</h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={result.growth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="savings" stroke="#ff7a00" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ marginTop: "40px" }}>
              <h3 style={{ color: "#f5b301", marginBottom: "15px" }}>Energy-Saving Suggestions</h3>
              <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
                {power >= 1000 && (
                  <>
                    <li>Upgrade to energy-efficient appliances (LEDs, inverter ACs, smart fridges).</li>
                    <li>Use smart plugs to control idle devices.</li>
                  </>
                )}
                {power < 1000 && power >= 500 && (
                  <>
                    <li>Reduce standby power consumption.</li>
                    <li>Use timers to control appliance usage.</li>
                  </>
                )}
                {power < 500 && <li>Even small appliances add up—unplug when not in use.</li>}
                <li>Turn off lights and devices when not in use.</li>
                <li>Use natural light during the day.</li>
                <li>Regularly maintain appliances to keep them efficient.</li>
              </ul>
            </div>

            <div style={{ marginTop: "30px" }}>
              <h3 style={{ color: "#ff7a00" }}>Cost Efficiency Insights</h3>
              <p>
                Reducing your usage by 1 hour/day per appliance could save <b>{((power * hours * 30 * appliances * tariff) - (power * (hours-1) * 30 * appliances * tariff)).toFixed(2)} ₹</b> monthly.
              </p>
            </div>

            <div style={{ marginTop: "30px" }}>
              <h3 style={{ color: "#f5b301" }}>Sustainability Impact 🌱</h3>
              <p>
                By following these recommendations, you can reduce CO₂ emissions by approximately <b>{(power * hours * 30 * appliances * 0.82).toFixed(2)} kg</b> per month.
              </p>
              <p>
                Efficient energy use reduces bills, conserves resources, and promotes sustainable living. Small changes can create a big environmental impact.
              </p>
            </div>

            <div style={{ marginTop: "30px", marginBottom: "30px" }}>
              <h3 style={{ color: "#ff7a00" }}>Future Recommendations</h3>
              <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
                <li>Integrate renewable energy sources (solar panels, wind energy).</li>
                <li>Use smart devices to monitor consumption.</li>
                <li>Promote energy-efficient habits to maximize savings and environmental impact.</li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default App;