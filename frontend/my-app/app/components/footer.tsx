'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#7a68ee',
        color: '#ffffff',
        padding: '1rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <p>&copy; {new Date().getFullYear()} Go Bravo. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
