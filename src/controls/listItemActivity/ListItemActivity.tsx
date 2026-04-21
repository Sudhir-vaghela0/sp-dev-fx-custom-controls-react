import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { EListType } from "./models/EListType";
import { AppContext } from "./common/AppContext";
import { setup } from "./services/PnPJsConfig";
import { ListItemActivityStateProvider } from "./components/ListItemActivityStateProvider/ListItemActivityStateProvider";
import ActivityTimeline from "./components/ActivityTimeline/ActivityTimeline";
import { useActivityTimelineStyles } from "./components/ActivityTimeline/useActivityTimelineStyles";

// ─── Props ─────────────────────────────────────────────────────────────────────

export interface IListItemActivityProps {
  /** SPFx WebPartContext — required to initialise PnP JS and MSGraphClient */
  context: WebPartContext;
  /** Absolute URL of the SharePoint site (e.g. https://contoso.sharepoint.com/sites/MySite) */
  webUrl: string;
  /** GUID of the SharePoint list */
  listId: string;
  /** Numeric item ID (as string) */
  itemId: string;
  /** Graph site ID — "{hostname},{siteId},{webId}" */
  siteId: string;
  /** Whether the list is a document library or a regular list */
  listType: EListType;
  /** Optional display name of the item */
  title?: string;
  /** Optional label above the timeline */
  label?: string;
  /** Activities per page (default: 10) */
  numberActivitiesPerPage?: number;
}

// ─── Inner header — reads live count from state context ────────────────────────

const ActivityHeader: React.FC<{ label: string; title?: string }> = ({ label, title }) => {
  const styles = useActivityTimelineStyles();

  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>{label}</div>
      {title && (
        <div className={styles.headerSubtitle} title={title}>
          {title}
        </div>
      )}
    </div>
  );
};

// ─── Main control ──────────────────────────────────────────────────────────────

/**
 * ListItemActivity — reusable SPFx control that displays the Microsoft Graph
 * activity timeline for a SharePoint list item or document library file.
 *
 * Usage mirrors @pnp/spfx-controls-react/ListItemComments:
 *
 *   <ListItemActivity
 *     serviceScope={serviceScope}
 *     webUrl="https://contoso.sharepoint.com/sites/MySite"
 *     listId="dfa283f4-5faf-4d54-b6b8-5bcaf2725af5"
 *     itemId="42"
 *     siteId="contoso.sharepoint.com,abc123,def456"
 *     listType={EListType.List}
 *     label="Item Activity"
 *     numberActivitiesPerPage={10}
 *   />
 */
export const ListItemActivity: React.FC<IListItemActivityProps> = ({
  context,
  webUrl,
  listId,
  itemId,
  siteId,
  listType,
  title,
  label = "Item Activity",
  numberActivitiesPerPage = 10,
}) => {
  const styles = useActivityTimelineStyles();

  // Must run synchronously before children mount — children's effects fire before parent effects,
  // so useEffect here would be too late when useActivitiesState tries to call MSGraphClient.
  setup(context);

  const appContext = React.useMemo(
    () => ({
      context,
      webUrl,
      listId,
      itemId,
      siteId,
      listType,
      numberActivitiesPerPage,
      label,
      title,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listId, itemId, siteId, listType, numberActivitiesPerPage, label, title, webUrl],
  );

  return (
    <AppContext.Provider value={appContext}>
      <ListItemActivityStateProvider numberActivitiesPerPage={numberActivitiesPerPage}>
        <div className={styles.root}>
          <ActivityHeader label={label} title={title} />
          <ActivityTimeline />
        </div>
      </ListItemActivityStateProvider>
    </AppContext.Provider>
  );
};

export default ListItemActivity;
