import {Box} from "@mui/material";

function Home() {
    return (
        <>
            <Box sx={{
                display: 'flex',
                width: '100vw',
                height: '100vh',
                backgroundColor: '#023626'
            }}>
                <Box sx={{ width: '30vw',
                    height: '80vh',
                    display: 'flex',
                    margin: '5vh',
                    marginTop: '15vh',
                    marginRight: '2.5vh',
                    borderRadius: '10px',
                    justifyContent: 'flex-start',
                    backgroundColor: '#00885F'
                }}>
                </Box>
                <Box sx={{ width: '65vw',
                    height: '80vh',
                    display: 'flex',
                    margin: '5vh',
                    marginTop: '15vh',
                    marginLeft: '2.5vh',
                    borderRadius: '10px',
                    justifyContent: 'flex-start',
                    backgroundColor: '#00885F'
                }}>
                </Box>
            </Box>
        </>
    );
}

export default Home;