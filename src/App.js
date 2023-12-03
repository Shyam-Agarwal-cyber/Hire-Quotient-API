import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { GrPrevious, GrNext } from "react-icons/gr";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function App() {
  const[data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  console.log("rerender"
  )

  useEffect(()=>{
    axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
          .then((res)=>{
            setData(res.data);
            setFilteredData(res.data);
          })
          .catch((err)=>{
            console.log(err);
          });
  },[]);


  const [itemsToBeDel, setItemsToBeDel] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const handleSelectOne = (e, id)=>{
    // console.log(itemsToBeDel)
    if(e.target.checked){
      if(!itemsToBeDel.includes(id)) setItemsToBeDel([...itemsToBeDel, id]);
    }else{
      if(itemsToBeDel.includes(e.id)) setItemsToBeDel(itemsToBeDel.filter(item => item !== id))
    }    
  }

  const handleSelectAll = (e)=>{
    const checkboxEl = document.querySelectorAll(".checkbox");
    setIsAllChecked((checked)=> !checked)

    if(e.target.checked){
      checkboxEl.forEach(el => {
        el.checked = true;
        if(!itemsToBeDel.includes(el.id)) setItemsToBeDel((itemsArr)=>[...itemsArr, el.id])
      })
    }
    else{
      checkboxEl.forEach(el => {
        el.checked = false;
        if(itemsToBeDel.includes(el.id)) setItemsToBeDel(itemsToBeDel.filter(item => item !== el.id))
      })
    }
    
  }

  const handleEdit = (itemId) => {
    console.log('Edit item with ID:', itemId);
  };

  const handleDelete = () => {
    console.log(itemsToBeDel)
  };

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Calculate the indexes for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => {
    setIsAllChecked(false);
    setCurrentPage(page);
  };

  // Handle search
  useEffect(() => {
    console.log('dga');
    setFilteredData(
      data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase()) || item.email.toLowerCase().includes(searchTerm.toLowerCase()) || item.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const Pagination = ({ itemsPerPage, totalPages, handlePageChange, currentPage }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className='flex flex-col items-center'>
        <div>
          {currentPage > 1 && <button className='bg-slate-200 btn m-2 w-6 h-6' onClick={() => handlePageChange(currentPage-1)}><GrPrevious/></button>}
          {pageNumbers.map(number => (
            <button className='bg-slate-200 btn m-2 w-6' key={number} onClick={() => handlePageChange(number)}>
              {number}
            </button>
          ))}
          {currentPage < totalPages && <button className='bg-slate-200 btn m-2 w-6 h-6' onClick={() => handlePageChange(currentPage+1)}><GrNext/></button>}
        </div>
        
        <div className='bg-slate-200 btn m-2 w-fit justify-between p-1'>Current Page: {currentPage}</div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className='w-auto m-5'>
        <input
          className='bg-indigo-200 border-indigo-500 p-2 w-full rounded-lg'
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <table className='flex flex-col items-center m-5 justify-between w-auto rounded-lg bg-stone-200'>
        <thead className='w-full m-2'>
          <tr className='flex items-center justify-between w-full'>
            <th className='p-2 ml-1 mr-1 bg-cyan-600 w-1/12'><input type='checkbox' onClick={handleSelectAll} checked= {isAllChecked}/></th>
            <th className='p-2 ml-1 mr-1 bg-cyan-600 w-full'>ID</th>
            <th className='p-2 ml-1 mr-1 bg-cyan-600 w-full'>Name</th>
            <th className='p-2 ml-1 mr-1 bg-cyan-600 w-full'>Email</th>
            <th className='p-2 ml-1 mr-1 bg-cyan-600 w-full'>Role</th>
            <th className='p-2 ml-1 mr-1 bg-cyan-600 w-full'>Actions</th>
          </tr>
        </thead>
        <tbody className='w-full'>
          {filteredData.slice(indexOfFirstItem, indexOfLastItem).map(item => (
            <tr key={item.id} className='flex items-center justify-between w-full'>
              <td className='p-2 ml-1 mr-1 mb-1 bg-cyan-100 w-1/12'><input type='checkbox' className='checkbox' id={item.id} onClick={(e)=>handleSelectOne(e, item.id)}/></td>
              <td className='p-2 ml-1 mr-1 mb-1 bg-cyan-100 lg w-full'>{item.id}</td>
              <td className='p-2 ml-1 mr-1 mb-1 bg-cyan-100 w-full'>{item.name}</td>
              <td className='p-2 ml-1 mr-1 mb-1 bg-cyan-100 w-full'>{item.email}</td>
              <td className='p-2 ml-1 mr-1 mb-1 bg-cyan-100 w-full'>{item.role}</td>
              <td className='p-2 ml-1 mr-1 mb-1 bg-cyan-100 w-full flex justify-around'>
                <button onClick={() => handleEdit(item.id)}><FaRegEdit/></button>
                <button onClick={() => handleDelete(item.id)}><MdDelete/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
      />
    </div>
  );
}

export default App;
