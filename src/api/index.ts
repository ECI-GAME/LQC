import User from "./user/index";
import Project from "./project/index";
import System from "./system/index";
import Version from "./version/index";
import Task from "./task/index";
import Work from "./work/index";

export class Api {
  user: User = new User();
  project: Project = new Project();
  system: System = new System();
  version: Version = new Version();
  task: Task = new Task();
  work: Work = new Work();
}

export default new Api();
