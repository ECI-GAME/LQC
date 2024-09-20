import * as _ from "lodash-es";
import safeGet from "@fengqiaogang/safe-get";
import {Gql, validate, required} from "@js-lion/api";

interface Query {
  [key: string]: string | any[] | object;
}

export default class {

  graphQLQuery(query: object | Array<any> = {}): string {
    if (_.isArray(query)) {
      const list: string[] = [];
      for (const value of query) {
        if (_.isNil(value)) {
          continue;
        }
        if (_.isNumber(value)) {
          list.push(String(value));
        } else if (_.isArray(value) || _.isObject(value)) {
          list.push(this.graphQLQuery(value));
        } else {
          list.push(`"${value}"`);
        }
      }
      return `[ ${list.join(", ")} ]`;
    } else {
      const list: string[] = [];
      const keys = Object.keys(query);
      for (const name of keys) {
        const value = safeGet<string | number>(query, name)!;
        if (_.isNil(value)) {
          continue;
        }
        if (_.isNumber(value)) {
          list.push(`${name}: ${value}`);
        } else if (_.isArray(value) || _.isObject(value)) {
          const item = this.graphQLQuery(value);
          list.push(`${name}: ${item}`);
        } else {
          list.push(`${name}: "${value}"`);
        }
      }
      return "{ " + list.join(", ") + " }";
    }
  }

  @Gql("/graphql")
  @validate
  protected graphQL<T>(@required name: string, @required query: Query[], @required keys: string[]): Promise<T> {
    let data: string;
    if (query.length > 0) {
      const params: string[] = [];
      for (const item of query) {
        const [key] = Object.keys(item);
        const value = item[key];
        if (_.isNil(value)) {
          continue;
        }
        if (_.isArray(value) || _.isObject(value)) {
          params.push(`${key}: ${this.graphQLQuery(value)}`);
        } else if (_.isNumber(value)) {
          params.push(`${key}: ${value}`);
        } else if (_.isString(value)) {
          params.push(`${key}: ${value}`);
        } else if (_.isString(value)) {
          params.push(`${key}: ${value}`);
        } else {
          params.push(`${key}: ${JSON.stringify(value)}`);
        }
      }
      data = `{ ${name} (${params.join(", ")}) { ${keys.join("\n")} } }`;
    } else {
      data = `{ ${name} { ${keys.join("\n")} } }`;
    }
    const callback = function (res: object) {
      return safeGet<object>(res, name);
    }
    // @ts-ignore
    return {data, callback};
  }
}