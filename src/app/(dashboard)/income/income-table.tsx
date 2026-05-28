'use client';

import { formatDate, formatCurrency } from '@/lib/utils/date';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Income } from './income-client';

type IncomeTableProps = {
  incomes: Income[];
  loading: boolean;
  onEdit: (income: Income) => void;
  onDelete: (id: string) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
};

export function IncomeTable({
  incomes,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}: IncomeTableProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Loading income...</div>
      </div>
    );
  }

  if (incomes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">No income found</div>
        <p className="text-sm text-gray-500 mt-2">Add your first income to get started</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomes.map((income) => (
            <TableRow key={income.id}>
              <TableCell>{formatDate(income.date)}</TableCell>
              <TableCell className="font-medium">{income.source}</TableCell>
              <TableCell>{income.description || '-'}</TableCell>
              <TableCell>
                {income.isRecurring ? (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    Recurring
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                    One-time
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right font-semibold text-green-600">
                {formatCurrency(Number(income.amount))}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(income)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(income.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
