import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, MenuItem, Button, Box, Select, FormControl,
  InputLabel
} from '@mui/material';

const FormRecords = () => {
  const [records, setRecords] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
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
    fetchTotalAmount();
  }, []);

  useEffect(() => {
    setDisplayedRecords(records.slice(0, 50));
  }, [records]);

  const fetchTotalAmount = async (filters = {}) => {
    setLoading(true);
    setError('');
    
    let query = '';
    if (filters.category) query += `&category=${filters.category}`;
    if (filters.date) query += `&date=${filters.date}`;
    if (filters.month) query += `&month=${filters.month}`;
    if (filters.year) query += `&year=${filters.year}`;

    try {
      const response = await fetch(`/api/forms/totalAmount?${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTotalAmount(data.totalAmount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (filters = {}, append = false) => {
    setLoading(true);
    setError('');

    let query = `offset=${offset}&limit=${limit}`;
    if (filters.category) query += `&category=${filters.category}`;
    if (filters.date) query += `&date=${filters.date}`;
    if (filters.month) query += `&month=${filters.month}`;
    if (filters.year) query += `&year=${filters.year}`;

    try {
      const response = await fetch(`/api/forms/filter?${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
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
    fetchTotalAmount(filters);
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
          Total Amount: ₹{totalAmount}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Raseed Records
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
              <MenuItem value="Sankirtan Khata">Sankirtan Khata</MenuItem>
              <MenuItem value="Shri Hari Gollak Khata">Shri Hari Gollak Khata</MenuItem>
              <MenuItem value="Bikri Khata Ganna sir">Bikri Khata Ganna sir</MenuItem>
              <MenuItem value="Bikri Kabad Sankirtan">Bikri Kabad Sankirtan</MenuItem>
              <MenuItem value="Gawshala Raseed Khata">Gawshala Raseed Khata</MenuItem>
              <MenuItem value="Land and Building Khata">Land and Building Khata</MenuItem>
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

export default FormRecords;
