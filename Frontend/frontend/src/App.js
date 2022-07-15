import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from "react";
import { Header } from "./Components/Header";
import { Card } from "@mui/material";

function App() {
  const [file, setFile] = useState();
  const [array, setArray] = useState(null);
  const [csvFileError, setCsvFileError] = useState(null)
  const [search,setSearch]= useState("")
  const [rows, setRows] = useState([])


  const fileReader = new FileReader();
  const handleOnChange = (e) => {
    const fileType = ['text/csv'];
    const selectedFile = e.target.files[0]
    console.log(selectedFile.type);
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        setFile(e.target.files[0]);
      }
      else {
        setCsvFileError('Please select only CSV file types');
        csvFileError(null);
      }
    }
  };


  const csvFileToArray = string => {
    const csvHeader = string.slice(0, string.indexOf("\n")).replace(/\r|"/g, "").split(",");
    console.log(csvHeader);
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    const array = csvRows.map(i => {
      const values = i.replace(/\r|"/g, "").split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        console.log(object, "++++++++++++++++++++++");
        return object;
      }, {});
      return obj;
    });
    setArray(array);
  };
  useEffect(() => {
    if (array) {
      const fatch = async () => {
        const response = await axios.post('http://localhost:8000/csv', array);
        const getAll = await axios.get('http://localhost:8000/csv')
        console.log(getAll.data, "lllllllllllllllllllll");
        setRows(getAll?.data?.data)
      }
      fatch()
    }
  }, [array])

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };
      fileReader.readAsText(file);
    }
  };


  const searchHandler = (e) => {
    setSearch(e.target.value)
  }
  const searchSubmit = async (e) => {
    const data= await axios.get(`http://localhost:8000/csv?search=${search}`)
    console.log(data.data.data);
    setRows(data?.data?.data)
  }
  const backSearch=async()=>{
    const data= await axios.get(`http://localhost:8000/csv`)
    setRows(data?.data?.data)
  }
  return (
    <>
    <Header/>
    <div className=" d-flex  p-4">
      {array == null ? <form className='form-group mt-4' autoComplete="off">
        <label>
          <h5>Upload CSV file</h5>
        </label>
        <br />
        <br />
        <input
          type='file'
          className="form-control"
          onChange={handleOnChange}
          required>
        </input>
        {csvFileError && <div className='text-danger'
          style={{ marginTop: 5 + 'px' }}>{csvFileError}</div>}
        <button
          type='submit'
          className='btn btn-success'
          style={{ marginTop: 5 + 'px', widows: "30px" }}
          onClick={(e) => {
            handleOnSubmit(e);
          }}>Submit</button>
      </form> :
       <Box className='d-flex justify-content-center flex-column'>
      <Box sx={{ minWidth: 275 }} className="mb-2">
      <Card variant="outlined">
      <form class="input-group mb-3">
          <input type="text" class="form-control" onChange={searchHandler}
            value={search}
            placeholder="Search...." name="search" />
        </form>
        <Box className=" d-flex justify-content-end ">
        <button className="btn btn-primary me-2" type="button" id="button-addon2" onClick={(e) => searchSubmit(e)}>search</button>
        <button className="btn btn-secondary" type="button" id="button-addon2" onClick={(e) => backSearch(e)}>Back</button>
        </Box>

      </Card>
    </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>S.N</TableCell>
                <TableCell align="right">sku_code</TableCell>
                <TableCell align="right">product_name</TableCell>
                <TableCell align="right">product_description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{row.id}</TableCell>
                  <TableCell component="th" scope="row">{row.sku_code}</TableCell>
                  <TableCell align="right">{row.product_name}</TableCell>
                  <TableCell align="right">{row.product_description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>}
    </div>
    </>
  );
}
export default App;