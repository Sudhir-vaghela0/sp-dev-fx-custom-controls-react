import * as React from "react";
import { EListItemActivityStateTypes } from "./EListItemActivityStateTypes";
import { IListItemActivityState } from "./IListItemActivityState";

export interface IListItemActivityStateContext {
  listItemActivityState: IListItemActivityState;
  setListItemActivityState: React.Dispatch<{ type: EListItemActivityStateTypes; payload: unknown }>;
}
