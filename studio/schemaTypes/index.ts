import { archive } from "./archive";
import { info } from "./info";

export const schemaTypes = [archive, info];

export const singletonTypes = new Set<string>(schemaTypes.map((type) => type.name));
