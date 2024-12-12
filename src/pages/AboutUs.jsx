import {Box, Button, Tooltip, Typography} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import {useNavigate} from "react-router-dom";

function Aboutus(){

    const navigate = useNavigate();
    function handleHomeButton(){
        navigate('/Home');
    }

    return (
        <>
            <Box sx={{
                width: '100vw',
                height: '100vh',
                backgroundColor: '#4A628A'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100vw',
                    height: '15vh',
                    backgroundColor: '#4A628A'
                }}>
                    <Typography sx={{
                        fontSize: '3em',
                        marginLeft: '3vw',
                        fontWeight: 100,
                        color: '#DFF2EB',
                    }}>
                        RCCIIT
                    </Typography>
                    <Typography sx={{
                        fontSize: '3em',
                        marginLeft: '1vw',
                        color: '#DFF2EB',
                    }}>
                        PDA
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        width: '100vw',
                        height: '14vh',
                        backgroundColor: '#4A628A'
                    }}>
                        <Button
                            onClick={handleHomeButton}
                            sx={{
                                marginRight: '3vw',
                                color: '#ffffff',
                                backgroundColor: '#277aab',
                                fontWeight: '400'
                            }}
                        >
                            Home
                        </Button>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    width: '100vw',
                    height: '65vh',
                    backgroundColor: '#4A628A'
                }}>
                    <Box sx={{
                        width: '18vw',
                        height: '40vh',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF'
                    }}>

                    </Box>
                    <Box sx={{
                        width: '18vw',
                        height: '40vh',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF'
                    }}>

                    </Box>
                    <Box sx={{
                        width: '18vw',
                        height: '40vh',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF'
                    }}>

                    </Box>
                    <Box sx={{
                        width: '18vw',
                        height: '40vh',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF'
                    }}>

                    </Box>
                </Box>
            </Box>
        </>
    );
}
export default Aboutus;