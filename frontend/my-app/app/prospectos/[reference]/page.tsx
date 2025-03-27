import { notFound } from 'next/navigation';
import React from 'react';
import DebtSelector from './debtselector';

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
  has_credit?: string;       
  status_divida?: string;    
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
  const prospectRes = await fetch('http://localhost:3000/api/data', { cache: 'no-store' });
  if (!prospectRes.ok) {
    notFound();
  }
  const prospectJson = await prospectRes.json();
  const prospects: Prospect[] = prospectJson.data || [];

  const prospect = prospects.find((p) => p.Reference === reference);
  if (!prospect) {
    notFound();
  }

  // 2) Fetch debt data
  const debtRes = await fetch('http://localhost:3000/api/debtdata', { cache: 'no-store' });
  if (!debtRes.ok) {
    notFound();
  }
  const debtJson = await debtRes.json();
  const debts: Debt[] = debtJson.data || [];

  // 3) Filter: only updated, not liquidated, no credit, matching Reference
  //    That is: (pago_a_banco_atualizado === 'true') && (status_divida !== 'liquidado') && (has_credit !== 'true')
  const clientDebts = debts.filter((d) => {
    const isMatchRef = d.Reference === reference;
    const isUpdated = d.pago_a_banco_atualizado?.toLowerCase() === 'true';
    const isLiquidated = d.status_divida?.toLowerCase() === 'liquidado';
    const hasCredit = d.has_credit?.toLowerCase() === 'true';
    return isMatchRef && isUpdated && !isLiquidated && !hasCredit;
  });

  // 4) We'll show how many such active debts we found
  const totalActiveDebts = clientDebts.length;

  return (
    <div style={{ padding: '1rem', fontFamily: 'Montserrat, sans-serif' }}>
      {/* Prospect Info */}
      <h1 style={{ marginBottom: '1rem', color: '#3f277b' }}>
        {prospect.Reference} - {prospect.nome}
      </h1>
      <div style={{ marginBottom: '1rem' }}>
        <p>
          <strong>quantidade_dividas:</strong> {prospect.quantidade_dividas}
        </p>
        <p>
          <strong>dividas_liquidadas:</strong> {prospect.dividas_liquidadas}
        </p>
        <p>
          <strong>dividas_credito:</strong> {prospect.dividas_credito}
        </p>
      </div>

      {/* Summary of how many active debts */}
      <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>
        {totalActiveDebts} dívida(s) ativa(s) encontrada(s).
      </p>

      {/* Debt Selector for these active debts */}
      <DebtSelector debts={clientDebts} />
    </div>
  );
}
