import { createReadStream } from "fs";
import { createInterface } from "readline";
import { UserData } from "../data/UserData";

export class CsvIterator implements AsyncIterable<UserData> {
  constructor(private filePath: string) {}

  async *[Symbol.asyncIterator](): AsyncGenerator<UserData> {
    const fileStream = createReadStream(this.filePath, "utf8");
    const lines = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let isFirstLine = true;
    for await (const line of lines) {
      if (isFirstLine) {
        isFirstLine = false;
        continue; // Skip header
      }

      const data = line.split(",");
      yield {
        id: +data[0],
        name: data[1],
        email: data[2],
        phone: data[3],
      } as UserData;
    }
  }
}
