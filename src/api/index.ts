import User from "./user/index";
import Project from "./project/index";
import System from "./system/index";
import Version from "./version/index";
import Task from "./task/index";
import Work from "./work/index";
import knowLedge from "./knowLedge";
import Common from "./common";


export class Api {
  user: User = new User();
  project: Project = new Project();
  system: System = new System();
  version: Version = new Version();
  task: Task = new Task();
  work: Work = new Work();
  knowLedge: knowLedge = new knowLedge();
  Common: Common = new Common();
}

export default new Api();
