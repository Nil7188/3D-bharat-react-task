"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { fetchDeals } from "../../store/dealSlice";
import { fetchInvestors } from "../../store/investorSlice";

export default function CorporateDashboard() {
  const dispatch = useDispatch();

  const {
    data: deals,
    loading: dealsLoading,
    error: dealsError,
  } = useSelector((state) => state.deals);

  const {
    data: investors,
    loading: investorsLoading,
    error: investorsError,
  } = useSelector((state) => state.investors);

  useEffect(() => {
    if (deals.length === 0) {
      dispatch(fetchDeals());
    }

    if (investors.length === 0) {
      dispatch(fetchInvestors());
    }
  }, [
    dispatch,
    deals.length,
    investors.length,
  ]);

  const loading =
    dealsLoading || investorsLoading;

  const error =
    dealsError || investorsError;

  // =========================
  // CORPORATE SUMMARY
  // =========================

  const totalInvestment = useMemo(() => {
    return deals.reduce(
      (total, deal) =>
        total + Number(deal.investment || 0),
      0
    );
  }, [deals]);

  const activeDeals = useMemo(() => {
    return deals.filter(
      (deal) => deal.status === "Active"
    ).length;
  }, [deals]);

  const averageROI = useMemo(() => {
    if (deals.length === 0) return 0;

    return (
      deals.reduce(
        (total, deal) =>
          total + Number(deal.roi || 0),
        0
      ) / deals.length
    ).toFixed(1);
  }, [deals]);

  const totalPortfolioCompanies = useMemo(() => {
    return investors.reduce(
      (total, investor) =>
        total +
        Number(
          investor.portfolioCompanies || 0
        ),
      0
    );
  }, [investors]);

  // =========================
  // INDUSTRY INVESTMENT
  // =========================

  const industryData = useMemo(() => {
    const industries = {};

    deals.forEach((deal) => {
      const industry = deal.industry;

      if (!industries[industry]) {
        industries[industry] = 0;
      }

      industries[industry] +=
        Number(deal.investment || 0);
    });

    return Object.entries(industries)
      .map(([name, investment]) => ({
        name,
        investment:
          Number(
            (investment / 10000000).toFixed(2)
          ),
      }))
      .sort(
        (a, b) =>
          b.investment - a.investment
      );
  }, [deals]);

  // =========================
  // INVESTOR TYPE
  // =========================

  const investorTypeData = useMemo(() => {
    const types = {};

    investors.forEach((investor) => {
      const type = investor.type;

      if (!types[type]) {
        types[type] = 0;
      }

      types[type]++;
    });

    return Object.entries(types).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }, [investors]);

  if (loading) {
    return (
      <main style={styles.center}>
        <h2>Loading corporate dashboard...</h2>
      </main>
    );
  }

  if (error) {
    return (
      <main style={styles.center}>
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>
          <p style={styles.brand}>
            3D Bharat
          </p>

          <h1 style={styles.title}>
            Corporate Dashboard
          </h1>

          <p style={styles.subtitle}>
            Monitor corporate investments,
            investors and portfolio activity.
          </p>
        </div>

        {/* SUMMARY */}

        <div style={styles.statsGrid}>

          <StatCard
            title="Total Investment"
            value={`₹${(
              totalInvestment / 10000000
            ).toFixed(2)} Cr`}
          />

          <StatCard
            title="Active Deals"
            value={activeDeals}
          />

          <StatCard
            title="Average ROI"
            value={`${averageROI}%`}
          />

          <StatCard
            title="Portfolio Companies"
            value={totalPortfolioCompanies}
          />

        </div>

        {/* CHARTS */}

        <div style={styles.twoColumn}>

          {/* INDUSTRY INVESTMENT */}

          <section style={styles.card}>

            <div style={styles.chartHeader}>
              <h2 style={styles.chartTitle}>
                Investment by Industry
              </h2>

              <p style={styles.chartSubtitle}>
                Total investment across industries
              </p>
            </div>

            <div style={styles.chartContainer}>
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={industryData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis
                    tickFormatter={(value) =>
                      `₹${value}Cr`
                    }
                  />

                  <Tooltip
                    formatter={(value) =>
                      `₹${value} Cr`
                    }
                  />

                  <Bar
                    dataKey="investment"
                    name="Investment"
                    fill="#2563eb"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </section>

          {/* INVESTOR TYPES */}

          <section style={styles.card}>

            <div style={styles.chartHeader}>
              <h2 style={styles.chartTitle}>
                Investor Types
              </h2>

              <p style={styles.chartSubtitle}>
                Distribution of investors
              </p>
            </div>

            <div style={styles.chartContainer}>
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>

                  <Pie
                    data={investorTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {investorTypeData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            PIE_COLORS[
                              index %
                                PIE_COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>
            </div>

          </section>

        </div>

        {/* CORPORATE TABLE */}

        <section style={styles.card}>

          <div style={styles.chartHeader}>
            <h2 style={styles.chartTitle}>
              Top Investors
            </h2>

            <p style={styles.chartSubtitle}>
              Investors ranked by total investment
            </p>
          </div>

          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>
                <tr>
                  <th style={styles.th}>
                    Investor
                  </th>

                  <th style={styles.th}>
                    Type
                  </th>

                  <th style={styles.th}>
                    Location
                  </th>

                  <th style={styles.th}>
                    Investments
                  </th>

                  <th style={styles.th}>
                    Total Invested
                  </th>

                  <th style={styles.th}>
                    Risk
                  </th>
                </tr>
              </thead>

              <tbody>

                {[...investors]
                  .sort(
                    (a, b) =>
                      b.totalInvested -
                      a.totalInvested
                  )
                  .slice(0, 10)
                  .map((investor) => (

                    <tr key={investor.id}>

                      <td style={styles.td}>
                        <strong>
                          {investor.name}
                        </strong>
                      </td>

                      <td style={styles.td}>
                        {investor.type}
                      </td>

                      <td style={styles.td}>
                        {investor.location}
                      </td>

                      <td style={styles.td}>
                        {investor.totalInvestments}
                      </td>

                      <td style={styles.td}>
                        ₹
                        {(
                          investor.totalInvested /
                          10000000
                        ).toFixed(2)}
                        Cr
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.riskBadge,
                            ...(investor.preferredRisk ===
                            "Low"
                              ? styles.lowRisk
                              : investor.preferredRisk ===
                                "Medium"
                              ? styles.mediumRisk
                              : styles.highRisk),
                          }}
                        >
                          {investor.preferredRisk}
                        </span>
                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        </section>

      </div>
    </main>
  );
}

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

const PIE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#7c3aed",
  "#ea580c",
];

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
    fontFamily: "Arial",
  },

  header: {
    marginBottom: "30px",
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
    fontSize: "28px",
    marginTop: "12px",
    marginBottom: 0,
    color: "#0f172a",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.06)",
    marginBottom: "25px",
  },

  chartHeader: {
    marginBottom: "15px",
  },

  chartTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "20px",
  },

  chartSubtitle: {
    color: "#64748b",
    fontSize: "14px",
    marginTop: "6px",
  },

  chartContainer: {
    width: "100%",
    height: 360,
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
    borderBottom:
      "1px solid #e2e8f0",
  },

  td: {
    padding: "15px 14px",
    borderBottom:
      "1px solid #e2e8f0",
    color: "#475569",
    fontSize: "14px",
  },

  riskBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  lowRisk: {
    background: "#dcfce7",
    color: "#166534",
  },

  mediumRisk: {
    background: "#fef3c7",
    color: "#92400e",
  },

  highRisk: {
    background: "#fee2e2",
    color: "#991b1b",
  },
};