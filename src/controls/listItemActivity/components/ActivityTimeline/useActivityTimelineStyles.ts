import { keyframes, mergeStyleSets } from "@fluentui/react";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(6px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const shimmer = keyframes({
  "0%": { backgroundPosition: "-400px 0" },
  "100%": { backgroundPosition: "400px 0" },
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useActivityTimelineStyles = () =>
  mergeStyleSets({

    // ── Root ──────────────────────────────────────────────────────────────────

    root: {
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    },

    // ── Header ────────────────────────────────────────────────────────────────

    header: {
      paddingBottom: 20,
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: 700,
      color: "#201f1e",
      lineHeight: "1.2",
    },

    headerSubtitle: {
      fontSize: 12,
      color: "#605e5c",
      marginTop: 4,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap" as const,
    },

    // ── Section label (e.g. "This week") ──────────────────────────────────────

    sectionLabel: {
      fontSize: 13,
      fontWeight: 400,
      color: "#605e5c",
      marginBottom: 8,
      marginTop: 16,
      display: "block",
      selectors: {
        ":first-child": {
          marginTop: 0,
        },
      },
    },

    // ── Timeline container ────────────────────────────────────────────────────

    timelineContainer: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 8,
    },

    // ── Single activity item ──────────────────────────────────────────────────

    item: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "12px 16px",
      background: "#f3f2f1",
      borderRadius: 8,
      animation: `${fadeIn} 0.25s ease both`,
    },

    // ── Icon box ──────────────────────────────────────────────────────────────

    iconBox: {
      width: 36,
      height: 36,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#5b5ea6",
      fontSize: 20,
    },

    // ── Text section ──────────────────────────────────────────────────────────

    textSection: {
      flex: 1,
      minWidth: 0,
    },

    primaryLine: {
      fontSize: 14,
      color: "#201f1e",
      lineHeight: "1.4",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap" as const,
    },

    actorBold: {
      fontWeight: 600,
    },

    timestamp: {
      fontSize: 12,
      color: "#605e5c",
      marginTop: 2,
      display: "block",
    },

    // ── Load more ─────────────────────────────────────────────────────────────

    loadMoreWrapper: {
      display: "flex",
      justifyContent: "center",
      paddingTop: 12,
    },

    loadMoreBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 16px",
      border: "1px solid #edebe9",
      borderRadius: 4,
      background: "#ffffff",
      fontSize: 13,
      fontWeight: 400,
      color: "#323130",
      cursor: "pointer",
      outline: "none",
      selectors: {
        ":hover": {
          background: "#f3f2f1",
          borderColor: "#c8c6c4",
        },
      },
    },

    // ── Skeleton loader ───────────────────────────────────────────────────────

    skeletonItem: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "12px 16px",
      background: "#f3f2f1",
      borderRadius: 8,
      marginBottom: 8,
      animation: `${fadeIn} 0.25s ease both`,
    },

    skeletonAvatar: {
      width: 36,
      height: 36,
      borderRadius: 8,
      flexShrink: 0,
      backgroundImage: `linear-gradient(90deg, #e1dfdd 25%, #d7d5d3 50%, #e1dfdd 75%)`,
      backgroundSize: "800px 100%",
      animation: `${shimmer} 1.5s infinite linear`,
    },

    skeletonContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
      gap: 8,
    },

    skeletonLine: {
      borderRadius: 4,
      backgroundImage: `linear-gradient(90deg, #e1dfdd 25%, #d7d5d3 50%, #e1dfdd 75%)`,
      backgroundSize: "800px 100%",
      animation: `${shimmer} 1.5s infinite linear`,
    },
  });
