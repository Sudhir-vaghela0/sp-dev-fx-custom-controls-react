/* eslint-disable @rushstack/no-new-null */
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp";

let _context: WebPartContext | null = null;

export const setup = (context: WebPartContext): void => {
  _context = context;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sp.setup({ spfxContext: context as any });
};

export const getSP = (): typeof sp => sp;

export const getContext = (): WebPartContext => {
  if (!_context) throw new Error("PnPJsConfig: call setup(context) before using services");
  return _context;
};
