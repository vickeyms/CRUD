import axios from "axios";
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const[users,setUsers]=useState([]);
  const[filterusers,setFilterusers]=useState([]);
  const[isModelOpen,setIsModelOpen]=useState(false);
  const[userData,setUserData]=useState({name:"",age:"",city:""})

  const getAllUsers=async()=>{
    await axios.get("http://localhost:8000/users").then
    ((res)=>{
      setUsers(res.data);
      setFilterusers(res.data)
      
      
    });
   
  }

  useEffect(()=>{
    getAllUsers();
  },[])
  //search fn
  const handleSearch=(e)=>{
    const searchText=e.target.value.toLowerCase();
    const filteredUsers=users.filter((user)=>user.name.toLowerCase().includes(searchText)||user.city.toLowerCase().includes(searchText));
    setFilterusers(filteredUsers)
  }

  //delete user
  const handleDelete=async(id)=>{
    const isconform=window.confirm("Are you sure want to delete user?")
    if(isconform){await axios.delete(`http://localhost:8000/users/${id}`).then((res)=>{
      setUsers(res.data);
      setFilterusers(res.data);
    })}
  }

  //close model

  const closeModel=()=>{
    setIsModelOpen(false)
    getAllUsers();
  }

  //add
  const handleAdd=()=>{
    setUserData({name:"",age:"",city:""});
    setIsModelOpen(true);

  }

//
const handleData=(e)=>{
  setUserData({...userData,[e.target.name]:e.target.value})

}

//

const handleSubmit=async(e)=>{
  e.preventDefault();
  if(userData.id){
    await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then((res)=>{
      console.log(res);})


  }
  else{
    
  await axios.post("http://localhost:8000/users",userData).then((res)=>{
    console.log(res);})

  }
  closeModel();
  setUserData({name:"",age:"",city:""});

    

}

//update
const handleUpdate=(user)=>{
  setUserData(user);
  setIsModelOpen(true);

}

  return (
   <>
   <div className="container">
    <h3>CRUD app</h3>
    <div className="input-search">
      <input type="search" placeholder="Search Text Here" onChange={handleSearch}/>
      <button className='btn green' onClick={handleAdd}>Add record</button>
    </div>
    <div >
      <table className="table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>city</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          { filterusers && filterusers.map((user,index)=>{
          return(
            <tr key={user.id}>
            <td>{index+1}</td>
            <td>{user.name}</td>
            <td>{user.age}</td>
            <td>{user.city}</td>
            <td><button className='btn green' onClick={()=>handleUpdate(user)}>Edit</button></td>
            <td><button onClick={()=>handleDelete(user.id)} className='btn red'>delete</button></td>
          </tr>);
          })}
          

        </tbody>
        
      </table>
      {isModelOpen&&(
        <div className="modal">
          <div className="modelcontent">
            <span className="close" onClick={closeModel}>&times;</span>
            <h2>{userData.id?"Update record":"Add record"}</h2>
            <div className="inputgroup">
              <label htmlFor="name">Full Name</label>
              <input type="text" value={userData.name} name="name" id="name" onChange={handleData}/>
              <label htmlFor="age">Age</label>
              <input type="number" value={userData.age} name="age" id="age" onChange={handleData}/>
              <label htmlFor="city">City</label>
              <input type="text" value={userData.city} name="city" id="city" onChange={handleData}/>
              <button className="btngreen" onClick={handleSubmit}>{userData.id?"Update user":"Add user"}</button>

            </div>
          </div>
        </div>
      )}
    </div>
   </div>
   </>
  )
}

export default App
