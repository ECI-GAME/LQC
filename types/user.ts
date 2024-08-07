// 用户信息
export class UserInfo{
  role: string | null = null;
  dashboard: string | null = null;
  lang: string | null = null;
  aid: string = "";
  eid: string = "";
  ename: string = "";
  dname: string = "";
  oldid: string | null = null;
  user_name: string = "";
  atype: string = "";
  oid: number = -1;
  did: number = -1;
  pid: number = -1;
  hpid: string | null = null;
  attachs: string = "";
  qywx: string | null = null;
  tz: string = "";
  scope: string[] = [];
  exp: number = 0;
  authorities: string | null = null;
  jti: string = "";
  client_id: string = "";
}