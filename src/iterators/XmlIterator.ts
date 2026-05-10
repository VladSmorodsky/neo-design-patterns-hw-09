import { createReadStream } from "fs";
import { UserData } from "../data/UserData";

export class XmlIterator implements AsyncIterable<UserData> {
  constructor(private filePath: string) {}

  async *[Symbol.asyncIterator](): AsyncGenerator<UserData> {
    const fileStream = createReadStream(this.filePath, "utf8");

    let data = "";
    for await (const chunk of fileStream) {
      data += chunk;
    }

    const userMatches = data.matchAll(/<user>(.*?)<\/user>/gs);

    for (const match of userMatches) {
      const userXml = match[1];

      const id = userXml.match(/<id>(.*?)<\/id>/)?.[1];
      const name = userXml.match(/<name>(.*?)<\/name>/)?.[1];
      const email = userXml.match(/<email>(.*?)<\/email>/)?.[1];
      const phone = userXml.match(/<phone>(.*?)<\/phone>/)?.[1];

      yield {
        id: id ? +id : 0,
        name: name || "",
        email: email || "",
        phone: phone || ""
      };
    }
  }
}
