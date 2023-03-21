import axios from "axios";
import { handleServerError } from "./plugin.service";

export abstract class Plugin {
  headers: Record<string, string>;

  constructor(headers: Record<string, string>) {
    this.headers = headers;
  }

  protected async checkConnectivity(url: string): Promise<void> {
    await axios
      .get(url, {
        headers: this.headers,
      })
      .then(() => console.log("Successful connection!"))
      .catch((error) => {
        handleServerError(error);
      });
  }
}
