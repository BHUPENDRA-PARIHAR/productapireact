import React from 'react';
import 'react-responsive-modal/styles.css';



const Produccard = ({data, modalopen, cartfunction}) => {


  return (
    <>
    <div className='rounded-lg bg-cyan-300 p-2'>
    <div className=''>
        <img src={data.thumbnail} alt="" />
    </div>
    <div className='card-head'>
        <h1 className='text-center font-bold'>{data.title}</h1>
        <p className='text-center'>Price : {data.price}</p>
    </div>
    <div className='card-body flex justify-between pt-2 px-1'>
        <button type="button" onClick={modalopen} class="btn btn-outline-primary border-2 border-slate-400 hover:bg-transparent hover:border-2 bg-slate-400 p-[5px_10px] text-[14px] font-semibold rounded-lg">Details</button>
        <button type="button" onClick={cartfunction} class="btn btn-outline-primary border-2 border-slate-400 hover:bg-transparent hover:border-2   bg-slate-400 p-[5px_10px] text-[14px] font-semibold rounded-lg">Add Cart</button>
    </div>
    </div>
    
    </>
  )
}

export default Produccard
