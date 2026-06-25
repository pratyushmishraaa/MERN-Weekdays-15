const FilterSidebar = ({ categories, selected, onSelect, priceRange, onPriceChange, onReset, totalCount }) => {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden sticky top-24">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">Filters</h3>
          {(selected !== "all" || priceRange[1] < priceRange[2]) && (
            <button onClick={onReset}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
              Reset
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Category</p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onSelect("all")}
              className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-sm transition-all
                ${selected === "all"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
              <span>All Products</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                ${selected === "all" ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                {totalCount}
              </span>
            </button>
            {categories.map(({ name, count }) => (
              <button key={name}
                onClick={() => onSelect(name)}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-sm transition-all capitalize
                  ${selected === name
                    ? "bg-indigo-600 text-white font-semibold"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                <span>{name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                  ${selected === name ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="px-5 py-4">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Max Price</p>
          <div className="flex flex-col gap-2">
            <input
              type="range"
              min={0}
              max={priceRange[2]}
              value={priceRange[1]}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>₹0</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                ₹{priceRange[1].toLocaleString("en-IN")}
              </span>
              <span>₹{priceRange[2].toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
