"use client";

interface Props {
  categories: string[];
  active: string;
  setActive: (value: string) => void;
}

export default function ProductFilters({
  categories,
  active,
  setActive,
}: Props) {
  return (
    <div className="flex gap-4 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActive(category)}
          className={`
            px-5 py-3 rounded-full
            ${
              active === category
                ? "bg-white text-black"
                : "bg-white/10 text-white"
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
}