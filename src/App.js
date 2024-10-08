import React,{useState, useEffect} from 'react';
import axios from 'axios';
import "./App.css"

const API_URL = 'http://localhost:8008';

function App(){

  const [tasks, setTasks] = useState([]);
  const [task,setTask] = useState("");

  useEffect(()=>{
    fetchTasks();
  },[])

  const fetchTasks = async() => {
    try {
      const response = await axios.get(`${API_URL}/tasks`)
      setTasks(response.data);
    }catch(error){
      console.error("Error fetching tasks:",error);
    }
  };

  const addTask = async () => {
    if(task){
      try{
        await axios.post(`${API_URL}/tasks`,{title: task});
        setTask("")
        fetchTasks();
      }catch(error){
        console.error("Error adding task:",error);
      }
    }
  };

  const deleteTask = async (id) => {
    try{
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks()
    }catch(error){
      console.error("Error deleting task:",error);
    }
  };


  return(
    <div className='App'>
      <h2>To-Do List</h2>
      <input value={task} type='text' onChange={(e)=>setTask(e.target.value)} placeholder='Enter your new task'/>
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map((task)=>(
          <li key = {task._id}>
            {task.title} <button onClick={()=>deleteTask(task._id)}>Delete Task</button>
          </li>
        ))}
      </ul>
    </div>
  );

}
export default App;