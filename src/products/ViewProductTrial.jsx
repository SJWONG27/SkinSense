import { useLocation} from "react-router-dom";
import { useState, useContext } from "react";
import Rating from '@mui/material/Rating';
import Review from "./Review";
import { Button } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import NavBar from "../NavBar";
import { ShopContext } from "../context/ShopContext";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import { Select, MenuItem, InputLabel, FormControl} from '@mui/material';

// 改了handleClickOpen名字成handleOpenDialog
// 加了
// 1. useContext, ShopContext
// 用来addCart，算number of items in cart in console

function ViewProductTrial(){

  let sortedReviews = [];

  const { addToCart, cartItems } = useContext(ShopContext);

    const [state, setState] = useState({
      open: false,
      vertical: 'top',
      horizontal: 'center',
    });

    const { vertical, horizontal, open } = state;
    
    const [openDialog, setOpenDialog] = useState(false);
    const [star, setStar] = useState(2);  // for star ratings
    const [review, setReview] = useState("");
    // const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
    const [submittedReviews, setSubmittedReviews] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const[sort, setSort] = useState("");

    const handleOpenDialog = () => {
        setOpenDialog(true);
      };

    const handleCloseDialog = () => {
        // Reset review form back to default value
       setReview(""); 
       setStar(0);
       setOpenDialog(false);
     };

    const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    };
  
    const handleClick = (newState, itemId) => () => {
      setState({ ...newState, open: true });
      addToCart(itemId);
      console.log(typeof itemId);
    };  
  
    const handleClose = () => {
      setState({ ...state, open: false });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        
        if(review.length<5){
          setOpenSnackbar(true);
          return;
        }
        const newReview = {
          star: star,
          content: review,
        };
        setSubmittedReviews([...submittedReviews, newReview]);
        // Reset review form back to default value
        setReview(""); 
        setStar(0);
        setOpenDialog(false); // Close the dialog after submission
      };
  
    // const submitReview = () => {
    //   // Logic for submitting the review
    //   console.log("Review submitted:", review);
  
    //   // Update the state to indicate that review has been submitted
    //   setHasSubmittedReview(true);
  
    //   // Clear the review textarea after submission (not this time)
    //   // setReview('');
    // };
  
    const location = useLocation();

    const data = location.state;

    const cartItemCount = cartItems[data.id2];
    console.log(cartItemCount)
  
    const context = (
        <>
        <NavBar/>
        <div className="view_product_page">
        <br/><br/><br/><br/>
        <img src={data.image1} alt="sss" width={400} height={400}/>
        <p className="product_name">{data.brand2}</p>
        <p className="product_description"><strong>Description</strong><br/>{data.description1}</p>
        <p className="product_price">{data.price2}</p>
        <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' }, data.id2)} variant="contained">Add to Cart</Button>
         
        <Snackbar
        open={open}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={1500}
        onClose={handleClose}>
          <Alert
            severity="success"
            variant="filled"
            >
            Successfully added to cart
          </Alert>
        </Snackbar>
  
        <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
        autoHideDuration={1500}
        onClose={handleSnackbarClose}>
          <Alert
            severity="error"
            variant="filled"
            >
            Please enter at least 5 characters
          </Alert>
        </Snackbar>
        <br/><br/><br/><br/><hr className="review_separator_line"/>
          <div className="review_section">
            <h2>Review 
              <FormControl className="sort_review_field" sx={{ m: 1, minWidth: 190}} size="small" >
              <InputLabel>Sort by</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Sort By"
                value={sort}
                onChange={handleSort}
                >
                <MenuItem value={"default"}>Default</MenuItem>
                <MenuItem value={"star-asc"}>Rating Low to High</MenuItem>
                <MenuItem value={"star-desc"}>Rating High to Low</MenuItem>
  
              </Select>
              </FormControl>

            {/* 
                {!hasSubmittedReview && (
                    <>
                    <Rating
                        name="simple-controlled"
                        value={value}
                        onChange={(event, newValue) => {
                        setValue(newValue);
                        }}
                    />
                    <br/>
                    <textarea cols={30} rows={5} value={review} onChange={(e)=>setReview(e.target.value)}></textarea>
                    <br/>
                    <Button color="error" variant="contained" onClick={submitReview}>Submit Review</Button>
                    </>
                )}
                {hasSubmittedReview && <Review content={review} star={value}/>}
            */}

  
            <div className='review_dialog'>
                  <Button color="error" variant="contained" onClick={handleOpenDialog}>
                        Add Review
                  </Button>
                  <Dialog open={openDialog} >
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
                        <textarea className="review_textarea" cols={30} rows={5} value={review} onChange={(e)=>setReview(e.target.value)}></textarea>
                        <br/>
                      </DialogContent>
                      <DialogActions>
                      <Button color="error" onClick={handleCloseDialog} variant="outlined" >Cancel</Button>
                      <Button variant="contained" onClick={handleSubmit}>
                              Submit
                      </Button>
                      </DialogActions>
                    </Dialog>
              </div>
              </h2>
              {sortedReviews.map((review) => (
              <Review content={review.content} star={review.star} />
               ))}
          </div>
        </div>
        </>
    );

    function handleSort(event){
        setSort(event.target.value)
    }

    function sortReviewsByStarAsc(review) {
      return review.sort((reviewA, reviewB) => {
        const starA = reviewA.star;
        const starB = reviewB.star;
        return starA - starB; // Ascending order (lowest to highest)
      });
    }

    function sortReviewsByStarDesc(review) {
      return review.sort((reviewA, reviewB) => {
        const starA = reviewA.star;
        const starB = reviewB.star;
        return starB - starA; // Descending order (highest to lowest)
      });
    }

    

    if(sort=="star-asc"){
        const tempReviews = [...submittedReviews]
        sortedReviews = sortReviewsByStarAsc(tempReviews); // Sort before rendering
    }  
        // descending review list
    else if(sort=="star-desc"){
        const tempReviews = [...submittedReviews]
        sortedReviews = sortReviewsByStarDesc(tempReviews); // Sort before rendering
    }  
        // default review list
    else{
        console.log("default")
        console.log(submittedReviews[0])
    }
    return context;
  }
  
export default ViewProductTrial






