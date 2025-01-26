import { getDownloadURL, ref } from 'firebase/storage';
import { getStorage } from 'src/firebase';

const storageStore = new Map<string, string>();

export const assetUrl = async (obj: any, refresh = false): Promise<string> => {
  if (typeof obj === 'string') {
    if (obj.startsWith('gs://')) {
      const storageRef = ref(getStorage(), obj);

      if (refresh) storageStore.delete(storageRef.fullPath);

      if (storageStore.has(storageRef.fullPath)) {
        return storageStore.get(storageRef.fullPath)!;
      }

      const result = await getDownloadURL(storageRef);
      storageStore.set(storageRef.fullPath, result);
      return result;
    }

    return obj;
  }

  return URL.createObjectURL(obj);
};
