import { Type } from "@sinclair/typebox";
import { AccountType } from "../generated/prisma/client.js";

export interface UserIdentity {
	id: string;
	email: string;
}

export const AccountTypeSchema = Type.Enum(AccountType);
