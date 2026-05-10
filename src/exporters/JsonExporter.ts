import { DataExporter } from "./DataExporter";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export class JsonExporter extends DataExporter {
  protected render(): string {
    return JSON.stringify(this.data);
  }

  protected save(): void {
    const filePath = "./output/users.json";
    const dir = dirname(filePath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(filePath, this.result, "utf-8");
  }
}
