import React, { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Container, TextField, MenuItem, Button, Typography, Paper, Box } from '@mui/material';
import './FormComponent.css';

const ExpenseRaseed = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    category: '',
    amountNumeric: '',
    amountWords: '',
    date: '',
    notes: '',
    tips: ''
  });

  const [counter, setCounter] = useState(() => {
    // Initialize counter from local storage or start from 1 if not found
    const savedCounter = localStorage.getItem('expenseCounter');
    return savedCounter ? parseInt(savedCounter, 10) : 1;
  });

  const formRef = useRef();

  useEffect(() => {
    // Save counter to local storage whenever it changes
    localStorage.setItem('expenseCounter', counter);
  }, [counter]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/submit-expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const result = await response.json();
    console.log(result);

    // Clear the form
    setFormData({
      name: '',
      address: '',
      category: '',
      amountNumeric: '',
      amountWords: '',
      date: '',
      notes: '',
      tips: ''
    });

    // Clear the form fields visually
    formRef.current.reset();

    // Increment the counter for the next receipt
    setCounter(prevCounter => prevCounter + 1);
  };

  const handleDownload = () => {
    const { name, address, category, amountNumeric, amountWords, date, notes, tips } = formData;
    const receiptId = `${counter}E`;
    const pdf = new jsPDF();
  
    // Add a border to the page
    pdf.setLineWidth(1);
    pdf.rect(10, 10, 190, 277); // Rect(x, y, width, height)
  
    // Add title and heading
    pdf.setFontSize(22);
    pdf.setFont('Times', 'Bold');
    pdf.text('Shree Haribandh Dham Trust Samiti (Reg.)', pdf.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
  
    pdf.setFontSize(14);
    pdf.setFont('Times', 'Normal');
    pdf.text('Gram-Maulanpur, Post-Ganva, Distt. Sambhal (U.P.)', pdf.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
  
    pdf.setFontSize(12);
    pdf.text(`Date: ${date}`, pdf.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
  
    // Add recipient information
    pdf.setFontSize(16);
    pdf.setFont('Times', 'Bold');
    pdf.text('Expense Details', 20, 80);
  
    pdf.setFontSize(14);
    pdf.setFont('Times', 'Normal');
  
    // Draw rectangles for fields to make them stand out
    const fieldX = 20;
    const fieldWidth = 170;
    const fieldHeight = 10;
  
    // Draw boxes around fields
    pdf.setLineWidth(0.5);
  
    pdf.text('Receipt ID:', fieldX, 90);
    pdf.rect(fieldX, 92, fieldWidth, fieldHeight);
    pdf.text(receiptId, fieldX + 2, 100);
  
    pdf.text('Shri/Smt:', fieldX, 110);
    pdf.rect(fieldX, 112, fieldWidth, fieldHeight);
    pdf.text(name, fieldX + 2, 120);
  
    pdf.text('Niwasi:', fieldX, 130);
    pdf.rect(fieldX, 132, fieldWidth, fieldHeight);
    pdf.text(address, fieldX + 2, 140);
  
    pdf.text('MadNaam:', fieldX, 150);
    pdf.rect(fieldX, 152, fieldWidth, fieldHeight);
    pdf.text(category, fieldX + 2, 160);
  
    pdf.text('Rashi (Ankan):', fieldX, 170);
    pdf.rect(fieldX, 172, fieldWidth, fieldHeight);
    pdf.text(amountNumeric, fieldX + 2, 180);
  
    pdf.text('Rashi (Shabdo Me):', fieldX, 190);
    pdf.rect(fieldX, 192, fieldWidth, fieldHeight);
    pdf.text(amountWords, fieldX + 2, 200);
  
    pdf.text('Notes:', fieldX, 210);
    pdf.rect(fieldX, 212, fieldWidth, fieldHeight);
    pdf.text(notes, fieldX + 2, 220);
  
    pdf.text('Tips:', fieldX, 230);
    pdf.rect(fieldX, 232, fieldWidth, fieldHeight);
    pdf.text(tips, fieldX + 2, 240);

    // Add signature field
    pdf.setFontSize(12);
    pdf.setFont('Times', 'Normal');
    pdf.text('Signature:', 20, 260);
  
    // Add footer or any additional information
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text('Thank you for your contribution!', pdf.internal.pageSize.getWidth() / 2, 280, { align: 'center' });
  
    pdf.save('expense_receipt.pdf');
  };
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Expense Raseed
        </Typography>
        <form onSubmit={handleSubmit} ref={formRef}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <MenuItem value="">
                <em>Select a category</em>
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
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              type="number"
              label="Amount (Numeric)"
              name="amountNumeric"
              value={formData.amountNumeric}
              onChange={handleChange}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Amount (Words)"
              name="amountWords"
              value={formData.amountWords}
              onChange={handleChange}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Tips"
              name="tips"
              value={formData.tips}
              onChange={handleChange}
            />
          </Box>
          <Button variant="contained" color="primary" type="submit" style={{ marginRight: '10px' }}>
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleDownload}>
            Download PDF
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ExpenseRaseed;
