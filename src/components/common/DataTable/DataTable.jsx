import React, { useState, useMemo, useCallback } from 'react';
import './DataTable.css';

const ICONS = {
  search: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  clear: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  filter: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  refresh: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  export: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  columns: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  first: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>,
  prev: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  next: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  last: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>,
  sortAsc: <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>,
  sortDesc: <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  empty: <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

function DataTable({
  columns,
  data = [],
  title,
  searchPlaceholder = 'Search...',
  filters = [],
  onFilterChange,
  loading = false,
  emptyState,
  exportAction,
  refreshAction,
  page = 1,
  perPage = 10,
  onPageChange,
  onPerPageChange,
  sortKey,
  sortDir = 'asc',
  onSortChange,
  actionColumn,
  rowClassName,
  onRowClick,
  showFilters: externalShowFilters,
  onToggleFilters,
}) {
  const [internalSearch, setInternalSearch] = useState('');
  const [internalFilters, setInternalFilters] = useState({});
  const [internalSortKey, setInternalSortKey] = useState(null);
  const [internalSortDir, setInternalSortDir] = useState('asc');
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState(new Set());

  const isControlled = onPageChange !== undefined;
  const [internalPage, setInternalPage] = useState(1);
  const [internalPerPage, setInternalPerPage] = useState(perPage);

  const currentPage = isControlled ? page : internalPage;
  const currentPerPage = isControlled ? perPage : internalPerPage;
  const currentSortKey = isControlled ? sortKey : internalSortKey;
  const currentSortDir = isControlled ? sortDir : internalSortDir;

  const visibleColumns = useMemo(() => columns.filter(c => !hiddenColumns.has(c.key)), [columns, hiddenColumns]);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    const searchTerm = (isControlled ? undefined : internalSearch)?.toLowerCase().trim();
    if (searchTerm) {
      result = result.filter(row => {
        return columns.some(col => {
          if (col.searchable === false) return false;
          const val = row[col.key];
          if (val == null) return false;
          return String(val).toLowerCase().includes(searchTerm);
        });
      });
    }

    // Filters
    const activeFilters = isControlled ? undefined : internalFilters;
    if (activeFilters && Object.keys(activeFilters).length > 0) {
      result = result.filter(row => {
        return Object.entries(activeFilters).every(([key, val]) => {
          if (!val || val === 'all') return true;
          const rowVal = row[key];
          if (rowVal == null) return false;
          return String(rowVal).toLowerCase() === String(val).toLowerCase();
        });
      });
    }

    // Sort
    if (currentSortKey) {
      result.sort((a, b) => {
        let av = a[currentSortKey], bv = b[currentSortKey];
        if (av == null) av = '';
        if (bv == null) bv = '';
        if (typeof av === 'number' && typeof bv === 'number') {
          return currentSortDir === 'asc' ? av - bv : bv - av;
        }
        av = String(av).toLowerCase();
        bv = String(bv).toLowerCase();
        if (av < bv) return currentSortDir === 'asc' ? -1 : 1;
        if (av > bv) return currentSortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, columns, internalSearch, internalFilters, currentSortKey, currentSortDir, isControlled]);

  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / currentPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startEntry = totalRecords === 0 ? 0 : (safePage - 1) * currentPerPage + 1;
  const endEntry = Math.min(safePage * currentPerPage, totalRecords);
  const paginatedData = filteredData.slice((safePage - 1) * currentPerPage, safePage * currentPerPage);

  const handleSearch = useCallback((val) => {
    if (isControlled) return;
    setInternalSearch(val);
    setInternalPage(1);
  }, [isControlled]);

  const handleFilterChange = useCallback((key, val) => {
    if (isControlled) {
      onFilterChange?.(key, val);
      return;
    }
    setInternalFilters(prev => ({ ...prev, [key]: val }));
    setInternalPage(1);
  }, [isControlled, onFilterChange]);

  const handleSort = useCallback((key) => {
    if (isControlled) {
      onSortChange?.(key, currentSortKey === key && currentSortDir === 'asc' ? 'desc' : 'asc');
      return;
    }
    setInternalSortKey(key);
    setInternalSortDir(prev => (currentSortKey === key && prev === 'asc' ? 'desc' : 'asc'));
  }, [isControlled, currentSortKey, currentSortDir, onSortChange]);

  const handlePageChange = useCallback((p) => {
    if (isControlled) {
      onPageChange?.(p);
      return;
    }
    setInternalPage(p);
  }, [isControlled, onPageChange]);

  const handlePerPageChange = useCallback((val) => {
    if (isControlled) {
      onPerPageChange?.(Number(val));
      return;
    }
    setInternalPerPage(Number(val));
    setInternalPage(1);
  }, [isControlled, onPerPageChange]);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [safePage, totalPages]);

  const toggleColumn = (key) => {
    setHiddenColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <div className="dt-root">
      {/* Toolbar */}
      <div className="dt-toolbar">
        <div className="dt-toolbar-left">
          <div className="dt-title-wrap">
            {title && <h3 className="dt-title">{title}</h3>}
            <span className="dt-badge">{totalRecords}</span>
          </div>
          <div className="dt-toolbar-actions">
            {filters.length > 0 && (
              <button className={`dt-toolbar-btn ${externalShowFilters ? 'active' : ''}`} onClick={onToggleFilters} title="Filters">
                {ICONS.filter}<span>Filters</span>
              </button>
            )}
            {refreshAction && (
              <button className="dt-toolbar-btn" onClick={refreshAction} title="Refresh">
                {ICONS.refresh}
              </button>
            )}
            {exportAction && (
              <button className="dt-toolbar-btn" onClick={exportAction} title="Export">
                {ICONS.export}
              </button>
            )}
            <div className="dt-column-dropdown">
              <button className="dt-toolbar-btn" onClick={() => setShowColumnPanel(v => !v)} title="Columns">
                {ICONS.columns}
              </button>
              {showColumnPanel && (
                <div className="dt-column-panel">
                  {columns.map(c => (
                    <label key={c.key} className="dt-column-item">
                      <input type="checkbox" checked={!hiddenColumns.has(c.key)} onChange={() => toggleColumn(c.key)} />
                      <span>{c.header}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="dt-toolbar-right">
          <div className="dt-search">
            {ICONS.search}
            <input
              type="text"
              className="dt-search-input"
              placeholder={searchPlaceholder}
              value={isControlled ? '' : internalSearch}
              onChange={e => handleSearch(e.target.value)}
            />
            {!isControlled && internalSearch && (
              <button className="dt-search-clear" onClick={() => handleSearch('')}>
                {ICONS.clear}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {externalShowFilters && filters.length > 0 && (
        <div className="dt-filter-panel">
          <div className="dt-filter-row">
            {filters.map(f => (
              <div key={f.key} className="dt-filter-group">
                <label className="dt-filter-label">{f.label}</label>
                <select
                  className="dt-filter-select"
                  value={(isControlled ? undefined : internalFilters[f.key]) || 'all'}
                  onChange={e => handleFilterChange(f.key, e.target.value === 'all' ? '' : e.target.value)}
                >
                  <option value="all">All</option>
                  {f.options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            ))}
            <div className="dt-filter-actions">
              <button className="btn btn-sm btn-secondary" onClick={() => {
                if (isControlled) {
                  filters.forEach(f => onFilterChange?.(f.key, ''));
                } else {
                  setInternalFilters({});
                }
              }}>Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="dt-table-wrap">
        {loading ? (
          <div className="dt-skeleton">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="dt-skeleton-row">
                {Array.from({ length: visibleColumns.length + (actionColumn ? 1 : 0) }).map((_, j) => (
                  <div key={j} className="dt-skeleton-cell" style={{ flex: 1 }} />
                ))}
              </div>
            ))}
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="dt-empty">
            {emptyState?.icon || ICONS.empty}
            <h4 className="dt-empty-title">{emptyState?.title || 'No records found'}</h4>
            <p className="dt-empty-desc">{emptyState?.description || 'No data matches your search or filter criteria.'}</p>
            {emptyState?.action}
          </div>
        ) : (
          <table className="dt-table">
            <thead>
              <tr>
                {visibleColumns.map(col => (
                  <th
                    key={col.key}
                    className={`${col.align === 'center' ? 'dt-th-center' : ''} ${col.sortable !== false ? 'dt-th-sortable' : ''}`}
                    style={{ width: col.width }}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    <span className="dt-th-content">
                      {col.header}
                      {currentSortKey === col.key && (
                        <span className="dt-sort-indicator">{currentSortDir === 'asc' ? ICONS.sortAsc : ICONS.sortDesc}</span>
                      )}
                    </span>
                  </th>
                ))}
                {actionColumn && <th className="dt-th-center dt-th-action">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={`${idx % 2 === 1 ? 'dt-alt-row' : ''} ${rowClassName ? rowClassName(row) : ''} ${onRowClick ? 'dt-clickable' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {visibleColumns.map(col => (
                    <td key={col.key} className={col.align === 'center' ? 'dt-td-center' : ''}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actionColumn && <td className="dt-td-center">{actionColumn(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalRecords > 0 && (
        <div className="dt-pagination">
          <div className="dt-pagination-left">
            <span className="dt-pagination-info">Showing <b>{startEntry}</b> to <b>{endEntry}</b> of <b>{totalRecords}</b> entries</span>
            <div className="dt-pagination-per-page">
              <span>Rows per page:</span>
              <select value={currentPerPage} onChange={e => handlePerPageChange(e.target.value)}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          <div className="dt-pagination-right">
            <button className="dt-page-btn dt-page-btn--icon" disabled={safePage === 1} onClick={() => handlePageChange(1)} title="First">{ICONS.first}</button>
            <button className="dt-page-btn dt-page-btn--icon" disabled={safePage === 1} onClick={() => handlePageChange(safePage - 1)} title="Previous">{ICONS.prev}</button>
            <div className="dt-page-numbers">
              {pageNumbers.map(p => (
                <button key={p} className={`dt-page-num ${p === safePage ? 'active' : ''}`} onClick={() => handlePageChange(p)}>{p}</button>
              ))}
            </div>
            <button className="dt-page-btn dt-page-btn--icon" disabled={safePage === totalPages} onClick={() => handlePageChange(safePage + 1)} title="Next">{ICONS.next}</button>
            <button className="dt-page-btn dt-page-btn--icon" disabled={safePage === totalPages} onClick={() => handlePageChange(totalPages)} title="Last">{ICONS.last}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
