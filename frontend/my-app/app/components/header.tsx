'use client';

import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header
      style={{
        backgroundColor: '#3f277b',
        color: '#ffffff',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <Link href="/home">
        <img
          src="/logobravo.png"
          alt="Logo do Go Bravo"
          style={{
            height: '30px',
            cursor: 'pointer',
          }}
        />
      </Link>
    </header>
  );
};

export default Header;
