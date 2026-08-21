"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchInvestors } from "../../store/investorSlice";
import useDebounce from "../../hooks/useDebounce";

export default function InvestorsPage() {
  const dispatch = useDispatch();

  const {
    data: investors,
    loading,
    error,
  } = useSelector((state) => state.investors);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [risk, setRisk] = useState("All");
  const [industry, setIndustry] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const itemsPerPage = 6;

  // =========================
  // FETCH INVESTORS
  // =========================

  useEffect(() => {
    if (investors.length === 0) {
      dispatch(fetchInvestors());
    }
  }, [dispatch, investors.length]);

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredInvestors = useMemo(() => {
    let result = [...investors];

    // Search
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();

      result = result.filter(
        (investor) =>
          investor.name.toLowerCase().includes(query) ||
          investor.location.toLowerCase().includes(query)
      );
    }

    // Type
    if (type !== "All") {
      result = result.filter(
        (investor) => investor.type === type
      );
    }

    // Risk
    if (risk !== "All") {
      result = result.filter(
        (investor) =>
          investor.preferredRisk === risk
      );
    }

    // Industry
    if (industry !== "All") {
      result = result.filter(
        (investor) =>
          investor.preferredIndustry === industry
      );
    }

    // Sorting
    if (sortBy === "investment-high") {
      result.sort(
        (a, b) =>
          b.totalInvested - a.totalInvested
      );
    }

    if (sortBy === "investment-low") {
      result.sort(
        (a, b) =>
          a.totalInvested - b.totalInvested
      );
    }

    if (sortBy === "deals-high") {
      result.sort(
        (a, b) =>
          b.totalInvestments -
          a.totalInvestments
      );
    }

    if (sortBy === "portfolio-high") {
      result.sort(
        (a, b) =>
          b.portfolioCompanies -
          a.portfolioCompanies
      );
    }

    return result;
  }, [
    investors,
    debouncedSearch,
    type,
    risk,
    industry,
    sortBy,
  ]);

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(
    filteredInvestors.length / itemsPerPage
  );

  const paginatedInvestors =
    filteredInvestors.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    type,
    risk,
    industry,
    sortBy,
  ]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main style={styles.center}>
        <h2>Loading investors...</h2>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <main style={styles.center}>
        <h2>Unable to load investors</h2>
        <p>{error}</p>
      </main>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>
          <p style={styles.brand}>
            3D Bharat
          </p>

          <h1 style={styles.title}>
            Investor Explorer
          </h1>

          <p style={styles.subtitle}>
            Explore investors, their investment
            preferences and portfolio activity.
          </p>
        </div>

        {/* FILTERS */}

        <div style={styles.filterBox}>

          {/* Search */}

          <input
            type="text"
            placeholder="Search investor or location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.input}
          />

          {/* Type */}

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            style={styles.input}
          >
            <option value="All">
              All Types
            </option>

            <option value="Venture Capital">
              Venture Capital
            </option>

            <option value="Private Equity">
              Private Equity
            </option>

            <option value="Angel Network">
              Angel Network
            </option>
          </select>

          {/* Risk */}

          <select
            value={risk}
            onChange={(e) =>
              setRisk(e.target.value)
            }
            style={styles.input}
          >
            <option value="All">
              All Risk
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

          {/* Industry */}

          <select
            value={industry}
            onChange={(e) =>
              setIndustry(e.target.value)
            }
            style={styles.input}
          >
            <option value="All">
              All Industries
            </option>

            <option value="AI">AI</option>

            <option value="SaaS">
              SaaS
            </option>

            <option value="Fintech">
              Fintech
            </option>

            <option value="Healthcare">
              Healthcare
            </option>

            <option value="Energy">
              Energy
            </option>

            <option value="Cybersecurity">
              Cybersecurity
            </option>

            <option value="EV">
              EV
            </option>

            <option value="Agriculture">
              Agriculture
            </option>
          </select>

          {/* Sort */}

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            style={styles.input}
          >
            <option value="default">
              Sort By
            </option>

            <option value="investment-high">
              Investment: High to Low
            </option>

            <option value="investment-low">
              Investment: Low to High
            </option>

            <option value="deals-high">
              Investments: High to Low
            </option>

            <option value="portfolio-high">
              Portfolio: High to Low
            </option>
          </select>

        </div>

        {/* RESULT COUNT */}

        <div style={styles.resultBar}>
          <strong>
            {filteredInvestors.length}
          </strong>{" "}
          investors found
        </div>

        {/* INVESTOR LIST */}

        {paginatedInvestors.length === 0 ? (
          <div style={styles.empty}>
            <h2>
              No investors found
            </h2>

            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div style={styles.grid}>

            {paginatedInvestors.map(
              (investor) => (
                <div
                  key={investor.id}
                  style={styles.card}
                >

                  {/* CARD HEADER */}

                  <div style={styles.cardHeader}>

                    <div>
                      <h2 style={styles.name}>
                        {investor.name}
                      </h2>

                      <p style={styles.location}>
                        {investor.location}
                      </p>
                    </div>

                    <span
                      style={getRiskStyle(
                        investor.preferredRisk
                      )}
                    >
                      {investor.preferredRisk}
                    </span>

                  </div>

                  {/* TYPE */}

                  <p style={styles.type}>
                    {investor.type}
                  </p>

                  {/* DETAILS */}

                  <div style={styles.infoGrid}>

                    <Info
                      label="Total Invested"
                      value={`₹${(
                        investor.totalInvested /
                        10000000
                      ).toFixed(2)} Cr`}
                    />

                    <Info
                      label="Investments"
                      value={
                        investor.totalInvestments
                      }
                    />

                    <Info
                      label="Portfolio"
                      value={
                        investor.portfolioCompanies
                      }
                    />

                    <Info
                      label="Industry"
                      value={
                        investor.preferredIndustry
                      }
                    />

                  </div>

                  {/* BUTTON */}

                  <Link
                    href={`/investors/${investor.id}`}
                    style={styles.link}
                  >
                    View Investor Profile →
                  </Link>

                </div>
              )
            )}

          </div>
        )}

        {/* PAGINATION */}

        {totalPages > 1 && (
          <div style={styles.pagination}>

            <button
              disabled={page === 1}
              onClick={() =>
                setPage(
                  (current) => current - 1
                )
              }
              style={
                page === 1
                  ? styles.disabledButton
                  : styles.button
              }
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={
                page === totalPages
              }
              onClick={() =>
                setPage(
                  (current) => current + 1
                )
              }
              style={
                page === totalPages
                  ? styles.disabledButton
                  : styles.button
              }
            >
              Next
            </button>

          </div>
        )}

      </div>
    </main>
  );
}

// =========================
// INFO COMPONENT
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

  filterBox: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    boxSizing: "border-box",
  },

  resultBar: {
    margin: "25px 0 15px",
    color: "#475569",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "white",
    padding: "22px",
    borderRadius: "16px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.05)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  name: {
    margin: 0,
    color: "#0f172a",
    fontSize: "20px",
  },

  location: {
    color: "#64748b",
    margin: "6px 0 0",
    fontSize: "14px",
  },

  type: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: "14px",
    margin: "18px 0",
  },

  riskBadge: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "10px",
    marginBottom: "20px",
  },

  info: {
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "10px",
  },

  infoLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    marginBottom: "5px",
  },

  infoValue: {
    color: "#0f172a",
    fontSize: "14px",
  },

  link: {
    display: "block",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
    marginTop: "5px",
  },

  empty: {
    background: "white",
    padding: "60px",
    borderRadius: "16px",
    textAlign: "center",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "30px",
  },

  button: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
  },

  disabledButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#cbd5e1",
    color: "#64748b",
    cursor: "not-allowed",
  },
};