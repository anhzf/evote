import * as v from 'valibot';
import { DocPath } from '../doc';

export const SessionPath = DocPath.template('sessions/{session}');
export const SessionInternalPath = SessionPath.childTemplate('settings/sys');

export const Session = v.object({
  title: v.string(),
  url: v.string(),
});

export const SessionInternal = v.object({
  tokenSalt: v.string(),
});
