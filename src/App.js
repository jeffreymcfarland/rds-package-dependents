import React, { useEffect, useState } from "react";
import { searchPackageDependents } from "./SearchHandlers";

import DataTable from "@ramsey-design-system/data-table";
import Heading from "@ramsey-design-system/heading";
import Link from "@ramsey-design-system/link";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function App() {
  const [selectedQuery, setSelectedQuery] = useState("ramsey-design-system");
  const [rdsPackageNames] = useState([
    {
      name: "RDS",
      query: "ramsey-design-system",
    },
    { name: "Button", query: "ramsey-design-system+button" },
    { name: "Card", query: "ramsey-design-system+card" },
    { name: "Data Table", query: "ramsey-design-system+data-table" },
    { name: "Heading", query: "ramsey-design-system+heading" },
    { name: "Icon", query: "ramsey-design-system+icon" },
    { name: "Icons", query: "ramsey-design-system+icons" },
    { name: "Link", query: "ramsey-design-system+link" },
    { name: "Media Object", query: "ramsey-design-system+media-object" },
    { name: "Progress Bar", query: "ramsey-design-system+progress-bar" },
    { name: "Rich Text", query: "ramsey-design-system+rich-text" },
    { name: "Stack", query: "ramsey-design-system+stack" },
    { name: "Tag", query: "ramsey-design-system+tag" },
    { name: "Text", query: "ramsey-design-system+text" },
    { name: "Tokens", query: "ramsey-design-system+tokens" },
    { name: "(Legacy) Gazelle Design System", query: "gazelle-design-system" },
    { name: "(Legacy) Gazelle Design Tokens", query: "gazelle-design-tokens" },
  ]);
  const [dependents, setDependents] = useState([]);
  const [packageDependentsTotal, setTotal] = useState();

  const parseOrgRepos = async (packageQuery) => {
    let data;
    let dependentsArray = [];
    let count = 0;
    let page = 1;

    const loop = (items) => {
      items.forEach((item) => {
        if (item.repository.name !== "ramsey-design-system") {
          dependentsArray.push({
            repo: item.repository.name,
            url: item.repository.html_url,
          });
        }
      });
    };

    const search = async (query, pageCount) => {
      data = await searchPackageDependents(query, pageCount);
      const total = data.total_count;
      count += data.items.length;

      loop(data.items);

      if (total > count) {
        page += 1;
        search(query, page);
      }

      setTotal(dependentsArray.length);
      setDependents(dependentsArray);

      return;
    };

    search(packageQuery, page);
  };

  useEffect(() => {
    parseOrgRepos(selectedQuery);
  }, [selectedQuery]);

  return (
    <div className="App">
      <Heading
        level="1"
        size="large"
        style={{ padding: 24, textAlign: "center" }}
      >
        RDS Package Dependents
      </Heading>
      <DataTable size="large" striped>
        <DataTable.Head>
          <tr>
            <th>{packageDependentsTotal} Repositories</th>
            <th>
              <div style={{ display: "flex", justifyContent: "right" }}>
                <FormControl>
                  <InputLabel id="select-package-name">Package</InputLabel>
                  <Select
                    size="small"
                    labelId="select-package-name"
                    id="select"
                    value={selectedQuery}
                    label="Name"
                    onChange={(e) => {
                      setSelectedQuery(e.target.value);
                    }}
                    autoWidth
                  >
                    {rdsPackageNames.map((rdsPackage, index) => (
                      <MenuItem value={rdsPackage.query} key={index}>
                        {rdsPackage.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </th>
          </tr>
        </DataTable.Head>
        <DataTable.Body>
          {dependents.map((item, index) => (
            <tr key={index}>
              <td colSpan={2}>
                <Link href={item.url} target="_blank">
                  {item.repo}
                </Link>
              </td>
            </tr>
          ))}
        </DataTable.Body>
      </DataTable>
    </div>
  );
}

export default App;
