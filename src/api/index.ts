import User from "./user/index";
import Project from "./project/index";

export class Api {
  user: User = new User();
  project: Project = new Project();
}

export default new Api();