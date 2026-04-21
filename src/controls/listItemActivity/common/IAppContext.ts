import { WebPartContext } from "@microsoft/sp-webpart-base";
import { EListType } from "../models/EListType";

export interface IAppContext {
  context: WebPartContext;
  webUrl: string;
  listId: string;
  itemId: string;
  siteId: string;
  listType: EListType;
  numberActivitiesPerPage?: number;
  label?: string;
  title?: string;
}
