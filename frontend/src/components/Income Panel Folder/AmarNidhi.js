import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import './FormComponent.css';

const AmarNidhi = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    amountNumeric: '1100',
    amountWords: 'One Thousand One Hundred Only',
    date: '',
  });

  const formRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // handling Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/amarNidhi', {
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
      amountNumeric: '1100',
      amountWords: 'One Thousand One Hundred Only',
      date: '',
    });

    // Clear the form fields visually
    formRef.current.reset();
  };

  const handleDownload = () => {
    const { name, address, amountNumeric, amountWords , date} = formData;
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
    pdf.text('AmarNidhi Details', 20, 80);
  
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
  
    pdf.text('Rashi (Ankan):', fieldX, 140);
    pdf.rect(fieldX, 142, fieldWidth, fieldHeight);
    pdf.text(amountNumeric, fieldX + 2, 150);
  
    pdf.text('Rashi (Shabdo Me):', fieldX, 160);
    pdf.rect(fieldX, 162, fieldWidth, fieldHeight);
    pdf.text(amountWords, fieldX + 2, 170);

       // Add signature field
    pdf.setFontSize(12);
    pdf.setFont('Times', 'Normal');
    pdf.text('Signature:', 20, 250);
  
    // Add footer or any additional information
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text('Thank you for your contribution!', pdf.internal.pageSize.getWidth() / 2, 270, { align: 'center' });
  
    pdf.save('AmarNidhiReceipt.pdf');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          AmarNidhi
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
              type="number"
              label="Amount (Numeric)"
              name="amountNumeric"
              value={formData.amountNumeric}
              onChange={handleChange}
              required
              InputProps={{
                readOnly: true,
              }}
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
              InputProps={{
                readOnly: true,
              }}
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

export default AmarNidhi;
