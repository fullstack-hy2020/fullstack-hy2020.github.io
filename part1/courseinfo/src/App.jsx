
const Header = (props) => {
  console.log(props)
  return <h1>{props.course}</h1>
}

const Content = (parts) =>{
    console.log(parts)
      return(
      <div>
        <Part parts={parts.parts[0]} />
        <Part parts={parts.parts[1]} />
        <Part parts={parts.parts[2]} />
      </div>
      )
}


const Part = (parts) =>{
    console.log(parts)
    return(
      <div>
         <p>
          {parts.parts.name} {parts.parts.exercises}
         </p>
      </div>
      
    )
}

const Total = (parts) =>{
    console.log(parts)
    return(
      <div>
         <p>
          Number of exercises {parts.parts[0].exercises + parts.parts[1].exercises + parts.parts[2].exercises} 
         </p>
      </div>
      
    )
}

function App() {
  const course = 'Half Stack application development'
   const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]
  return (
    <>
      <Header course={course} />
      <Content parts ={parts} />
      <Total parts ={parts} />
     
    </>
  )
}

export default App
