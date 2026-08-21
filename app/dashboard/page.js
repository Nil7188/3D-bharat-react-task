"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { fetchDeals } from "../../store/dealSlice";

export default function DashboardPage() {
  const dispatch = useDispatch();

  const {
    data: deals,
    loading,
    error,
  } = useSelector((state) => state.deals);

  useEffect(() => {
    if (deals.length === 0) {
      dispatch(fetchDeals());
    }
  }, [dispatch, deals.length]);

  // =========================
  // SUMMARY DATA
  // =========================

  const totalInvestment = useMemo(() => {
    return deals.reduce(
      (total, deal) => total + deal.investment,
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
        (total, deal) => total + deal.roi,
        0
      ) / deals.length
    ).toFixed(1);
  }, [deals]);

  // =========================
  // INVESTMENT GROWTH
  // =========================

  const investmentGrowth = useMemo(() => {
    const years = {};

    deals.forEach((deal) => {
      const year = deal.founded;

      if (!years[year]) {
        years[year] = 0;
      }

      years[year] += deal.investment;
    });

    return Object.entries(years)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, investment]) => ({
        year,
        investment: Number(
          (investment / 10000000).toFixed(2)
        ),
      }));
  }, [deals]);

  // =========================
  // INDUSTRY DISTRIBUTION
  // =========================

  const industryData = useMemo(() => {
    const industries = {};

    deals.forEach((deal) => {
      if (!industries[deal.industry]) {
        industries[deal.industry] = 0;
      }

      industries[deal.industry]++;
    });

    return Object.entries(industries).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }, [deals]);

  // =========================
  // RISK DISTRIBUTION
  // =========================

  const riskData = useMemo(() => {
    const risks = {
      Low: 0,
      Medium: 0,
      High: 0,
    };

    deals.forEach((deal) => {
      if (risks[deal.risk] !== undefined) {
        risks[deal.risk]++;
      }
    });

    return Object.entries(risks).map(
      ([risk, count]) => ({
        risk,
        count,
      })
    );
  }, [deals]);

  // =========================
  // RISK VS ROI
  // =========================

  const riskVsROI = useMemo(() => {
    return deals.map((deal) => ({
      roi: deal.roi,
      investment: Number(
        (deal.investment / 100000).toFixed(1)
      ),
      risk: deal.risk,
      company: deal.company,
    }));
  }, [deals]);

  if (loading) {
    return (
      <main style={styles.center}>
        <h2>Loading investment data...</h2>
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
          <p style={styles.brand}>3D Bharat</p>

          <h1 style={styles.title}>
            Investor Dashboard
          </h1>

          <p style={styles.subtitle}>
            Track your investments, deals and
            portfolio performance.
          </p>
        </div>

        {/* SUMMARY CARDS */}

        <div style={styles.statsGrid}>
          <StatCard
            title="Total Investments"
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
            title="Total Deals"
            value={deals.length}
          />
        </div>

        {/* INVESTMENT GROWTH */}

        <section style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h2 style={styles.chartTitle}>
              Investment Growth
            </h2>

            <p style={styles.chartSubtitle}>
              Investment distribution based on
              company founding year
            </p>
          </div>

          <div style={styles.chartContainer}>
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={investmentGrowth}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="year" />

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

                <Legend />

                <Line
                  type="monotone"
                  dataKey="investment"
                  name="Investment"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* INDUSTRY + RISK */}

        <div style={styles.twoColumn}>

          {/* INDUSTRY */}

          <section style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h2 style={styles.chartTitle}>
                Industry Distribution
              </h2>

              <p style={styles.chartSubtitle}>
                Deals by industry
              </p>
            </div>

            <div style={styles.chartContainer}>
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={industryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {industryData.map(
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

          {/* RISK */}

          <section style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h2 style={styles.chartTitle}>
                Risk Distribution
              </h2>

              <p style={styles.chartSubtitle}>
                Number of deals by risk level
              </p>
            </div>

            <div style={styles.chartContainer}>
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={riskData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="risk" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="count"
                    name="Deals"
                    fill="#7c3aed"
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
        </div>

        {/* RISK VS ROI */}

        <section style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h2 style={styles.chartTitle}>
              Risk vs ROI
            </h2>

            <p style={styles.chartSubtitle}>
              Relationship between investment
              amount and expected ROI
            </p>
          </div>

          <div style={styles.chartContainer}>
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <ScatterChart>
                <CartesianGrid />

                <XAxis
                  type="number"
                  dataKey="investment"
                  name="Investment"
                  unit="L"
                />

                <YAxis
                  type="number"
                  dataKey="roi"
                  name="ROI"
                  unit="%"
                />

                <Tooltip
                  cursor={{
                    strokeDasharray: "3 3",
                  }}
                  formatter={(value, name) => {
                    if (
                      name === "Investment"
                    ) {
                      return [
                        `₹${value} L`,
                        name,
                      ];
                    }

                    return [
                      `${value}%`,
                      name,
                    ];
                  }}
                />

                <Legend />

                <Scatter
                  name="Deals"
                  data={riskVsROI}
                  fill="#16a34a"
                />
              </ScatterChart>
            </ResponsiveContainer>
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
  "#0891b2",
  "#db2777",
  "#ca8a04",
  "#475569",
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

  chartCard: {
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

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "25px",
  },
};