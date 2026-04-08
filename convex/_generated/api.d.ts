/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ResendOTP from "../ResendOTP.js";
import type * as auth from "../auth.js";
import type * as foods from "../foods.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as mealEntries from "../mealEntries.js";
import type * as mealTemplates from "../mealTemplates.js";
import type * as quickAdds from "../quickAdds.js";
import type * as stats from "../stats.js";
import type * as userGoals from "../userGoals.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  auth: typeof auth;
  foods: typeof foods;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  mealEntries: typeof mealEntries;
  mealTemplates: typeof mealTemplates;
  quickAdds: typeof quickAdds;
  stats: typeof stats;
  userGoals: typeof userGoals;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
