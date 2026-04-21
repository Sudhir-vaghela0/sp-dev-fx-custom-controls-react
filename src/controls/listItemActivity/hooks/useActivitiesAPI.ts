import { useContext } from "react";
import { AppContext } from "../common";
import { SPServices } from "../services/SPServices";
import { IItemActivity, IItemActivityStat } from "../models/IItemActivity";

export interface IActivitiesAPIResult {
  activities: IItemActivity[];
  v1Stats: IItemActivityStat[];
}

/**
 * Hook that exposes Graph API calls for item activities via PnP JS (SPServices).
 * Reads siteId, listId, itemId, listType from AppContext.
 */
const useActivitiesAPI = (): { getActivities: () => Promise<IActivitiesAPIResult> } => {
  const { siteId, listId, itemId, listType } = useContext(AppContext);

  const getActivities = async (): Promise<IActivitiesAPIResult> => {
    const svc = new SPServices();
    const result = await svc.getItemActivities(siteId, listId, itemId, listType);

    // Normalise: PnP JS graphGet may return the OData wrapper or the unwrapped array
    const normalise = <T,>(raw: T[] | { value: T[] } | undefined): T[] => {
      if (!raw) return [];
      return Array.isArray(raw) ? raw : (raw as { value: T[] }).value ?? [];
    };

    return {
      activities: normalise(result.betaActivities),
      v1Stats: normalise(result.v1Stats),
    };
  };

  return { getActivities };
};

export default useActivitiesAPI;
