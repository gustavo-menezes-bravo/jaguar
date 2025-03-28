"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// Helper function to format numbers as Brazilian currency (R$ 1,000.00)
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const ITEMS_PER_PAGE = 20;

export default function ProspectosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL query parameters
  const initialFilterCredito = searchParams.get("filterCredito") || "";
  const initialFilterNome = searchParams.get("filterNome") || "";
  const initialFilterCidade = searchParams.get("filterCidade") || "";
  const initialFilterReference = searchParams.get("filterReference") || "";
  const initialFilterMinDebt = searchParams.get("filterMinDebt") || "";
  const initialFilterMaxDebt = searchParams.get("filterMaxDebt") || "";

  const [prospectData, setProspectData] = useState<any[]>([]);
  const [debtData, setDebtData] = useState<any[]>([]);
  const [filterNome, setFilterNome] = useState(initialFilterNome);
  const [filterCidade, setFilterCidade] = useState(initialFilterCidade);
  const [filterReference, setFilterReference] = useState(
    initialFilterReference
  );
  const [filterCredito, setFilterCredito] = useState(initialFilterCredito);
  const [filterMinDebt, setFilterMinDebt] = useState(initialFilterMinDebt);
  const [filterMaxDebt, setFilterMaxDebt] = useState(initialFilterMaxDebt);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch prospect data
  useEffect(() => {
    fetch("/api/data", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => setProspectData(json.data || []))
      .catch(console.error);
  }, []);

  // Fetch debt data
  useEffect(() => {
    fetch("/api/debtdata", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => setDebtData(json.data || []))
      .catch(console.error);
  }, []);

  // Filter prospects based on user input (Nome, Cidade, Reference, Crédito)
  const filteredProspects = prospectData.filter((item) => {
    const nomeMatch = filterNome
      ? item.nome && item.nome.toLowerCase().includes(filterNome.toLowerCase())
      : true;
    const cidadeMatch = filterCidade
      ? item.cidade &&
        item.cidade.toLowerCase().includes(filterCidade.toLowerCase())
      : true;
    const referenceMatch = filterReference
      ? item.Reference &&
        item.Reference.toLowerCase().includes(filterReference.toLowerCase())
      : true;
    let creditoMatch = true;
    if (filterCredito === "true") {
      creditoMatch =
        item.has_credit && item.has_credit.toLowerCase() === "true";
    } else if (filterCredito === "false") {
      creditoMatch =
        item.has_credit && item.has_credit.toLowerCase() === "false";
    }
    return nomeMatch && cidadeMatch && referenceMatch && creditoMatch;
  });

  // For each prospect, calculate the sum of debts (divida_bravo) where
  // status_divida is "new" or "negotiation" (case-insensitive)
  const prospectsWithDebtSum = filteredProspects.map((prospect) => {
    const sum = debtData
      .filter(
        (d) =>
          d.Reference === prospect.Reference &&
          d.divida_bravo && // must have a debt amount
          ["new", "negotiation"].includes(
            d.status_divida?.trim().toLowerCase() || ""
          )
      )
      .reduce((acc, d) => {
        const amount = parseFloat(d.divida_bravo || "0");
        return acc + (isNaN(amount) ? 0 : amount);
      }, 0);
    return { ...prospect, debtSum: sum };
  });

  // Only show prospects that have at least one active debt (debtSum > 0)
  // and if provided, only those with debtSum >= min and <= max.
  const finalProspects = prospectsWithDebtSum.filter((p) => {
    const meetsDebtCriteria =
      p.debtSum > 0 &&
      (filterMinDebt ? p.debtSum >= parseFloat(filterMinDebt) : true) &&
      (filterMaxDebt ? p.debtSum <= parseFloat(filterMaxDebt) : true);
    return meetsDebtCriteria;
  });

  // Pagination
  const totalPages = Math.ceil(finalProspects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = finalProspects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Update URL params on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filterNome) params.set("filterNome", filterNome);
    if (filterCidade) params.set("filterCidade", filterCidade);
    if (filterReference) params.set("filterReference", filterReference);
    if (filterCredito) params.set("filterCredito", filterCredito);
    if (filterMinDebt) params.set("filterMinDebt", filterMinDebt);
    if (filterMaxDebt) params.set("filterMaxDebt", filterMaxDebt);
    router.push(`/prospectos?${params.toString()}`);
    setCurrentPage(1);
  }, [
    filterNome,
    filterCidade,
    filterReference,
    filterCredito,
    filterMinDebt,
    filterMaxDebt,
    router,
  ]);

  const activeFilters: string[] = [];
  if (filterNome) activeFilters.push(`Nome: ${filterNome}`);
  if (filterCidade) activeFilters.push(`Cidade: ${filterCidade}`);
  if (filterReference) activeFilters.push(`Reference: ${filterReference}`);
  if (filterCredito === "true") activeFilters.push(`Com Crédito`);
  if (filterCredito === "false") activeFilters.push(`Sem Crédito`);
  if (filterMinDebt)
    activeFilters.push(
      `Min Dívida: R$ ${formatCurrency(parseFloat(filterMinDebt))}`
    );
  if (filterMaxDebt)
    activeFilters.push(
      `Max Dívida: R$ ${formatCurrency(parseFloat(filterMaxDebt))}`
    );
  const activeFiltersText = activeFilters.join(", ");

  return (
    <div style={{ padding: "1rem", fontFamily: "Montserrat, sans-serif" }}>
      <h1
        style={{
          color: "#3f277b",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        Prospectos {activeFiltersText && `- Filtro: ${activeFiltersText}`}
      </h1>
      <p style={{ textAlign: "center", marginBottom: "1rem" }}>
        {finalProspects.length} prospectos encontrados (com dívida ativa).
      </p>

      {/* Filter Panel */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "0.75rem",
          border: "1px solid #21ade0",
          borderRadius: "8px",
          backgroundColor: "#e6f7ff",
          maxWidth: "1000px",
          margin: "2rem auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            htmlFor="filterNome"
            style={{ fontWeight: "bold", marginRight: "0.5rem" }}
          >
            Nome:
          </label>
          <input
            id="filterNome"
            type="text"
            placeholder="Nome"
            value={filterNome}
            onChange={(e) => setFilterNome(e.target.value)}
            style={{ padding: "0.5rem" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            htmlFor="filterCidade"
            style={{ fontWeight: "bold", marginRight: "0.5rem" }}
          >
            Cidade:
          </label>
          <input
            id="filterCidade"
            type="text"
            placeholder="Cidade"
            value={filterCidade}
            onChange={(e) => setFilterCidade(e.target.value)}
            style={{ padding: "0.5rem" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            htmlFor="filterReference"
            style={{ fontWeight: "bold", marginRight: "0.5rem" }}
          >
            Reference:
          </label>
          <input
            id="filterReference"
            type="text"
            placeholder="Reference"
            value={filterReference}
            onChange={(e) => setFilterReference(e.target.value)}
            style={{ padding: "0.5rem" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            htmlFor="filterCredito"
            style={{ fontWeight: "bold", marginRight: "0.5rem" }}
          >
            Crédito:
          </label>
          <select
            id="filterCredito"
            value={filterCredito}
            onChange={(e) => setFilterCredito(e.target.value)}
            style={{ padding: "0.5rem" }}
          >
            <option value="">Todos</option>
            <option value="true">Com Crédito</option>
            <option value="false">Sem Crédito</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            htmlFor="filterMinDebt"
            style={{ fontWeight: "bold", marginRight: "0.5rem" }}
          >
            Min Dívida:
          </label>
          <input
            id="filterMinDebt"
            type="number"
            placeholder="0"
            value={filterMinDebt}
            onChange={(e) => setFilterMinDebt(e.target.value)}
            style={{ padding: "0.5rem", width: "100px" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            htmlFor="filterMaxDebt"
            style={{ fontWeight: "bold", marginRight: "0.5rem" }}
          >
            Max Dívida:
          </label>
          <input
            id="filterMaxDebt"
            type="number"
            placeholder="0"
            value={filterMaxDebt}
            onChange={(e) => setFilterMaxDebt(e.target.value)}
            style={{ padding: "0.5rem", width: "100px" }}
          />
        </div>
        {/* "Limpar" Button */}
        <button
          type="button"
          onClick={() => {
            setFilterNome("");
            setFilterCidade("");
            setFilterReference("");
            setFilterCredito("");
            setFilterMinDebt("");
            setFilterMaxDebt("");
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#1890ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Limpar
        </button>
      </div>

      {finalProspects.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          Nenhum prospecto com dívida ativa encontrado.
        </p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            {currentItems.map((prospect, index) => {
              // Compute the sum of debts (divida_bravo) for this prospect,
              // including only debts with status "new" or "negotiation".
              const debtSum = debtData
                .filter((d) => {
                  return (
                    d.Reference === prospect.Reference &&
                    d.divida_bravo &&
                    ["new", "negotiation"].includes(
                      d.status_divida?.trim().toLowerCase() || ""
                    )
                  );
                })
                .reduce((acc, d) => {
                  const amount = parseFloat(d.divida_bravo || "0");
                  return acc + (isNaN(amount) ? 0 : amount);
                }, 0);

              return (
                <Link
                  key={index}
                  href={`/prospectos/${prospect.Reference}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "1rem",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      minHeight: "150px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <p
                      style={{
                        margin: "0.3rem 0",
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}
                    >
                      {prospect.nome}
                    </p>
                    <p style={{ margin: "0.3rem 0", fontSize: "0.9rem" }}>
                      <strong>Reference:</strong> {prospect.Reference}
                    </p>
                    <p style={{ margin: "0.3rem 0", fontSize: "0.9rem" }}>
                      <strong>Cidade:</strong> {prospect.cidade}
                    </p>
                    <p
                      style={{
                        margin: "0.3rem 0",
                        fontSize: "0.9rem",
                        color: "#21ade0",
                      }}
                    >
                      <strong>Total da Dívida:</strong>{" "}
                      {formatCurrency(debtSum)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "0.5rem 1rem",
                marginRight: "1rem",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              style={{
                padding: "0.5rem 1rem",
                marginLeft: "1rem",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Próximo
            </button>
          </div>
        </>
      )}
    </div>
  );
}
