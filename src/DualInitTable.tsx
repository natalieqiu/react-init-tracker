import {Button} from "@mui/material";
import InitTable from "./InitTable";



const DualInitTable = () => {

    return (
        <>
            <InitTable name={1}> </InitTable>
            <Button variant={"outlined"}  size={"large"}> Add Player</Button>
            <Button variant={"outlined"}  size={"large"}> Next Turn </Button>
            <InitTable name={2}>  </InitTable>
        </>

    )
}
export default DualInitTable;