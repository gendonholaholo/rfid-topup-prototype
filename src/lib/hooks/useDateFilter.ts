import { useState, useMemo } from 'react';

export function useDateFilter<T>(items: T[], getDate: (item: T) => string) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => {
    let result = items;

    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((item) => new Date(getDate(item)) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((item) => new Date(getDate(item)) <= to);
    }

    return result;
  }, [items, dateFrom, dateTo, getDate]);

  const reset = () => {
    setDateFrom('');
    setDateTo('');
  };

  const hasFilter = !!(dateFrom || dateTo);

  return { dateFrom, setDateFrom, dateTo, setDateTo, filtered, reset, hasFilter };
}
