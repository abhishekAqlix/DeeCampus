import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode, useState } from "react";

export interface Column<T> {
  key: string;
  header?: string;
  label?: string;
  render?: ((row: T) => ReactNode) | ((value: any) => ReactNode);
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: string;
  onSearch?: (query: string) => void;
  actions?: ReactNode;
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({ columns, data, searchPlaceholder = "Search...", searchKey, actions, pageSize = 10 }: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = data.filter(row => {
    if (!search) return true;
    if (searchKey) return String(row[searchKey] ?? "").toLowerCase().includes(search.toLowerCase());
    return columns.some(col => String(row[col.key] ?? "").toLowerCase().includes(search.toLowerCase()));
  });
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const getColumnHeader = (col: Column<T>) => col.header || col.label || col.key;

  const renderCell = (col: Column<T>, row: T) => {
    if (!col.render) return row[col.key];
    // Support both (row) => ReactNode and (value) => ReactNode signatures
    try {
      const result = (col.render as (value: any) => ReactNode)(row[col.key]);
      // If the render function returned undefined/null and the value exists, it might expect the row
      if (result === undefined && row[col.key] !== undefined) {
        return (col.render as (row: T) => ReactNode)(row);
      }
      return result;
    } catch {
      return (col.render as (row: T) => ReactNode)(row);
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm animate-fade-in">
      <div className="p-4 flex items-center justify-between gap-3 border-b">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={searchPlaceholder} value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} className="pl-9 h-9 bg-secondary/50 border-0" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-1.5"><Filter className="h-3.5 w-3.5" />Filters</Button>
          <Button variant="outline" size="sm" className="h-9 gap-1.5"><Download className="h-3.5 w-3.5" />Export</Button>
          {actions}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map(col => (
              <TableHead key={col.key} className={`text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.className || ""}`}>{getColumnHeader(col)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((row, i) => (
            <TableRow key={i} className="cursor-pointer hover:bg-secondary/50 transition-colors">
              {columns.map(col => (
                <TableCell key={col.key} className={col.className}>{renderCell(col, row)}</TableCell>
              ))}
            </TableRow>
          ))}
          {paged.length === 0 && (
            <TableRow><TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">No records found</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      <div className="p-4 flex items-center justify-between border-t text-xs text-muted-foreground">
        <span>Showing {filtered.length > 0 ? page * pageSize + 1 : 0}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)} className="h-7 w-7 p-0"><ChevronLeft className="h-4 w-4" /></Button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
            <Button key={i} variant={page === i ? "default" : "ghost"} size="sm" onClick={() => setPage(i)} className="h-7 w-7 p-0 text-xs">{i + 1}</Button>
          ))}
          <Button variant="ghost" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="h-7 w-7 p-0"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
