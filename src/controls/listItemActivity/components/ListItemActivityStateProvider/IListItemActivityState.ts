import { IItemActivity, IItemActivityStat } from "../../models/IItemActivity";
import { IPageInfo } from "../../models/IPageInfo";
import { IErrorInfo } from "./IErrorInfo";

export interface IListItemActivityState {
  errorInfo: IErrorInfo | undefined;
  activities: IItemActivity[];
  allActivities: IItemActivity[];
  v1Stats: IItemActivityStat[];
  isLoading: boolean;
  isLoadingMore: boolean;
  visibleCount: number;
  pageInfo: IPageInfo;
}
