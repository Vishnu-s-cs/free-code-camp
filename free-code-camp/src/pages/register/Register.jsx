import { useContext, useState } from "react";
import "./register.scss";
import FormInput from "../../components/formInput/FormInput";
import {useNavigate,Link} from 'react-router-dom'
import Swal from 'sweetalert2'
import axios  from "../../axios";
import { AuthContext } from "../../context/authContext";
const Register = () => {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const {config} = useContext(AuthContext)
const [error, setError] = useState(false);
  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special character!",
      label: "Username",
      pattern: "^[A-Za-z0-9]{3,16}$",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be a valid email address!",
      label: "Email",
      required: true,
    },
    {
      id: 3,
      name: "phone",
      type: "text",
      placeholder: "Phone no...",
      errorMessage: "It should be a valid phone number",
      label: "Phone no.",
      pattern: `^[0-9]{10,10}$`,
      required: true,
    },
   
    {
      id: 4,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    },
    {
      id: 5,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Passwords don't match!",
      label: "Confirm Password",
      pattern: values.password,
      required: true,
    },
  ];
  const {confirmPassword,...others} = values
 let details=others
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await axios.post(`/auth/register`,details,config).then((response) => {
        console.log('signup success',response);
        navigate('/login')
    }).catch((err)=>{
      console.log(err);
     err.response.data.error?setError(err.response.data.error):setError(err.response.data)
      
    })
    } catch (error) {
      setError(true)
      console.log(error);
    }
   console.log(error);
   if(error)
   {
    Swal.fire({
        title: 'Error!',
        text: `${error}`,
        icon: 'error',
        confirmButtonText: 'ok'
      })
   }

  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
      <h1 style={{"paddingTop":"10px"}} className="icon">Prosper</h1>
        <div className="msg" style={{"paddingBottom":"10px"}}>Sign up to see photos and videos from your friends</div>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <span className="error">{error&&error}</span>
        <button>Register</button>
        <div style={{"paddingBottom":"20px"}}>
          Already signed up? <b><Link to="/login" className="link">login now.</Link></b><br />
           
          </div>
      </form>
    </div>
  );
};

export default Register;
