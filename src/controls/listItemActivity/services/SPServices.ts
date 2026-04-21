import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { getContext } from "./PnPJsConfig";
import { IItemActivity, IItemActivityStat, IListItem } from "../models/IItemActivity";
import { EListType } from "../models/EListType";

// ─── Result shapes ─────────────────────────────────────────────────────────────

export interface IListItemsResult {
  items: IListItem[];
  listId: string;
  listTitle: string;
  siteGraphId: string;
  listType: EListType;
}

export interface IActivitiesResult {
  betaActivities: IItemActivity[];
  v1Stats: IItemActivityStat[];
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class SPServices {
  private _graphClient: MSGraphClientV3 | null = null;

  private async _getGraphClient(): Promise<MSGraphClientV3> {
    if (!this._graphClient) {
      this._graphClient = await getContext().msGraphClientFactory.getClient("3");
    }
    return this._graphClient;
  }

  public getListItems = async (listId: string, siteUrl: string): Promise<IListItemsResult> => {
    const targetWeb = Web(siteUrl);
    const list = targetWeb.lists.getById(listId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listData: any = await list.select("Id", "Title", "BaseTemplate").get();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawItems: any[] = await list.items
      .select("Id", "Title", "FileRef", "FileLeafRef", "FSObjType", "Modified", "Editor/Title")
      .expand("Editor")
      .top(50)
      .get();
      

    const siteGraphId = await this._getGraphSiteId(siteUrl);

    let listType: EListType;
    if (listData.BaseTemplate === 101) {
      listType = EListType.DocumentLibrary;
    } else if (listData.BaseTemplate === 100) {
      listType = EListType.List;
    } else {
      throw new Error(`Unsupported list type: BaseTemplate ${listData.BaseTemplate}`);
    }

    const items: IListItem[] = rawItems.map((item) => ({
      id: String(item.Id),
      title: item.Title ?? item.FileLeafRef ?? "(untitled)",
      fileRef: item.FileRef,
      fileLeafRef: item.FileLeafRef,
      listId,
      siteGraphId,
      listType,
      modified: item.Modified,
      editor: item.Editor?.Title ?? "",
      isFolder: item.FSObjType === 1,
    }));

    return { items, listId: listData.Id, listTitle: listData.Title ?? "", siteGraphId, listType };
  };

  private _getGraphSiteId = async (siteUrl: string): Promise<string> => {
    const url = new URL(siteUrl);
    const client = await this._getGraphClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const siteInfo: any = await client
      .api(`/sites/${url.hostname}:${url.pathname}`)
      .select("id")
      .get();
    return siteInfo.id ?? "";
  };

  public getItemActivities = async (
    siteId: string,
    listId: string,
    itemId: string,
    listType: EListType,
  ): Promise<IActivitiesResult> => {
    const client = await this._getGraphClient();
    const listItemPath = `sites/${siteId}/lists/${listId}/items/${itemId}`;

    let betaActivities: IItemActivity[] = [];
    let v1Stats: IItemActivityStat[] = [];

    try {
      const betaPath =
        listType === EListType.DocumentLibrary
          ? `/${listItemPath}/driveItem/activities`
          : `/${listItemPath}/activities`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const betaResponse: any = await client.api(betaPath).version("beta").get();
      betaActivities = betaResponse?.value ?? betaResponse ?? [];
    } catch (e) {
      console.warn("[ItemActivity] Beta activities failed:", e);
    }

    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      const startStr = start.toISOString().split("T")[0];
      const endStr = end.toISOString().split("T")[0];
      const intervalSuffix = `getActivitiesByInterval(startDateTime='${startStr}',endDateTime='${endStr}',interval='day')`;

      const v1Path =
        listType === EListType.DocumentLibrary
          ? `/${listItemPath}/driveItem/${intervalSuffix}`
          : `/${listItemPath}/${intervalSuffix}`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const v1Response: any = await client.api(v1Path).version("v1.0").get();
      v1Stats = v1Response?.value ?? v1Response ?? [];
    } catch (e) {
      console.warn("[ItemActivity] Interval stats failed:", e);
    }

    return { betaActivities, v1Stats };
  };
}
