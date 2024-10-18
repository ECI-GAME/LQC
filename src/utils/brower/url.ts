import URL from "url";

export default class {
  public protocol?: string;
  public hostname?: string;
  public host?: string;
  public port?: string | number;
  public pathname: string = "/";
  public search?: string;

  constructor(value?: string) {
    if (value) {
      const url = URL.parse(value, true);
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
    this.search = value;
  }

  setQuery(key: string, value: string | number): void {

  }

  format(): string {
    if (this.host) {
      return URL.format({
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