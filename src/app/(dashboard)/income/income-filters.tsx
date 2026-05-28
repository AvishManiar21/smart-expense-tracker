'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

type IncomeFiltersProps = {
  filters: {
    startDate: string;
    endDate: string;
    minAmount: string;
    maxAmount: string;
  };
  onFilterChange: (filters: IncomeFiltersProps['filters']) => void;
};

export function IncomeFilters({ filters, onFilterChange }: IncomeFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={localFilters.startDate}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={localFilters.endDate}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minAmount">Min Amount</Label>
            <Input
              id="minAmount"
              type="number"
              placeholder="0.00"
              value={localFilters.minAmount}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, minAmount: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAmount">Max Amount</Label>
            <Input
              id="maxAmount"
              type="number"
              placeholder="0.00"
              value={localFilters.maxAmount}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, maxAmount: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={handleApply}>Apply Filters</Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
