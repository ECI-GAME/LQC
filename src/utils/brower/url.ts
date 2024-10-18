/**
 * @file URL 解析
 * @author svon.me@gmail.com
 **/

import _URL from "url";

export default class Url {
  public protocol?: string;
  public hostname?: string;
  public host?: string;
  public port?: string | number;
  public pathname: string = "/";
  public search?: string;

  constructor(value?: string) {
    if (value) {
      const url = _URL.parse(value, true);
      this.protocol = url.protocol || void 0;
      this.hostname = url.hostname || void 0;
      this.host = url.host || void 0;
      this.port = url.port || void 0;
      this.pathname = url.pathname || "/";
      this.search = url.search || void 0;
    }
  }

  setPathName(value: string = "/"): void {
    this.pathname = value;
  }

  setSearch(value?: string): void {
    if (value) {
      this.search = (value[0] === "?" ? value : `?${value}`);
    } else {
      this.search = value;
    }
  }

  get query(): Map<string, string | number | undefined> {
    const query = new Map<string, string | number | undefined>();
    if (this.search) {
      const text: string = this.search.slice(1);
      for (const item of text.split("&")) {
        const [key, ...value] = item.split("=");
        query.set(key, value.join("="));
      }
    }
    return query;
  }

  getQuery(name: string): string | number | undefined {
    const query = this.query;
    return query.get(name);
  }

  setQuery(key: string, value: string | number | undefined): void {
    if (this.search) {
      const query = this.query;
      query.set(key, value);
      const search: string[] = [];
      for (const key of query.keys()) {
        const value = query.get(key);
        search.push(`${key}=${value}`);
      }
      this.search = `?${search.join("&")}`;
    } else {
      this.search = `?${key}=${value}`;
    }
  }

  format(): string {
    if (this.host) {
      return _URL.format({
        protocol: this.protocol,
        hostname: this.hostname,
        host: this.host,
        port: this.port,
        pathname: this.pathname,
        search: this.search,
      });
    } else {
      return this.pathname + (this.search ? `?${this.search}` : "");
    }
  }
}