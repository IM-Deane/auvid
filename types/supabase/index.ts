import { Database as EventDB } from "./events";
import { Database as PublicDB } from "./public";

/**
 * Supbase `Event` interface maps to `events` schema
 */
export interface Event extends EventDB {}

/**
 * Supbase `Public` interface maps to `public` schema
 */
export interface Public extends PublicDB {}
