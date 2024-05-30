import Rating from '@mui/material/Rating';
import './product.css';

function Review({username, content, star, date}){
    return(
        <div className="review_container">
            <strong>{username}</strong><br/>
            <p className='date'>{date}</p>
            <Rating name="read-only" value={star} readOnly /><br/>
            <p>{content}</p>
        </div>
    );

}

export default Review