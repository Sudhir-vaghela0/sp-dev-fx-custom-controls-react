import { MSGraphClientV3 } from "@microsoft/sp-http";
import { getContext } from "./PnPJsConfig";
import { IItemActivity } from "../models/IItemActivity";
import { EListType } from "../models/EListType";

// ─── Service ──────────────────────────────────────────────────────────────────

export class SPServices {
  private _graphClient: MSGraphClientV3 | null = null;

  private async _getGraphClient(): Promise<MSGraphClientV3> {
    if (!this._graphClient) {
      this._graphClient = await getContext().msGraphClientFactory.getClient("3");
    }
    return this._graphClient;
  }


  public getGraphSiteId = async (siteUrl: string): Promise<string> => {
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
  ): Promise<IItemActivity[]> => {
    const client = await this._getGraphClient();
    const listItemPath = `sites/${siteId}/lists/${listId}/items/${itemId}`;

    const path =
      listType === EListType.DocumentLibrary
        ? `/${listItemPath}/driveItem/activities`
        : `/${listItemPath}/activities`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await client.api(path).version("beta").get();
    const raw = response?.value ?? response ?? [];
    return Array.isArray(raw) ? raw : [];
  };
}
