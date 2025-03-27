'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [data, setData] = useState<any[]>([]);
  const [cityFilter, setCityFilter] = useState('');

  // Top metric state variables
  const [totalProspects, setTotalProspects] = useState(0);
  const [withCreditCount, setWithCreditCount] = useState(0);
  const [withoutCreditCount, setWithoutCreditCount] = useState(0);

  useEffect(() => {
    fetch('/api/data', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        const fetchedData = json.data || [];
        setData(fetchedData);
        setTotalProspects(fetchedData.length);
        const withCredit = fetchedData.filter((item: any) => {
          if (!item.has_credit) return false;
          const val = item.has_credit.toLowerCase();
          return val === 'true' || val === '1' || val === 'yes';
        }).length;
        setWithCreditCount(withCredit);
        const withoutCredit = fetchedData.filter((item: any) => {
          if (item.has_credit) {
            const val = item.has_credit.toLowerCase();
            return val === 'false';
          }
          return false;
        }).length;
        setWithoutCreditCount(withoutCredit);
      })
      .catch(console.error);
  }, []);

  // Compute city distribution for ALL cities
  const cityDistribution: { [key: string]: number } = {};
  data.forEach((item) => {
    const city = item.cidade ? item.cidade.trim() : 'Desconhecido';
    cityDistribution[city] = (cityDistribution[city] || 0) + 1;
  });
  let cityArray = Object.entries(cityDistribution).map(([city, count]) => ({ city, count }));
  // Order cities from highest to lowest
  cityArray.sort((a, b) => b.count - a.count);
  // Filter cities based on cityFilter
  const filteredCityArray = cityArray.filter((item) =>
    item.city.toLowerCase().includes(cityFilter.toLowerCase())
  );
  const maxCityCount =
    filteredCityArray.length > 0
      ? Math.max(...filteredCityArray.map((item) => item.count))
      : 0;

  return (
    <div style={{ padding: '1rem', fontFamily: 'Montserrat, sans-serif' }}>

      {/* Top Metric Cards */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        <Link href="/prospectos" style={{ textDecoration: 'none' }}>
          <div style={metricCardStyle}>
            <h3>Total de Prospectos</h3>
            <p style={metricStyle}>{totalProspects}</p>
          </div>
        </Link>
        <Link href="/prospectos?filterCredito=true" style={{ textDecoration: 'none' }}>
          <div style={metricCardStyle}>
            <h3>Com Crédito</h3>
            <p style={metricStyle}>{withCreditCount}</p>
          </div>
        </Link>
        <Link href="/prospectos?filterCredito=false" style={{ textDecoration: 'none' }}>
          <div style={metricCardStyle}>
            <h3>Sem Crédito</h3>
            <p style={metricStyle}>{withoutCreditCount}</p>
          </div>
        </Link>
      </div>

      {/* City Filter Input for the Bar Graph */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <div
          style={{
            backgroundColor: '#e6f7ff',
            padding: '1rem',
            border: '2px solid #21ade0',
            borderRadius: '8px',
            maxWidth: '300px',
            width: '100%',
          }}
        >
          <input
            type="text"
            placeholder="Filtrar cidades..."
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              width: '100%',
              fontSize: '1rem',
              border: 'none',
              outline: 'none',
              background: 'transparent',
            }}
          />
        </div>
      </div>

      {/* City Bar Graph in a fixed-height, scrollable container */}
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filteredCityArray.map((item) => {
          const barWidth = maxCityCount > 0 ? (item.count / maxCityCount) * 100 : 0;
          return (
            <Link
              key={item.city}
              href={`/prospectos?filterCidade=${encodeURIComponent(item.city)}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    marginRight: '1rem',
                    minWidth: '100px',
                    fontWeight: 'bold',
                  }}
                >
                  {item.city}
                </span>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#e0e0e0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginRight: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: `${barWidth}%`,
                      background: 'linear-gradient(90deg, #21ade0, #42bec3)',
                      height: '24px',
                      borderRadius: '10px',
                      textAlign: 'right',
                      lineHeight: '24px',
                      color: '#fff',
                      paddingRight: '5px',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.count}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const metricCardStyle = {
  flex: '1 1 200px',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center' as const,
  cursor: 'pointer',
  transition: 'transform 0.2s',
  minHeight: '150px',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
};

const metricStyle = {
  fontSize: '1.5rem',
  margin: '0.5rem 0 0',
  color: '#333',
};
