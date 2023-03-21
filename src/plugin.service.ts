import axios from "axios";
const fs = require("fs");
const { errorPool } = require("./errors/errors");

export async function getDataFromPaginatedApi(
  nameOfFile: string,
  url: string,
  headers: Record<string, string>
): Promise<void> {
  let page = 0;
  let totalPages = 0;
  const stream = fs.createWriteStream(nameOfFile, { flags: "w" });

  stream.on("error", function (err: any) {
    console.error("There's been an error when creating the file" + err);
    stream.end();
  });

  try {
    stream.write("[");
    while (page <= totalPages) {
      const response = await axios.get(`${url}?page=${page}`, {
        headers: headers,
      });

      stream.write(
        JSON.stringify(response.data.data, null, "\t").replace(/[\[\]']+/g, "")
      );

      totalPages = Math.ceil(response.data.total / response.data.limit) - 1;
      page++;

      if (page <= totalPages) {
        stream.write(",");
      }
    }
    stream.write("]");
    stream.end();
  } catch (error) {
    handleServerError(error);
  }
}

export function handleServerError(error: any): void {
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.error
  ) {
    const serverError = error.response.data.error;
    console.error(errorPool(serverError));
  } else {
    console.error("Error making server request:", error);
  }
}

export function getJSON<T>(
  url: string,
  headers: Record<string, string>
): Promise<T> {
  return axios
    .get(`${url}`, {
      headers: headers,
    })
    .then<T>((response) => response.data.data);
}
