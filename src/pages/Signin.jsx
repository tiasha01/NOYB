import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import Cookies from 'js-cookie';
import {useNavigate} from 'react-router-dom';
import axios from "axios";

function Signin() {

    const navigate = useNavigate();
    const [signinError, setSigninError] = useState(false);
    const [signinErrorMessage, setSigninErrorMessage] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [tokenValue, setTokenValue] = useState("");


    function validate(username, password){
        if(username === "" && password === ""){
            setSigninErrorMessage("Fields are empty!");
            setSigninError(true);
            return false;
        }else if(username === ""){
            setSigninErrorMessage("Please enter the user name.");
            setSigninError(true);
            return false;
        }else if(password === ""){
            setSigninErrorMessage("Please enter the password.");
            setSigninError(true);
            return false;
        }
        return true;
    }

    function handleSignin() {
        if(validate(username, password)){
            setSigninErrorMessage("");
            setSigninError(false);
            setOpenBackdrop(true);
            // TODO: pass the username in the request after fixing backend
            axios.post('http://ec2-15-206-84-53.ap-south-1.compute.amazonaws.com:8097/api/v1/auth/sign_in', {
                password: password
            })
                .then(function (response) {
                    setTokenValue(response.data.token);
                    setOpenBackdrop(false);
                    setSnackbarMessage("Sign In Successful!");
                    setOpenSnackbar(true);
                })
                .catch((error) => {
                    if (error.response) {
                        if (error.response.status === 406) {
                            setSigninErrorMessage("Invalid credentials. Please try again.");
                            setSigninError(true);
                        } else if (error.response.status === 404) {
                            setSigninErrorMessage("User not found! Please try again.");
                            setSigninError(true);
                        } else if (error.response.status === 500) {
                            setSnackbarMessage("Server error. Please try again later.");
                            setOpenSnackbar(true);
                        }
                    } else {
                        setSnackbarMessage("Network error. Please check your connection.");
                        setOpenSnackbar(true);
                    }
                    setOpenBackdrop(false);
                })
        }
    }

    function handleSnackbarClose() {
        Cookies.set('token', tokenValue, { expires: 1 });
        setOpenSnackbar(false);
    }

    useEffect(() => {
        if(Cookies.get('token') !== undefined){
          navigate('/Home');
        }
    });

    return (
        <>
            <Box sx={{
                    display: 'flex',
                    width: '100vw',
                    height: '100vh',
                }}>
                {(<Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={openBackdrop}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>)}
                <Box sx={{ width: '55vw',
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        backgroundColor: '#00885F'
                    }}>
                    <Box sx={{ height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        backgroundColor: '#00885F'
                    }}>
                        <Typography sx={{
                            fontSize: '8em',
                            fontWeight: 100,
                            color: '#ffffff',
                            marginTop: '18vh',
                            marginLeft: '5vw'
                            }}>
                            RCCIIT
                        </Typography>
                        <Typography sx={{
                            fontSize: '3em',
                            fontWeight: 400,
                            color: '#ffffff',
                            marginLeft: '5.5vw'
                            }}>
                            <span style={{ fontWeight: 'bold' }}>P</span>lacement
                        </Typography>
                        <Typography sx={{
                            fontSize: '3em',
                            fontWeight: 400,
                            color: '#ffffff',
                            marginLeft: '5.5vw'
                            }}>
                            <span style={{ fontWeight: 'bold' }}>D</span>ata
                        </Typography>
                        <Typography sx={{
                            fontSize: '3em',
                            fontWeight: 400,
                            color: '#ffffff',
                            marginLeft: '5.5vw'
                            }}>
                            <span style={{ fontWeight: 'bold' }}>A</span>nalytics
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ width: '45vw',
                    height: '100vh',
                    backgroundColor: '#00D394'
                }}>
                    <Typography sx={{
                        fontSize: '2em',
                        fontWeight: 900,
                        color: '#00593E',
                        marginTop: '28vh',
                        marginLeft: '12vw',
                        marginBottom: '1vw'
                    }}>
                        Sign In
                    </Typography>
                    {signinError && (<Typography sx={{
                        fontSize: '1em',
                        marginLeft: '12vw',
                        fontWeight: 400,
                        color: '#ffffff',
                        backgroundColor: '#cc0000',
                        width: '38%',
                        padding: '1%'
                    }}>
                        {signinErrorMessage}
                    </Typography>)}
                    <TextField
                        id="user-name"
                        label="USER NAME"
                        variant="standard"
                        type="text"
                        color="success"
                        sx={{
                            marginTop: '1vh',
                            marginLeft: '12vw',
                            width: '40%',
                            backgroundColor: '#abedda',
                            input: {
                                color: 'black',
                                fontSize: '20px',
                                fontWeight: 'bold'
                            }
                        }}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        id="password"
                        label="PASSWORD"
                        variant="standard"
                        type="password"
                        color="success"
                        sx={{
                            marginTop: '2vh',
                            marginLeft: '12vw',
                            width: '40%',
                            backgroundColor: '#abedda',
                            input: {
                                color: 'black',
                                letterSpacing: '3px',
                                fontSize: '20px',
                                WebkitTextSecurity: 'disc',
                                MozTextSecurity: 'disc',
                                textSecurity: 'disc'
                            }
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSignin}
                        sx={{
                            marginTop: '3vh',
                            marginLeft: '24.5vw',
                            backgroundColor: '#005e42'
                        }}>
                        Sign In
                    </Button>
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={openSnackbar}
                        onClose={handleSnackbarClose}
                        autoHideDuration={2000}
                        message={snackbarMessage}
                    />
                </Box>
            </Box>
        </>
    );
}

export default Signin;