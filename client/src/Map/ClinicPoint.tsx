import { makeStyles } from "@material-ui/styles"

type ClinicPointProps = {
  name: string
  onClick: () => void
}

const styles = makeStyles({
  root:{
    background: 'white',
    border: 5,
    borderColor: 'black',
    borderRadius: '5px',
    padding: '10px',
    width: '60px',
    zIndex: 1000,
    position: 'relative'
  }
})


const ClinicPoint = (props: ClinicPointProps) => {
  const classes = styles()
  return (
    <div className={classes.root} onClick={props.onClick}>
      {props.name}
    </div>
  )
}

export default ClinicPoint