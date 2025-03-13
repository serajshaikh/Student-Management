import { randomBytes } from "crypto";
import { ulid } from "ulid";

export class CommonUtils {

    /**
     * @description Method to generate unique ULID
     * @param prefix , prefix to be added to the generated ULID
     * @returns unique ULID
     */
    public static genUlid(prefix: string): string {
        return prefix.toUpperCase() + "-" + ulid() + randomBytes(4).toString("hex").toUpperCase();
    }

}