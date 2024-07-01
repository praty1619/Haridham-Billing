import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Container, TextField, Button, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const ExpenseBalanceSheet = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [records, setRecords] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDownloadEnabled, setIsDownloadEnabled] = useState(false);

  const months = [
    { value: '', label: 'All' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const fetchRecords = async () => {
    try {
      const response = await fetch(`/api/expense/balance?year=${year}${month ? `&month=${month}` : ''}`);
      const data = await response.json();
      
      console.log('Fetched data:', data); // Debugging statement
  
      setRecords(data.records || []); // Ensure records is an array
      setTotalAmount(data.totalAmount || 0); // Ensure totalAmount is a number
      setIsDownloadEnabled(true); // Enable download button after fetching records
    } catch (err) {
      console.error('Error fetching records:', err);
      setRecords([]); // Set to empty array on error
      setTotalAmount(0); // Reset total amount on error
    }
  };

  const handleDownload = () => {
    const pdf = new jsPDF('p', 'pt', 'letter');
    
    // Custom header
    pdf.setFontSize(22);
    pdf.setFont('Times', 'Bold');
    pdf.text('Shree Haribandh Dham Trust Samiti (Reg.)', pdf.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

    pdf.setFontSize(14);
    pdf.setFont('Times', 'Normal');
    pdf.text('Gram-Maulanpur, Post-Gawan, Distt. Sambhal (U.P.)', pdf.internal.pageSize.getWidth() / 2, 50, { align: 'center' });

    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Name', dataKey: 'name' },
      { header: 'Address', dataKey: 'address' },
      { header: 'Category', dataKey: 'category' },
      { header: 'Amount (Numeric)', dataKey: 'amountnumeric' },
      { header: 'Amount (Words)', dataKey: 'amountwords' },
      { header: 'Mobile No', dataKey: 'mobileno' },
      { header: 'Notes', dataKey: 'notes' },
      { header: 'Tips' , dataKey: 'tips'},
      { header: 'Date', dataKey: 'formatted_date' },
    ];

    const rows = records.map(record => ({
      id: record.id,
      name: record.name,
      address: record.address,
      category: record.category,
      amountnumeric: record.amountnumeric,
      amountwords: record.amountwords,
      mobileno: record.mobileno,
      notes: record.notes,
      tips: record.tips,
      formatted_date: record.formatted_date,
    }));

    pdf.autoTable({
      head: [columns.map(col => col.header)],
      body: rows.map(row => columns.map(col => row[col.dataKey])),
      startY: 90,
      styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: [22, 160, 133] },
      columnStyles: {
        id: { cellWidth: 40 },  // ID
        name: { cellWidth: 60 },  // Name
        address: { cellWidth: 100 },  // Address
        category: { cellWidth: 60 },  // Category
        amountnumeric: { cellWidth: 60 },  // Amount (Numeric)
        amountwords: { cellWidth: 100 },  // Amount (Words)
        mobileno: { cellWidth: 60 },  // Mobile No
        notes: { cellWidth: 100 },
        tips:{cellWidth: 100},  // Notes
        formatted_date: { cellWidth: 60 },  // Date
      },
      theme: 'striped',
    });

    // Add total amount at the end of the table
    pdf.text(`Total Amount: ${totalAmount}`, pdf.internal.pageSize.getWidth() - 160, pdf.autoTable.previous.finalY + 30);

    pdf.save('balance_sheet.pdf');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
            व्यय बैलेंस शीट
        </Typography>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </Box>
        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" color="primary" onClick={fetchRecords} style={{ marginRight: '10px' }}>
          फ़िल्टर लागू करें
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleDownload} disabled={!isDownloadEnabled}>
          बैलेंस शीट डाउनलोड करें
        </Button>
        {records.length > 0 && (
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
                  <TableCell>फोन नं.</TableCell>
                  <TableCell>टिप्पणियाँ</TableCell>
                  <TableCell>सुझाव</TableCell>
                  <TableCell>दिनांक</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.address}</TableCell>
                    <TableCell>{record.category}</TableCell>
                    <TableCell>{record.amountnumeric}</TableCell>
                    <TableCell>{record.amountwords}</TableCell>
                    <TableCell>{record.mobileno}</TableCell>
                    <TableCell>{record.notes}</TableCell>
                    <TableCell>{record.tips}</TableCell>
                    <TableCell>{record.formatted_date}</TableCell> {/* Use formatted_date here */}
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

export default ExpenseBalanceSheet;
