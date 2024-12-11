import {Backdrop, Box, Button, CircularProgress, Snackbar, Tooltip, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import LogoutIcon from '@mui/icons-material/Logout';
import * as XLSX from "xlsx";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

function Home() {

    const navigate = useNavigate();
    const [fileName, setFileName] = useState("NO FILE SELECTED.")
    const [username, setUsername] = useState("");
    const [signoutState, setSignoutState] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [selectButtonText, setSelectButtonText] = useState("Select");
    const [fileSize, setFileSize] = useState("0 byte");
    const [numberOfRows, setNumberOfRows] = useState("-");
    const [numberOfColumns, setNumberOfColumns] = useState("-");
    const [uploadDisabled, setUploadDisabled] = useState(true);
    const [analyzeDisabled, setAnalyzeDisabled] = useState(true);
    const [downloadDisabled, setDownloadDisabled] = useState(true);
    const [uploadError, setUploadError] = useState(false);
    const [uploadErrorMessage, setUploadErrorMessage] = useState("");
    const [selectFile, setSelectFile] = useState(null);
    const [analyzedFile, setAnalyzedFile] = useState(null);
    const [placeableCount, setPlaceableCount] = useState("-");
    const [placeablePercentage, setPlaceablePercentage] = useState("-");
    const [placeableColor, setPlaceableColor] = useState("");
    const [femaleCount, setFemaleCount] = useState("-");
    const [femalePercentage, setFemalePercentage] = useState("-");
    const [maleCount, setMaleCount] = useState("-");
    const [malePercentage, setMalePercentage] = useState("-");
    const [hideBox, setHideBox] = useState(0);

    function resetToDefault() {
        setAnalyzeDisabled(true);
        setDownloadDisabled(true);
        setNumberOfRows("-");
        setNumberOfColumns("-");
        setFileSize("0 byte");
        setPlaceablePercentage("-");
        setPlaceableColor("");
        setPlaceableCount("-");
        setAnalyzedFile(null);
        setFemaleCount("-");
        setFemalePercentage("-");
        setMaleCount("-");
        setMalePercentage("-");
        setAnalyzedFile(null);
        setHideBox(0);
    }

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
            });
    }

    function handleSelectButton(event){
        resetToDefault();
        const file = event.target.files[0];
        if(file){
            setSelectFile(file);
            setFileName(file.name);
            setSelectButtonText("re-Select");
            setFileSize(file.size + " bytes");
            getRowColumnCount(file);
            setUploadDisabled(false);
        }else{
            setFileName("NO FILE SELECTED.");
        }
    }

    function handleUploadButton(){
        setDownloadDisabled(true);
        setOpenBackdrop(true);
        const formData = new FormData();
        formData.append("file", selectFile);
        formData.append("token", Cookies.get("token"));
        axios.post('http://ec2-13-232-61-89.ap-south-1.compute.amazonaws.com:8097/api/v1/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(function (response) {
                if(response.status === 200){
                    setOpenBackdrop(false);
                    setSnackbarMessage("Upload Successful!");
                    setOpenSnackbar(true);
                    setAnalyzeDisabled(false)
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 400 || error.response.status === 406){
                        setUploadErrorMessage("Incompatible request.");
                        setUploadError(true);
                    } else if (error.response.status === 404){
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
            });
    }

    function handleAnalyzeButton(){
        setOpenBackdrop(true);
        setAnalyzeDisabled(true);
        axios.get('http://ec2-13-232-61-89.ap-south-1.compute.amazonaws.com:8097/api/v1/file/get_analysis', {
                params: { token: Cookies.get('token') },
                responseType: 'blob',
            })
            .then((response) => {
                if(response.status === 200) {
                    const blob = new Blob([response.data], {
                        type: 'application/octet-stream',
                    });
                    getPlaceableRowCount(blob);
                    getPlaceableGenderCount(blob);
                    setAnalyzedFile(blob);
                    setOpenBackdrop(false);
                    setSnackbarMessage("Analysis complete!");
                    setOpenSnackbar(true);
                    setDownloadDisabled(false);
                    setHideBox(1);
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404 || error.response.status === 406){
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
            });
    }

    function getRowColumnCount(file){
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const numberOfRows = jsonData.length;
            const numberOfColumns = jsonData[0]?.length || 0;
            setNumberOfRows(numberOfRows.toString());
            setNumberOfColumns(numberOfColumns);
        };
        reader.readAsArrayBuffer(file);
    }

    function getPlaceableRowCount(file){
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const headerRow = jsonData[0];
            const placeabilityIndex = headerRow.indexOf('Placeability');

            if (placeabilityIndex === -1) {
                setSnackbarMessage("Error: 'Placeability' column was not found!");
                setOpenSnackbar(true);
                return;
            }

            const placeableCount = jsonData.slice(1).reduce((count, row) => {
                return row[placeabilityIndex] === 'Placeable' ? count + 1 : count;
            }, 0);

            setPlaceableCount(placeableCount);
            setPlaceablePercentage((Math.round((placeableCount / numberOfRows) * 100)).toString());
        };
        reader.readAsArrayBuffer(file);
    }

    function getPlaceableGenderCount(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const headerRow = jsonData[0];
            const placeabilityIndex = headerRow.indexOf('Placeability');
            const genderIndex = headerRow.indexOf('Gender');

            if (placeabilityIndex === -1) {
                setSnackbarMessage("Error: 'Placeability' column was not found!");
                setOpenSnackbar(true);
                return;
            }
            if (genderIndex === -1) {
                setSnackbarMessage("Error: 'Gender' column was not found!");
                setOpenSnackbar(true);
                return;
            }

            let femaleCount = 0;
            let maleCount = 0;

            jsonData.slice(1).forEach((row) => {
                if (row[placeabilityIndex] === 'Placeable') {
                    if (row[genderIndex] === 'FEMALE') {
                        femaleCount++;
                    } else if (row[genderIndex] === 'MALE') {
                        maleCount++;
                    }
                }
            });
            setFemaleCount(femaleCount.toString());
            setMaleCount(maleCount.toString());
            setFemalePercentage(Math.round((femaleCount/numberOfRows) * 100).toString());
            setMalePercentage(Math.round((maleCount/numberOfRows) * 100).toString());
        };
        reader.readAsArrayBuffer(file);
    }

    function getPlaceableColor(){
        if(placeablePercentage === "-"){
            setPlaceableColor('#b8cdcf');
        } else if(placeablePercentage <= 33){
            setPlaceableColor('#eb605b');
        } else if(placeablePercentage <= 66){
            setPlaceableColor('#ebc95b');
        } else{
            setPlaceableColor('#5beb62');
        }
    }

    function handleSnackbarClose(){
        if(signoutState){
            Cookies.remove("token");
            Cookies.remove("name");
        }
        setOpenSnackbar(false);
    }

    function handleDownloadButton(){
        if(analyzedFile){
            const link = document.createElement('a');
            link.href = URL.createObjectURL(analyzedFile);
            link.download = 'Analytics.xlsx';
            link.click();
        }
    }

    useEffect(() => {
        if(Cookies.get('token') === undefined){
            navigate('/');
        }
    });

    useEffect(() =>{
        setUsername(Cookies.get('name'));
    }, []);

    useEffect(() =>{
        getPlaceableColor();
    }, [placeablePercentage]);

    return (
        <>
            <Box sx={{
                width: '100vw',
                height: '100vh',
                backgroundColor: '#4A628A'
                }}>
                {(<Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={openBackdrop}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>)}
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
                            color: '#DFF2EB',
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
                                    backgroundColor: '#800000',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                    '&:hover': {
                                        backgroundColor: '#d40000',
                                    }
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
                    backgroundColor: '#4A628A'
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
                        backgroundColor: '#7AB2D3'
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
                            backgroundColor: '#ccd8d9',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)'
                        }}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    marginLeft: '1vw',
                                    backgroundColor: '#303e57',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                    '&:hover': {
                                        backgroundColor: '#4A628A',
                                    }
                                }}>
                                {selectButtonText}
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleSelectButton}
                                    hidden
                                />
                            </Button>
                            <Typography
                                color="#303e57"
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
                            backgroundColor: '#ccd8d9',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)'
                        }}>
                            <Typography
                                color="#303e57"
                                sx={{
                                    fontWeight: 'bold',
                                    margin: '1%'
                                }}>
                                FILE SIZE: {fileSize}
                            </Typography>
                            <Typography
                                color="#303e57"
                                sx={{
                                    fontWeight: 'bold',
                                    margin: '1%'
                                }}>
                                NO. OF ROWS: {numberOfRows}
                            </Typography>
                            <Typography
                                color="#303e57"
                                sx={{
                                    fontWeight: 'bold',
                                    margin: '1%'
                                }}>
                                NO. OF COLUMNS: {numberOfColumns}
                            </Typography>
                            <Typography
                                color='#c96800'
                                sx={{
                                    fontWeight: 'bold',
                                    margin: '1%',
                                    marginTop: '30%'
                                }}>
                                CAUTION: Following fields are required: Gender, 10th Marks, 12th Marks, Stream and CGPA.
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            width: '100%',
                            height: '10vh',
                            borderRadius: '10px',
                            marginBottom: '1vh',
                            backgroundColor: '#7AB2D3'
                        }}>
                            {uploadError && (<Typography sx={{
                                fontSize: '1em',
                                marginLeft: '1vw',
                                fontWeight: 400,
                                color: '#ffffff',
                                backgroundColor: '#d40000',
                                width: '62%',
                                padding: '1%'
                            }}>
                                {uploadErrorMessage}
                            </Typography>)}
                            <Button
                                variant="contained"
                                disabled={uploadDisabled}
                                component="label"
                                onClick={handleUploadButton}
                                sx={{
                                    margin: '1.5vw',
                                    backgroundColor: '#303e57',
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                    '&:hover': {
                                        backgroundColor: '#e06c00',
                                    }
                                }}>
                                Upload
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ width: '65vw',
                        height: '72vh',
                        margin: '5vh',
                        marginTop: '0vh',
                        marginLeft: '2.5vh',
                        borderRadius: '10px',
                        backgroundColor: '#7AB2D3'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            weight: '100%',
                            height: '26vh',
                            borderRadius: '10px',
                            backgroundColor: '#7AB2D3'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                width: '10vw',
                                marginLeft: '1.2vw',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                backgroundColor: '#7AB2D3'
                            }}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    disabled={analyzeDisabled}
                                    onClick={handleAnalyzeButton}
                                    sx={{
                                        margin: '1vw',
                                        backgroundColor: '#303e57',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                        '&:hover': {
                                            backgroundColor: '#e06c00',
                                        }
                                    }}>
                                    Analyze
                                </Button>
                                <Button
                                    variant="contained"
                                    component="label"
                                    disabled={downloadDisabled}
                                    onClick={handleDownloadButton}
                                    sx={{
                                        margin: '1vw',
                                        backgroundColor: '#303e57',
                                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                        '&:hover': {
                                            backgroundColor: '#4A628A',
                                        }
                                    }}>
                                    Download
                                </Button>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '15vw',
                                height: '20vh',
                                borderRadius: '10px',
                                margin: '0.5vw',
                                marginTop: '1.5vw',
                                backgroundColor: placeableColor,
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                opacity: hideBox
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '60%',
                                    height: '100%',
                                    borderRadius: '10px',
                                }}>
                                    <Typography
                                        color='#4a4a4a'
                                        sx={{
                                            fontSize: '3.6em',
                                            fontWeight: '400',
                                            margin: 'auto',
                                            marginBottom: '0',
                                            marginTop: '0',
                                            height: '60%'
                                    }}>
                                        {placeablePercentage}%
                                    </Typography>
                                    <Typography
                                        color='#2b2b2b'
                                        sx={{
                                            display: 'flex',
                                            fontSize: '1em',
                                            fontWeight: '600',
                                            height: '20%',
                                            justifyContent: 'center'
                                        }}>
                                        ~ PLACEABLE
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    width: '40%',
                                    Height: '100%'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        width: '100%',
                                        height: '40%',
                                        borderTopRightRadius: '10px',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#ebebeb',
                                    }}>
                                        <Typography
                                            color='#2b2b2b'
                                            sx={{
                                                fontSize: '2em',
                                                fontWeight: '400',
                                            }}>
                                            {placeableCount}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        height: '60%',
                                        borderBottomRightRadius: '10px',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#d4d4d4'
                                    }}>
                                        <Typography
                                            color='#2b2b2b'
                                            sx={{
                                                fontSize: '1em',
                                                fontWeight: '400',
                                            }}>
                                            OUT OF
                                        </Typography>
                                        <Typography
                                            color='#2b2b2b'
                                            sx={{
                                                fontSize: '2em',
                                                fontWeight: '400',
                                            }}>
                                            {numberOfRows}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '15vw',
                                height: '20vh',
                                borderRadius: '10px',
                                margin: '0.5vw',
                                marginTop: '1.5vw',
                                backgroundColor: '#d79cff',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                opacity: hideBox
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '60%',
                                    height: '100%',
                                    borderRadius: '10px',
                                }}>
                                    <Typography
                                        color='#4a4a4a'
                                        sx={{
                                            fontSize: '3.6em',
                                            fontWeight: '400',
                                            margin: 'auto',
                                            marginBottom: '0',
                                            marginTop: '0',
                                            height: '60%'
                                        }}>
                                        {femalePercentage}%
                                    </Typography>
                                    <Typography
                                        color='#2b2b2b'
                                        sx={{
                                            display: 'flex',
                                            fontSize: '1em',
                                            fontWeight: '600',
                                            height: '20%',
                                            justifyContent: 'center'
                                        }}>
                                        ~ FEMALE <FemaleIcon/>
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    width: '40%',
                                    Height: '100%'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        width: '100%',
                                        height: '40%',
                                        borderTopRightRadius: '10px',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#ebebeb',
                                    }}>
                                        <Typography
                                            color='#2b2b2b'
                                            sx={{
                                                fontSize: '2em',
                                                fontWeight: '400',
                                            }}>
                                            {femaleCount}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        height: '60%',
                                        borderBottomRightRadius: '10px',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#d4d4d4'
                                    }}>
                                        <Typography
                                            color='#2b2b2b'
                                            sx={{
                                                fontSize: '1em',
                                                fontWeight: '400',
                                            }}>
                                            OUT OF
                                        </Typography>
                                        <Typography
                                            color='#2b2b2b'
                                            sx={{
                                                fontSize: '2em',
                                                fontWeight: '400',
                                            }}>
                                            {numberOfRows}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '15vw',
                                height: '20vh',
                                borderRadius: '10px',
                                margin: '0.5vw',
                                marginTop: '1.5vw',
                                backgroundColor: '#ae9cff',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                                opacity: hideBox
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '60%',
                                    height: '100%',
                                    borderRadius: '10px',
                                }}>
                                    <Typography
                                        color='#4a4a4a'
                                        sx={{
                                            fontSize: '3.6em',
                                            fontWeight: '400',
                                            margin: 'auto',
                                            marginBottom: '0',
                                            marginTop: '0',
                                            height: '60%'
                                        }}>
                                        {malePercentage}%
                                    </Typography>
                                    <Typography
                                        color='#2b2b2b'
                                        sx={{
                                            display: 'flex',
                                            fontSize: '1em',
                                            fontWeight: '600',
                                            height: '20%',
                                            justifyContent: 'center'
                                        }}>
                                        ~ MALE <MaleIcon/>
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    width: '40%',
                                    Height: '100%'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        width: '100%',
                                        height: '40%',
                                        borderTopRightRadius: '10px',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#ebebeb',
                                    }}>
                                        <Typography
                                            color='#2b2b2b'
                                            sx={{
                                                fontSize: '2em',
                                                fontWeight: '400',
                                            }}>
                                            {maleCount}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        height: '60%',
                                        borderBottomRightRadius: '10px',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#d4d4d4'
                                    }}>
                                        <Typography
                                            color='#2b2b2b'
                                            sx={{
                                                fontSize: '1em',
                                                fontWeight: '400',
                                            }}>
                                            OUT OF
                                        </Typography>
                                        <Typography
                                            color='#2b2b2b'
                                            sx={{
                                                fontSize: '2em',
                                                fontWeight: '400',
                                            }}>
                                            {numberOfRows}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{
                            alignItems: 'center',
                            borderRadius: '10px',
                            height: '59%',
                            width: '95.5%',
                            margin: '1.5vw',
                            marginTop: '0',
                            backgroundColor: '#ccd8d9',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                            opacity: hideBox
                        }}>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    width: '100vw',
                    height: '8vh',
                    backgroundColor: '#7AB2D3'
                }}>
                </Box>
            </Box>
        </>
    );
}

export default Home;