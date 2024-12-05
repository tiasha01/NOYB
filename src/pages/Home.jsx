import {Backdrop, Box, Button, CircularProgress, Snackbar, Tooltip, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import LogoutIcon from '@mui/icons-material/Logout';

function Home() {

    const navigate = useNavigate();
    const [fileName, setFileName] = useState("NO FILE SELECTED.")
    const [username, setUsername] = useState("");
    const [signoutState, setSignoutState] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [selectButtonText, setSelectButtonText] = useState("Select File");

    function handleSignout(){
        setOpenBackdrop(true);
        axios.post('http://ec2-13-232-61-89.ap-south-1.compute.amazonaws.com:8097/api/v1/auth/sign_out', {
            token: Cookies.get("token")
            })
            .then(function (response) {
                if(response.status === 200){
                    setSignoutState(true);
                    setSnackbarMessage("Sign Out Successful!");
                    setOpenSnackbar(true);
                }
            })
            .catch((error) => {
                if (error.response) {
                     if (error.response.status === 404){
                         setSignoutState(true);
                         setSnackbarMessage("Session Expired!");
                         setOpenSnackbar(true);
                     } else if (error.response.status === 500){
                         setSnackbarMessage("Server error. Please try again later.");
                         setOpenSnackbar(true);
                     }
                }else{
                    setSnackbarMessage("Network error. Please check your connection.");
                    setOpenSnackbar(true);
                }
                setOpenBackdrop(false);
            })
    }

    function handleSelectFile(event){
        let file = event.target.files[0];
        if(file){
            setFileName(file.name);
            setSelectButtonText("re-Select File")
        }else{
            setFileName("NO FILE SELECTED.");
        }
    }

    function handleSnackbarClose(){
        if(signoutState){
            Cookies.remove("token");
            Cookies.remove("name");
        }
        setOpenSnackbar(false);
    }

    useEffect(() => {
        if(Cookies.get('token') === undefined){
            navigate('/');
        }
    });

    useEffect(() =>{
        setUsername(Cookies.get('name'));
    }, []);

    return (
        <>
            <Box sx={{
                width: '100vw',
                height: '100vh',
                backgroundColor: '#023626'
                }}>
                {(<Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={openBackdrop}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>)}
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={openSnackbar}
                    onClose={handleSnackbarClose}
                    autoHideDuration={2000}
                    message={snackbarMessage}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100vw',
                    height: '14vh',
                    backgroundColor: '#023626'
                }}>
                    <Typography sx={{
                        fontSize: '3em',
                        marginLeft: '3vw',
                        fontWeight: 100,
                        color: '#a8ffc5',
                    }}>
                        RCCIIT
                    </Typography>
                    <Typography sx={{
                        fontSize: '3em',
                        marginLeft: '1vw',
                        color: '#a8ffc5',
                    }}>
                        PDA
                    </Typography>
                    <Box sx={{
                        width: '100vw',
                        height: '14vh',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginRight: '3vw'
                    }}>
                        <Typography sx={{
                            fontSize: '1.3em',
                            marginLeft: '1vw',
                            color: '#a8ffc5',
                        }}>
                            Hello, <span style={{fontWeight: 'bold'}}>{username}</span>
                        </Typography>
                        <Tooltip title="Good Bye!">
                            <Button
                                variant="contained"
                                component="label"
                                onClick={handleSignout}
                                sx={{
                                    marginLeft: '2vw',
                                    backgroundColor: '#d40000'
                                }}>
                                <LogoutIcon />
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    width: '100vw',
                    height: '78vh',
                    backgroundColor: '#023626'
                }}>
                    <Box sx={{ width: '30vw',
                        height: '72vh',
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '5vh',
                        marginTop: '0vh',
                        marginRight: '2.5vh',
                        borderRadius: '10px',
                        justifyContent: 'flex-start',
                        backgroundColor: '#499982'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            width: '90%',
                            height: '10vh',
                            margin: '5%',
                            marginBottom: '2.5%',
                            borderRadius: '10px',
                            backgroundColor: '#9cdbc9',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)'
                        }}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    marginLeft: '1vw',
                                    backgroundColor: '#005e42',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)'
                                }}>
                                {selectButtonText}
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleSelectFile}
                                    hidden
                                />
                            </Button>
                            <Typography
                                color="#023626"
                                sx={{
                                    marginLeft: '2vw',
                                    fontWeight: 'bold',
                                }}>
                                {fileName}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '5%',
                            width: '80%',
                            flexGrow: 1,
                            margin: '5%',
                            marginTop: '2.5%',
                            marginBottom: '2.5%',
                            borderRadius: '10px',
                            backgroundColor: '#9cdbc9',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)'
                        }}>
                            <Typography
                                color="#023626"
                                sx={{
                                    fontWeight: 'bold',
                                    margin: '1%'
                                }}>
                                FILE SIZE:
                            </Typography>
                            <Typography
                                color="#023626"
                                sx={{
                                    fontWeight: 'bold',
                                    margin: '1%'
                                }}>
                                NUMBER OF ROWS:
                            </Typography>
                            <Typography
                                color="#023626"
                                sx={{
                                    fontWeight: 'bold',
                                    margin: '1%'
                                }}>
                                NUMBER OF COLUMN:
                            </Typography>
                            <Typography
                                color="#023626"
                                sx={{
                                    fontWeight: 'bold',
                                    margin: '1%'
                                }}>
                                COLUMN NAMES:
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '10vh',
                            borderRadius: '10px',
                            marginBottom: '1vh',
                            backgroundColor: '#499982'
                        }}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    margin: '2vw',
                                    backgroundColor: '#00422f',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                    '&:hover': {
                                        backgroundColor: '#e06c00',
                                    }
                                }}>
                                Upload File
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ width: '65vw',
                        height: '72vh',
                        display: 'flex',
                        margin: '5vh',
                        marginTop: '0vh',
                        marginLeft: '2.5vh',
                        borderRadius: '10px',
                        justifyContent: 'flex-start',
                        backgroundColor: '#499982'
                    }}>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    width: '100vw',
                    height: '8vh',
                    backgroundColor: '#015c40'
                }}>

                </Box>
            </Box>
        </>
    );
}

export default Home;