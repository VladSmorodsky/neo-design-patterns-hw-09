import { DataExporter } from "./DataExporter";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export class CsvExporter extends DataExporter {
  protected beforeRender(): void {
    this.result += "id,name,email,phone";
  }

  protected render(): string {
    return this.data
      .map((user) => `\n${user.id},${user.name},${user.email},${user.phone}`)
      .join("");
  }

  protected save(): void {
    const filePath = "./output/users.csv";
    const dir = dirname(filePath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(filePath, this.result, "utf-8");
  }
}
