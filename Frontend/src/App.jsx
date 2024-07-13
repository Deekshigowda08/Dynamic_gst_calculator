import React, { useState } from 'react';
import './App.css';
import { MdExpandMore, MdExpandLess, MdDeleteOutline } from "react-icons/md";

function App() {
  const [divs, setDivs] = useState([{ id: 0, value: '', selectedItem: null, dropdownVisible: false }]);
  const [items, setItems] = useState([
    { id: 1, name: "Food items(rice,egg,etc)", description: "Description for 0" },
    { id: 2, name: "Processed food(Bread,biscuits,etc)", description: "Description for 5" },
    { id: 3, name: "Cut and semi-polished stones(Rubies,cut diamonds)", description: "Description for.25" },
    { id: 4, name: "Household necessities(oil,indiansweets,etc)", description: "Description for 5" },
    { id: 5, name: "mini electronics(including computer under 32 in)", description: "Description for 12" },
    { id: 6, name: "industrial intermediaries(chemicals,plastics,etc)", description: "Description for 18" },
    { id: 7, name: "luxury items(car,refrigerators,etc)", description: "Description for 28" },
    { id: 8, name: "capital goods(soaps,hair oil,etc)", description: "Description for 18" },
    { id: 9, name: "clothing", description: "Description for 12" }
  ]);
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const addDiv = () => {
    setDivs([...divs, { id: divs.length, value: '', selectedItem: null, dropdownVisible: false }]);
  };

  const handleInputChange = (index, event) => {
    const newDivs = [...divs];
    newDivs[index].value = event.target.value;
    setDivs(newDivs);
  };

  const handleItemChange = (index, field, value) => {
    const newDivs = [...divs];
    newDivs[index][field] = value;
    setDivs(newDivs);
  };

  const removeDiv = (index) => {
    const newDivs = divs.filter((_, i) => i !== index);
    setDivs(newDivs);
  };

  const toggleDropdown = (index) => {
    const newDivs = divs.map((div, i) => (
      i === index ? { ...div, dropdownVisible: !div.dropdownVisible } : { ...div, dropdownVisible: false }
    ));
    setDivs(newDivs);
  };

  const handleItemClick = (index, item) => {
    const newDivs = [...divs];
    newDivs[index].selectedItem = item;
    newDivs[index].dropdownVisible = false;
    setDivs(newDivs);
  };
  const stati=()=>{
      window.location.assign("https://www.paisabazaar.com/tax/gst-calculation-tool/")
  }
  const handleDownload = async () => {
    
    try {
      const products = divs.map(div => ({
        category: div.selectedItem.name,
        price: div.price,
        quantity: div.quantity,
        name:div.product
      }));
      const response = await fetch('http://127.0.0.1:8000/myapp/download/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products })
    });

      // Create a URL and anchor element to trigger the download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product_list.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading product list:', error);
      
    }
  };
  const handleSubmit = () => {
    const products = divs.map(div => ({
      category: div.selectedItem.name,
      price: div.price,
      quantity: div.quantity
      
    }));

    fetch('http://127.0.0.1:8000/myapp/calculate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Update the state with the calculated GST and total
      const updatedDivs = divs.map((div, index) => ({
        ...div,
        gst: data.products[index].gst,
        total: data.products[index].total
      }));
      setDivs(updatedDivs);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f7f7f7] flex-1 flex-col justify-center px-6 py-6 lg:px-[20%]">
      <div className="flex min-h-full border bg-white shadow-lg shadow-slate-200 md:shadow-xl md:shadow-slate-200 flex-1 flex-col px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Expenditure manager"
            src="/logo.png"
            className="mx-auto h-10 w-auto"
          />
        </div>
        <div className='h-[20%]'>
          <div className="mt-5 sm:mx-auto h-[0%] sm:w-full sm:max-w-sm">
            <label htmlFor="name" className="block text-xs font-bold font-serif leading-6 text-gray-900">
              Company Name
            </label>
            <div className="my-2">
              <input
                id="name"
                name="name"
                type="text"
                onChange={(e) => setCompany(e.target.value)}
                required
                className="block px-4 h-[3%] w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="address" className="block text-xs font-bold font-serif leading-6 text-gray-900">
              Address
            </label>
            <div className="my-2">
              <input
                id="address"
                name="address"
                type="text"
                onChange={(e) => setAddress(e.target.value)}
                required
                className="block px-4 h-[3%] w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <label htmlFor="phone" className="block text-xs font-bold font-serif leading-6 text-gray-900">
              Phone number:
            </label>
            <div className="mt-2 mb-5">
              <input
                id="phone"
                name="phone"
                type="number"
                onChange={(e) => setPhone(e.target.value)}
                required
                className="block px-4 w-full h-[3%] rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
        <div className='w-[100%] h-[1px] bg-gray-500'></div>
        <div className='px-10 py-2'>
          <div className='text-center text-2xl font-bold font-serif'>Add Products</div>
          <div className="container">
            {divs.map((div, index) => (
              <div key={div.id} className="input-container flex items-center gap-4">
                <div className='font-bold font-serif text-center'>{div.id + 1}.</div>
                <div className='flex flex-col w-[15%]'>
                  <label htmlFor={`product-${index}`} className='text-[10px] font-serif font-bold p-0.5'>Product</label>
                  <input
                    type="text"
                    id={`product-${index}`}
                    name='product'
                    value={div.product || ''}
                    onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                    className='w-[90%] border  p-1 text-[10px]'
                    placeholder={`Input ${div.id + 1}`}
                  />
                </div>
                <div className="flex flex-col w-[20%] relative">
                  <label className='text-[10px] font-serif font-bold p-0.5'>Category</label>
                  <div
                    className=" font-medium text-[7px] bg-white p-1 cursor-pointer gap-2 flex border-b"
                    onClick={() => toggleDropdown(index)}
                  >
                    {div.selectedItem ? div.selectedItem.name : "Select a category"}
                    <div className='p-1'>{div.dropdownVisible ? <MdExpandLess /> : <MdExpandMore />}</div>
                  </div>
                  {div.dropdownVisible && (
                    <div className="bg-white w-[100%] h-[10vh] overflow-scroll  absolute top-12 z-10 ">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="cursor-pointer text-[7px] bg-white p-1 overflow-clip"
                          onClick={() => handleItemClick(index, item)}
                        >
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className='flex flex-col w-[10%]'>
                  <label htmlFor={`price-${index}`} className='text-[10px] font-serif font-bold p-0.5'>Price</label>
                  <input
                    type="number"
                    id={`price-${index}`}
                    name='price'
                    value={div.price || ''}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    className='w-[100%] p-1 border text-[10px]'
                    placeholder={`Input ${div.id + 1}`}
                  />
                </div>
                <div className='flex flex-col w-[10%]'>
                  <label htmlFor={`quantity-${index}`} className='text-[10px] font-serif font-bold p-0.5'>Quantity</label>
                  <input
                    type="number"
                    id={`quantity-${index}`}
                    name='quantity'
                    value={div.quantity || ''}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className='w-[100%] p-1 border text-[10px]'
                    placeholder={`Input ${div.id + 1}`}
                  />
                </div>
                <div className=''>
                  <div className='text-center text-[10px] font-serif font-bold p-0.5'>GST</div>
                  <div className='text-center text-[10px] font-bold p-0.5'>{div.gst ? `${div.gst}%` : '0%'}</div>
                </div>
                <div className=''>
                  <div className='text-center text-[10px] font-serif font-bold p-0.5'>Total</div>
                  <div className='text-center text-[10px] font-bold p-0.5'>₹{div.total ? div.total : '0'}</div>
                </div>
                <button className='p-1 bg-red-600 m-1' onClick={() => removeDiv(index)}><MdDeleteOutline /></button>
              </div>
            ))}
          </div>
          <div className='flex w-[100%] justify-between'>
            <button onClick={addDiv} className="add-button bg-yellow-500">Add</button>
            <button onClick={handleSubmit} className="submit-button bg-blue-500">Submit</button>
            <button onClick={stati} className="submit-button bg-blue-500 text-sm">Static calculater</button>
            <button onClick={handleDownload}>Download Product List</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
