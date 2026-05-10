import { CsvIterator } from "./iterators/CsvIterator";
import { JsonIterator } from "./iterators/JsonIterator";
import { XmlIterator } from "./iterators/XmlIterator";

async function main() {
  console.log("--- CSV ---");
  for await (const user of new CsvIterator("./output/users.csv")) {
    console.log(user);
  }
  console.log("--- JSON ---");
  for await (const user of new JsonIterator("./output/users.json")) {
    console.log(user);
  }
  console.log("--- XML ---");
  for await (const user of new XmlIterator("./output/users.xml")) {
    console.log(user);
  }
}

main().catch(console.error);
