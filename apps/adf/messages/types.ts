import type sharedEnUs from "../../../packages/i18n/shared/en-US.json";
import type localEnUs from "./en-US.json";

export type SharedAdfMessages = (typeof sharedEnUs)["adf"];
export type SharedLayoutMessages = SharedAdfMessages["layout"];

type LocalMessages = typeof localEnUs;
type LocalLayoutMessages = LocalMessages extends { layout: infer L } ? (L extends object ? L : Record<string, never>) : Record<string, never>;

export type LayoutMessages = SharedLayoutMessages & (LocalLayoutMessages extends { localeSwitcher?: infer L }
  ? { localeSwitcher?: L }
  : Record<string, never>);

export type AdfMessages = LocalMessages & { layout: LayoutMessages };
export type HomeMessages = AdfMessages["home"];
export type QuickstartMessages = AdfMessages["quickstart"];
