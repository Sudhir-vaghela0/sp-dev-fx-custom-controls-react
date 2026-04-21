import { IItemActivity } from "../../models/IItemActivity";
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

    // SET_ACTIVITIES stores the FULL list in allActivities and slices to visibleCount.
    // This allows SET_VISIBLE_COUNT to re-slice without a new API call.
    case EListItemActivityStateTypes.SET_ACTIVITIES: {
      const all = action.payload as IItemActivity[];
      return {
        ...state,
        allActivities: all,
        activities: all.slice(0, state.visibleCount),
        hasMore: all.length > state.visibleCount,
      };
    }

    case EListItemActivityStateTypes.SET_IS_LOADING:
      return { ...state, isLoading: action.payload as boolean };

    // SET_VISIBLE_COUNT re-slices allActivities to the new count.
    case EListItemActivityStateTypes.SET_VISIBLE_COUNT: {
      const count = action.payload as number;
      return {
        ...state,
        visibleCount: count,
        activities: state.allActivities.slice(0, count),
        hasMore: state.allActivities.length > count,
      };
    }

    default:
      return state;
  }
};
