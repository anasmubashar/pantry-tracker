import React, { useState } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { Container, Box } from "@mui/material";

// Define the type for a row
interface RowData {
  id: number;
  item: string;
  quantity: number;
  expiry: string;
}

interface DataTableProps {
  rows: RowData[];
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90, sortable: true },
  {
    field: "item",
    headerName: "item",
    width: 150,
    editable: true,
    sortable: true,
  },
  {
    field: "quantity",
    headerName: "quantity",
    type: "number",
    width: 110,
    editable: true,
    sortable: true,
  },
  {
    field: "expiry",
    headerName: "expiry",
    width: 200,
    editable: true,
    sortable: true,
  },
];

// const rows: RowData[] = [
//   { id: 1, name: "John Doe", age: 35, address: "123 Main St" },
//   { id: 2, name: "Jane Smith", age: 42, address: "456 Maple Ave" },
//   { id: 3, name: "Alice Johnson", age: 28, address: "789 Elm St" },
//   { id: 4, name: "Bob Brown", age: 50, address: "101 Pine St" },
// ];

const DataTable: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const handleRowSelection = (selectionModel: GridRowSelectionModel) => {
    setSelectedRows(selectionModel);
  };

  return (
    <Container>
      <Box sx={{ height: 400, width: "100%", marginTop: 4 }}>
        <DataGrid
          // rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          //   experimentalFeatures={{ newEditingApi: true }}
          sortingOrder={["asc", "desc", null]}
          onRowSelectionModelChange={(newSelection) =>
            handleRowSelection(newSelection)
          }
        />
      </Box>
    </Container>
  );
};

export default DataTable;
