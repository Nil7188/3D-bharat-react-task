"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getDealById } from "../../../services/dealService";

export default function DealDetailsPage() {
  const params = useParams();

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function loadDeal() {
      try {
        setLoading(true);

        const data = await getDealById(params.id);

        setDeal(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDeal();
  }, [params.id]);

  if (loading) {
    return (
      <main style={styles.center}>
        <h2>Loading deal...</h2>
      </main>
    );
  }

  if (error || !deal) {
    return (
      <main style={styles.center}>
        <h2>Deal not found</h2>
        <p>{error}</p>
      </main>
    );
  }

  const roiProjection = [
    { year: "Year 1", roi: deal.roi },
    { year: "Year 2", roi: deal.roi + 4 },
    { year: "Year 3", roi: deal.roi + 8 },
    { year: "Year 4", roi: deal.roi + 11 },
    { year: "Year 5", roi: deal.roi + 15 },
  ];

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.brand}>3D Bharat</p>

          <h1 style={styles.title}>
            {deal.company}
          </h1>

          <p style={styles.subtitle}>
            {deal.industry} • {deal.status}
          </p>
        </div>

        {/* Main Metrics */}

        <div style={styles.metricsGrid}>
          <Metric
            title="Expected ROI"
            value={`${deal.roi}%`}
          />

          <Metric
            title="Investment"
            value={`₹${(
              deal.investment / 100000
            ).toFixed(1)} L`}
          />

          <Metric
            title="Funding"
            value={`₹${(
              deal.funding / 10000000
            ).toFixed(2)} Cr`}
          />

          <Metric
            title="Risk"
            value={deal.risk}
          />
        </div>

        {/* Tabs */}

        <div style={styles.tabs}>
          <button
            onClick={() =>
              setActiveTab("overview")
            }
            style={
              activeTab === "overview"
                ? styles.activeTab
                : styles.tab
            }
          >
            Overview
          </button>

          <button
            onClick={() =>
              setActiveTab("financials")
            }
            style={
              activeTab === "financials"
                ? styles.activeTab
                : styles.tab
            }
          >
            Financials
          </button>

          <button
            onClick={() =>
              setActiveTab("risk")
            }
            style={
              activeTab === "risk"
                ? styles.activeTab
                : styles.tab
            }
          >
            Risk Analysis
          </button>
        </div>

        {/* Overview */}

        {activeTab === "overview" && (
          <section style={styles.card}>
            <h2>Company Overview</h2>

            <p style={styles.description}>
              {deal.description}
            </p>

            <div style={styles.infoGrid}>
              <Info
                label="Industry"
                value={deal.industry}
              />

              <Info
                label="Founded"
                value={deal.founded}
              />

              <Info
                label="Investors"
                value={deal.investors}
              />

              <Info
                label="Status"
                value={deal.status}
              />
            </div>
          </section>
        )}

        {/* Financials */}

        {activeTab === "financials" && (
          <section style={styles.card}>
            <h2>ROI Projection</h2>

            <div
              style={{
                width: "100%",
                height: 350,
              }}
            >
              <ResponsiveContainer>
                <LineChart
                  data={roiProjection}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="year" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="roi"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.infoGrid}>
              <Info
                label="Current ROI"
                value={`${deal.roi}%`}
              />

              <Info
                label="Projected ROI"
                value={`${deal.roi + 15}%`}
              />

              <Info
                label="Investment"
                value={`₹${(
                  deal.investment / 100000
                ).toFixed(1)} L`}
              />

              <Info
                label="Funding Raised"
                value={`₹${(
                  deal.funding / 10000000
                ).toFixed(2)} Cr`}
              />
            </div>
          </section>
        )}

        {/* Risk */}

        {activeTab === "risk" && (
          <section style={styles.card}>
            <h2>Risk Analysis</h2>

            <div style={styles.riskBox}>
              <h3>
                Risk Level: {deal.risk}
              </h3>

              <p>
                This deal has been classified as a{" "}
                <strong>
                  {deal.risk.toLowerCase()}
                </strong>{" "}
                risk investment based on the
                simulated portfolio data.
              </p>
            </div>

            <div style={styles.infoGrid}>
              <Info
                label="Risk Category"
                value={deal.risk}
              />

              <Info
                label="Expected ROI"
                value={`${deal.roi}%`}
              />

              <Info
                label="Industry"
                value={deal.industry}
              />

              <Info
                label="Active Status"
                value={deal.status}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Metric({ title, value }) {
  return (
    <div style={styles.metricCard}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.info}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
    flexDirection: "column",
  },

  header: {
    marginBottom: "30px",
  },

  brand: {
    color: "#64748b",
  },

  title: {
    fontSize: "36px",
    color: "#0f172a",
    margin: "5px 0",
  },

  subtitle: {
    color: "#64748b",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },

  metricCard: {
    background: "white",
    padding: "22px",
    borderRadius: "16px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.05)",
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  tab: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#e2e8f0",
    cursor: "pointer",
  },

  activeTab: {
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.05)",
  },

  description: {
    color: "#64748b",
    lineHeight: "1.7",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginTop: "25px",
  },

  info: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "10px",
  },

  riskBox: {
    padding: "20px",
    background: "#f8fafc",
    borderRadius: "12px",
    marginTop: "20px",
  },
};