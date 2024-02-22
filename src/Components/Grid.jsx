import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import "ag-grid-charts-enterprise";
// import "ag-grid-enterprise";

import axios from "axios";

export default function Grid() {
  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: 600, width: "100%" }), []);
  const paginationPageSize = 500;
  const paginationPageSizeSelector = [200, 500, 1000];
  const [rowData, setRowData] = useState();
  const [colDefs, setColDefs] = useState([
    {
      headerName: "Block Number",
      field: "blockNumber",
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Hash",
      field: "hash",
      sortable: true,
      filter: "agTextColumnFilter",
      chartType: "excluded",
    },
    {
      headerName: "To",
      field: "to",
      sortable: true,
      filter: "agTextColumnFilter",
      chartType: "excluded",
    },
    {
      headerName: "Value",
      field: "value",
      sortable: true,
      filter: "agTextColumnFilter",
      enableValue: true,
    },
    {
      headerName: "Gas",
      field: "gas",
      sortable: true,
      filter: "agTextColumnFilter",
      chartType: "series",
      enableValue: true,
    },
    {
      headerName: "Gas Price",
      field: "gasPrice",
      sortable: true,
      filter: "agTextColumnFilter",
      chartType: "series",
      enableValue: true,
    },
    {
      headerName: "Gas Used",
      field: "gasUsed",
      sortable: true,
      filter: "agTextColumnFilter",
      chartDataType: "series",
      enableValue: true,
    },
    {
      headerName: "Function Name",
      field: "functionName",
      sortable: true,
      filter: "agTextColumnFilter",
      chartType: "excluded",
    },
  ]);

  const onGridReady = useCallback((params) => {
    axios(
      "https://api.etherscan.io/api?module=account&action=txlist&address=0x6Fb447Ae94F5180254D436A693907a1f57696900&startblock=16689267&endblock=18982605&sort=asc&apikey=5S7KGZ79BUQ8YIJUVNTV3UWMQHCIPGQGSR"
    ).then((res) =>
      setRowData(
        res?.data?.result?.map((ele) => {
          return {
            ...ele,
            value: Number(ele.value),
            blockNumber: Number(ele.blockNumber),
            gasUsed: Number(ele.gasUsed),
            gasPrice: Number(ele.gasPrice),
            gas: Number(ele.gas),
          };
        })
      )
    );
  }, []);

  const onBtnExportCSV = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const icons = useMemo(() => {
    return {
      "custom-stats": '<span class="ag-icon ag-icon-custom-stats"></span>',
    };
  }, []);

  const sideBar = useMemo(() => {
    return {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
        },
        {
          id: "filters",
          labelDefault: "Filters",
          labelKey: "filters",
          iconKey: "filter",
          toolPanel: "agFiltersToolPanel",
        },
      ],
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      editable: false,
      flex: 1,
      minWidth: 100,

      enableRowGroup: true,
    };
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    params.api.createRangeChart({
      chartContainer: document.querySelector("#myChart"),
      cellRange: {
        columns: ["gasUsed", "gas"],
      },
      chartType: "groupedColumn",
      aggFunc: "sum",
    });
  }, []);

  const popupParent = useMemo(() => {
    return document.body;
  }, []);

  const chartThemeOverrides = useMemo(() => {
    return {
      common: {
        title: {
          enabled: true,
          text: "Gas used",
        },
      },
      bar: {
        axes: {
          category: {
            label: {
              rotation: 0,
            },
          },
        },
      },
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div className="wrapper">
        <div className="ag-theme-quartz" style={gridStyle}>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            icons={icons}
            sideBar={sideBar}
            reactiveCustomComponents
            ref={gridRef}
            pagination={true}
            paginationPageSize={paginationPageSize}
            paginationPageSizeSelector={paginationPageSizeSelector}
            onGridReady={onGridReady}
            enableCharts={true} // Enable charts
            enableRangeSelection={true}
            onFirstDataRendered={onFirstDataRendered}
            chartThemeOverrides={chartThemeOverrides}
            popupParent={popupParent}
          />
          <div id="myChart" className="ag-theme-quartz my-chart"></div>
        </div>
      </div>
    </div>
  );
}
