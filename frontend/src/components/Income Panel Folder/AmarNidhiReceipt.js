import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Button, Box, Grid, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';

const AmarNidhiReceipt = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [records, setRecords] = useState([]);
  const [displayedRecords, setDisplayedRecords] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [offset, setOffset] = useState(0);
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const formatDateForBackend = (date) => {
    if (!date) return '';
    const [month, day, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const fetchTotalAmount = async (query) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/amarNidhiReceipt/custom_date?${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setTotalAmount(result.totalAmount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (query, append = false) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/amarNidhiRecords/custom_date?${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setRecords((prevRecords) => (append ? [...prevRecords, ...result] : result));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  useEffect(() => {
    setDisplayedRecords(records.slice(0, 50));
  }, [records]);

  const handleFetch = () => {
    setOffset(0); // Reset offset when fetching new date range
    let query = '';
    if (filterType === 'date') {
      const formattedFromDate = formatDateForBackend(fromDate);
      const formattedToDate = formatDateForBackend(toDate);
      query = new URLSearchParams({ fromDate: formattedFromDate, toDate: formattedToDate }).toString();
    } else if (filterType === 'month') {
      query = new URLSearchParams({ month: filterValue }).toString();
    } else if (filterType === 'year') {
      query = new URLSearchParams({ year: filterValue }).toString();
    }
    fetchTotalAmount(query);
    fetchRecords(query);
  };

  const handleShowMore = () => {
    const newOffset = offset + 50;
    setOffset(newOffset);
    setDisplayedRecords(records.slice(0, newOffset + 50));
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setFromDate('');
    setToDate('');
    setFilterValue('');
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Total AmarNidhi Amount: ₹{totalAmount}
        </Typography>

        <Box mb={4}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Filter Type</InputLabel>
                <Select value={filterType} onChange={handleFilterChange}>
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {filterType === 'date' && (
              <>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="From Date"
                    type="text"
                    placeholder="MM/DD/YYYY"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="To Date"
                    type="text"
                    placeholder="MM/DD/YYYY"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFetch}
                    disabled={loading}
                    fullWidth
                  >
                    Fetch
                  </Button>
                </Grid>
              </>
            )}

            {filterType === 'month' && (
              <>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Month"
                    name="month"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    select
                    fullWidth
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
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFetch}
                    disabled={loading}
                    fullWidth
                  >
                    Apply Filter
                  </Button>
                </Grid>
              </>
            )}

            {filterType === 'year' && (
              <>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Year"
                    name="year"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    select
                    fullWidth
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
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFetch}
                    disabled={loading}
                    fullWidth
                  >
                    Apply Filter
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
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

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
    </Container>
  );
};

export default AmarNidhiReceipt;
