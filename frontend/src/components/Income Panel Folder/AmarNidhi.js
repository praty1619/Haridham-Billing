import React, { useState, useRef, useEffect } from 'react';
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

  const [counter, setCounter] = useState(() => {
    // Initialize counter from local storage or start from 1 if not found
    const savedCounter = localStorage.getItem('amarNidhiCounter');
    return savedCounter ? parseInt(savedCounter, 10) : 1;
  });

  const formRef = useRef();

  useEffect(() => {
    // Save counter to local storage whenever it changes
    localStorage.setItem('amarNidhiCounter', counter);
  }, [counter]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

    // Increment the counter for the next receipt
    setCounter(prevCounter => prevCounter + 1);
  };

  const handleDownload = () => {
    const { name, address, amountNumeric, amountWords, date } = formData;
    const receiptId = `${counter}A`;
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
    pdf.text('AmarNidhi Details', 20, 80);

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

    pdf.text('Rashi (Ankan):', fieldX, 150);
    pdf.rect(fieldX, 152, fieldWidth, fieldHeight);
    pdf.text(amountNumeric, fieldX + 2, 160);

    pdf.text('Rashi (Shabdo Me):', fieldX, 170);
    pdf.rect(fieldX, 172, fieldWidth, fieldHeight);
    pdf.text(amountWords, fieldX + 2, 180);

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
