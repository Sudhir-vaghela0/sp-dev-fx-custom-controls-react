import * as React from "react";
import { EListItemActivityStateTypes } from "./EListItemActivityStateTypes";
import { IListItemActivityState } from "./IListItemActivityState";
import { IListItemActivityStateContext } from "./IListItemActivityStateContext";
import { ListItemActivityStateReducer } from "./ListItemActivityStateReducer";

export const ListItemActivityStateContext = React.createContext<IListItemActivityStateContext>(
  undefined as unknown as IListItemActivityStateContext,
);

const initialState: IListItemActivityState = {
  errorInfo: undefined,
  activities: [],
  allActivities: [],
  isLoading: false,
  hasMore: false,
  visibleCount: 10,
};

interface IListItemActivityStateProviderProps {
  children: React.ReactNode;
  numberActivitiesPerPage?: number;
}

export const ListItemActivityStateProvider: React.FC<IListItemActivityStateProviderProps> = ({
  children,
  numberActivitiesPerPage = 10,
}) => {
  const [listItemActivityState, setListItemActivityState] = React.useReducer(
    ListItemActivityStateReducer,
    { ...initialState, visibleCount: numberActivitiesPerPage },
  );

  return (
    <ListItemActivityStateContext.Provider value={{ listItemActivityState, setListItemActivityState }}>
      {children}
    </ListItemActivityStateContext.Provider>
  );
};

export type ListItemActivityDispatch = React.Dispatch<{
  type: EListItemActivityStateTypes;
  payload: unknown;
}>;
