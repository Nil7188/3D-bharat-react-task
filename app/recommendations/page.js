"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getDeals } from "@/services/dealService";

export default function RecommendationsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [industry, setIndustry] = useState("All");
  const [risk, setRisk] = useState("All");
  const [minimumROI, setMinimumROI] = useState(15);

  // Load all deals
  useEffect(() => {
    async function loadDeals() {
      try {
        setLoading(true);

        const data = await getDeals();

        setDeals(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load deals.");
      } finally {
        setLoading(false);
      }
    }

    loadDeals();
  }, []);

  // Recommendation Engine
  const recommendations = useMemo(() => {
    if (!deals.length) {
      return [];
    }

    const scoredDeals = deals.map((deal) => {
      let score = 0;

      // Industry
      if (industry === "All") {
        score += 25;
      } else if (deal.industry === industry) {
        score += 40;
      }

      // Risk
      if (risk === "All") {
        score += 20;
      } else if (deal.risk === risk) {
        score += 25;
      }

      // ROI
      if (deal.roi >= minimumROI) {
        score += 30;
      }

      // Active deal
      if (deal.status === "Active") {
        score += 5;
      }

      return {
        ...deal,
        recommendationScore: Math.min(score, 100),
      };
    });

    return scoredDeals
      .filter((deal) => deal.roi >= minimumROI)
      .sort(
        (a, b) =>
          b.recommendationScore - a.recommendationScore ||
          b.roi - a.roi
      )
      .slice(0, 5);
  }, [deals, industry, risk, minimumROI]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <p style={styles.brand}>
          3D Bharat
        </p>

        <h1 style={styles.title}>
          Recommended Deals
        </h1>

        <p style={styles.subtitle}>
          Personalized investment opportunities based on
          your preferences.
        </p>

        {/* Preferences */}
        <section style={styles.preferenceCard}>
          <h2 style={styles.sectionTitle}>
            Your Preferences
          </h2>

          <div style={styles.grid}>

            {/* Industry */}
            <div>
              <label style={styles.label}>
                Preferred Industry
              </label>

              <select
                value={industry}
                onChange={(e) => {
                  setIndustry(e.target.value);
                }}
                style={styles.input}
              >
                <option value="All">
                  All Industries
                </option>

                <option value="AI">AI</option>
                <option value="Fintech">
                  Fintech
                </option>
                <option value="Healthcare">
                  Healthcare
                </option>
                <option value="Energy">
                  Energy
                </option>
                <option value="Agriculture">
                  Agriculture
                </option>
                <option value="SaaS">
                  SaaS
                </option>
                <option value="Cybersecurity">
                  Cybersecurity
                </option>
                <option value="EV">
                  EV
                </option>
              </select>
            </div>

            {/* Risk */}
            <div>
              <label style={styles.label}>
                Preferred Risk
              </label>

              <select
                value={risk}
                onChange={(e) => {
                  setRisk(e.target.value);
                }}
                style={styles.input}
              >
                <option value="All">
                  All Risks
                </option>

                <option value="Low">
                  Low Risk
                </option>

                <option value="Medium">
                  Medium Risk
                </option>

                <option value="High">
                  High Risk
                </option>
              </select>
            </div>

            {/* ROI */}
            <div>
              <label style={styles.label}>
                Minimum ROI
              </label>

              <select
                value={minimumROI}
                onChange={(e) => {
                  setMinimumROI(
                    Number(e.target.value)
                  );
                }}
                style={styles.input}
              >
                <option value={10}>10%+</option>
                <option value={15}>15%+</option>
                <option value={20}>20%+</option>
                <option value={25}>25%+</option>
                <option value={30}>30%+</option>
              </select>
            </div>

          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div style={styles.message}>
            Loading recommendations...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <div style={styles.resultHeader}>
              <div>
                <h2 style={styles.resultTitle}>
                  Top Recommendations
                </h2>

                <p style={styles.resultSubtitle}>
                  {recommendations.length} matches
                </p>
              </div>
            </div>

            {recommendations.length === 0 ? (
              <div style={styles.empty}>
                <h3>
                  No matching deals
                </h3>

                <p>
                  Try lowering the minimum ROI or
                  changing your investment preferences.
                </p>
              </div>
            ) : (
              <div style={styles.deals}>
                {recommendations.map((deal) => (
                  <div
                    key={deal.id}
                    style={styles.dealCard}
                  >

                    {/* Top */}
                    <div style={styles.dealTop}>

                      <div>
                        <h3 style={styles.company}>
                          {deal.company}
                        </h3>

                        <p style={styles.meta}>
                          {deal.industry} • Risk:{" "}
                          {deal.risk}
                        </p>
                      </div>

                      <div style={styles.score}>
                        <span
                          style={styles.scoreLabel}
                        >
                          Match
                        </span>

                        <strong>
                          {deal.recommendationScore}%
                        </strong>
                      </div>

                    </div>

                    {/* Metrics */}
                    <div style={styles.metrics}>

                      <div>
                        <span
                          style={styles.metricLabel}
                        >
                          ROI
                        </span>

                        <strong style={styles.roi}>
                          {deal.roi}%
                        </strong>
                      </div>

                      <div>
                        <span
                          style={styles.metricLabel}
                        >
                          Investment
                        </span>

                        <strong>
                          ₹
                          {deal.investment.toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </div>

                      <div>
                        <span
                          style={styles.metricLabel}
                        >
                          Status
                        </span>

                        <strong style={styles.status}>
                          {deal.status}
                        </strong>
                      </div>

                    </div>

                    {/* Link */}
                    <Link
                      href={`/deals/${deal.id}`}
                      style={styles.link}
                    >
                      View Deal →
                    </Link>

                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </main>
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

  brand: {
    color: "#64748b",
    marginBottom: "8px",
  },

  title: {
    fontSize: "34px",
    margin: 0,
    color: "#0f172a",
  },

  subtitle: {
    color: "#64748b",
    marginTop: "10px",
  },

  preferenceCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    marginTop: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#0f172a",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    background: "#ffffff",
    fontSize: "14px",
  },

  resultHeader: {
    marginTop: "35px",
    marginBottom: "15px",
  },

  resultTitle: {
    margin: 0,
    color: "#0f172a",
  },

  resultSubtitle: {
    color: "#64748b",
    marginTop: "5px",
  },

  deals: {
    display: "grid",
    gap: "16px",
  },

  dealCard: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },

  dealTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },

  company: {
    margin: 0,
    color: "#0f172a",
    fontSize: "20px",
  },

  meta: {
    color: "#64748b",
    marginTop: "6px",
  },

  score: {
    minWidth: "90px",
    textAlign: "center",
    background: "#eff6ff",
    padding: "10px",
    borderRadius: "10px",
    color: "#2563eb",
  },

  scoreLabel: {
    display: "block",
    fontSize: "12px",
    marginBottom: "4px",
  },

  metrics: {
    display: "flex",
    gap: "50px",
    marginTop: "22px",
    paddingTop: "18px",
    borderTop: "1px solid #e2e8f0",
  },

  metricLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    marginBottom: "5px",
  },

  roi: {
    color: "#16a34a",
  },

  status: {
    color: "#16a34a",
  },

  link: {
    display: "inline-block",
    marginTop: "20px",
    color: "#2563eb",
    fontWeight: "600",
    textDecoration: "none",
  },

  message: {
    marginTop: "30px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    textAlign: "center",
    color: "#64748b",
  },

  error: {
    marginTop: "30px",
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "20px",
    borderRadius: "12px",
  },

  empty: {
    background: "#ffffff",
    padding: "50px",
    textAlign: "center",
    borderRadius: "16px",
    color: "#64748b",
  },
};