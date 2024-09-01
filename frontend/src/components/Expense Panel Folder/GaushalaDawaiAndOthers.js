import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Button, Box, Select, FormControl, InputLabel } from '@mui/material';

const GaushalaDawaiAndOthers = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    filterType: '',
    date: '',
    month: '',
    year: '',
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async (filters = {}) => {
    setLoading(true);
    setError('');

    let query = 'category=Gaushala%20Dawai%20and%20Others';
    if (filters.date) query += `&date=${filters.date}`;
    if (filters.month) query += `&month=${filters.month}`;
    if (filters.year) query += `&year=${filters.year}`;

    try {
      const response = await fetch(`/api/expense/filter?${query}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setRecords(data);
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
    fetchRecords(filters);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6" component="h2" gutterBottom>
        गौशाला दवाई एवं अन्य
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
              <MenuItem value="date">दिनांक</MenuItem>
              <MenuItem value="month">माह</MenuItem>
              <MenuItem value="year">वर्ष</MenuItem>
            </Select>
          </FormControl>
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
            फ़िल्टर लागू करें
          </Button>
        </Box>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && (
          <TableContainer component={Paper} style={{ marginTop: '20px' }}>
            <Table>
                <TableHead>
                  <TableRow>
                  <TableCell>आई.डी.</TableCell>
                    <TableCell>नाम</TableCell>
                    <TableCell>पता</TableCell>
                    <TableCell>मदनाम चुने</TableCell>
                    <TableCell>राशि (संख्यात्मक)</TableCell>
                    <TableCell>राशि (शब्दों में)</TableCell>
                    <TableCell>फोन नं</TableCell>
                    <TableCell>दिनांक</TableCell>
                    <TableCell>टिप्पणियाँ</TableCell>
                    <TableCell>सुझाव</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {records.map((record) => (
                      <TableRow key={record.id}>
                      <TableCell>{record.receipt_no}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.address}</TableCell>
                      <TableCell>{record.category}</TableCell>
                      <TableCell>{record.amountnumeric}</TableCell>
                      <TableCell>{record.amountwords}</TableCell>
                      <TableCell>{record.mobileno}</TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.notes}</TableCell>
                      <TableCell>{record.tips}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default GaushalaDawaiAndOthers;
