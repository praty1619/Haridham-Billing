import React, { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { Container, TextField, MenuItem, Button, Typography, Paper, Box } from '@mui/material';
import './FormComponent.css';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    category: '',
    amountNumeric: '',
    amountWords: '',
    mobileno:'',
    notes:'',
    date: ''
  });

  const [latestId, setLatestId] = useState(0);

  const formRef = useRef();

  useEffect(() => {
    const fetchLatestId = async () => {
      try {
        const response = await fetch('/api/forms/latestId');
        const result = await response.json();
        setLatestId(result.latestId);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLatestId();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const result = await response.json();
    console.log(result);

    setFormData({
      name: '',
      address: '',
      category: '',
      amountNumeric: '',
      amountWords: '',
      mobileno:'',
      notes:'',
      date: ''
    });

    formRef.current.reset();

    setLatestId(prevId => prevId + 1); // Increment the local latest ID
  };

  const handleDownload = () => {
    const { name, address, category, amountNumeric, amountWords, mobileno, notes, date } = formData;
    const receiptId = `${latestId + 1}I`; // Use the latest ID + 1 for the new receipt
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
    pdf.text(`Date: ${date}`, pdf.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
    pdf.text(`Reciept ID: ${receiptId}`, pdf.internal.pageSize.getWidth() / 8, 70, { align: 'left' });

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
    pdf.text(name, fieldX + 2, 100);

    pdf.text('Niwasi:', fieldX, 110);
    pdf.rect(fieldX, 112, fieldWidth, fieldHeight);
    pdf.text(address, fieldX + 2, 120);

    pdf.text('Babat:', fieldX, 130);
    pdf.rect(fieldX, 132, fieldWidth, fieldHeight);
    pdf.text(category, fieldX + 2, 140);

    pdf.text('Rashi (Ankan):', fieldX, 150);
    pdf.rect(fieldX, 152, fieldWidth, fieldHeight);
    pdf.text(amountNumeric, fieldX + 2, 160);

    pdf.text('Rashi (Shabdo Me):', fieldX, 170);
    pdf.rect(fieldX, 172, fieldWidth, fieldHeight);
    pdf.text(amountWords, fieldX + 2, 180);

    pdf.text('Mobile No.:', fieldX, 190);
    pdf.rect(fieldX, 192, fieldWidth, fieldHeight);
    pdf.text(mobileno, fieldX + 2, 200);

    pdf.text('Notes:', fieldX, 210);
    pdf.rect(fieldX, 212, fieldWidth, fieldHeight);
    pdf.text(notes, fieldX + 2, 220);

    pdf.setFontSize(12);
    pdf.setFont('Times', 'Normal');
    pdf.text('Signature:', 20, 250);

    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text('Thank you for your contribution!', pdf.internal.pageSize.getWidth() / 2, 270, { align: 'center' });

    pdf.save('receipt.pdf');
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
        रसीद पर्ची
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
                <em>बाबत्त</em>
              </MenuItem>
              <MenuItem value="Sankirtan Khata">संकीर्तन खाता</MenuItem>
              <MenuItem value="Shri Hari Gollak Khata">श्री हरि गोलक खाता</MenuItem>
              <MenuItem value="Bikri Khata Ganna sir">बिकरी खाता गन्ना सीर</MenuItem>
              <MenuItem value="Bikri Kabad Sankirtan">बिक्री कबाड़ संकीर्तन</MenuItem>
              <MenuItem value="Gawshala Raseed Khata">गौशाला रसीद खाता</MenuItem>
              <MenuItem value="Land and Building Khata">लैंड एंड बिल्डिंग खाता</MenuItem>
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
              type='number'
              label="Mobile No."
              name="mobileno"
              value={formData.mobileno}
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
          <Button variant="contained" color="primary" type="submit" style={{ marginRight: '10px' }}>
          जमा करें
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleDownload}>
            डाउनलोड रसीद
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default FormComponent;
