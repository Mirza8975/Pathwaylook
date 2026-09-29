/**
 * Offline Service using IndexedDB
 */

const DB_NAME = 'PathwayLockDB';
const DB_VERSION = 1;

interface SyncQueueItem {
  id?: number;
  entityType: string;
  data: any;
  timestamp: string;
  synced: boolean;
}

class OfflineService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('beneficiaries')) {
          db.createObjectStore('beneficiaries', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('recommendations')) {
          db.createObjectStore('recommendations', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async saveBeneficiary(data: any): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['beneficiaries'], 'readwrite');
      const store = transaction.objectStore('beneficiaries');
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getBeneficiary(id: number): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['beneficiaries'], 'readonly');
      const store = transaction.objectStore('beneficiaries');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addToSyncQueue(entityType: string, data: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const item: SyncQueueItem = {
      entityType,
      data,
      timestamp: new Date().toISOString(),
      synced: false,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.add(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markSynced(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearSynced(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const queue = await this.getSyncQueue();
    const synced = queue.filter((item) => item.synced);

    for (const item of synced) {
      if (item.id) {
        await this.markSynced(item.id);
      }
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}

export const offlineService = new OfflineService();
