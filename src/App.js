import React, { useEffect, useState } from "react";
import { searchPackageDependents } from "./SearchHandlers";

import DataTable from "@ramsey-design-system/data-table";
import Heading from "@ramsey-design-system/heading";
import Link from "@ramsey-design-system/link";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function App() {
  const [selectedName, setSelectedName] = useState("RDS");
  const [rdsPackageNames] = useState([
    "RDS",
    "Button",
    "Card",
    "Data Table",
    "Heading",
    "Icon",
    "Icons",
    "Link",
    "Media Object",
    "Progress Bar",
    "Rich Text",
    "Stack",
    "Tag",
    "Text",
    "Tokens",
  ]);
  const [dependents, setDependents] = useState([]);
  const [packageDependentsTotal, setTotal] = useState();

  const parseOrgRepos = async (packageName) => {
    let data;
    let dependentsArray = [];
    if (packageName === "RDS") {
      data = await searchPackageDependents();
      data.items.forEach((item) => {
        if (item.repository.name !== "ramsey-design-system") {
          dependentsArray.push({
            repo: item.repository.name,
            url: item.repository.html_url,
          });
        }
      });
      setTotal(dependentsArray.length);
      setDependents(dependentsArray);
    } else {
      data = await searchPackageDependents(packageName.split(" ").join(""));
      data.items.forEach((item) => {
        if (item.repository.name !== "ramsey-design-system") {
          dependentsArray.push({
            repo: item.repository.name,
            url: item.repository.html_url,
          });
        }
      });
      setTotal(dependentsArray.length);
      setDependents(dependentsArray);
    }
  };

  useEffect(() => {
    parseOrgRepos(selectedName);
  }, [selectedName]);

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
                    value={selectedName}
                    label="Name"
                    onChange={(e) => {
                      setSelectedName(e.target.value);
                    }}
                    autoWidth
                  >
                    {rdsPackageNames.map((name, index) => (
                      <MenuItem value={name} key={index}>
                        {name}
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
