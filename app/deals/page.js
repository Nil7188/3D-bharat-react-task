"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchDeals } from "../../store/dealSlice";
import useDebounce from "../../hooks/useDebounce";

export default function DealsPage() {
  const dispatch = useDispatch();

  const {
    data: deals,
    loading,
    error,
  } = useSelector((state) => state.deals);

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [risk, setRisk] = useState("All");
  const [minROI, setMinROI] = useState("0");
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const itemsPerPage = 10;

  // Load deals if Redux doesn't already have them
  useEffect(() => {
    if (deals.length === 0) {
      dispatch(fetchDeals());
    }
  }, [dispatch, deals.length]);

  // Filtering + Sorting
  const filteredDeals = useMemo(() => {
    let result = [...deals];

    // Search
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();

      result = result.filter(
        (deal) =>
          deal.company.toLowerCase().includes(query) ||
          deal.industry.toLowerCase().includes(query)
      );
    }

    // Industry
    if (industry !== "All") {
      result = result.filter(
        (deal) => deal.industry === industry
      );
    }

    // Risk
    if (risk !== "All") {
      result = result.filter(
        (deal) => deal.risk === risk
      );
    }

    // ROI
    result = result.filter(
      (deal) => deal.roi >= Number(minROI)
    );

    // Sorting
    if (sortBy === "roi-high") {
      result.sort((a, b) => b.roi - a.roi);
    }

    if (sortBy === "roi-low") {
      result.sort((a, b) => a.roi - b.roi);
    }

    if (sortBy === "investment-high") {
      result.sort(
        (a, b) => b.investment - a.investment
      );
    }

    if (sortBy === "investment-low") {
      result.sort(
        (a, b) => a.investment - b.investment
      );
    }

    return result;
  }, [
    deals,
    debouncedSearch,
    industry,
    risk,
    minROI,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredDeals.length / itemsPerPage
  );

  const paginatedDeals = filteredDeals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    industry,
    risk,
    minROI,
    sortBy,
  ]);

  if (loading) {
    return (
      <main style={styles.center}>
        <h2>Loading deals...</h2>
      </main>
    );
  }

  if (error) {
    return (
      <main style={styles.container}>
        <h2>Unable to load deals</h2>
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <p style={styles.brand}>3D Bharat</p>

          <h1 style={styles.title}>
            Deal Explorer
          </h1>

          <p style={styles.subtitle}>
            Explore investment opportunities and
            find deals matching your strategy.
          </p>
        </div>

        {/* Filters */}
        <div style={styles.filterBox}>
          <input
            type="text"
            placeholder="Search company or industry..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.input}
          />

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
            <option value="SaaS">SaaS</option>
            <option value="Cybersecurity">
              Cybersecurity
            </option>
            <option value="EV">EV</option>
          </select>

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

            <option value="Low">Low Risk</option>
            <option value="Medium">
              Medium Risk
            </option>
            <option value="High">
              High Risk
            </option>
          </select>

          <select
            value={minROI}
            onChange={(e) =>
              setMinROI(e.target.value)
            }
            style={styles.input}
          >
            <option value="0">
              Any ROI
            </option>

            <option value="10">
              10%+ ROI
            </option>

            <option value="15">
              15%+ ROI
            </option>

            <option value="20">
              20%+ ROI
            </option>

            <option value="25">
              25%+ ROI
            </option>
          </select>

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

            <option value="roi-high">
              ROI: High to Low
            </option>

            <option value="roi-low">
              ROI: Low to High
            </option>

            <option value="investment-high">
              Investment: High to Low
            </option>

            <option value="investment-low">
              Investment: Low to High
            </option>
          </select>
        </div>

        {/* Result information */}
        <div style={styles.resultBar}>
          <strong>
            {filteredDeals.length}
          </strong>{" "}
          deals found
        </div>

        {/* Deals */}
        {paginatedDeals.length === 0 ? (
          <div style={styles.empty}>
            <h2>No deals found</h2>

            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div style={styles.dealList}>
            {paginatedDeals.map((deal) => (
              <div
                key={deal.id}
                style={styles.dealCard}
              >
                <div>
                  <h2 style={styles.company}>
                    {deal.company}
                  </h2>

                  <p style={styles.meta}>
                    {deal.industry} • Risk:{" "}
                    {deal.risk}
                  </p>

                  <p style={styles.description}>
                    {deal.description}
                  </p>
                </div>

                <div style={styles.metrics}>
                  <div>
                    <span style={styles.metricLabel}>
                      ROI
                    </span>

                    <strong style={styles.roi}>
                      {deal.roi}%
                    </strong>
                  </div>

                  <div>
                    <span style={styles.metricLabel}>
                      Investment
                    </span>

                    <strong>
                      ₹
                      {(
                        deal.investment / 100000
                      ).toFixed(1)}
                      L
                    </strong>
                  </div>

                </div>
                <Link
  href={`/deals/${deal.id}`}
  style={{
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
    whiteSpace: "nowrap",
  }}
>
  View Details →
</Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() =>
                setPage((current) => current - 1)
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
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) => current + 1)
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

  dealList: {
    display: "grid",
    gap: "15px",
  },

  dealCard: {
    background: "white",
    padding: "22px",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.05)",
  },

  company: {
    margin: 0,
    color: "#0f172a",
    fontSize: "20px",
  },

  meta: {
    color: "#64748b",
    margin: "8px 0",
  },

  description: {
    color: "#64748b",
    maxWidth: "650px",
    lineHeight: "1.5",
  },

  metrics: {
    display: "flex",
    gap: "30px",
    alignItems: "center",
  },

  metricLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "13px",
    marginBottom: "5px",
  },

  roi: {
    color: "#16a34a",
    fontSize: "22px",
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

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};