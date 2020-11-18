import React,{useState} from "react"
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
const Get_Todos = gql`
{
  todos {
    task,
    id,
    status
  }
}
` ;

const ADD_TODO  = gql`
  mutation addTodo($task: String!){
    addTodo(task: $task) {
      task
    }
  }
`;
const DEL_TODO = gql`
  mutation delTodo($id: ID!) {
    delTodo(id: $id) {
    task
  }
  }
`;

const useStyles = makeStyles((theme: Theme) =>
createStyles({
  app: {
    
    maxWidth: "500px",
    margin: "auto",
  },
  margin: {
    color:"#3f51b5"
  },
  title:{
    textAlign:"center",
    marginBottom:"10px",
    color:"#3f51b5",
  },
  form:{
    padding:"10px 10px 10px 10px",
    marginTop:"10px",
    marginBottom:"10px",
    minWidth:"600px"
  },
  list:{
    width:"400px",
    textAlign:"center",
    color:"#000",
    borderRadius:"30px",
    boxShadow:"0 0 10px #000"
    
  },
  subtitle:{
    color:"#3f51b5",
    borderRadius:"10px",
    textAlign:"center",
    fontSize:"28px",
    boxShadow:"0 0 5px #3f51b5"

  }
})
)
export default function Home() {
  const classes = useStyles()




  const [taskdata, setTaskdata] = useState<string>("")
  const { loading, error, data } = useQuery(Get_Todos);
  
  if (error) {
     console.log(error) 
    return <h2>Error</h2>
  }
  const [addTodo] = useMutation(ADD_TODO);
  const [delTodo] = useMutation(DEL_TODO);
  const addTask = (event) => {
    event.preventDefault();
    addTodo({
      variables:{
        task: taskdata,
      },
      refetchQueries: [{ query: Get_Todos }]
    })
    setTaskdata ("");
  }
  const delTask = (id) => {
    console.log(JSON.stringify(id));
    delTodo({
      variables:{
        id: id,
      },
      refetchQueries: [{ query: Get_Todos }]
    });

  }  

  
  
  return (
    <div className={classes.app}>
      <Grid container spacing={3}>
        <Grid item xs={6} >
        <h1 className={classes.title}>Todo app</h1>
      <form onSubmit={addTask} className={classes.form}>
        <TextField id="outlined-basic" label="Todos" variant="outlined" value={taskdata}
        onChange={(e) => setTaskdata(e.target.value)}
        name="todo"
        required
        style={{width:"450px"}}
        />
        <br/>
        
      <Button variant="contained" color="primary" type="submit" style={{marginTop:"10px"}}>
        Add Task
      </Button>
        

        </form>
        </Grid>
        <Grid item xs={12}>
        <h3 className={classes.subtitle}>Todo List</h3>
        {loading ? (
          <div>
            <h1>loading</h1>
          </div>
        ):(
          data.todos.map((todo)=>(
            
            <Box display="flex" flexDirection="row" p={1} m={1} bgcolor="opal" key={todo.id} >
            
            <Box p={1} className={classes.list}>
            <p>{todo.task}</p>
            </Box>
            <Box p={1} >
              
              <IconButton aria-label="delete" className={classes.margin} onClick={() => {delTask(todo.id)}}>
                <DeleteIcon fontSize="large" />
              </IconButton>
              
            </Box>
              </Box>
          ))
        )}
      
      
      <br/>
        </Grid>
      </Grid>
      
        
      
      
      
    </div>
  )
}
