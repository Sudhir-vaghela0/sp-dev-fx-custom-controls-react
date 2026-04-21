import { IItemActivity, IItemActivityStat } from "../../models/IItemActivity";
import { IPageInfo } from "../../models/IPageInfo";
import { EListItemActivityStateTypes } from "./EListItemActivityStateTypes";
import { IErrorInfo } from "./IErrorInfo";
import { IListItemActivityState } from "./IListItemActivityState";

type Action = { type: EListItemActivityStateTypes; payload: unknown };

export const ListItemActivityStateReducer = (
  state: IListItemActivityState,
  action: Action,
): IListItemActivityState => {
  switch (action.type) {
    case EListItemActivityStateTypes.SET_ERROR_INFO:
      return { ...state, errorInfo: action.payload as IErrorInfo };

    // SET_ACTIVITIES stores the FULL list in allActivities and keeps the current slice in activities.
    // This allows SET_VISIBLE_COUNT to re-slice without a new API call.
    case EListItemActivityStateTypes.SET_ACTIVITIES: {
      const all = action.payload as IItemActivity[];
      return {
        ...state,
        allActivities: all,
        activities: all.slice(0, state.visibleCount),
        pageInfo: { ...state.pageInfo, hasMore: all.length > state.visibleCount },
      };
    }

    case EListItemActivityStateTypes.SET_IS_LOADING:
      return { ...state, isLoading: action.payload as boolean };

    case EListItemActivityStateTypes.SET_IS_LOADING_MORE:
      return { ...state, isLoadingMore: action.payload as boolean };

    case EListItemActivityStateTypes.SET_PAGE_INFO:
      return { ...state, pageInfo: action.payload as IPageInfo };

    case EListItemActivityStateTypes.SET_V1_STATS:
      return { ...state, v1Stats: action.payload as IItemActivityStat[] };

    // SET_VISIBLE_COUNT re-slices allActivities to the new count.
    case EListItemActivityStateTypes.SET_VISIBLE_COUNT: {
      const count = action.payload as number;
      return {
        ...state,
        visibleCount: count,
        activities: state.allActivities.slice(0, count),
        pageInfo: {
          ...state.pageInfo,
          hasMore: state.allActivities.length > count,
        },
      };
    }

    default:
      return state;
  }
};
