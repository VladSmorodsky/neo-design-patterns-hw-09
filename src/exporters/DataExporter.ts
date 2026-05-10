import { UserData } from "../data/UserData";
import fetch from "node-fetch";

export abstract class DataExporter {
  protected data: UserData[] = [];
  protected result: string = "";
  protected userApiURL = "https://jsonplaceholder.typicode.com/users";

  public async export() {
    await this.load();
    this.transform();
    this.beforeRender();
    this.result += this.render();
    this.afterRender();
    this.save();
  }

  protected async load() {
    const response = await fetch(this.userApiURL);
    this.data = (await response.json()) as UserData[];
  }

  protected transform() {
    this.data = this.data
      .map(
        (user) =>
          ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
          }) as UserData,
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  protected beforeRender() {
    // hook
  }

  protected afterRender() {
    // hook
  }

  protected abstract render(): string;
  protected abstract save(): void;
}
