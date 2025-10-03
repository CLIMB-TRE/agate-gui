import { useMemo, useCallback } from "react";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
  SuppressKeyboardEventParams,
  themeQuartz,
} from "ag-grid-community";

import { IngestionItem } from "./IngestionItem";

// Register all community features once in your app entry point
ModuleRegistry.registerModules([AllCommunityModule]);

function status(s: string): string {
  switch (s) {
    case "US":
      return "Unstarted";
    case "MD":
      return "Awaiting metadata checks";
    case "VD":
      return "Awaiting validation Checks";
    case "FM":
      return "Metadata checks failed";
    case "FV":
      return "Validation checks failed";
    case "SU":
      return "Success";
    default:
      return "Unknown";
  }
}

function bool_icon(b: boolean): string {
  return b ? "✓" : "✗";
}

export function ResultsTable({
  httpPathHandler,
  data,
  handleRefreshClick,
}: {
  httpPathHandler: (path: string) => Promise<Response>;
  data: IngestionItem[];
  handleRefreshClick: () => void;
}) {
  const archive = useCallback(
    (uuid: string) => {
      httpPathHandler(`archive/${uuid}`).then(() => handleRefreshClick());
    },
    [httpPathHandler, handleRefreshClick],
  );

  const delete_record = useCallback(
    (uuid: string) => {
      httpPathHandler(`delete/${uuid}`).then(() => handleRefreshClick());
    },
    [httpPathHandler, handleRefreshClick],
  );

  // Define AG Grid columns
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Name",
        field: "name",
        flex: 1,
        cellRenderer: (params: CustomCellRendererProps) =>
          `${params.data.name} (${params.data.uuid.slice(-5)})`,
      },
      { headerName: "Platform", field: "platform", flex: 1 },
      {
        headerName: "Status",
        field: "status",
        flex: 1.5,
        tooltipField: "error_message",
        cellRenderer: (params: CustomCellRendererProps) => {
          return (
            <div className="agate-progress-wrapper">
              <span className="agate-progress-label">
                {status(params.value)}
              </span>
              <div className="agate-progress-bar">
                <div className={`agate-progress-fill ${params.value}`} />
              </div>
            </div>
          );
        },
      },
      {
        headerName: "Published",
        field: "is_published",
        flex: 1,
        cellRenderer: (params: CustomCellRendererProps) =>
          bool_icon(params.value),
      },
      {
        headerName: "Test Attempt",
        field: "is_test_attempt",
        flex: 1,
        cellRenderer: (params: CustomCellRendererProps) =>
          bool_icon(params.value),
      },
      {
        headerName: "Actions",
        field: "uuid",
        flex: 1.5,
        cellRenderer: (params: CustomCellRendererProps) => (
          <div>
            <button
              className="agate-row-button"
              tabIndex={0} // To allow focussing with keyboard
              onClick={() => archive(params.value)}
            >
              Archive
            </button>
            <button
              className="agate-row-button"
              tabIndex={0} // To allow focussing with keyboard
              onClick={() => delete_record(params.value)}
            >
              Delete
            </button>
          </div>
        ),
        // We need to tell AG Grid to not supress any tabs for this
        // column so that we can focus on the buttons inside it with
        // the keyboard
        suppressKeyboardEvent: (params: SuppressKeyboardEventParams) => {
          const e = params.event as KeyboardEvent;
          const key = e.key;

          // Allow arrow keys to move focus even if a button inside is focused
          if (
            key === "ArrowLeft" ||
            key === "ArrowRight" ||
            key === "ArrowUp" ||
            key === "ArrowDown"
          ) {
            return false; // don't suppress → let AG Grid handle it
          }

          // Let other keys (Enter, Space) behave normally inside the button
          return true;
        },
        cellStyle: {
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
        },
      },
    ],
    [archive, delete_record],
  );

  return (
    <AgGridReact
      className="agate-table"
      rowData={data}
      columnDefs={columnDefs}
      rowHeight={40}
      pagination={true}
      theme={themeQuartz}
      paginationAutoPageSize={true}
    />
  );
}
