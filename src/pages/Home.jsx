import {Box,  Button, Typography} from "@mui/material";
import { useState } from "react";

function Home() {

    const [fileName, setFileName] = useState("NO FILE SELECTED.")

    function handleSelectFile(event){
        const file = event.target.files[0]; 
        if (file) {
            setFileName(file.name); 
        } else {
            setFileName("NO FILE SELECTED."); 
        }
    }

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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center', 
                        justifyContent: 'flex-start',
                        width: '50vw',
                        height: '10vh',
                        margin: '3vh',
                        borderRadius: '10px',
                        backgroundColor: '#80ffaa'
                     }}>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                marginLeft: '1vw',
                                backgroundColor: '#005e42'
                            }}>
                            Select File
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