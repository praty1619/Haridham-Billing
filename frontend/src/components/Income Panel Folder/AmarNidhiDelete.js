import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Button, Box, Grid, MenuItem, Select, FormControl, InputLabel, Checkbox
} from '@mui/material';
import { jsPDF } from 'jspdf';

const AmarNidhiDelete = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [displayedRecords, setDisplayedRecords] = useState([]);
  const limit = 50;

  const formatDateForBackend = (date) => {
    if (!date) return '';
    const [month, day, year] = date.split('/');
    return `${year}-${month}-${day}`;
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

  const handleSelectRecord = (record) => {
    setSelectedRecords((prevSelected) => {
      if (prevSelected.includes(record)) {
        return prevSelected.filter((r) => r !== record);
      } else {
        return [...prevSelected, record];
      }
    });
  };

  const handleDelete = async () => {
    try {
      const deletePromises = selectedRecords.map((record) =>
        fetch(`/api/amarNidhi/${record.id}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
      setRecords((prevRecords) =>
        prevRecords.filter((record) => !selectedRecords.includes(record))
      ); // Remove deleted records from the state
      setSelectedRecords([]); // Clear selected records
    } catch (error) {
      console.error('Failed to delete records', error);
      alert('Failed to delete records');
    }
  };

  const handleDownload = () => {
    console.log('Selected records:', selectedRecords);
    selectedRecords.forEach((record) => {
      console.log('Processing record:', record);
      if (!record) return;

      const { id, name, address, amountnumeric, amountwords, mobileno, notes, date } = record;
      const receiptId = `${id}A`; // Use the record ID for the receipt

      const pdf = new jsPDF();

      pdf.setLineWidth(1);
      pdf.rect(10, 10, 190, 277); // Rect(x, y, width, height)

      pdf.setFontSize(22);
      pdf.setFont('Times', 'Bold');
      pdf.text('Shree Haribandh Dham Trust Samiti (Reg.)', pdf.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

      pdf.setFontSize(14);
      pdf.setFont('Times', 'Normal');
      pdf.text('Gram-Maulanpur, Post-Gawan, Distt. Sambhal (U.P.)', pdf.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

      pdf.setFontSize(12);
      pdf.text(`Date: ${new Date(date).toLocaleDateString()}`, pdf.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
      pdf.text(`Receipt ID: ${receiptId}`, pdf.internal.pageSize.getWidth() / 8, 70, { align: 'left' });

      pdf.setFontSize(16);
      pdf.setFont('Times', 'Bold');
      pdf.text('Raseed Details', 20, 80);

      pdf.setFontSize(14);
      pdf.setFont('Times', 'Normal');

      const fieldX = 20;
      const fieldWidth = 170;
      const fieldHeight = 10;

      pdf.setLineWidth(0.5);

      pdf.text('Shri/Smt:', fieldX, 90);
      pdf.rect(fieldX, 92, fieldWidth, fieldHeight);
      pdf.text(String(name), fieldX + 2, 100);

      pdf.text('Niwasi:', fieldX, 110);
      pdf.rect(fieldX, 112, fieldWidth, fieldHeight);
      pdf.text(String(address), fieldX + 2, 120);

      pdf.text('Rashi (Ankan):', fieldX, 130);
      pdf.rect(fieldX, 132, fieldWidth, fieldHeight);
      pdf.text(String(amountnumeric), fieldX + 2, 140);

      pdf.text('Rashi (Shabdo Me):', fieldX, 150);
      pdf.rect(fieldX, 152, fieldWidth, fieldHeight);
      pdf.text(String(amountwords), fieldX + 2, 160);

      pdf.text('Mobile No.:', fieldX, 170);
      pdf.rect(fieldX, 172, fieldWidth, fieldHeight);
      pdf.text(String(mobileno), fieldX + 2, 180);

      pdf.text('Notes:', fieldX, 190);
      pdf.rect(fieldX, 192, fieldWidth, fieldHeight);
      pdf.text(String(notes), fieldX + 2, 200);


      pdf.setFontSize(12);
      pdf.setFont('Times', 'Normal');
      pdf.text('Signature:', 20, 250);

      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text('Thank you for your contribution!', pdf.internal.pageSize.getWidth() / 2, 270, { align: 'center' });

      pdf.save(`receipt_${receiptId}.pdf`);
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          डिलीट अमरनिधि खाता
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
                  <MenuItem value="date">दिनांक</MenuItem>
                  <MenuItem value="month">माह</MenuItem>
                  <MenuItem value="year">वर्ष</MenuItem>
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
                    फिल्टर लागू करें
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
                    फिल्टर लागू करें
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
                    फिल्टर लागू करें
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
                <TableCell>चुने</TableCell>
                  <TableCell>आई.डी.</TableCell>
                  <TableCell>नाम</TableCell>
                  <TableCell>पता</TableCell>
                  <TableCell>राशि (संख्यात्मक)</TableCell>
                  <TableCell>राशि (शब्दों में)</TableCell>
                  <TableCell>फोन नं.</TableCell>
                  <TableCell>टिप्पणियाँ</TableCell>
                  <TableCell>दिनांक</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {displayedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRecords.includes(record)}
                      onChange={() => handleSelectRecord(record)}
                    />
                  </TableCell>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.address}</TableCell>
                    <TableCell>{record.amountnumeric}</TableCell>
                    <TableCell>{record.amountwords}</TableCell>
                    <TableCell>{record.mobileno}</TableCell>
                    <TableCell>{record.notes}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="secondary" onClick={handleDelete} disabled={selectedRecords.length === 0}>
            चयनित को हटाओ
          </Button>
          <Button
                variant="contained"
                color="primary"
                onClick={handleDownload}
                disabled={selectedRecords.length === 0}
                style={{ marginLeft: '10px' }}
              >
                चयनित को डाउनलोड करें
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="primary" onClick={handleShowMore} disabled={loading}>
            और दिखाओ
          </Button>
        </Box>

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
    </Container>
  );
};

export default AmarNidhiDelete;
