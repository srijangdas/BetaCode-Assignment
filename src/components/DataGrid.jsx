import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function DataGrid() {
  //Here, Filters are taken from React-Table Docs and ChatGPT both.
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);

  //Axios For getting API result
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://jsonplaceholder.typicode.com/comments")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  //Defined column name and Key, used in <th> mapping and key value pair match from JSON</th>
  const columns = useMemo(
    () => [
      { header: "ID", accessorKey: "id" },
      { header: "Post ID", accessorKey: "postId" },
      { header: "Name", accessorKey: "name" },
      { header: "Email", accessorKey: "email" },
      { header: "Body", accessorKey: "body" },
    ],
    []
  );

  //Each added from docs as required, all are ad-ins for Row Sorting, etc
  //this table already includes all the data(rows) of the tabel
  //column name, and sorting logic
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter, //Search Box function
    getCoreRowModel: getCoreRowModel(), //base table model
    getSortedRowModel: getSortedRowModel(), //asc-desc sorting
    getFilteredRowModel: getFilteredRowModel(), //for filtering row acc. to search bar
    getPaginationRowModel: getPaginationRowModel(), //divides x rows into pages
    globalFilterFn: (row, columnId, filterValue) => {
      //Defines how search bar access columns
      const rowValues = Object.values(row.original).join(" ").toLowerCase(); //all the data of that row
      return rowValues.includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="p-10">
      <h2 className="text-4xl">Data Grid: </h2>
      <div className="py-8 w-full flex gap-5">
        <input
          placeholder="Search..."
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="px-5 w-xl h-10"
        />
        <button
          div
          className="px-5 w-30 h-10"
          onClick={() => setGlobalFilter("")}
        >
          Clear
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          {/* Logic of Rows starts from here */}

          <p className="text-10 w-full">
            Tip: Click on header to sort accordingly, default sorted by ID
          </p>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {/* Handling Header of the table */}
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        border: "1px solid #ccc",
                        textAlign: "left",
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                      }}
                      className="px-2 h-10 bg-primary"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {/* render name of the header, getContext() displays Name */}
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" && " 🔼"}
                      {header.column.getIsSorted() === "desc" && " 🔽"}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {/* Getting each row via mapping rowmodel */}
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{ padding: 6, border: "1px solid #eee" }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Logic */}
      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </button>
        <span style={{ margin: "0 8px" }}>
          Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          style={{ marginLeft: 8 }}
          className="px-5 w-30 h-10 bg-primary"
        >
          {[10, 20, 50, 100].map((sz) => (
            <option key={sz} value={sz}>
              {sz} / {data.length}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
