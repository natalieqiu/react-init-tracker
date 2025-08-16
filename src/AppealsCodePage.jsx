import React, {useState, useEffect, useMemo, useRef} from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
    MRT_EditActionButtons
} from "material-react-table";
import {
    Stack,
    Box,
    TextField,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    Paper,
    Button,
    Typography,
    IconButton,
    Tooltip,
    Checkbox,
    FormControlLabel,
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {styled} from "@mui/material/styles";
import LoadingOverlay from "./LoadingOverlay.js";
import * as api from "../services/ApiService.js";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {handleExportAllData} from '../util/ExportToExcel.js';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateNewAppealCodeModal from './CreateNewAppealCodeModal.js'
import PaperComponent from './PaperComponent.js';
function AppealCodesPage() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [appealCodesData, updateAppealCodesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [active, setActive] = useState('Active Only');
    const [validationErrors, setValidationErrors] = useState({});
    let appealCodeRef = useRef('');
    let descriptionRef = useRef('');
    let segmentRef = useRef('');
    useEffect(() => {
        // Load the active appeal codes
        fetchAppealCodes(appealCodeRef.current.trim(),
            descriptionRef.current.trim(),
            segmentRef.current.trim(),
            active)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const appealCodesSearch = async () => {
        updateAppealCodesData([])
        table.resetRowSelection()
        table.resetGlobalFilter()
        setIsLoading(true)
        //check input string length
        if (appealCodeRef.current.trim().length > 20) {
            alert("Appeal Code should not be longer than 20 chars!");
            setIsLoading(false);
            return;
        }
        if (descriptionRef.current.trim().length > 100) {
            alert("Description should not be longer than 100 chars!");
            setIsLoading(false);
            return;
        }
        if (segmentRef.current.trim().length > 50) {
            alert("Segment should not be longer than 50 chars!");
            setIsLoading(false);
            return;
        }
        await fetchAppealCodes(appealCodeRef.current.trim(),
            descriptionRef.current.trim(),
            segmentRef.current.trim(),
            active)
    }
    const fetchAppealCodes = async (appealCode, description, segment, active) => {
        await api.retrieveAppealCodes(appealCode,
            description,
            segment,
            active)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Something went wrong with the search. Please try again and report the issue if it continues.')
                }
                return res.json()
            })
            .then(json => {
                setIsLoading(false);
                if (json.message) {
                    alert(json.message + '\nPlease modify your search criteria');
                } else {
                    // filter out "RowCount" and "ErrorMessage" columns
                    const appealData = json.map((row) => {
                        row = Object.fromEntries(Object.entries(row).filter(([key]) =>
                            key !== "RowCount" && key !== "ErrorMessage"));
                        return row;
                    });
                    updateAppealCodesData(appealData);
                }
            })
            .catch(error => {
                alert('Server Error:\n' + error.message);
                setIsLoading(false)
                console.error(error)
            })
    }
    const resetForm = () => {
        window.location.reload();
    }
    const handleActiveChange = (event) => {
        setActive(event.target.value);
    }
    const excludeFromExport =
        [
            'CanDelete'
        ];
    const handleExportAll = (rows) => {
        const cleanedData = removeFieldsBeforeExport(rows);
        handleExportAllData(cleanedData, 'appealCodes');
    }
    const handleExportSelected = (rows) => {
        const originalRows = rows.map((row) => row = row.original);
        handleExportAll(originalRows);
    }
    const removeFieldsBeforeExport = (data) => {
        // filter out 'Exclude From Export' from the data
        const cleanedData = data.map((row) => {
            row = Object.fromEntries(Object.entries(row).filter(([key]) =>
                !excludeFromExport.includes(key)));
            return row;
        });
        return cleanedData;
    }
    const Item = styled(Paper)(({theme}) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        ...theme.typography.body2,
        padding: theme.spacing(0),
        textAlign: "center",
        color: theme.palette.text.secondary
    }));
    const columns = useMemo(() => [
            {
                accessorKey: "AppealCodesId",
                header: "AppealCodesId",
                enableEditing: false,
                size: 200
            },
            {
                accessorKey: "Appeal Code",
                header: "Appeal Code",
                enableEditing: false,
                size: 200
            },
            {
                accessorKey: "Description",
                header: "Description",
                muiEditTextFieldProps: {
                    required: true,
                    error: !!validationErrors?.Description,
                    helperText: validationErrors?.Description,
                },
                size: 250
            },
            {
                accessorKey: "Segment",
                header: "Segment",
                muiEditTextFieldProps: {
                    error: !!validationErrors?.Segment,
                    helperText: validationErrors?.Segment,
                },
                size: 200
            },
            {
                accessorKey: "Active",
                header: "Active",
                Edit: (props) => {
                    const [isChecked, setIsChecked] = React.useState(props.cell.getValue());
                    return (
                        <FormControlLabel
                            key={props.column.id}
                            control={
                                <Checkbox
                                    name={props.column.id}
                                    checked={isChecked}
                                    value={isChecked}
                                    onChange={(e) => {
                                        setIsChecked(e.target.checked);
                                        props.row._valuesCache[props.column.id] = e.target.checked;
                                    }}
                                />
                            }
                            label={props.column.id}
                        />
                    )
                },
                Cell: ({cell}) => (
                    <Checkbox
                        checked={cell.getValue()}
                    />
                ),
            },
            {
                accessorKey: "DateAdded",
                header: "DateAdded",
                enableEditing: false,
                size: 150,
                type: 'date',
                Cell: ({cell}) => {
                    if (!cell.getValue()) return;
                    return new Date(cell.getValue()).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                }
            },
            {
                accessorKey: "AddedBy",
                header: "AddedBy",
                enableEditing: false,
                size: 150
            }
        ],
        [validationErrors]);
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, //customize the default page size
    });
    useEffect(() => {
        //move to the top of the window in case there are less rows to show
        window.scrollTo({top: 0});
    }, [pagination.pageIndex, pagination.pageSize]);
    const handleDeleteAppealCodes = async (row) => {
        if (window.confirm('Are you sure you want to delete the appeal codes: appealCodeId = ' + row.original.AppealCodesId + '?')) {
            await api.deleteAppealCodes(row.original.AppealCodesId).then(res => {
                if (!res.ok) {
                    throw new Error('Something went wrong with deleting the appeal code. Please try again and report the issue if it continues.')
                }
                return res.json()
            })
                .then(json => {
                    alert('Appeal Code deleted');
                    //update data in fly, no need to fetch the whole table
                    appealCodesData.splice(row.index, 1);
                    updateAppealCodesData([...appealCodesData]);
                })
                .catch(error => {
                    alert('Server Error:\n' + error.message);
                })
        }
    };
    const validateRequired = (value) => !!value.trim().length;
    const validateLength = (value, maxlen) => !!(value.trim().length < maxlen);
//Validate the description and segment before updates
    function validateAppealCodes(code) {
        return {
            Description: !validateRequired(code.Description)
                ? 'Description is Required'
                : (!validateLength(code.Description, 100)
                    ? 'Description is too long, max length is 100!'
                    : ''),
            Segment: !validateLength(code.Segment, 50)
                ? 'Segment is too long, max length is 50'
                : '',
        };
    }
    //UPDATE Appeal Code
    const handleUpdateAppealCodes = async (row, table, values) => {
        //validate the input fields
        const newValidationErrors = validateAppealCodes(values);
        if (Object.values(newValidationErrors).some((error) => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        // clear out the errors state
        setValidationErrors({});
        //save the data to the database
        await api.updateAppealCodes(values).then(res => {
            if (!res.ok) {
                throw new Error('Something went wrong with the update appeal codes. Please try again and report the issue if it continues.')
            }
            return res.json()
        })
            .then(json => {
                alert('Appeal Code updated!');
                if (active === 'All') {
                    //update the row to the newval in place; no need to fetch the whole table
                    row.original.Description = row._valuesCache.Description;
                    row.original.Segment = row._valuesCache.Segment;
                    row.original.Active = row._valuesCache.Active;
                } else {
                    //refetch the records from database
                    appealCodesSearch();
                }
            })
            .catch(error => {
                alert('Server Error:\n' + error.message);
                //refresh the table
                appealCodesSearch();
                console.error(error)
            })
        //exit editing mode
        table.setEditingRow(null);
    };
    const handleCreateAppealCodes = async (values) => {
        //save the data to the database
        await api.createAppealCodes(values).then(res => {
            if (!res.ok) {
                throw new Error('Something went wrong with creating appeal codes. Please try again and report the issue if it continues.')
            }
            return res.json()
        })
            .then(json => {
                alert('Appeal Code created!');
                // refetch the table data
                appealCodesSearch();
            })
            .catch(error => {
                alert('Server Error:\n' + error.message);
                console.error(error)
            })
    };
    const table = useMaterialReactTable({
        columns,
        data: appealCodesData,
        defaultDisplayColumn: {enableResizing: true},
        enableColumnResizing: true,
        enableColumnVirtualization: true,
        enableGlobalFilterModes: true,
        enableRowSelection: true,
        enableMultiRowSelection: true,
        enableColumnPinning: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        state: {rowSelection, pagination},
        columnVirtualizerOptions: {overscan: 2},
        initialState: {
            density: "compact",
            columnPinning: {left: ["mrt-row-select"]}
        },
        muiTableBodyRowProps: ({row}) => ({
            //conditionally style selected rows
            sx: {
                fontWeight: row.getIsSelected() ? 'bold' : 'normal',
            },
        }),
        muiTableBodyProps: {
            sx: {
                //stripe the rows, make odd rows a darker color
                '& tr:nth-of-type(odd) > td': {
                    backgroundColor: '#f5f5f5',
                },
            },
        },
        //disable the toggle full screen option in the top tool bar
        enableFullScreenToggle: false,
        selectAllMode: "all",
        paginationDisplayMode: 'pages',
        autoResetPageIndex: false,
        muiPaginationProps: {
            rowsPerPageOptions: [5, 10, 25, 50, 100],
            showFirstButton: true,
            showLastButton: true,
            color: "primary",
            variant: "outlined",
            shape: 'rounded',
        },
        enableEditing: true,
        positionActionsColumn: "first",
        editDisplayMode: 'modal',
        onEditingRowSave: ({row, table, values}) => {
            handleUpdateAppealCodes(row, table, values);
        },
        onEditingRowCancel: () => {
            //clear any validation errors
            setValidationErrors({});
        },
        //optionally customize modal content
        renderEditRowDialogContent: ({table, row, internalEditComponents}) => (
            <>
                <Dialog
                    open={true}
                    PaperComponent={PaperComponent}
                    aria-labelledby="draggable-dialog-title"
                >
                    <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title" textAlign="center">
                        Edit Appeal Code
                    </DialogTitle>
                    <DialogContent
                        sx={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}
                    >
                        <Stack
                            sx={{
                                width: '100%',
                                minWidth: {xs: '300px', sm: '360px', md: '400px'},
                                gap: '1.5rem',
                            }}
                        >
                            {internalEditComponents}
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        {/* eslint-disable-next-line */}
                        <MRT_EditActionButtons variant="text" table={table} row={row}/>
                    </DialogActions>
                </Dialog>
            </>
        ),
        renderTopToolbarCustomActions: ({table}) => (
            <Button
                color="secondary"
                onClick={() => setCreateModalOpen(true)}
                variant="contained"
            >
                Add Appeal Code
            </Button>
        ),
        displayColumnDefOptions: {
            'mrt-row-actions': {
                size: 100,
                Cell: ({row, table}) => (
                    <Box sx={{display: "flex", flexWrap: "nowrap", gap: "1px"}}>
                        <Tooltip title="Edit">
                            <IconButton
                                color="primary"
                                onClick={() => {
                                    table.setEditingRow(row);
                                }}
                            >
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>
                        {row && row.original.CanDelete === true ?
                            <Tooltip title="Delete">
                                <IconButton color="secondary" onClick={() => handleDeleteAppealCodes(row)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </Tooltip>
                            : ''}
                    </Box>
                ),
            },
        },
    });
    return (
        <div>
            <Typography
                align="center"
                variant="h5"
                component="div"
                color="white"
                sx={{
                    position: "fixed",
                    top: "0%",
                    left: "50%",
                    transform: "translate(-50%, 50%)"
                }}
            >
                Appeal Codes
            </Typography>
            {isLoading && <LoadingOverlay/>}
            <Box sx={{flexGrow: 1}}>
                <Grid container spacing={5} rowSpacing={5}>
                    <Grid size={{xs: 12}}>
                        <Item style={{marginLeft: "20px", marginRight: "20px"}}>
                            <Box sx={{width: "100%"}} style={{margin: "20px"}}>
                                <TextField
                                    size="small"
                                    sx={{minWidth: 250, margin: "5px"}}
                                    label="Appeal Code"
                                    defaultValue={appealCodeRef.current || ""}
                                    onKeyUp={(event) => {
                                        appealCodeRef.current = event.target.value
                                    }}
                                />
                                <TextField
                                    size="small"
                                    sx={{minWidth: 250, margin: "5px"}}
                                    label="Description"
                                    defaultValue={descriptionRef.current || ""}
                                    onKeyUp={(event) => {
                                        descriptionRef.current = event.target.value
                                    }}
                                />
                                <TextField
                                    size="small"
                                    sx={{minWidth: 250, margin: "5px"}}
                                    label="Segment"
                                    defaultValue={segmentRef.current || ""}
                                    onKeyUp={(event) => {
                                        segmentRef.current = event.target.value
                                    }}
                                />
                                <FormControl sx={{m: 0.6, minWidth: 200}}>
                                    <InputLabel>Active</InputLabel>
                                    <Select
                                        size="small"
                                        id="active-select"
                                        value={active}
                                        label="Active"
                                        autoWidth
                                        onChange={handleActiveChange}
                                    >
                                        <MenuItem value="All">All</MenuItem>
                                        <MenuItem value="Active Only">Active Only</MenuItem>
                                        <MenuItem value="Inactive Only">Inactive Only</MenuItem>
                                    </Select>
                                </FormControl>
                                <br/>
                                <Button
                                    size="medium"
                                    variant="contained"
                                    color="secondary"
                                    sx={{marginTop: "6px", marginRight: "6px", marginBottom: "6px"}}
                                    onClick={() => appealCodesSearch()}
                                >
                                    Search Appeal Codes
                                </Button>
                                <Button
                                    size="medium"
                                    variant="contained"
                                    color="secondary"
                                    sx={{marginTop: "6px", marginBottom: "6px"}}
                                    onClick={() => resetForm()}
                                >
                                    Reset
                                </Button>
                            </Box>
                        </Item>
                    </Grid>{" "}
                    <Grid size={{xs: 12}} style={{marginTop: "-50px"}}>
                        <Box gridColumn="span 4" style={{margin: "20px"}}>
                            <Item>
                                <MaterialReactTable
                                    table={table}
                                />
                            </Item>
                            <CreateNewAppealCodeModal
                                open={createModalOpen}
                                onClose={() => setCreateModalOpen(false)}
                                onSubmit={handleCreateAppealCodes}
                            />
                            {appealCodesData && appealCodesData.length
                                ?
                                <div style={{paddingTop: "5px"}}>Total
                                    Rows: {new Intl.NumberFormat().format(appealCodesData.length)}</div>
                                : ""}
                            {appealCodesData && appealCodesData.length
                                ? <Button
                                    size="medium"
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        minWidth: 200,
                                        textAlign: "center",
                                        margin: "10px"
                                    }}
                                    onClick={() => handleExportAll(appealCodesData)}
                                    startIcon={<FileDownloadIcon/>}
                                >
                                    Export All to Excel
                                </Button>
                                : ""}
                            {appealCodesData && appealCodesData.length
                                ?
                                <Button
                                    size="medium"
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        minWidth: 200,
                                        textAlign: "center",
                                        margin: "10px"
                                    }}
                                    disabled={
                                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                                    }
                                    //only export selected rows
                                    onClick={() => handleExportSelected(table.getSelectedRowModel().rows)}
                                    startIcon={<FileDownloadIcon/>}
                                >
                                    Export Selected Rows
                                </Button>
                                : ""}
                        </Box>
                    </Grid>{" "}
                </Grid>{" "}
            </Box>{" "}
        </div>
    );
}
export default AppealCodesPage;