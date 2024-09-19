import * as _ from "lodash-es";
import safeGet from "@fengqiaogang/safe-get";
import {Gql, validate, required} from "@js-lion/api";

interface Query {
  [key: string]: string | any[] | object;
}

export default class {

  graphQLQuery(query: object = {}): string {
    const list: string[] = [];

    const keys = Object.keys(query);

    for (const name of keys) {
      const value = safeGet<string | number>(query, name)!;
      if (_.isNil(value)) {
        continue;
      }
      if (_.isNumber(value)) {
        list.push(`${name}: ${value}`);
      } else {
        list.push(`${name}: "${value}"`);
      }
    }

    return "{" + list.join(",") + "}";
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
        if (typeof value === "string") {
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