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

  const [latestId, setLatestId] = useState(0);


  const formRef = useRef();

  useEffect(() => {
    const fetchLatestId = async () => {
      try {
        const response = await fetch('/api/expense/latestId');
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
    setLatestId(prevId => prevId + 1);
  };

  const handleDownload = () => {
    const { name, address, category, amountNumeric, amountWords, date, notes, tips } = formData;
    const receiptId = `${latestId + 1}E`; // Use the latest ID + 1 for the new receipt
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
    pdf.text('Gram-Maulanpur, Post-Gawan, Distt. Sambhal (U.P.)', pdf.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
  
    pdf.setFontSize(12);
    pdf.text(`Date: ${date}`, pdf.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
    pdf.text(`Reciept ID: ${receiptId}`, pdf.internal.pageSize.getWidth() / 8, 70, { align: 'left' });
  
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
  
    pdf.text('Shri/Smt:', fieldX, 90);
    pdf.rect(fieldX, 92, fieldWidth, fieldHeight);
    pdf.text(name, fieldX + 2, 100);
  
    pdf.text('Niwasi:', fieldX, 110);
    pdf.rect(fieldX, 112, fieldWidth, fieldHeight);
    pdf.text(address, fieldX + 2, 120);
  
    pdf.text('MadNaam:', fieldX, 130);
    pdf.rect(fieldX, 132, fieldWidth, fieldHeight);
    pdf.text(category, fieldX + 2, 140);
  
    pdf.text('Rashi (Ankan):', fieldX, 150);
    pdf.rect(fieldX, 152, fieldWidth, fieldHeight);
    pdf.text(amountNumeric, fieldX + 2, 160);
  
    pdf.text('Rashi (Shabdo Me):', fieldX, 170);
    pdf.rect(fieldX, 172, fieldWidth, fieldHeight);
    pdf.text(amountWords, fieldX + 2, 180);
  
    pdf.text('Notes:', fieldX, 190);
    pdf.rect(fieldX, 192, fieldWidth, fieldHeight);
    pdf.text(notes, fieldX + 2, 200);
  
    pdf.text('Tips:', fieldX, 210);
    pdf.rect(fieldX, 212, fieldWidth, fieldHeight);
    pdf.text(tips, fieldX + 2, 220);

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
          व्यय रसीद
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
                <em>मदनाम चुने</em>
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

export default ExpenseRaseed;
