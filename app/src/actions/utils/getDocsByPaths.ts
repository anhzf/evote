import { DocumentData } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { getFns } from 'src/firebase';

export interface GetDocsByPathsPayload {
  paths: string[];
}

export type GetDocsByPathsResponse<T = DocumentData> = T[];

export default async <T = DocumentData>(paths: string[] = []) => {
  const fn = httpsCallable<GetDocsByPathsPayload, GetDocsByPathsResponse<T>>(getFns(), 'getDocumentsByFullPath');
  const { data } = await fn({ paths });
  return data;
};
