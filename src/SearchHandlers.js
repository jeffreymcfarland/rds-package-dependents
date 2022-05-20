import { Octokit } from "@octokit/core";

export const searchPackageDependents = async (name) => {
  const octokit = new Octokit({
    auth: process.env.REACT_APP_ACCESS_TOKEN,
  });

  const response = await octokit.request("GET /search/code", {
    headers: {
      authorization: process.env.REACT_APP_ACCESS_TOKEN,
    },
    q: `ramsey-design-system+${
      name ? name + "+" : ""
    }filename:package+org:lampo`,
    per_page: 100,
  });

  return response.data;
};
