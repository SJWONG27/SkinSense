import { Link } from "react-router-dom";
import Avatar from "./general/Avatar";
import avatarUser from '../src/assets/images/img_avatar.jpeg'
import ShoppingCart from "@mui/icons-material/ShoppingCart";

function NavBar(){
    return(
        <div className='navbar'>
            <img className="logo" src="../src/assets/images/logo_skinsense.png"/>
            <div className="navbarLinkContainer">
                <Link to="/Home" className='link'>Home</Link>
                <Link to="/products" className='link'>Products</Link>
                <Link to="/chat" className='link'>Chat</Link>
                <Link to="/sellerDashboard" className='link'>Seller Centre</Link>
            </div>
            <div className="navbarLinkContainer">
                <Link to="/shoppingcart" className='link'>
                    <ShoppingCart/>
                </Link>
                <Link to="/profile" className='link'>
                    <Avatar photo={avatarUser} name={"Zhang LingHe"}/>
                </Link>
            </div>

            
        </div>
        
    )
}

export default NavBar