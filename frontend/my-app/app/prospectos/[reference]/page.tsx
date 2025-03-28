import { notFound } from "next/navigation";
import React from "react";
import DebtSelector from "./debtselector";

interface Prospect {
  Reference?: string;
  nome?: string;
  quantidade_dividas?: string;
  dividas_liquidadas?: string;
  dividas_credito?: string;
  has_credit?: string;
  [key: string]: any;
}

interface Debt {
  Reference?: string;
  debt_id?: string;
  status_divida?: string; // e.g., "new", "negotiation", "liquidado", etc.
  pago_a_banco_atualizado?: string;
  [key: string]: any;
}

export default async function ProspectDetailPage({
  params,
}: {
  params: { reference: string };
}) {
  const reference = params.reference;

  // 1) Fetch prospect data
  const prospectRes = await fetch("http://localhost:3000/api/data", {
    cache: "no-store",
  });
  if (!prospectRes.ok) notFound();
  const prospectJson = await prospectRes.json();
  const prospects: Prospect[] = prospectJson.data || [];
  const prospect = prospects.find((p) => p.Reference === reference);
  if (!prospect) notFound();

  // 2) Fetch debt data
  const debtRes = await fetch("http://localhost:3000/api/debtdata", {
    cache: "no-store",
  });
  if (!debtRes.ok) notFound();
  const debtJson = await debtRes.json();
  const debts: Debt[] = debtJson.data || [];

  // 3) Filter debts: only include those for this prospect where:
  //    - status_divida is "new" or "negotiation" (case-insensitive)
  //    - pago_a_banco_atualizado is not blank
  const clientDebts = debts.filter((d) => {
    const status = d.status_divida?.trim().toLowerCase() || "";
    const isStatusValid = status === "new" || status === "negotiation";
    const pago = d.pago_a_banco_atualizado?.trim() || "";
    return d.Reference === reference && isStatusValid && pago !== "";
  });

  const totalActiveDebts = clientDebts.length;

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Montserrat, sans-serif",
        backgroundColor: "#f7f7f7",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Prospect Info */}
        <h1
          style={{
            marginBottom: "1.5rem",
            color: "#3f277b",
            fontSize: "2rem",
            borderBottom: "2px solid #e0e0e0",
            paddingBottom: "0.5rem",
          }}
        >
          {prospect.Reference} - {prospect.nome}
        </h1>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            <strong>Quantidade de Dívidas:</strong>{" "}
            {prospect.quantidade_dividas}
          </p>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            <strong>Dívidas Liquidadas:</strong> {prospect.dividas_liquidadas}
          </p>
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            <strong>Dívidas Crédito:</strong> {prospect.dividas_credito}
          </p>
        </div>

        {/* Summary */}
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "#555" }}>
          {totalActiveDebts} dívida(s) ativa(s) atualizadas encontrada(s).
        </p>

        {/* Debt Selector */}
        <DebtSelector debts={clientDebts} />
      </div>
    </div>
  );
}
