import { describe, expect, jest, test } from "@jest/globals";
import { DummyAPIPlugin } from "../src/dummyapi-plugin";
import axios from "axios";
require("dotenv").config();

const { errorPool } = require("../src/errors/errors");
const wrongAppID = "wrong-app-id";
const correctAppID = process.env.DUMMYAPI_APP_ID || "6412de19a85b52d38209d6af";

describe("Check connectivity", () => {
  test("Connectivity check should succeed", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    const dummyApiPlugin = new DummyAPIPlugin(correctAppID);

    await dummyApiPlugin.checkConnectivity();
    expect(consoleSpy).toHaveBeenCalledWith("Successful connection!");
  });

  test("Connectivity check should fail due to wrong app-id", async () => {
    const consoleSpy = jest.spyOn(console, "error");
    const dummyApiPlugin = new DummyAPIPlugin(wrongAppID);

    await dummyApiPlugin.checkConnectivity();
    expect(consoleSpy).toHaveBeenCalledWith(errorPool("APP_ID_NOT_EXIST"));
  });

  test("Connectivity check should fail due to no app-id header", async () => {
    const consoleSpy = jest.spyOn(console, "error");
    const dummyApiPlugin = new DummyAPIPlugin(wrongAppID);
    dummyApiPlugin.headers = {};

    await dummyApiPlugin.checkConnectivity();
    expect(consoleSpy).toHaveBeenCalledWith(errorPool("APP_ID_MISSING"));
  });
});

// Uncomment only if skipping tests above
// jest.mock("axios");

xdescribe("getUsers()", () => {
  xtest("Get error on /GET getUsers() ", async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockRejectedValue(new Error("This is an error"));
    const consoleSpy = jest.spyOn(console, "error");
    const dummyApiPlugin = new DummyAPIPlugin(correctAppID);

    await dummyApiPlugin.getUsers();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error making server request:",
      new Error("This is an error")
    );
  });
});
