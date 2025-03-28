"use client";

import React from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <Link href="/home" className="navLink">
              Home
            </Link>
          </li>
          <li>
            <Link href="/prospectos" className="navLink">
              Prospectos
            </Link>
          </li>
        </ul>
      </nav>

      <style jsx>{`
        .sidebar {
          background-color: #bfbae1;
          width: 200px;
          font-family: "Montserrat", sans-serif;
          padding: 1rem;
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          margin-bottom: 1rem;
        }
        .navLink {
          color: #17789c;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.3s ease, color 0.3s ease,
            transform 0.3s ease, box-shadow 0.3s ease;
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }
        .navLink:hover {
          color: #42bec3;
          background-color: #e0e0e0;
          transform: translateY(-2px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </aside>
  );
}
