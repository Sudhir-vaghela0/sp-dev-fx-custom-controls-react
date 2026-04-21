import { useCallback, useContext, useEffect } from "react";
import { AppContext } from "../common";
import { ListItemActivityStateContext } from "../components/ListItemActivityStateProvider/ListItemActivityStateProvider";
import { EListItemActivityStateTypes } from "../components/ListItemActivityStateProvider/EListItemActivityStateTypes";
import useActivitiesAPI from "./useActivitiesAPI";

/**
 * Orchestrates data-fetching and client-side pagination for the ListItemActivity control.
 * Must be rendered inside both AppContext.Provider and ListItemActivityStateProvider.
 */
const useActivitiesState = (): { loadMore: () => void } => {
  const { numberActivitiesPerPage = 10 } = useContext(AppContext);
  const { listItemActivityState, setListItemActivityState } = useContext(ListItemActivityStateContext);
  const { getActivities } = useActivitiesAPI();

  // ─── Initial load ───────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const load = async (): Promise<void> => {
      setListItemActivityState({ type: EListItemActivityStateTypes.SET_IS_LOADING, payload: true });
      setListItemActivityState({
        type: EListItemActivityStateTypes.SET_ERROR_INFO,
        payload: { showError: false, error: undefined },
      });

      try {
        const result = await getActivities();
        if (cancelled) return;

        // Sort newest first
        const sorted = [...result.activities].sort(
          (a, b) =>
            new Date(b.times?.recordedDateTime ?? 0).getTime() -
            new Date(a.times?.recordedDateTime ?? 0).getTime(),
        );

        setListItemActivityState({ type: EListItemActivityStateTypes.SET_V1_STATS, payload: result.v1Stats });

        // SET_ACTIVITIES stores the full sorted list in allActivities and slices to visibleCount
        setListItemActivityState({ type: EListItemActivityStateTypes.SET_ACTIVITIES, payload: sorted });
      } catch (err) {
        if (!cancelled) {
          setListItemActivityState({
            type: EListItemActivityStateTypes.SET_ERROR_INFO,
            payload: { showError: true, error: err instanceof Error ? err : new Error(String(err)) },
          });
        }
      } finally {
        if (!cancelled) {
          setListItemActivityState({ type: EListItemActivityStateTypes.SET_IS_LOADING, payload: false });
        }
      }
    };

    load().catch(console.error);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Load more (client-side pagination) ────────────────────────────────────

  const loadMore = useCallback(() => {
    setListItemActivityState({
      type: EListItemActivityStateTypes.SET_VISIBLE_COUNT,
      payload: listItemActivityState.visibleCount + numberActivitiesPerPage,
    });
  }, [listItemActivityState.visibleCount, numberActivitiesPerPage, setListItemActivityState]);

  return { loadMore };
};

export default useActivitiesState;
