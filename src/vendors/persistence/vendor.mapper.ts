import { Vendor } from "../domain/vendor";
import { VendorEntity } from "./vendor.entity";

export class VendorMapper {
  static toDomain(raw: VendorEntity): Vendor {
    raw = raw.get({ plain: true });
    const vendor = new Vendor();
    vendor.id = raw.id;
    vendor.name = raw.name;
    vendor.createdAt = raw.createdAt;
    vendor.updatedAt = raw.updatedAt;
    return vendor;
  }

  static toPersistence(vendor: Vendor) {
    return vendor;
  }
}