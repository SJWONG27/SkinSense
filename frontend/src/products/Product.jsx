import React, { useState } from 'react';
import ProductList from './ProductList';
import { Select, MenuItem, InputLabel, FormControl} from '@mui/material';
import "./product.css"
function Product() {
  const[input, setInput] = useState("");
  const[sort, setSort] = useState("");
  return (
    <div className='homeContainer'>
      <div className="product_page">
        <br/>
        <h2>Products</h2>
        <input className="search_product_field" type='text' placeholder="Search product" value={input} onChange={(e)=>setInput(e.target.value)}></input>
        <FormControl className="sort_product_field" sx={{ m: 1, minWidth: 190 }} size="small" >
        <InputLabel>Sort by</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          label="Sort By"
          value={sort}
          onChange={handleChange}>
          <MenuItem value={"default"}>Default</MenuItem>
          <MenuItem value={"price-asc"}>Price Low to High</MenuItem>
          <MenuItem value={"price-desc"}>Price High to Low</MenuItem>
          <MenuItem value={"star-desc"}>Rating High to Low</MenuItem>
        </Select>
        </FormControl>
        <ProductList filter={input} sort={sort}/>
      </div>
    </div>
  );

  function handleChange(event){
      setSort(event.target.value)
  }
}

export default Product;