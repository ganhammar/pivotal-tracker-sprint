import { inject } from "aurelia-framework";
import { Local } from "./local";

@inject(Local)
export class Settings {
  constructor() {
    this.storyStates = [
       "unscheduled", "unstarted", "started", "finished", "delivered",
       "accepted", "rejected"
    ];

    this.columnBaseTypes = ["state", "label"];
    
    this.columns = [
      { title: "Todo", basedOn: "state", value: ["planned", "unstarted"] },
      { title: "Doing", basedOn: "state", value: ["started"] },
      { title: "Testing", basedOn: "state", value: ["finished"] },
      { title: "Done", basedOn: "state", value: ["delivered", "accepted"] },
      { title: "Impedements", basedOn: "label", value: ["_blocked"] }
    ];
  }
}
