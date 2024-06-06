import { Link } from "react-router-dom";
import Avatar from "./general/Avatar";
import avatarUser from '../src/assets/images/img_avatar.jpg'
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { UserContext } from "./general/UserContext";
import { useContext } from "react";

function NavBar(){
    const { user } = useContext(UserContext);

    return(
        <div className='navbar'>
            <img className="logo" src="../src/assets/images/logo_skinsense.png"/>
            <div className="navbarLinkContainer">
                <Link to="/products" className='link'>Products</Link>
                <Link to="/chat" className='link'>Chat</Link>
                <Link to="/sellerDashboard" className='link'>Seller Centre</Link>
                <Link to="/myOrder" className='link'>My Order</Link>
            </div>
            <div className="navbarLinkContainer">
                <Link to="/shoppingcart" className='link'>
                    <ShoppingCart/>
                </Link>
                {user && (
                  <Link to="/profilePage" className='link'>
                      <Avatar photo={user.profilePic} name={user.username}/>
                  </Link>
                )}
            </div>

            
        </div>
        
    )
}

export default NavBar