import * as React from "react";
import { useContext } from "react";
import { Icon } from "@fluentui/react";
import { IItemActivity } from "../../models/IItemActivity";
import { useActivityTimelineStyles } from "./useActivityTimelineStyles";
import { AppContext } from "../../common";

// ─── Action config ────────────────────────────────────────────────────────────

interface IActionConfig {
  iconName: string;
  label: (action: IItemActivity["action"]) => string;
}

const ACTION_MAP: Record<string, IActionConfig> = {
  create: {
    iconName: "Add",
    label: () => "created",
  },
  edit: {
    iconName: "Edit",
    label: () => "edited",
  },
  delete: {
    iconName: "Delete",
    label: () => "deleted",
  },
  move: {
    iconName: "MoveToFolder",
    label: (a) => (a.move ? `moved from "${a.move.from}"` : "moved"),
  },
  rename: {
    iconName: "Rename",
    label: (a) => (a.rename?.newName ? `renamed to "${a.rename.newName}"` : "renamed"),
  },
  restore: {
    iconName: "ReturnToSession",
    label: () => "restored",
  },
  share: {
    iconName: "Share",
    label: (a) => {
      const r = a.share?.recipients ?? [];
      if (!r.length) return "shared";
      const names = r.slice(0, 2).map((x) => x.user?.displayName ?? x.group?.displayName ?? "someone").join(", ");
      return `shared with ${names}${r.length > 2 ? ` +${r.length - 2}` : ""}`;
    },
  },
  version: {
    iconName: "History",
    label: (a) => (a.version ? `created version ${a.version.newVersion}` : "created a new version"),
  },
  mention: {
    iconName: "Mention",
    label: () => "mentioned someone",
  },
  comment: {
    iconName: "Comment",
    label: (a) => (a.comment?.isReply ? "replied to a comment" : "commented on"),
  },
};

const DEFAULT_ACTION: IActionConfig = {
  iconName: "ActivityFeed",
  label: () => "performed an activity",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getActionKey(action: IItemActivity["action"]): string {
  return Object.keys(action ?? {}).find((k) => action[k as keyof typeof action] !== undefined) ?? "";
}

export function formatOOBTimestamp(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return `Today at ${time}`;
  if (diffDays === 1) return `Yesterday at ${time}`;
  if (diffDays < 7) return `${date.toLocaleDateString([], { weekday: "long" })} at ${time}`;
  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} at ${time}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface IActivityItemProps {
  activity: IItemActivity;
  index?: number;
}

const ActivityItem: React.FC<IActivityItemProps> = ({ activity, index = 0 }) => {
  const styles = useActivityTimelineStyles();
  const { title: itemTitle } = useContext(AppContext);
  const actionKey = getActionKey(activity.action ?? {});
  const config = ACTION_MAP[actionKey] ?? DEFAULT_ACTION;

  const actor = activity.actor?.user ?? activity.actor?.application ?? activity.actor?.device;
  const actorName = actor?.displayName ?? "Unknown user";

  const rawLabel = config.label(activity.action ?? {});
  const actionLabel =
    actionKey === "rename" && rawLabel === "renamed" && itemTitle
      ? `renamed to ${itemTitle}`
      : rawLabel;
  const timestamp = formatOOBTimestamp(activity.times?.recordedDateTime);

  return (
    <div className={styles.item} style={{ animationDelay: `${index * 50}ms` }}>

      {/* ── Action icon ─────────────────────────────────────────────── */}
      <div className={styles.iconBox}>
        <Icon iconName={config.iconName} />
      </div>

      {/* ── Text ────────────────────────────────────────────────────── */}
      <div className={styles.textSection}>
        <div className={styles.primaryLine}>
          <span className={styles.actorBold}>{actorName}</span>
          {" "}
          {actionLabel}
        </div>
        <span className={styles.timestamp}>{timestamp}</span>
      </div>

    </div>
  );
};

export default ActivityItem;
