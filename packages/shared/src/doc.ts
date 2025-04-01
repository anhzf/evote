import type { ParamsOf } from 'firebase-functions/v2';
import { doc, type CollectionReference, type DocumentReference } from 'firebase/firestore';
import { getFirestore } from './setup';

export class DocPath<P extends string> {
  private segmentsTemplate: string[] = [];

  private segments: string[] = [];

  /**
   *
   * @param path placeholder path with params in curly braces
   *
   * @example
   * new TemplatePath('sessions/{session}/votables/{votable}')
   */
  constructor(path: P) {
    this.segments = path.split('/').filter(Boolean);
  }

  /**
   * @returns resolved path with params
   */
  get path() {
    return this.segments.map((segment) => {
      const matcher = /{(.+)}/;
      const isParam = matcher.test(segment);

      if (isParam) {
        const param = matcher.exec(segment)![1];
        return this.params[param];
      }

      return segment;
    }).join('/');
  }

  get params() {
    return this.segmentsTemplate.reduce(
      (params, segment, i) => /{.+}/.test(segment)
        ? { ...params, [segment.slice(1, -1)]: this.segments[i] }
        : params,
      {} as ParamsOf<P>,
    );
  }

  static template<P extends string>(path: P) {
    const template = new DocPath<P>(path);
    template.segmentsTemplate = path.split('/').filter(Boolean);
    return template;
  }

  fills(params: Partial<typeof this.params>): DocPath<P> {
    const template = new DocPath(this.path) as DocPath<P>;
    template.segmentsTemplate = this.segmentsTemplate;
    template.segments = this.segments.map((segment) => {
      const matcher = /{(.+)}/;
      const isParam = matcher.test(segment);

      if (isParam) {
        const param = matcher.exec(segment)![1];
        return params[param] ?? segment;
      }

      return segment;
    });

    return template;
  }

  fromString(str: string): DocPath<P> {
    const segments = str.split('/').filter(Boolean);
    const params = Object.fromEntries(Object.entries(this.params)
      .map(([name, v]) => {
        const idxOfSegments = segments.indexOf(name);
        // expect the value of the params is the next of segment
        return [name, segments.at(idxOfSegments + 1) ?? v];
      }));

    return this.fills(params as typeof this.params);
  }

  childTemplate<PC extends string>(path: PC) {
    return DocPath.template(`${this.path}/${path}`) as DocPath<`${P}/${PC}`>;
  }

  toString() {
    return this.path;
  }

  toJSON() {
    return { path: this.path };
  }

  toDocRef(): DocumentReference {
    return doc(getFirestore(), this.toString());
  }

  toCollectionRef(): CollectionReference {
    return doc(getFirestore(), this.toString()).parent;
  }
}
