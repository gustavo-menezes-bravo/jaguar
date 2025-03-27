'use client';

import React, { useState, useEffect } from 'react';

interface Debt {
  debt_id?: string;
  divida_bravo?: string;
  instituicao_divida?: string;
  product_type?: string;
  pago_a_banco_atualizado?: string;
  negociador?: string;
  pago_banco_plano_liq?: string;
  [key: string]: any;
}

interface DebtSelectorProps {
  debts: Debt[];
}

export default function DebtSelector({ debts }: DebtSelectorProps) {
  const [selectedDebts, setSelectedDebts] = useState<Debt[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);

  // For demonstration, discount is 10% of total.
  const discountRate = 0.1;

  const toggleDebt = (debt: Debt) => {
    const alreadySelected = selectedDebts.some((d) => d.debt_id === debt.debt_id);
    if (alreadySelected) {
      // Remove from selection
      setSelectedDebts((prev) => prev.filter((d) => d.debt_id !== debt.debt_id));
    } else {
      // Add to selection
      setSelectedDebts((prev) => [...prev, debt]);
    }
  };

  // Recompute total and discount whenever selectedDebts changes
  useEffect(() => {
    const sum = selectedDebts.reduce((acc, d) => {
      const amount = parseFloat(d.divida_bravo || '0');
      return acc + (isNaN(amount) ? 0 : amount);
    }, 0);
    setTotalAmount(sum);
    setDiscount(sum * discountRate);
  }, [selectedDebts]);

  if (!debts || debts.length === 0) {
    return <p style={{ marginBottom: '2rem' }}>Nenhuma dívida ativa encontrada.</p>;
  }

  return (
    <div>
      {debts.map((debt) => {
        const isSelected = selectedDebts.some((d) => d.debt_id === debt.debt_id);

        return (
          <div
            key={debt.debt_id}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleDebt(debt)}
              style={{ marginRight: '1rem' }}
            />
            <div>
              <p><strong>debt_id:</strong> {debt.debt_id}</p>
              <p><strong>instituicao_divida:</strong> {debt.instituicao_divida}</p>
              <p><strong>product_type:</strong> {debt.product_type}</p>
              <p><strong>divida_bravo:</strong> {debt.divida_bravo}</p>
              <p><strong>pago_a_banco_atualizado:</strong> {debt.pago_a_banco_atualizado}</p>
              <p><strong>pago_banco_plano_liq:</strong> {debt.pago_banco_plano_liq}</p>
              <p><strong>negociador:</strong> {debt.negociador}</p>
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div
        style={{
          marginTop: '2rem',
          textAlign: 'center',
          borderTop: '1px solid #ccc',
          paddingTop: '1rem',
        }}
      >
        <p style={{ fontSize: '1.25rem' }}>
          <strong>Total Selecionado:</strong> R$ {totalAmount.toFixed(2)}
        </p>
        <p style={{ fontSize: '1.25rem', color: '#21ade0' }}>
          <strong>Desconto (10%):</strong> R$ {discount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
