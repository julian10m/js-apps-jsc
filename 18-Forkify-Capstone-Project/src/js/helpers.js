import { async } from "regenerator-runtime";
import { TIMEOUT_SECONDS } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

export const getJSON = async function(url) {
    try {
        const req = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
        const data = await req.json();
        if(!req.ok) throw new Error(`${data.message} ${req.status}`);
        return data;
    } catch (err) {
        throw err;
    }
}