import React, { useRef, useState } from 'react';
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
    notes: '', // Additional field
    tips: ''   // Additional field
  });

  const formRef = useRef();

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
      notes: '', // Clear the additional fields
      tips: ''
    });

    // Clear the form fields visually
    formRef.current.reset();
  };

  const handleDownload = () => {
    const { name, address, category, amountNumeric, amountWords, date, notes, tips } = formData;
    const pdf = new jsPDF();
  
    // Add a border to the page
    pdf.setLineWidth(1);
    pdf.rect(10, 10, 190, 277); // Rect(x, y, width, height)
  
    // Add title and heading
    pdf.setFontSize(22);
    pdf.setFont('Times', 'Bold');
    pdf.text('Shree Haridam Bandh Trust Samiti (Reg.)', pdf.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
  
    pdf.setFontSize(14);
    pdf.setFont('Times', 'Normal');
    pdf.text('Gram-Maulanpur, Post-Garva, Zila Sambhal (U.P.)', pdf.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
  
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
  
    pdf.text('Shri/Smt:', fieldX, 100);
    pdf.rect(fieldX, 102, fieldWidth, fieldHeight);
    pdf.text(name, fieldX + 2, 110);
  
    pdf.text('Niwasi:', fieldX, 120);
    pdf.rect(fieldX, 122, fieldWidth, fieldHeight);
    pdf.text(address, fieldX + 2, 130);
  
    pdf.text('MadNaam:', fieldX, 140);
    pdf.rect(fieldX, 142, fieldWidth, fieldHeight);
    pdf.text(category, fieldX + 2, 150);
  
    pdf.text('Rashi (Ankan):', fieldX, 160);
    pdf.rect(fieldX, 162, fieldWidth, fieldHeight);
    pdf.text(amountNumeric, fieldX + 2, 170);
  
    pdf.text('Rashi (Shabdo Me):', fieldX, 180);
    pdf.rect(fieldX, 182, fieldWidth, fieldHeight);
    pdf.text(amountWords, fieldX + 2, 190);

    pdf.text('Notes:', fieldX, 200); // Add field for notes
    pdf.rect(fieldX, 202, fieldWidth, fieldHeight);
    pdf.text(notes, fieldX + 2, 210);

    pdf.text('Tips:', fieldX, 220); // Add field for tips
    pdf.rect(fieldX, 222, fieldWidth, fieldHeight);
    pdf.text(tips, fieldX + 2, 230);

       // Add signature field
    pdf.setFontSize(12);
    pdf.setFont('Times', 'Normal');
    pdf.text('Signature:', 20, 250);
  
    // Add footer or any additional information
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text('Thank you for your contribution!', pdf.internal.pageSize.getWidth() / 2, 270, { align: 'center' });
  
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
