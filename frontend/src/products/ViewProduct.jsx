import { useLocation, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Rating from '@mui/material/Rating';
import Review from "./Review";
import { Button } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import NavBar from "../NavBar";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import { Select, MenuItem, InputLabel, FormControl} from '@mui/material';
import './product.css';

function ViewProduct(){
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const params = useParams();
  const [username, setUsername] = useState("");
  const [comments, setComments] = useState([]);
  const [userID, setUserID] = useState("");

  // to get the user ID, to trace name of commenter
  useEffect(()=>{ 
    async function getUserID() {
      const id = JSON.parse(localStorage.getItem('id'));
      setUserID(id);
    }
    getUserID();
    return;
  }, [])

  // to get the username, based on user ID
  useEffect(()=>{ 
  async function getUsername() {
    const userID = JSON.parse(localStorage.getItem('id'));
    const response = await fetch(`http://localhost:4000/user/userID/${userID}`);
    const result = await response.json();
    setUsername(result.username)
  }
  getUsername();
  return;
  }, [])

  // This method fetches the product comments from the database.
  useEffect(() => {
    async function getComments() {
      const response = await fetch(`http://localhost:4000/product/comments/${params.id.toString()}`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const result = await response.json();

      for (var comment of result.comments){
        var userID = comment.userID;
        const response = await fetch(`http://localhost:4000/user/userID/${userID}`);
        const result = await response.json();
        comment.username = result.username;

      }
      setComments(result.comments);
    }
    getComments();
    return;
  }, [comments.length, submittedReviews.length]);

  // This useEffect hook calculates the accumulated stars for this product & update to Product collection
  useEffect(()=>{
    async function getStars(){
        var sum = 0;  // get the total stars collected
        comments.map((comment)=>{sum+=comment.star})
        var avgStars = Math.ceil(sum/comments.length); // get the upper bound
        const response = await fetch(`http://localhost:4000/product/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
             star: avgStars
          })
        }) 
        const result = await response.json()
     }
     getStars();
     return;
},[comments.length, submittedReviews.length])

  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => () => {
    setState({ ...newState, open: true });
    addToCartFunc();
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

   // to set whether this product has been ordered by this user
   const [isOrdered, setIsOrdered] = useState(false)

   // to get products ordered
   useEffect(()=>{ 
     async function getOrders() {
       const userID = JSON.parse(localStorage.getItem('id'));
       const response = await fetch(`http://localhost:4000/orders/${userID}/${params.id}`);
       const result = await response.json();
       console.log(result)
       for(const order of result){
         if(order.itemId == params.id){
           setIsOrdered(true)
         }
       }
     }
     getOrders();
     return;
   }, [])

    const location = useLocation();
    const data = location.state;

    const [openDialog, setOpenDialog] = useState(false);
    const [star, setStar] = useState(0);  // for star ratings
    const[review, setReview] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [reviewSnackbar, setReviewSnackbar] = useState(false);

    const[sort, setSort] = useState("");

    const [currentDate, setCurrentDate] = useState(getDate());

    
    const handleClickOpen = () => {
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

    const handleReviewSnackbarClose = () => {
      setReviewSnackbar(false);
    };

    async function addCommentsFunc() {
        const response = await fetch(`http://localhost:4000/product/comments/${params.id.toString()}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
              userID: userID,
              star: star,
              content: review
          })
    
        });
        //console.log(response)
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          console.error(message);
          return;
        }

  }

  async function addToCartFunc() {
    const response = await fetch(`http://localhost:4000/cart/add/${params.id.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          userId: userID,
          quantity: 1,
      })

    });
    //console.log(response)
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`; 
      console.error(message);
      return;
    }
  }
  
  
    const handleSubmit = (event) => {
      event.preventDefault();
      setCurrentDate(getDate())
      
      if(review.length<5){
        setOpenSnackbar(true);
        return;
      }
      const newReview = {
        username: username,
        star: star,
        content: review,
        date: currentDate
      };
      setReviewSnackbar(true);
      setSubmittedReviews([...submittedReviews, newReview]);
      // Reset review form back to default value
      setReview(""); 
      setStar(0);
      setOpenDialog(false); // Close the dialog after submission
      addCommentsFunc();
    };

  if(isOrdered){
    // ascending review list
    if(sort=="star-asc"){
      const tempReviews = [...comments]
      const sortedReviews = sortReviewsByStarAsc(tempReviews); // Sort before rendering

      return (
        <>
        <NavBar/>
        <div className="view_product_page">
        <br/><br/><br/><br/>
        <img src={data.image1} alt="sss" width={400} height={400}/>
        <p className="product_name">{data.name2}</p>
        <p className="product_description"><strong>Description</strong><br/>{data.description1}</p>
        <p className="product_price">RM{data.price2}</p>
        <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })} variant="contained">Add to Cart</Button>
         
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

        <Snackbar
        open={reviewSnackbar}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
        autoHideDuration={1500}
        onClose={handleReviewSnackbarClose}>
          <Alert
            severity="success"
            variant="filled"
            >
            Review added
          </Alert>
        </Snackbar>

        <br/><br/><br/><br/><br/><br/><br/><br/><hr className="review_separator_line"/>
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
                <MenuItem value={"date-desc"}>Latest to Oldest</MenuItem>
              </Select>
              </FormControl>

            <div className='review_dialog'>
                  <Button color="error" variant="contained" onClick={handleClickOpen}>
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
              <Review key={review.date} username={review.username}  content={review.content} star={review.star} date={review.date.slice(0,10)}/>
               ))}
          </div>
        </div>
        </>
      ); 
    }   

    // descending review list
    else if(sort=="star-desc"){
      const tempReviews = [...comments]
      const sortedReviews = sortReviewsByStarDesc(tempReviews); // Sort before rendering
      return (
        <>
        <NavBar/>
        <div className="view_product_page">
        <br/><br/><br/><br/>
        <img src={data.image1} alt="sss" width={400} height={400}/>
        <p className="product_name">{data.name2}</p>
        <p className="product_description"><strong>Description</strong><br/>{data.description1}</p>
        <p className="product_price">RM{data.price2}</p>
        <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })} variant="contained">Add to Cart</Button>
         
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

        <Snackbar
        open={reviewSnackbar}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
        autoHideDuration={1500}
        onClose={handleReviewSnackbarClose}>
          <Alert
            severity="success"
            variant="filled"
            >
            Review added
          </Alert>
        </Snackbar>

        <br/><br/><br/><br/><br/><br/><br/><br/><hr className="review_separator_line"/>
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
                <MenuItem value={"date-desc"}>Latest to Oldest</MenuItem>

              </Select>
              </FormControl>

            <div className='review_dialog'>
                  <Button color="error" variant="contained" onClick={handleClickOpen}>
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
              <Review key={review.date} username={review.username} content={review.content} star={review.star} date={review.date.slice(0,10)}/>
               ))}
          </div>
        </div>
        </>
      ); 
    }  

     // from latest to oldest date
     else if(sort=="date-desc"){
      const tempReviews = [...comments]
      const sortedReviews = sortReviewsByDateDesc(tempReviews); // Sort before rendering
      return (
        <>
        <NavBar/>
        <div className="view_product_page">
        <br/><br/><br/><br/>
        <img src={data.image1} alt="sss" width={400} height={400}/>
        <p className="product_name">{data.name2}</p>
        <p className="product_description"><strong>Description</strong><br/>{data.description1}</p>
        <p className="product_price">RM{data.price2}</p>
        <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })} variant="contained">Add to Cart</Button>
         
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

        <Snackbar
        open={reviewSnackbar}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
        autoHideDuration={1500}
        onClose={handleReviewSnackbarClose}>
          <Alert
            severity="success"
            variant="filled"
            >
            Review added
          </Alert>
        </Snackbar>

        <br/><br/><br/><br/><br/><br/><br/><br/><hr className="review_separator_line"/>
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
                <MenuItem value={"date-desc"}>Latest to Oldest</MenuItem>

              </Select>
              </FormControl>

            <div className='review_dialog'>
                  <Button color="error" variant="contained" onClick={handleClickOpen}>
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
              <Review key={review.date} username={review.username}  content={review.content} star={review.star} date={review.date.slice(0,10)}/>
               ))}
          </div>
        </div>
        </>
      ); 
    }  

    // default review list
    else{
      return (
        <>
        <NavBar/>
        <div className="view_product_page">
        <br/><br/><br/><br/>
        <img src={data.image1} alt="sss" width={400} height={400}/>
        <p className="product_name">{data.name2}</p>
        <p className="product_description"><strong>Description</strong><br/>{data.description1}</p>
        <p className="product_price">RM{data.price2}</p>
        <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })} variant="contained">Add to Cart</Button>
         
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

        <Snackbar
        open={reviewSnackbar}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
        autoHideDuration={1500}
        onClose={handleReviewSnackbarClose}>
          <Alert
            severity="success"
            variant="filled"
            >
            Review added
          </Alert>
        </Snackbar>

        <br/><br/><br/><br/><br/><br/><br/><br/><hr className="review_separator_line"/>
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
                <MenuItem value={"date-desc"}>Latest to Oldest</MenuItem>

              </Select>
              </FormControl>

            <div className='review_dialog'>
                  <Button color="error" variant="contained" onClick={handleClickOpen}>
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
              {/* {submittedReviews.map((review) => (
              <Review key={review.date} username={review.username} content={review.content} star={review.star} date={review.date} />
               ))} */}
            {comments.length>0 && comments.map((review) => (
                <Review key={review.date} username={review.username} content={review.content} star={review.star} date={review.date.slice(0,10)} />
              ))}
          </div>

        </div>
        </>
      ); 
    }  
  }

  // NOT ORDERED, NO REVIEW BUTTON
  else{
    // ascending review list
    if(sort=="star-asc"){
      const tempReviews = [...comments]
      const sortedReviews = sortReviewsByStarAsc(tempReviews); // Sort before rendering

      return (
        <>
        <NavBar/>
        <div className="view_product_page">
        <br/><br/><br/><br/>
        <img src={data.image1} alt="sss" width={400} height={400}/>
        <p className="product_name">{data.name2}</p>
        <p className="product_description"><strong>Description</strong><br/>{data.description1}</p>
        <p className="product_price">RM{data.price2}</p>
        <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })} variant="contained">Add to Cart</Button>
         
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

        <Snackbar
        open={reviewSnackbar}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
        autoHideDuration={1500}
        onClose={handleReviewSnackbarClose}>
          <Alert
            severity="success"
            variant="filled"
            >
            Review added
          </Alert>
        </Snackbar>

        <br/><br/><br/><br/><br/><br/><br/><br/><hr className="review_separator_line"/>
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
                <MenuItem value={"date-desc"}>Latest to Oldest</MenuItem>
              </Select>
              </FormControl>

            <div className='review_dialog'>
                  {/* <Button color="error" variant="contained" onClick={handleClickOpen}>
                        Add Review
                  </Button> */}
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
              <Review key={review.date} username={review.username}  content={review.content} star={review.star} date={review.date.slice(0,10)}/>
               ))}
          </div>
        </div>
        </>
      ); 
    }   

    // descending review list
    else if(sort=="star-desc"){
      const tempReviews = [...comments]
      const sortedReviews = sortReviewsByStarDesc(tempReviews); // Sort before rendering
      return (
        <>
        <NavBar/>
        <div className="view_product_page">
        <br/><br/><br/><br/>
        <img src={data.image1} alt="sss" width={400} height={400}/>
        <p className="product_name">{data.name2}</p>
        <p className="product_description"><strong>Description</strong><br/>{data.description1}</p>
        <p className="product_price">RM{data.price2}</p>
        <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })} variant="contained">Add to Cart</Button>
         
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

        <Snackbar
        open={reviewSnackbar}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
        autoHideDuration={1500}
        onClose={handleReviewSnackbarClose}>
          <Alert
            severity="success"
            variant="filled"
            >
            Review added
          </Alert>
        </Snackbar>

        <br/><br/><br/><br/><br/><br/><br/><br/><hr className="review_separator_line"/>
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
                <MenuItem value={"date-desc"}>Latest to Oldest</MenuItem>

              </Select>
              </FormControl>

            <div className='review_dialog'>
                  {/* <Button color="error" variant="contained" onClick={handleClickOpen}>
                        Add Review
                  </Button> */}
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
              <Review key={review.date} username={review.username} content={review.content} star={review.star} date={review.date.slice(0,10)}/>
               ))}
          </div>
        </div>
        </>
      ); 
    }  

    // from latest to oldest date
    else if(sort=="date-desc"){
      const tempReviews = [...comments]
      const sortedReviews = sortReviewsByDateDesc(tempReviews); // Sort before rendering
      return (
        <>
        <NavBar/>
        <div className="view_product_page">
        <br/><br/><br/><br/>
        <img src={data.image1} alt="sss" width={400} height={400}/>
        <p className="product_name">{data.name2}</p>
        <p className="product_description"><strong>Description</strong><br/>{data.description1}</p>
        <p className="product_price">RM{data.price2}</p>
        <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })} variant="contained">Add to Cart</Button>
         
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

        <Snackbar
        open={reviewSnackbar}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
        autoHideDuration={1500}
        onClose={handleReviewSnackbarClose}>
          <Alert
            severity="success"
            variant="filled"
            >
            Review added
          </Alert>
        </Snackbar>

        <br/><br/><br/><br/><br/><br/><br/><br/><hr className="review_separator_line"/>
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
                <MenuItem value={"date-desc"}>Latest to Oldest</MenuItem>

              </Select>
              </FormControl>

            <div className='review_dialog'>
                  {/* <Button color="error" variant="contained" onClick={handleClickOpen}>
                        Add Review
                  </Button> */}
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
              <Review key={review.date} username={review.username}  content={review.content} star={review.star} date={review.date.slice(0,10)}/>
               ))}
          </div>
        </div>
        </>
      ); 
    }  

    // default review list
    else{
      return (
        <>
        <NavBar/>
        <div className="view_product_page">
        <br/><br/><br/><br/>
        <img src={data.image1} alt="sss" width={400} height={400}/>
        <p className="product_name">{data.name2}</p>
        <p className="product_description"><strong>Description</strong><br/>{data.description1}</p>
        <p className="product_price">RM{data.price2}</p>
        <Button onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })} variant="contained">Add to Cart</Button>
         
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

        <Snackbar
        open={reviewSnackbar}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
        autoHideDuration={1500}
        onClose={handleReviewSnackbarClose}>
          <Alert
            severity="success"
            variant="filled"
            >
            Review added
          </Alert>
        </Snackbar>

        <br/><br/><br/><br/><br/><br/><br/><br/><hr className="review_separator_line"/>
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
                <MenuItem value={"date-desc"}>Latest to Oldest</MenuItem>

              </Select>
              </FormControl>

            <div className='review_dialog'>
                  {/* <Button color="error" variant="contained" onClick={handleClickOpen}>
                        Add Review
                  </Button> */}
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
              {/* {submittedReviews.map((review) => (
              <Review key={review.date} username={review.username} content={review.content} star={review.star} date={review.date} />
               ))} */}
            {comments.length>0 && comments.map((review) => (
                <Review key={review.date} username={review.username} content={review.content} star={review.star} date={review.date.slice(0,10)} />
              ))}
          </div>

        </div>
        </>
      ); 
    } 
  }

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

      function sortReviewsByDateDesc(review) {
        return review.sort((reviewA, reviewB) => {
          const dateA = new Date(reviewA.date); // Convert to Date object
          const dateB = new Date(reviewB.date);
          return dateB - dateA; // Descending order (latest to oldest)
        });
      }


      function getDate() {
        const today = new Date();
        var month = today.getMonth()+1;
        if(month.toString().length<2){
          month = "0"+month;
        }
        
        const year = today.getFullYear();
        var date = today.getDate();
        if(date.toString().length<2){
          date = "0"+date;
        }
        return `${year}-${month}-${date}`;
      }
}

export default ViewProduct