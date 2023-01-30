import { useContext, useEffect, useState } from "react";
import "./login.scss";
import FormInput from "../../components/formInput/FormInput";
import {Link, useNavigate} from 'react-router-dom'
// import Cookies from 'universal-cookie';
import { AuthContext } from "../../context/authContext";
import Modal from 'react-modal';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import CloseIcon from '@mui/icons-material/Close';
import { Grid } from "@mui/material";
import axios from "../../axios";
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth:"28rem",
    display:"flex",
    flexDirection: "column",
    backgroundColor: "white",
    padding:"30px"


  },
};


const Login = () => {
  // const cookies = new Cookies();
  // const navigate = useNavigate()
  const [err, setErr] = useState(false);
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState(false)
  const [number, setNumber] = useState(false)
  const [counter,setCounter] = useState("0m:10s")
const [resetCounter,setResetCounter] = useState(false)
  const [otpsended, setOtpsended] = useState(true)

  useEffect(()=>{
    let timer = 10; 
    let minute,second;
        let counterInterval = setInterval(()=>{
            if(timer <= 0 ) { 
                setCounter("")
    
                return clearInterval(counterInterval)
            }
            timer = timer - 1;
            minute = Math.floor(timer / 60) 
            second = timer % 60;
            setCounter(`${minute}m : ${second}s`)
        },1000)
    },[resetCounter])


  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const { login ,setCurrentUser,setConfig} = useContext(AuthContext);
  const navigate = useNavigate()
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = 'blue';
  }

  function closeModal() {
    setIsOpen(false);
  }
  const inputs = [
   
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be a valid email address!",
      label: "Email",
      required: true,
    },
   
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    }
   
  ];
 let details=values
  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      await login(details).then(()=>{
      navigate('/')

      })
    } catch (error) {
      console.log(error);
      setErr(error.response.data)
    }    
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleOTP = (e)=>{
    
   e.preventDefault()
  
   if (phone.trim().length===10) {
   setStatus("please wait...")
    axios.post('auth/sendotp',{phno:phone}).then(()=>{
       setOtpsended(false)
       setResetCounter(prev => !prev)
      setNumber(phone)
      setStatus("otp sent successfully")
    }).catch((err)=>{
      setStatus(false)
      setErr(err.response.data)
    })
   }else{
    setErr("please enter a valid phone no.")
   }
  }

  const verifyOTP = (e)=>{
    e.preventDefault()
   if (otp.trim().length>0&&number) {
   setStatus("please wait...")
    axios.post('auth/otplogin',{otp:otp,phno:number}).then((res)=>{
      setCurrentUser(res.data.other)
      console.log(res.data);
      localStorage.setItem("accessToken", res.data.accessToken);
      setConfig({
        headers: { token: `Bearer ${res.data.accessToken}` },      
    })
      navigate('/')

    }).catch((err)=>{
     console.log(err);
      setErr(err.response.data.err)
      setStatus(" ")

    })
   }else{
    setErr("something went wrong please try again")
   }
  }
  

  return (
    <div className="app" >
      <form onSubmit={handleSubmit}>
        <h1 style={{"paddingTop":"10px"}} className="icon">Prosper</h1>
        <div className="msg" style={{"paddingBottom":"10px"}}>Login to see what your friends are doing</div>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <div className="error"> {err&&err}</div>
       
        <button type="submit">Login</button>
        <div style={{width: "100%", height: "20px", borderBottom: "1px solid black", textAlign: "center",marginTop:"-15px",marginBottom:"6px"}}>
  <span style={{fontSize: "23px", backgroundColor: "#F3F5F6", padding: "0 10px;"}}>
    OR
  </span>
</div>
        <button type="button" onClick={openModal}>Login with OTP</button>
            
     
          <div style={{"paddingBottom":"29px"}}>
          New here? <b><Link to="/register" className="link">Sign up now.</Link></b><br />
           
          </div>
      </form>
            <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            
          >
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>OTP</h2>
            <CloseIcon onClick={closeModal} className="close" />
           

            <FormControl>
            {err&&<span style={{ top: "2rem", color: "red" }} className="err">{err}</span>}
            {status&&<span style={{ top: "2rem", color: "green" }} >{status}</span>}
            {
              otpsended ? <>
              <TextField id="standard-basic" label="Enter your phone no." type="number" variant="standard" onChange={e=>{setPhone(e.target.value);setErr(false)}}/>
              <Button variant="contained" endIcon={<SendIcon />} className="sendButton"  style={{alignSelf:"flex-end"}} onClick={handleOTP}>Send</Button>
              </>

              :<>
              <TextField id="standard-basic" label="Enter OTP" value={otp} variant="standard" onChange={e=>setOtp(e.target.value)}/>
              {/* {err&&<span style={{ top: "2rem", color: "red" }} className="err">{err}</span>} */}
              <div
               style={{visibility:counter ?"":"hidden"}}
               >{counter&&"Resend otp in "}{counter||"no timer"}</div>
              <Grid container className="otpbuttons" >

             <Button variant="contained" endIcon={<SendIcon />} className="sendButton" onClick={handleOTP} disabled={counter}>Resend</Button>&nbsp;&nbsp;
              <Button variant="contained"  className="sendButton" onClick={verifyOTP} style={{backgroundColor:"blue" ,display:"inline"}}>Login</Button>
              </Grid>
              </>

            }
              
              
            </FormControl>
          </Modal>
    </div>
    
  );
};

export default Login;