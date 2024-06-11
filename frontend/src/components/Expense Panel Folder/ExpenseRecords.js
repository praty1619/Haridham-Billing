import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, MenuItem, Button, Box, Select, FormControl,
  InputLabel
} from '@mui/material';

const ExpenseRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayedRecords, setDisplayedRecords] = useState([]);
  const [filters, setFilters] = useState({
    filterType: '',
    category: '',
    date: '',
    month: '',
    year: '',
  });
  const [offset, setOffset] = useState(0);
  const limit = 50;

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    setDisplayedRecords(records.slice(0, 50));
  }, [records]);

  const fetchRecords = async (filters = {}, append = false) => {
    setLoading(true);
    setError('');

    let query = `offset=${offset}&limit=${limit}`;
    if (filters.category) query += `&category=${filters.category}`;
    if (filters.date) query += `&date=${filters.date}`;
    if (filters.month) query += `&month=${filters.month}`;
    if (filters.year) query += `&year=${filters.year}`;

    try {
      const response = await fetch(`/api/expense/filter?${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setRecords((prevRecords) => (append ? [...prevRecords, ...data] : data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'filterType') {
      setFilters({
        filterType: value,
        category: '',
        date: '',
        month: '',
        year: '',
      });
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  const handleFilter = () => {
    setOffset(0); // Reset offset when applying filters
    fetchRecords(filters);
  };

  const handleShowMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    setDisplayedRecords(records.slice(0, newOffset + 50));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Expense Records
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <FormControl style={{ width: '23%' }}>
            <InputLabel>Filter Type</InputLabel>
            <Select
              value={filters.filterType}
              onChange={handleChange}
              name="filterType"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="category">Category</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
          {filters.filterType === 'category' && (
            <TextField
              label="Category"
              name="category"
              value={filters.category}
              onChange={handleChange}
              select
              style={{ width: '23%' }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Machinery Marammat Sir">Machinery Marammat Sir</MenuItem>
              <MenuItem value="Khad Beej Sir">Khad Beej Sir</MenuItem>
              <MenuItem value="Labour Sir">Labour Sir</MenuItem>
              <MenuItem value="Sir Labour Mandeya">Sir Labour Mandeya</MenuItem>
              <MenuItem value="Gaushala Labour Mandeya">Gaushala Labour Mandeya</MenuItem>
              <MenuItem value="Gaushala Bhusa aur Chara">Gaushala Bhusa aur Chara</MenuItem>
              <MenuItem value="Sankirtan Anya">Sankirtan Anya</MenuItem>
              <MenuItem value="Sankirtan Gass">Sankirtan Gass</MenuItem>
              <MenuItem value="B.R Singh ji Khata">B.R Singh ji Khata</MenuItem>
              <MenuItem value="Land and Building Bhandara">Land and Building Bhandara</MenuItem>
              <MenuItem value="Sankirtan Labour Khata">Sankirtan Labour Khata</MenuItem>
              <MenuItem value="Diesel Khata">Diesel Khata</MenuItem>
              <MenuItem value="Light Generator Marammat Khata">Light Generator Marammat Khata</MenuItem>
              <MenuItem value="Sankirtan Rashan Khata">Sankirtan Rashan Khata</MenuItem>
              <MenuItem value="Sankirtan Khata Mandeya">Sankirtan Khata Mandeya</MenuItem>
              <MenuItem value="Vidya Peeth Mandeya">Vidya Peeth Mandeya</MenuItem>
              <MenuItem value="Park Maintenance Khata">Park Maintenance Khata</MenuItem>
              <MenuItem value="Building Marammat Khata">Building Marammat Khata</MenuItem>
              <MenuItem value="Vidyalaya Others Kharcha">Vidyalaya Others Kharcha</MenuItem>
              <MenuItem value="Sankirtan Gehu Labour">Sankirtan Gehu Labour</MenuItem>
              <MenuItem value="Sankirtan Sabji">Sankirtan Sabji</MenuItem>
              <MenuItem value="Gaushala Dawai and Others">Gaushala Dawai and Others</MenuItem>
              <MenuItem value="Gaushala Khal">Gaushala Khal</MenuItem>
              <MenuItem value="Sankirtan Khata Doodh">Sankirtan Khata Doodh</MenuItem>
              <MenuItem value="Atul Sharma Khata">Atul Sharma Khata</MenuItem>
              <MenuItem value="Ramesh Bhagatji Khata">Ramesh Bhagatji Khata</MenuItem>
              <MenuItem value="Gaushala Building Ped">Gaushala Building Ped</MenuItem>
            </TextField>
          )}
          {filters.filterType === 'date' && (
            <TextField
              label="Date"
              name="date"
              type="date"
              value={filters.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ width: '23%' }}
            />
          )}
          {filters.filterType === 'month' && (
            <TextField
              label="Month"
              name="month"
              value={filters.month}
              onChange={handleChange}
              select
              style={{ width: '23%' }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {[...Array(12)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </TextField>
          )}
          {filters.filterType === 'year' && (
            <TextField
              label="Year"
              name="year"
              value={filters.year}
              onChange={handleChange}
              select
              style={{ width: '23%' }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {[...Array(50)].map((_, i) => (
                <MenuItem key={2023 - i} value={2023 - i}>
                  {2023 - i}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Button variant="contained" color="primary" onClick={handleFilter}>
            Apply Filters
          </Button>
        </Box>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && (
          <>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Amount (Numeric)</TableCell>
                    <TableCell>Amount (Words)</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Tips</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {displayedRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.address}</TableCell>
                      <TableCell>{record.category}</TableCell>
                      <TableCell>{record.amountnumeric}</TableCell>
                      <TableCell>{record.amountwords}</TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.notes}</TableCell>
                      <TableCell>{record.tips}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button variant="contained" color="primary" onClick={handleShowMore} disabled={loading}>
                Show More
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ExpenseRecords;
