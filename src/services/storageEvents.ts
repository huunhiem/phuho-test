export type StorageEntity =
  | 'classes'
  | 'users'
  | 'questions'
  | 'tests'
  | 'assignments'
  | 'submissions'
  | 'lessons'
  | 'all';

export type StorageChangeListener = (entity: StorageEntity) => void;

const changeListeners: Set<StorageChangeListener> = new Set();

export function onStorageChange(listener: StorageChangeListener): () => void {
  changeListeners.add(listener);
  return () => {
    changeListeners.delete(listener);
  };
}

export function notifyChange(entity: StorageEntity) {
  changeListeners.forEach((fn) => {
    try {
      fn(entity);
    } catch (e) {
      console.warn('Storage change listener error:', e);
    }
  });
}
