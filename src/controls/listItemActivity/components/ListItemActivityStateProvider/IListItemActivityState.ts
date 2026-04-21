import { IItemActivity } from "../../models/IItemActivity";
import { IErrorInfo } from "./IErrorInfo";

export interface IListItemActivityState {
  errorInfo: IErrorInfo | undefined;
  activities: IItemActivity[];
  allActivities: IItemActivity[];
  isLoading: boolean;
  hasMore: boolean;
  visibleCount: number;
}
