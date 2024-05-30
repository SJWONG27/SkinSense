import { Link} from 'react-router-dom';
import Rating from '@mui/material/Rating';

import './product.css';

function ProductCard({index, name, filter, price, description, imgsrc, seller, stars}){

    // extract the path from database ../frontend/src/uploads/ to ../uploads/
    imgsrc = "..".concat(imgsrc.substring(15))

    const dataToPass = { index2: index, name2: name, price2: price , image1:getImgUrl(imgsrc), description1: description, seller2:seller, star2:stars};
    if(name.toLowerCase().includes(filter.toLowerCase()) ||filter==""){
        return (
            <div className="product_card">
                <Rating className="product_stars" name="read-only" value={stars} sx={{color: "#300b14"}} readOnly size='small' />
                <p className='product_category'>{seller}</p>
                <img src={getImgUrl(imgsrc)} alt="image" width={100} height={130}/>
                <p>{name}</p>
                <p>RM{price}</p>
                <Link to={`/products/${index}`} state={dataToPass} className='view_product_btn'>View More</Link>
            </div>
         );
    }

    // function to get the url and pass to "src" attribute in <img> tag
    function getImgUrl(imgPath){
        return new URL(`${imgPath}`, import.meta.url).href
    }
}

export default ProductCard