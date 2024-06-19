import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, MenuItem, Button, Box, Select, FormControl,
  InputLabel
} from '@mui/material';

const ExpenseRecords = () => {
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
      const response = await fetch(`/api/expense/totalAmount?${query}`);
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
          कुल राशि: ₹{totalAmount}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          व्यय खाता
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
              <MenuItem value="category">मदनाम चुने</MenuItem>
              <MenuItem value="date">दिनांक</MenuItem>
              <MenuItem value="month">माह</MenuItem>
              <MenuItem value="year">वर्ष</MenuItem>
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
              <MenuItem value="Machinery Marammat Sir">मशीनरी मरम्मत सीर</MenuItem>
              <MenuItem value="Khad Beej Sir">खाद बीज सीर</MenuItem>
              <MenuItem value="Labour Sir">लेबर सीर</MenuItem>
              <MenuItem value="Sir Labour Mandeya">सीर लेबर मानदेय</MenuItem>
              <MenuItem value="Gaushala Labour Mandeya">गौशाला लेबर मानदेय</MenuItem>
              <MenuItem value="Gaushala Bhusa aur Chara">गौशाला भूसा और चारा</MenuItem>
              <MenuItem value="Sankirtan Anya">संकीर्तन अन्य</MenuItem>
              <MenuItem value="Sankirtan Gass">संकीर्तन गैस</MenuItem>
              <MenuItem value="B.R Singh Ji Khata">बी.आर सिंह जि खाता</MenuItem>
              <MenuItem value="Land and Building Bhandara">लैंड एंड बिल्डिंग भंडारा</MenuItem>
              <MenuItem value="Sankirtan Labour Khata">संकीर्तन लेबर खता</MenuItem>
              <MenuItem value="Diesel Khata">डीजल खाता</MenuItem>
              <MenuItem value="Light Generator Marammat Khata">लाइट जनरेटर मरम्मत खता</MenuItem>
              <MenuItem value="Sankirtan Rashan Khata">संकीर्तन राशन खता</MenuItem>
              <MenuItem value="Sankirtan Khata Mandeya">संकीर्तन खता मानदेय</MenuItem>
              <MenuItem value="Vidya Peeth Mandeya">विद्या पीठ मानदेय</MenuItem>
              <MenuItem value="Park Maintenance Khata">पार्क मेंटेनेंस खता</MenuItem>
              <MenuItem value="Building Marammat Khata">बिल्डिंग मरम्मत खता</MenuItem>
              <MenuItem value="Vidyalaya Others Kharcha">विद्यालय अन्य खर्चा</MenuItem>
              <MenuItem value="Sankirtan Gehu Labour">संकीर्तन गेहू लेबर</MenuItem>
              <MenuItem value="Sankirtan Sabji">संकीर्तन सब्जी</MenuItem>
              <MenuItem value="Gaushala Dawai and Others">गौशाला दवाई एवं अन्य</MenuItem>
              <MenuItem value="Gaushala Khal">गौशाला खाल</MenuItem>
              <MenuItem value="Sankirtan Khata Doodh">संकीर्तन खता दूध</MenuItem>
              <MenuItem value="Atul Sharma Khata">अतुल शर्मा खाता</MenuItem>
              <MenuItem value="Ramesh Bhagatji Khata">रमेश भगतजी खता</MenuItem>
              <MenuItem value="Gaushala Building Ped">गौशाला बिल्डिंग पेड़</MenuItem>
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
            फ़िल्टर लागू करें
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
                    <TableCell>नाम</TableCell>
                    <TableCell>पता</TableCell>
                    <TableCell>मदनाम चुने</TableCell>
                    <TableCell>राशि (संख्यात्मक)</TableCell>
                    <TableCell>राशि (शब्दों में)</TableCell>
                    <TableCell>दिनांक</TableCell>
                    <TableCell>टिप्पणियाँ</TableCell>
                    <TableCell>सुझाव</TableCell>
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
                और दिखाओ
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ExpenseRecords;
