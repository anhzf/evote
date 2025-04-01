import * as v from 'valibot';
import { Person } from './person';
import { DocPath } from '../doc';

export const UserPath = DocPath.template('users/{user}');

export const User = v.object({
  ...Person.entries,
});
