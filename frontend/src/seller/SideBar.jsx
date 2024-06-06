import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import skinsense from "../assets/images/logo_skinsense.png"

function SideBar() {

    const[showProductMenu, setShowProductMenu] = useState(false);
    const onToggleProductMenu = () =>{
        setShowProductMenu(!showProductMenu);
    };

    return (
        <div className='sidebar'>
            <Link to='/BuyerPage'>
                <img className='logo' src={skinsense}/>
            </Link>
            
            <h1>Seller Centre</h1>
            <ul>
                <li><Link to='*/Order'>Order</Link></li>
                <li>
                    <span onClick={onToggleProductMenu}>Products</span>
                    {showProductMenu && (
                        <ul>
                            <li><Link to='*/MyProduct'>My Product</Link></li>
                            <li><Link to='*/AddProduct'>Add Product</Link></li>
                        </ul>
                    )}
                </li>
                <li><Link to='*/ChatManagement'>Chat</Link></li>
            </ul>
        </div>
    )
}

export default SideBar
