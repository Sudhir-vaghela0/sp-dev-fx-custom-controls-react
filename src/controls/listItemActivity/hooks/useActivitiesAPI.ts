import { useContext } from "react";
import { AppContext } from "../common";
import { SPServices } from "../services/SPServices";
import { IItemActivity } from "../models/IItemActivity";

/**
 * Hook that exposes the Graph API call for item activities.
 * Reads siteId, listId, itemId, listType from AppContext.
 */
const useActivitiesAPI = (): { getActivities: () => Promise<IItemActivity[]> } => {
  const { siteId, listId, itemId, listType } = useContext(AppContext);

  const getActivities = async (): Promise<IItemActivity[]> => {
    const svc = new SPServices();
    return svc.getItemActivities(siteId, listId, itemId, listType);
  };

  return { getActivities };
};

export default useActivitiesAPI;
