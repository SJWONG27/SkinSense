import Rating from '@mui/material/Rating';
import './product.css';

function Review({content, star, date}){
    return(
        <div className="review_container">
            <strong>Hor</strong><br/>
            <p className='date'>{date}</p>
            <Rating name="read-only" value={star} readOnly /><br/>
            <p>{content}</p>
        </div>
    );

}

export default Review