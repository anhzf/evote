import { getDownloadURL, ref } from 'firebase/storage';
import { getStorage } from 'src/firebase';

export const assetUrl = async (obj: any): Promise<string> => {
  if (typeof obj === 'string') {
    if (obj.startsWith('gs://')) {
      const storage = getStorage();
      return getDownloadURL(ref(storage, obj));
    }

    return obj;
  }

  return URL.createObjectURL(obj);
};
