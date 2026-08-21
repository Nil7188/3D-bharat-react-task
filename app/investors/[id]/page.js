"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { fetchInvestors } from "../../../store/investorSlice";

export default function InvestorDetailsPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const {
    data: investors,
    loading,
    error,
  } = useSelector((state) => state.investors);

  useEffect(() => {
    if (investors.length === 0) {
      dispatch(fetchInvestors());
    }
  }, [dispatch, investors.length]);

  const investor = investors.find(
    (item) => item.id === Number(params.id)
  );

  // =========================
  // LOADING
  // =========================

  if (loading || investors.length === 0) {
    return (
      <main style={styles.center}>
        <h2>Loading investor...</h2>
      </main>
    );
  }

  // =========================
  // ERROR / NOT FOUND
  // =========================

  if (error || !investor) {
    return (
      <main style={styles.center}>
        <h2>Investor not found</h2>

        <p>
          {error || "The requested investor does not exist."}
        </p>

        <Link href="/investors" style={styles.backLink}>
          ← Back to Investors
        </Link>
      </main>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* BACK BUTTON */}

        <Link
          href="/investors"
          style={styles.backLink}
        >
          ← Back to Investors
        </Link>

        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <p style={styles.brand}>
              3D Bharat
            </p>

            <h1 style={styles.title}>
              {investor.name}
            </h1>

            <p style={styles.subtitle}>
              {investor.location} •{" "}
              {investor.type}
            </p>
          </div>

          <span
            style={getRiskStyle(
              investor.preferredRisk
            )}
          >
            {investor.preferredRisk} Risk
          </span>
        </div>

        {/* SUMMARY CARDS */}

        <div style={styles.statsGrid}>

          <StatCard
            title="Total Investments"
            value={investor.totalInvestments}
          />

          <StatCard
            title="Total Invested"
            value={`₹${(
              investor.totalInvested /
              10000000
            ).toFixed(2)} Cr`}
          />

          <StatCard
            title="Portfolio Companies"
            value={investor.portfolioCompanies}
          />

          <StatCard
            title="Status"
            value={investor.status}
          />

        </div>

        {/* INVESTMENT PREFERENCES */}

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            Investment Preferences
          </h2>

          <div style={styles.infoGrid}>

            <Info
              label="Preferred Industry"
              value={investor.preferredIndustry}
            />

            <Info
              label="Preferred Risk"
              value={investor.preferredRisk}
            />

            <Info
              label="Investor Type"
              value={investor.type}
            />

            <Info
              label="Location"
              value={investor.location}
            />

          </div>
        </section>

        {/* INVESTMENT ACTIVITY */}

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            Investment Activity
          </h2>

          <div style={styles.activityGrid}>

            <div style={styles.activityItem}>
              <span>
                Total Investments
              </span>

              <strong>
                {investor.totalInvestments}
              </strong>
            </div>

            <div style={styles.activityItem}>
              <span>
                Portfolio Companies
              </span>

              <strong>
                {investor.portfolioCompanies}
              </strong>
            </div>

            <div style={styles.activityItem}>
              <span>
                Average Investment
              </span>

              <strong>
                ₹
                {(
                  investor.totalInvested /
                  investor.totalInvestments /
                  100000
                ).toFixed(1)}
                L
              </strong>
            </div>

          </div>
        </section>

        {/* INVESTOR SUMMARY */}

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            Investor Summary
          </h2>

          <p style={styles.description}>
            {investor.name} is a{" "}
            <strong>
              {investor.type}
            </strong>{" "}
            based in{" "}
            <strong>
              {investor.location}
            </strong>
            . The investor has made{" "}
            <strong>
              {investor.totalInvestments}
            </strong>{" "}
            investments with a total invested
            capital of{" "}
            <strong>
              ₹
              {(
                investor.totalInvested /
                10000000
              ).toFixed(2)}{" "}
              Cr
            </strong>
            .
          </p>

          <p style={styles.description}>
            The investor primarily prefers{" "}
            <strong>
              {investor.preferredIndustry}
            </strong>{" "}
            companies and follows a{" "}
            <strong>
              {investor.preferredRisk.toLowerCase()}
            </strong>{" "}
            risk investment strategy.
          </p>
        </section>

      </div>
    </main>
  );
}

// =========================
// STAT CARD
// =========================

function StatCard({ title, value }) {
  return (
    <div style={styles.statCard}>
      <p style={styles.statTitle}>
        {title}
      </p>

      <h2 style={styles.statValue}>
        {value}
      </h2>
    </div>
  );
}

// =========================
// INFO
// =========================

function Info({ label, value }) {
  return (
    <div style={styles.info}>
      <span style={styles.infoLabel}>
        {label}
      </span>

      <strong style={styles.infoValue}>
        {value}
      </strong>
    </div>
  );
}

// =========================
// RISK STYLE
// =========================

function getRiskStyle(risk) {
  if (risk === "Low") {
    return {
      ...styles.riskBadge,
      background: "#dcfce7",
      color: "#166534",
    };
  }

  if (risk === "High") {
    return {
      ...styles.riskBadge,
      background: "#fee2e2",
      color: "#991b1b",
    };
  }

  return {
    ...styles.riskBadge,
    background: "#fef3c7",
    color: "#92400e",
  };
}

// =========================
// STYLES
// =========================

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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    gap: "10px",
  },

  backLink: {
    display: "inline-block",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
    marginBottom: "25px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "30px",
  },

  brand: {
    color: "#64748b",
    marginBottom: "8px",
  },

  title: {
    fontSize: "36px",
    margin: 0,
    color: "#0f172a",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "10px",
  },

  riskBadge: {
    padding: "8px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.06)",
  },

  statTitle: {
    color: "#64748b",
    margin: 0,
    fontSize: "14px",
  },

  statValue: {
    color: "#0f172a",
    fontSize: "28px",
    marginTop: "12px",
    marginBottom: 0,
  },

  card: {
    background: "white",
    padding: "28px",
    borderRadius: "16px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.06)",
    marginBottom: "25px",
  },

  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "21px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  info: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "10px",
  },

  infoLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "13px",
    marginBottom: "7px",
  },

  infoValue: {
    color: "#0f172a",
    fontSize: "15px",
  },

  activityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },

  activityItem: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  description: {
    color: "#64748b",
    lineHeight: "1.7",
    marginTop: "18px",
  },
};