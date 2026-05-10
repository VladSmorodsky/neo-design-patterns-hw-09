import { createReadStream } from "fs";
import { UserData } from "../data/UserData";

export class JsonIterator implements AsyncIterable<UserData> {
  constructor(private filePath: string) {}

  async *[Symbol.asyncIterator](): AsyncGenerator<UserData> {
    const fileStream = createReadStream(this.filePath, "utf8");

    let data = "";
    for await (const chunk of fileStream) {
      data += chunk;
    }

    const users: UserData[] = JSON.parse(data);
    for (const user of users) {
      yield user;
    }
  }
}
