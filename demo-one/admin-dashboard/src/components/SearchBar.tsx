"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <label className="search-bar">
      <Search size={16} className="text-zinc-500" />
      <input type="search" placeholder="Search products, orders, customers..." />
    </label>
  );
}
