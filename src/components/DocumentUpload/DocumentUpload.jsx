import React, { useState } from 'react';
import './DocumentUpload.css';
import { useCandidates } from '../../helpers/hooks/candidatesHooks';
import CloseIcon from '@mui/icons-material/Close';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useTheme } from '@mui/material/styles';
import SpinLoader from '../SpinLoader/SpinLoader';
import { FormControlLabel, FormControl, MenuItem, InputLabel, Select, TextField, Button } from '@mui/material';

function DocumentUpload({ candidate, setshowDocument, statuses }) {
    const [isExperienced, setIsExperienced] = useState(candidate?.candidateType);
    const { uploadDocuments, updateCandidate, deleteDocument } = useCandidates();
    const [open, setOpen] = useState(true);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleUpload = (e) => {
        console.log(candidate.candidateId)
        console.log(e.target.files);
        if (e.target.files[0].size > 10 && (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || e.target.files[0].type === '.docx' || e.target.files[0].type === 'application/pdf')) {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            formData.append('candidateId', candidate.candidateId);
            formData.append('documentName', e.target.name);

            uploadDocuments.mutate({ formData },
                {
                    onSuccess: (data) => {
                        alert('success')
                    }
                },
                {
                    onError: (data) => {
                        alert('error')
                    }
                }
            );
        } else {
            alert('Document type should be PDf or Word only');
            e.target.value = ''
        }
    }

    const handleDelete = (e) => {
        const formData = new FormData();

        formData.append('candidateId', candidate.candidateId);
        formData.append('documentName', e.target.name);
        formData.append('delete', true);

        deleteDocument.mutate({ formData });
    }

    const downloadDocument = (e) => {
        e.preventDefault();


        if (candidate?.documents) {
            let document = candidate.documents.filter((doc) => doc.documentName === e.target.name)[0];

            if (document) {
                window.open(document.downloadLink, '_blank', 'noopener,noreferrer')
            }
        }
    }


    return (
        <>
            <Dialog
                open={open}
                fullScreen={fullScreen}
                aria-labelledby="responsive-dialog-title"
                maxWidth='lg'
            >

                <DialogContent>
                    <Box m={1} mt={0} sx={{ boxShadow: 1 }} >


                        {/* <CloseIcon onClick={() => {
                            setshowDocument(false);
                            // setOpen(false);
                        }} /> */}

                        <h2 style={{
                            backgroundColor: "#243c80",
                            color: "white", fontWeight: 500, fontSize: "18px",
                        }}>Candidates schedule Dates</h2>
                        <hr />
                        <Grid container m={2} gap={10}>

                            {
                                uploadDocuments.isLoading && <> return <SpinLoader /> </>
                            }

                            {
                                !isExperienced ?
                                    <>
                                        <FormControl variant="standard" sx={{ width: 300 }} size="small">
                                            <Grid item xs='auto'>
                                                <label>Last 3 months salary splips (PDF)</label>
                                                {
                                                    (candidate?.documents?.filter((doc) => doc.documentName === 'Salary Slip')[0]) ?
                                                        <>
                                                            <Button variant='contained' name='Salary Slip' onClick={(e) => downloadDocument(e)}>Download</Button>
                                                            <Button variant='contained' name='Salary Slip' onClick={(e) => handleDelete(e)}>Delete</Button>

                                                        </>
                                                        :
                                                        <input id="salary_slips" type="file" name='Salary Slip' onChange={(e) => handleUpload(e)} />
                                                }
                                            </Grid>
                                        </FormControl>
                                        <br />
                                        <FormControl variant="standard" sx={{ width: 300 }} size="small">
                                            <Grid item xs='auto'>
                                                <label>Bank statements of last 3 months (PDF)</label>
                                                {
                                                    candidate?.documents?.filter((doc) => doc.documentName === 'Bank Statement')[0] ?
                                                        <>
                                                            <Button variant='contained' name='Bank Statement' onClick={(e) => downloadDocument(e)}>Download</Button>
                                                            <Button variant='contained' name='Bank Statement' onClick={(e) => handleDelete(e)}>Delete</Button>
                                                        </>
                                                        :
                                                        <input id="bank_statement" type="file" name='Bank Statement' onChange={(e) => handleUpload(e)} />
                                                }

                                            </Grid>
                                        </FormControl>
                                        <br />
                                        <FormControl variant="standard" sx={{ width: 300 }} size="small">
                                            <Grid item xs='auto'>

                                                <label>Offer or Appointment letter</label>
                                                {
                                                    candidate?.documents?.filter((doc) => doc.documentName === 'Offer Letter')[0] ?
                                                        <>
                                                            <Button variant='contained' name='Offer Letter' onClick={(e) => downloadDocument(e)}>Download</Button>
                                                            <Button variant='contained' name='Offer Letter' onClick={(e) => handleDelete(e)}>Delete</Button>
                                                        </>
                                                        :
                                                        <input id="offer_letter" type="file" name='Offer Letter' onChange={(e) => handleUpload(e)} />
                                                }
                                            </Grid>
                                        </FormControl>
                                        <br />
                                        <FormControl variant="standard" sx={{ width: 300 }} size="small">
                                            <Grid item xs='auto'>
                                                <label>Adhaar Card</label><br />
                                                {
                                                    candidate?.documents?.filter((doc) => doc.documentName === 'Adhaar Card')[0] ?
                                                        <>
                                                            <Button variant='contained' name='Adhaar Card' onClick={(e) => downloadDocument(e)}>Download</Button>
                                                            <Button variant='contained' name='Adhaar Card' onClick={(e) => handleDelete(e)}>Delete</Button>
                                                        </>
                                                        :
                                                        <input id="adhaar_card" type="file" name='Adhaar Card' onChange={(e) => handleUpload(e)} />
                                                }
                                            </Grid>
                                        </FormControl>

                                    </>
                                    :
                                    <>
                                        <FormControl variant="standard" sx={{ width: 300 }} size="small">
                                            <Grid item xs='auto'>
                                                <label>Adhaar Card</label><br />
                                                {
                                                    candidate?.documents?.filter((doc) => doc.documentName === 'Adhaar Card')[0] ?
                                                        <>
                                                            <Button variant='contained' name='Adhaar Card' onClick={(e) => downloadDocument(e)}>Download</Button>
                                                            <Button variant='contained' name='Adhaar Card' onClick={(e) => handleDelete(e)}>Delete</Button>
                                                        </>
                                                        :
                                                        <input id="adhaar_card" className='documentUpload-block__input' type="file" name='Adhaar Card' onChange={(e) => handleUpload(e)} />
                                                }
                                            </Grid>
                                        </FormControl>
                                        <br />

                                    </>
                            }


                            {isExperienced &&
                                <>
                                    <FormControl variant="standard" sx={{ width: 300 }} size="small">
                                        <Grid item xs='auto'>
                                            {(candidate?.documents?.length > 3) &&
                                                <>
                                                    <Button variant='contained' onClick={(e) => {
                                                        if (!isExperienced) {
                                                            updateCandidate.mutate({ id: candidate.candidateId, formData: { candidateStatusId: statuses.filter((status) => status.displayText.status === 'Doc Verification Completed')[0].metaDataId } });
                                                            setshowDocument(false);
                                                        }
                                                    }}>Ok</Button>
                                                </>
                                            }
                                        </Grid>
                                    </FormControl>
                                    <br />

                                </>
                            }

                        </Grid>
                    </Box>
                </DialogContent>
                <Button onClick={(e) => setshowDocument(false)} autoFocus>
                    Close
                </Button>
            </Dialog>
        </>

    )
};

export default DocumentUpload