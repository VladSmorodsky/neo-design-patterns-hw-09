import { DataExporter } from "./DataExporter";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export class XmlExporter extends DataExporter {
  protected beforeRender(): void {
    this.result += `<?xml version="1.0" encoding="UTF-8"?>`;
  }

  protected render(): string {
    let usersTag = "<users>";

    this.data.forEach((user) => {
      const idTag = `<id>${user.id}</id>`;
      const nameTag = `<name>${user.name}</name>`;
      const emailTag = `<email>${user.email}</email>`;
      const phoneTag = `<phone>${user.phone}</phone>`;
      usersTag += `<user>${idTag}${nameTag}${emailTag}${phoneTag}</user>`;
    });

    usersTag += "</users>";

    return usersTag;
  }

  protected afterRender(): void {
    const now = new Date();
    const isoString = now.toISOString();
    this.result += `<!-- Експорт згенеровано: ${isoString} -->`;
  }

  protected save(): void {
    const filePath = "./output/users.xml";
    const dir = dirname(filePath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(filePath, this.result, "utf-8");
  }
}
