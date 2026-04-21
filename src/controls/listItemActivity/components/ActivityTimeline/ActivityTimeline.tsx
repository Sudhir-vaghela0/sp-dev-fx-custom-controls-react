import * as React from "react";
import { Icon } from "@fluentui/react";
import { useContext } from "react";
import { ListItemActivityStateContext } from "../ListItemActivityStateProvider/ListItemActivityStateProvider";
import { IItemActivity } from "../../models/IItemActivity";
import useActivitiesState from "../../hooks/useActivitiesState";
import ActivityItem from "./ActivityItem";
import { useActivityTimelineStyles } from "./useActivityTimelineStyles";
import RenderSpinner from "../RenderSpinner/RenderSpinner";
import RenderError from "../RenderError/RenderError";
import RenderNoActivities from "../RenderNoActivities/RenderNoActivities";

// ─── Time period grouping ─────────────────────────────────────────────────────

function getTimePeriod(dateStr: string): string {
  if (!dateStr) return "Earlier";
  const date = new Date(dateStr);
  const now = new Date();

  // Start of this week (Monday)
  const startOfWeek = new Date(now);
  const day = now.getDay();
  startOfWeek.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfWeek.getDate() - 7);

  if (date >= startOfWeek) return "This week";
  if (date >= startOfLastWeek) return "Last week";
  return "Earlier";
}

function groupActivities(activities: IItemActivity[]): { period: string; items: IItemActivity[] }[] {
  const order = ["This week", "Last week", "Earlier"];
  const map: Record<string, IItemActivity[]> = {};

  for (const activity of activities) {
    const period = getTimePeriod(activity.times?.recordedDateTime);
    if (!map[period]) map[period] = [];
    map[period].push(activity);
  }

  return order.filter((p) => map[p]?.length > 0).map((period) => ({ period, items: map[period] }));
}

// ─── Main component ───────────────────────────────────────────────────────────

const ActivityTimeline: React.FC = () => {
  const styles = useActivityTimelineStyles();
  const { listItemActivityState } = useContext(ListItemActivityStateContext);
  const { loadMore } = useActivitiesState();

  const { activities, isLoading, errorInfo, pageInfo } = listItemActivityState;

  if (isLoading) return <RenderSpinner />;
  if (errorInfo?.showError) return <RenderError error={errorInfo.error} />;
  if (!activities.length) return <RenderNoActivities />;

  const groups = groupActivities(activities);

  return (
    <div>

      {groups.map((group) => (
        <div key={group.period}>
          <span className={styles.sectionLabel}>{group.period}</span>
          <div className={styles.timelineContainer}>
            {group.items.map((activity, idx) => (
              <ActivityItem key={activity.id} activity={activity} index={idx} />
            ))}
          </div>
        </div>
      ))}

      {/* ── Load more ────────────────────────────────────────────────── */}
      {pageInfo.hasMore && (
        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMoreBtn} onClick={loadMore}>
            <Icon iconName="ChevronDown" styles={{ root: { fontSize: 10 } }} />
            Show more
          </button>
        </div>
      )}

    </div>
  );
};

export default ActivityTimeline;
