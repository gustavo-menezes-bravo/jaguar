"use client";

import React, { useState, useEffect } from "react";

// Helper function to format numbers as Brazilian currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProposalPage() {
  const [selectedDebts, setSelectedDebts] = useState<any[]>([]);
  const [initialTotal, setInitialTotal] = useState(0);
  const [months, setMonths] = useState(12);
  const [interestRate, setInterestRate] = useState(5); // percent
  const [finalCredit, setFinalCredit] = useState(0);

  // Read selected debts from localStorage on mount
  useEffect(() => {
    const debtsString = localStorage.getItem("selectedDebts");
    if (debtsString) {
      const debts = JSON.parse(debtsString);
      setSelectedDebts(debts);

      // Sum up "pago_a_banco_atualizado" from the selected debts
      const sum = debts.reduce((acc: number, d: any) => {
        const amount = parseFloat(d.pago_a_banco_atualizado || "0");
        return acc + (isNaN(amount) ? 0 : amount);
      }, 0);

      setInitialTotal(sum);
      setFinalCredit(sum);
    }
  }, []);

  // Update final credit when months or interest rate changes
  useEffect(() => {
    // Simple interest: finalCredit = initialTotal + (initialTotal * interestRate/100 * (months/12))
    const newFinal =
      initialTotal + ((initialTotal * interestRate) / 100) * (months / 12);
    setFinalCredit(newFinal);
  }, [months, interestRate, initialTotal]);

  // Calculate monthly payment
  const monthlyPayment = finalCredit / months || 0;

  return (
    <div style={{ padding: "1rem", fontFamily: "Montserrat, sans-serif" }}>
      <h1
        style={{ textAlign: "center", color: "#3f277b", marginBottom: "1rem" }}
      >
        Proposta de Crédito
      </h1>

      <p
        style={{
          textAlign: "center",
          fontSize: "1.25rem",
          marginBottom: "1rem",
        }}
      >
        <strong>Total Inicial:</strong> {formatCurrency(initialTotal)}
      </p>

      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="months" style={{ fontWeight: "bold" }}>
            Meses: {months}
          </label>
          <input
            id="months"
            type="range"
            min="1"
            max="60"
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="interestRate" style={{ fontWeight: "bold" }}>
            Taxa de Juros (%): {interestRate}
          </label>
          <input
            id="interestRate"
            type="range"
            min="0"
            max="20"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* Final Credit */}
      <p
        style={{
          textAlign: "center",
          marginTop: "1rem",
          fontSize: "1.25rem",
          color: "#21ade0",
        }}
      >
        <strong>Total Proposta:</strong> {formatCurrency(finalCredit)}
      </p>

      {/* Monthly Payment */}
      <p
        style={{
          textAlign: "center",
          fontSize: "1.25rem",
          color: "#21ade0",
        }}
      >
        <strong>Valor Mensal:</strong> {formatCurrency(monthlyPayment)}
      </p>
    </div>
  );
}
