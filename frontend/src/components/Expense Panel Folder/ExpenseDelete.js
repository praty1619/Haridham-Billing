import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, MenuItem, Button, Box, Select, FormControl,
  InputLabel , Checkbox
} from '@mui/material';
import jsPDF from 'jspdf';

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
  const [selectedRecords, setSelectedRecords] = useState([]);
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

  const handleSelectRecord = (recordId) => {
    setSelectedRecords((prevSelected) =>
      prevSelected.includes(recordId)
        ? prevSelected.filter((id) => id !== recordId)
        : [...prevSelected, recordId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedRecords.map((recordId) =>
          fetch(`/api/submit-form/${recordId}`, {
            method: 'DELETE',
          })
        )
      );
      setSelectedRecords([]);
      fetchRecords(filters); // Refetch records after deletion
    } catch (err) {
      setError('Failed to delete records');
    }
  };

  const downloadReceipt = () => {
    selectedRecords
      .map((recordId) => records.find((record) => record.id === recordId))
      .forEach((record) => {
        if (!record) return;
  
        const { name, address, category, amountnumeric, amountwords, mobileno, date, notes, tips, id } = record;
        const receiptId = `${id}E`;
        const pdf = new jsPDF();
  
        pdf.setLineWidth(1);
        pdf.rect(10, 10, 190, 277);
  
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
        pdf.text('Expense Details', 20, 80);
  
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
  
        pdf.text('MadNaam:', fieldX, 130);
        pdf.rect(fieldX, 132, fieldWidth, fieldHeight);
        pdf.text(String(category), fieldX + 2, 140);
  
        pdf.text('Rashi (Ankan):', fieldX, 150);
        pdf.rect(fieldX, 152, fieldWidth, fieldHeight);
        pdf.text(String(amountnumeric), fieldX + 2, 160);
  
        pdf.text('Rashi (Shabdo Me):', fieldX, 170);
        pdf.rect(fieldX, 172, fieldWidth, fieldHeight);
        pdf.text(String(amountwords), fieldX + 2, 180);
  
        pdf.text('Mobile No.:', fieldX, 190);
        pdf.rect(fieldX, 192, fieldWidth, fieldHeight);
        pdf.text(String(mobileno), fieldX + 2, 200);
  
        pdf.text('Notes:', fieldX, 210);
        pdf.rect(fieldX, 212, fieldWidth, fieldHeight);
        pdf.text(String(notes), fieldX + 2, 220);
  
        pdf.text('Tips:', fieldX, 230);
        pdf.rect(fieldX, 232, fieldWidth, fieldHeight);
        pdf.text(String(tips), fieldX + 2, 240);
  
        pdf.setFontSize(12);
        pdf.setFont('Times', 'Normal');
        pdf.text('Signature:', 20, 260);
  
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text('Thank you for your contribution!', pdf.internal.pageSize.getWidth() / 2, 280, { align: 'center' });
  
        pdf.save(`expense_receipt_${receiptId}.pdf`);
      });
  };
  

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
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
                    <TableCell>चुने</TableCell>
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
                {displayedRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRecords.includes(record.id)}
                          onChange={() => handleSelectRecord(record.id)}
                        />
                      </TableCell>
                      <TableCell>{record.id}</TableCell>
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
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteSelected}
                disabled={selectedRecords.length === 0}
              >
                व्यय रिकॉर्ड हटाएं
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={downloadReceipt}
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
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ExpenseRecords;
