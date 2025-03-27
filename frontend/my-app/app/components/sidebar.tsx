'use client';

import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside
      style={{
        backgroundColor: '#bfbae1',
        padding: '1rem',
        minWidth: '200px',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '1rem' }}>
            <Link className="nav-link" href="/home">
              Home
            </Link>
          </li>
          <li style={{ marginBottom: '1rem' }}>
            <Link className="nav-link" href="/prospectos">
              Prospectos
            </Link>
          </li>
        </ul>
      </nav>
      <style jsx>{`
        .nav-link {
          color: #17789c;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          font-family: 'Montserrat, sans-serif';
        }
        .nav-link:hover {
          color: #42bec3;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
