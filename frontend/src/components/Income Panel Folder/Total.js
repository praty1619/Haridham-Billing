import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const Total = () => {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/fixedDeposits');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setRecords(result);
        const totalamount = result.reduce((sum, record) => sum + parseFloat(record.depositamount), 0);
        setTotal(totalamount);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Total Fixed Deposits
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {loading ? (
          <CircularProgress />
        ) : (
          <div>
            <Typography variant="h6">Total Amount: ₹{total}</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bank Name</TableCell>
                  <TableCell>Account Number</TableCell>
                  <TableCell>FDR Number</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.bankname}</TableCell>
                    <TableCell>{record.accountnumber}</TableCell>
                    <TableCell>{record.fdrnumber}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>₹{record.depositamount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default Total;
