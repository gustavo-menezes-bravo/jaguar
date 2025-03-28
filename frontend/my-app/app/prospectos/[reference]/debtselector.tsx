"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Helper function to format numbers as Brazilian currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

interface Debt {
  debt_id?: string;
  pago_a_banco_atualizado?: string;
  instituicao_divida?: string;
  product_type?: string;
  divida_bravo?: string;
  negociador?: string;
  pago_banco_plano_liq?: string;
  [key: string]: any;
}

interface DebtSelectorProps {
  debts: Debt[];
}

export default function DebtSelector({ debts }: DebtSelectorProps) {
  const router = useRouter();
  const [selectedDebts, setSelectedDebts] = useState<Debt[]>([]);
  const [totalCredit, setTotalCredit] = useState(0);

  // Compute total credit as the sum of pago_a_banco_atualizado (parsed as float)
  useEffect(() => {
    const sum = selectedDebts.reduce((acc: number, d: any) => {
      const amount = parseFloat(d.pago_a_banco_atualizado || "0");
      return acc + (isNaN(amount) ? 0 : amount);
    }, 0);
    setTotalCredit(sum);
  }, [selectedDebts]);

  const toggleDebt = (debt: Debt) => {
    const isSelected = selectedDebts.some((d) => d.debt_id === debt.debt_id);
    if (isSelected) {
      setSelectedDebts((prev) =>
        prev.filter((d) => d.debt_id !== debt.debt_id)
      );
    } else {
      setSelectedDebts((prev) => [...prev, debt]);
    }
  };

  const generateProposal = () => {
    localStorage.setItem("selectedDebts", JSON.stringify(selectedDebts));
    // Navigate to the proposal page
    router.push("/proposal");
  };

  return (
    <div>
      {debts.length === 0 ? (
        <p style={{ marginBottom: "2rem" }}>Nenhuma dívida ativa encontrada.</p>
      ) : (
        <div>
          {debts.map((debt) => {
            const isSelected = selectedDebts.some(
              (d) => d.debt_id === debt.debt_id
            );
            return (
              <div
                key={debt.debt_id}
                onClick={() => toggleDebt(debt)}
                style={{
                  backgroundColor: isSelected ? "#d6f5d6" : "#fff",
                  border: isSelected ? "2px solid #21ade0" : "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  cursor: "pointer",
                  transition: "background-color 0.3s, border 0.3s",
                }}
              >
                <p>
                  <strong>debt_id:</strong> {debt.debt_id}
                </p>
                <p>
                  <strong>instituicao_divida:</strong> {debt.instituicao_divida}
                </p>
                <p>
                  <strong>product_type:</strong> {debt.product_type}
                </p>
                <p>
                  <strong>divida_bravo:</strong> {debt.divida_bravo}
                </p>
                <p>
                  <strong>pago_a_banco_atualizado:</strong>{" "}
                  {formatCurrency(
                    parseFloat(debt.pago_a_banco_atualizado || "0")
                  )}
                </p>
                <p>
                  <strong>pago_banco_plano_liq:</strong>{" "}
                  {formatCurrency(parseFloat(debt.pago_banco_plano_liq || "0"))}
                </p>
                <p>
                  <strong>negociador:</strong> {debt.negociador}
                </p>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <p style={{ fontSize: "1.25rem" }}>
          <strong>Total Crédito:</strong> {formatCurrency(totalCredit)}
        </p>
        <button
          onClick={generateProposal}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#1890ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Gerar Proposta
        </button>
      </div>
    </div>
  );
}
