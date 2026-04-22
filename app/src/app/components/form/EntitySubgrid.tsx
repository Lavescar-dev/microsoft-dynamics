import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { cn } from '../ui/utils';
import { useLocale } from '../../contexts/LocaleContext';

export interface EntitySubgridColumn<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  className?: string;
  sortValue?: (row: T) => string | number;
}

export interface EntitySubgridView<T> {
  label: string;
  filter: (row: T) => boolean;
}

interface EntitySubgridProps<T> {
  title: string;
  rows: T[];
  columns: EntitySubgridColumn<T>[];
  emptyLabel: string;
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  getFilterText?: (row: T) => string;
  views?: EntitySubgridView<T>[];
}

export function EntitySubgrid<T>({
  title,
  rows,
  columns,
  emptyLabel,
  getRowId,
  onRowClick,
  getFilterText,
  views,
}: EntitySubgridProps<T>) {
  const { tr } = useLocale();
  const [query, setQuery] = React.useState('');
  const [viewIndex, setViewIndex] = React.useState(views?.[0]?.label ?? 'all');
  const [sortKey, setSortKey] = React.useState(columns[0]?.key ?? '');

  const activeView = views?.find((view) => view.label === viewIndex);

  const visibleRows = React.useMemo(() => {
    const filteredRows = rows.filter((row) => {
      const matchesView = activeView ? activeView.filter(row) : true;
      const haystack = getFilterText ? getFilterText(row).toLowerCase() : '';
      const matchesQuery = query ? haystack.includes(query.toLowerCase()) : true;
      return matchesView && matchesQuery;
    });

    const sortColumn = columns.find((column) => column.key === sortKey);
    if (!sortColumn?.sortValue) {
      return filteredRows;
    }

    return [...filteredRows].sort((left, right) => {
      const leftValue = sortColumn.sortValue?.(left);
      const rightValue = sortColumn.sortValue?.(right);
      return String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [activeView, columns, getFilterText, query, rows, sortKey]);

  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-100 pb-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <CardTitle className="text-sm font-semibold">{tr(title)}</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            {getFilterText ? (
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tr('Filter records')}
                className="w-44"
              />
            ) : null}
            {views?.length ? (
              <Select value={viewIndex} onValueChange={setViewIndex}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {views.map((view) => (
                    <SelectItem key={view.label} value={view.label}>
                      {tr(view.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            {columns.some((column) => column.sortValue) ? (
              <Select value={sortKey} onValueChange={setSortKey}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns
                    .filter((column) => column.sortValue)
                    .map((column) => (
                      <SelectItem key={column.key} value={column.key}>
                        {typeof column.header === 'string' ? tr(column.header) : column.key}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {visibleRows.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow
                  key={getRowId(row)}
                  className={cn(onRowClick ? 'cursor-pointer' : undefined)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {typeof column.cell(row) === 'string' ? tr(String(column.cell(row))) : column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>{tr(emptyLabel)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
