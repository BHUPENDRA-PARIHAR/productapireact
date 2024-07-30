import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Produccard from './comman component/Produccard';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import { MdShoppingCart } from "react-icons/md";
import Cookies from 'js-cookie';

import { RxCross2 } from "react-icons/rx";


const Header = () =>{
        const [data, setData] =useState([])
        const [allData,setAllData]= useState([])
        const[totalPages, setTPage]= useState(1)
        const [currentPage, setCurrentPage] = useState(1);
        const [categories, setCategories] = useState([]);
        const [activeCat, setActivecat] = useState('all');
        const [cartCount, setCartCount] = useState(null);
        const [minPrice, setMinPrice] =useState(0);
        const [maxPrice, setMaxPrice] = useState(1000000);
        const [userPriceLimit, setUserPriceLimit] = useState(0);
        const [modeldata, setModeldata] = useState({});
        const [cardPosition, setCardPosition] =useState('-800px');
        const [cardoverlay, setCardoverlay] = useState('none');
        const [cartData, setCartData] = useState([]);
        const [cartProduct, setCartProduct]= useState([]);

    const getData = async()=>{
      let url = `https://dummyjson.com/products?limit=12&skip=${(currentPage-1)*12}`

      if(activeCat !== 'all'){
        url = `https://dummyjson.com/products/category/${activeCat}?limit=12&skip=${(currentPage-1)*12}`
      }
       const response=await axios.get(url);

       
       
       if(response.status !== 200) return alert('something went wrong!')
            setData(response.data.products);
            setAllData(response.data.products);
            setTPage(Math.ceil((response.data.total)/12));
                let min = Infinity;
                let max = -Infinity;
            response.data.products.forEach((item)=>{
            

              if(item.price < min){
                min = item.price;
              };

             

              if(item.price > max){
                max = item.price;
              };

              
            })
            setMinPrice(min);
            setMaxPrice(max);
            setUserPriceLimit(max);
    }    


    const getCategories = async()=>{
      const response =await axios.get('https://dummyjson.com/products/categories');
      setCategories(response.data)
    }

    useEffect(()=>{
      getCategories();
    },[]);

    useEffect(()=>{
        getData(); 
    },[currentPage, activeCat]);


    const pricefilter =()=>{
      const pricedata =allData.filter((item)=>item.price <= userPriceLimit);
      setData(pricedata);
    }

    useEffect(()=>{
      pricefilter();
    },[userPriceLimit]);


    const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const handleAddtoCart =(productData)=>{
    let olddata = Cookies.get('product-cart')
    if(olddata){
      olddata = JSON.parse(olddata);
    }else{
      olddata = [];
    }

    const indexNo = olddata.findIndex((item)=> item.id === productData.id);

    if(indexNo === -1){
      const data ={
        id:productData.id,
        quentity:1
      }

      olddata.push(data);
      Cookies.set('product-cart', JSON.stringify(olddata));
      
    }else{
      olddata[indexNo].quentity = olddata[indexNo].quentity + 1;

      Cookies.set('product-cart', JSON.stringify(olddata));
        
    }
    getCartData();
  }

  const getCartData = () =>{
    let olddata = Cookies.get('product-cart')
    if(olddata){
      olddata = JSON.parse(olddata);
    }else{
      olddata = [];
    }
    let total =0;
    olddata.forEach((item)=>{
        total += item.quentity
    })
    setCartData(olddata);
    setCartCount(total);

  }

  useEffect(()=>{
    getCartData();
  },[]);


  const handleModel =(indexdata)=>{
    setModeldata(data[indexdata]);
    onOpenModal();
  }

  useEffect(()=>{
    const allIds =[];
    cartData.filter((item)=>{
        allIds.push(item.id)
    })

    
    axios.get('https://dummyjson.com/products?limit=194')
    .then((response)=>{
     
    const cartProducts = response.data.products.filter((item)=> allIds.includes(item.id, item.quentity));

    cartProducts.forEach((item,in1)=>{
      cartData.forEach((cartIn, in2)=>{
        if(item.id === cartIn.id){
          cartProducts[in1].quantity = cartData[in2].quentity
        }
      });

      setCartProduct(cartProducts);

    });

   
    // const finalCart = cartProduct.map((item)=> {
    //   cartData.forEach((cart)=>{
    //     if(cart.id === item.id){
    //       setCartProduct([...cartProduct,{...item, quentity: cart.quentity}]);

    //       console.log([...cartProduct,{...item, quentity: cart.quentity}]);
    //       }
    //   })
    // })
    
    })

  },[cardPosition]);

  return (
    <>
    <div className='nav flex justify-between items-center px-2 py-5'>
      <div>
      <h1 className='text-[36px] ps-5 font-bold uppercase font-serif text-gray-600'>Products</h1>
      </div>
      <div className='px-5 flex'>
      <MdShoppingCart className='text-[40px] text-gray-600 ' onClick={()=>{setCardPosition('0px');setCardoverlay('block') }} />
      <sup className='text-[14px] font-semibold p-0 top-[0]'>{cartCount}</sup>
      </div>
    </div>
    <div className='w-[40vw] h-[100vh] bg-white fixed top-0 z-[9999] transition-[0.2s] overflow-y-scroll scroling'style={{right:cardPosition}}> 
          <div className='flex justify-start p-2'><RxCross2 className='text-[20px]' onClick={()=>{setCardPosition('-800px');setCardoverlay('none')}} /></div>
          <div className='product-details flex justify-center'>
              <table className='border text-[13px] m-2 '>
                <thead>
                <tr>
                  <th className='px-3 border'>Sr. No.</th>
                  <th className='px-3 border'>Product Name</th>
                  <th className='px-3 border'>Product Img</th>
                  <th className='px-3 border'>Product Price</th>
                  <th className='px-2'>Remove</th>
                  <th className='px-3 border'>Product Quantity</th>
                  <th className='px-2'>Add</th>
                  <th className='px-3 border'>Total</th>
                </tr>
                </thead>
                <tbody>
                {
                  cartProduct.map((cartD,i)=>(
                    <tr className='text-center border'>
                      <td className='border-collapse border'>{i + 1}</td>
                      <td className='border-collapse border'>{cartD.title}</td>
                      <td className='border-collapse flex justify-center'>
                        <img src={cartD.thumbnail} alt="" height={'100%'} width={'100%'} />
                        </td>
                      <td className='border-collapse border'>{cartD.price}</td>
                      <td className='border-collapse border'>-</td>
                      <td className='border-collapse border'>{cartD.quantity}</td>
                      <td className='border-collapse border'>+</td>
                      <td className='border-collapse border'>Total</td>
                    </tr>
                  ))
                }
                </tbody>  
              </table>
          </div>
    </div>
    <div className='w-[100vw] h-[100vh] bg-[rgba(0,0,0,.40)] fixed top-0 right-0 z-[9998]' style={{display:cardoverlay}} onClick={()=>{setCardPosition('-800px');setCardoverlay('none') }}> 

    </div>
      <div className='container grid grid-cols-[1fr_3fr] gap-2'>
        <div className='product-filter bg-[cyan]'>
           <div className='categories'>
            <h3 className='text-[30px] font-bold text-center p-2 text-gray-600 uppercase'>Categories</h3>
              <ul>
                <li className= {`p-2 m-1 bg-cyan-300 font-bold ps-4 border-2 border-cyan-300 cursor-pointer hover:bg-transparent ${activeCat === 'all' ? 'active-cat-li' : ''}`}
                 onClick={()=>{setActivecat('all')}}>
                  All
                  </li>
              {
                categories.map((cat)=>(
                    <li className={`p-2 m-1 bg-cyan-300 font-bold ps-4 border-2 border-cyan-300 cursor-pointer hover:bg-transparent ${activeCat === cat.slug ? 'active-cat-li' : ''} `}
                    onClick={()=>{setActivecat(cat.slug)}}
                    >{cat.name}
                    </li>
                ))
              }
              </ul>
           </div>
           <div  className='p-2 mt-3'>
            <h1 className='text-center text-[20px] font-semibold uppercase'>Price filter</h1>
            <div className='px-3 py-4'>
              <input type="range" className='w-full' min={minPrice} max={maxPrice} value={userPriceLimit} onChange={(e)=>{setUserPriceLimit(Number(e.target.value))}} />

              <span className='pt-3'>Max Price :</span>
              <span>{userPriceLimit}</span>
            </div>
           </div>
        </div>
        <div className='products bg-[cyan] grid grid-cols-[1fr_1fr_1fr_1fr] gap-2 p-2'> 
        {
             data.map((product, index)=>(
              <Produccard key={index} cartfunction={()=>{handleAddtoCart(product)}} modalopen={()=>handleModel(index)} data={product}/>
             ))
            }
        </div>

      </div>
      <div className='p-[20px_25px]'>
      <ResponsivePagination
      current={currentPage}
      total={totalPages}
      onPageChange={setCurrentPage}
    />
      </div>
      <div>
      {/* <button onClick={onOpenModal}>Open modal</button> */}
      <Modal open={open} onClose={onCloseModal} center>
        <div className='flex items-center'>
          <div className='grid grid-cols-[1fr_2fr]'>
            <div className=''>
            <img src={modeldata.thumbnail} alt="" />
            <div className='flex justify-center'>
            <img src={modeldata.thumbnail} alt="" width={'30%'} className='border me-1 bg-gray-300 rounded-lg' />
            <img src={modeldata.thumbnail} alt="" width={'30%'} className='border me-1 bg-gray-300 rounded-lg'/>
            <img src={modeldata.thumbnail} alt="" width={'30%'} className='border bg-gray-300 rounded-lg'/>
            </div>
            </div>
            <div className='flex justify-center items-center'>
              <div>
              <h1 className='text-[30px] font-bold'>{modeldata.title}</h1>
              <p className='text-[20px] font-bold'>Price: <span className='bg-[gray] p-1 text-white'>{modeldata.price}</span></p>
              <p className=''><span className='font-semibold'>Product Rating:</span> {modeldata.rating}</p>
              <p className='justify pt-3 pe-8'><span className='font-semibold'>Description :</span> {modeldata.description}</p>
              </div>
             
            </div>
          </div>
        </div>
        
      </Modal>
    </div>
          
    

    </>
  )
}

export default Header
