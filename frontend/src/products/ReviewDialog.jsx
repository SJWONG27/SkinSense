import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Rating } from '@mui/material';
import './product.css';

function ReviewDialog() {
  const [open, setOpen] = useState(false);
  const [star, setStar] = useState(2);  // for star ratings
  const[review, setReview] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here (e.g., send data to server)
    setOpen(false); // Close the dialog after submission
  };

  return (
    <div className='review_dialog'>
      <Button color="error" variant="contained" onClick={handleClickOpen}>
        Add Review
      </Button>
      <Dialog open={open} >
        <DialogTitle>Review Form</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your review.</DialogContentText>
          <Rating
            name="simple-controlled"
            value={star}
            onChange={(event, newStar) => {
                 setStar(newStar);
            }}
        />
        <br/>
        <textarea cols={30} rows={5} value={review} onChange={(e)=>setReview(e.target.value)}></textarea>
        <br/>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose} variant="outlined" >Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

  
}

export default ReviewDialog;