import { useEffect, useMemo, useState } from 'react';

function readStoredItems<T extends { id: string }>(storageKey: string): T[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function usePersistentCollection<T extends { id: string }>(storageKey: string, seedItems: T[]) {
  const [storedItems, setStoredItems] = useState<T[]>([]);

  useEffect(() => {
    setStoredItems(readStoredItems<T>(storageKey));
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(storedItems));
  }, [storageKey, storedItems]);

  const items = useMemo(() => {
    const tombstones = new Set(
      storedItems
        .filter((item) => item.id.endsWith('__deleted'))
        .map((item) => item.id.replace(/__deleted$/, ''))
    );
    const mergedItems = [
      ...storedItems.filter((item) => !item.id.endsWith('__deleted')),
      ...seedItems.filter((item) => !tombstones.has(item.id)),
    ];
    const deduped = new Map<string, T>();

    for (const item of mergedItems) {
      deduped.set(item.id, item);
    }

    return Array.from(deduped.values()).sort((left, right) => {
      const leftId = Number(left.id);
      const rightId = Number(right.id);

      if (Number.isFinite(leftId) && Number.isFinite(rightId)) {
        return leftId - rightId;
      }

      return left.id.localeCompare(right.id, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [seedItems, storedItems]);

  const upsertItem = (item: T) => {
    setStoredItems((current) => {
      const nextItems = current.filter((entry) => entry.id !== item.id);
      nextItems.unshift(item);
      return nextItems;
    });
  };

  const removeItem = (id: string) => {
    setStoredItems((current) => {
      const seedItem = seedItems.find((entry) => entry.id === id);
      if (seedItem) {
        return [
          { ...seedItem, id: `${seedItem.id}__deleted` } as T,
          ...current.filter((entry) => entry.id !== id && entry.id !== `${id}__deleted`)
        ];
      }

      return current.filter((entry) => entry.id !== id);
    });
  };

  return {
    items,
    upsertItem,
    removeItem,
  };
}
