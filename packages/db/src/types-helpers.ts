import type { Database } from "./types";

type PublicSchema = Database["public"];

type Tables = PublicSchema["Tables"];

type TableName = keyof Tables & string;

type TableFor<Name extends TableName> = Tables[Name];

export type TablesInsert<Name extends TableName> = TableFor<Name>["Insert"];
export type TablesUpdate<Name extends TableName> = TableFor<Name>["Update"];
export type TablesRow<Name extends TableName> = TableFor<Name>["Row"];
