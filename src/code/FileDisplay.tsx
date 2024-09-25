import {SigningOrder} from "../models/signingOrder";
import {DataGrid, useGridApiRef} from '@mui/x-data-grid';
import { SigningOrderColumns } from "../models/signingOrderColumns";
import {useEffect, useState} from "react";
import { Button, darken, lighten, styled } from "@mui/material";


interface FileDisplayProps {
    orders: Array<SigningOrder>;
    handleInsert: (signingOrder: SigningOrder, signingOrders: Array<SigningOrder>) => void;
    canLoadValues: boolean;
  }
  
  const FileDisplay: React.FC<FileDisplayProps> = (props: FileDisplayProps) => {
    
    const [orders, setOrders] = useState<Array<SigningOrder>>(props.orders);
    const [page, setPage] = useState<number>(0);
    const [showInsertButton, setShowInsertButton] = useState<boolean>(false);
    const apiRef = useGridApiRef();

    const getBackgroundColor = (color: string, mode: string) =>
      mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);
    
    const getHoverBackgroundColor = (color: string, mode: string) =>
      mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);
    
    const getSelectedBackgroundColor = (color: string, mode: string) =>
      mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);
    
    const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
      mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
      '& .hasBeenImported--true': {
        backgroundColor: getBackgroundColor(theme.palette.success.main, theme.palette.mode),
        '&:hover': {
          backgroundColor: getHoverBackgroundColor(
            theme.palette.success.main,
            theme.palette.mode,
          ),
        },
        '&.Mui-selected': {
          backgroundColor: getSelectedBackgroundColor(
            theme.palette.success.main,
            theme.palette.mode,
          ),
          '&:hover': {
            backgroundColor: getSelectedHoverBackgroundColor(
              theme.palette.success.main,
              theme.palette.mode,
            ),
          },
        },
      },
      '& .hasBeenImported--false': {
        '&.Mui-selected': {
          backgroundColor: getSelectedBackgroundColor(
            theme.palette.info.light,
            theme.palette.mode,
          ),
          '&:hover': {
            backgroundColor: getSelectedHoverBackgroundColor(
              theme.palette.info.light,
              theme.palette.mode,
            ),
          },
        },
      }
    }));

    const handleInsertClick = () => {
      const selectedRow = apiRef.current.getSelectedRows().entries().next().value[1];
      if(selectedRow){
        const selectedOrder = orders.find(order => order.escrowNumber === selectedRow.escrowNumber);
        if (selectedOrder) {
          selectedOrder.hasBeenImported = true;
          props.handleInsert(selectedOrder, orders);
        }
      }
    };

    useEffect(() => {
        setOrders(props.orders);
      }, [apiRef, props.orders]);

    useEffect(() => {
      if(orders.length > 0){
        const firstUnimportedOrder = orders.find(order => order.hasBeenImported !== true);
        if (firstUnimportedOrder) {
          apiRef.current.selectRow(firstUnimportedOrder.escrowNumber, true, false);
        }
      }
    }, [page, orders, apiRef, props.canLoadValues]);

    useEffect(() => {
      if(orders.length > 0){
        const index = orders.findIndex(order => order.hasBeenImported !== true);
        console.log('Index:', index);
        if (index >= 0) {
          const page = Math.floor(index / 5);
          setPage(page);
        }else{
          setPage(0);
        }
      }
    }, [apiRef, orders]);
   
    return (
        <div>
            <StyledDataGrid
                getRowId={(row) => row.escrowNumber}
                rows={orders}
                columns={SigningOrderColumns}
                initialState={{
                pagination: {
                    paginationModel: { page: page, pageSize: 5 },
                },
                }}
                pageSizeOptions={[5, 10]}
                disableMultipleRowSelection={true}
                disableColumnSorting={true}
                apiRef={apiRef}
                getRowClassName={(params) => `hasBeenImported--${params.row.hasBeenImported ?? false}`}
            />
            {orders.length > 0 && props.canLoadValues &&
            <div className="filedisplay-container">
              <Button 
                className="filedisplay-insertButton"
                component="label"
                role={undefined}
                tabIndex={-2}
                variant="contained"
                onClick={handleInsertClick}
                >
                  Insert
                  <input 
                    style={{ display: 'none' }}/>
              </Button> 
            </div>}
        </div>
    );
  }

export default FileDisplay;