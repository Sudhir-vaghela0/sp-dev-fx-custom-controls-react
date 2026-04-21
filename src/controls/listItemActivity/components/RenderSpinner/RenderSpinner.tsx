import * as React from "react";
import { useActivityTimelineStyles } from "../ActivityTimeline/useActivityTimelineStyles";

const SKELETON_WIDTHS = [
  { name: "55%", desc: "35%" },
  { name: "70%", desc: "45%" },
  { name: "40%", desc: "60%" },
];

const RenderSpinner: React.FC = () => {
  const styles = useActivityTimelineStyles();

  return (
    <div>
      {SKELETON_WIDTHS.map((w, i) => (
        <div
          key={i}
          className={styles.skeletonItem}
          style={{ animationDelay: `${i * 80}ms`, opacity: 1 - i * 0.2 }}
        >
          <div className={styles.skeletonAvatar} style={{ animationDelay: `${i * 80}ms` }} />
          <div className={styles.skeletonContent}>
            <div
              className={styles.skeletonLine}
              style={{ height: 12, width: w.name, animationDelay: `${i * 80 + 40}ms` }}
            />
            <div
              className={styles.skeletonLine}
              style={{ height: 10, width: w.desc, animationDelay: `${i * 80 + 70}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderSpinner;
