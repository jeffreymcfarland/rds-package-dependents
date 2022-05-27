import { Octokit } from "@octokit/core";

export const searchPackageDependents = async (query, page) => {
  const octokit = new Octokit({
    auth: process.env.REACT_APP_ACCESS_TOKEN,
  });

  const response = await octokit.request("GET /search/code", {
    headers: {
      authorization: process.env.REACT_APP_ACCESS_TOKEN,
    },
    q: `${query}+filename:package+org:lampo`,
    per_page: 100,
    page: page,
  });

  return response.data;
};
