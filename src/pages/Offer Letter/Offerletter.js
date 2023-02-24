import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Typography } from '@mui/material';
import { AppBar, Dialog, DialogContent, Select } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import PaddingIcon from '@mui/icons-material/Padding';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import { useState, useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Label } from 'recharts';
// hooks
import { useSalary } from '../../helpers/hooks/salaryDetailsHooks'

import ReactQuill from 'react-quill';
import JoditEditor from "jodit-react";
import { RemoveFromQueue } from '@mui/icons-material';
import { margin } from '@mui/system';
import "../Offer Letter/offerLetter.css";
import {useMetaData} from '../../helpers/hooks/metaDataHooks';

// radio button

import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { click } from '@testing-library/user-event/dist/click';



const Offerletter = () => {

    // joditedit config 

    // const config = {
    //     readonly: false, // all options from https://xdsoft.net/jodit/doc/,
    // }


    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [render, Setrender] = useState(false)
    const [variablePayVisibility, setVariablePayVisibility] = useState(false)

    const [bonusPay, setBonusPay] = useState(false)

    const [bonusDuration, setbonusDuration] = useState('')
    const [freqVariable , setfreqVariable] = useState('')

    const [remark, setRemark] = useState(null);
    const editor = useRef(null);
    const [input, setInput] = useState('');
    const [edit, setEdit] = useState("")
    const {salaryDetails} = useMetaData();


    // state for variable pay  button questions 

    const [form, setform] = useState({
        employerContributionPFMonth: 1800,
        employerContributionPFYearly: 1800 * 12,
        employerContributionPfWithoutPfMonth: 0,
        employerContributionPfWithoutPfYear: 0,
        // employeeContributionwithPfMonth :employeeContributionwithPfYear / 12, 
        employeeContributionwithPfYear: 21600,
        employeeContributionwithoutPfMonth: 0,
        employeeContributionwithoutPfYear: 0,
        

    });

    const ClickToOpen = () => {
        Setrender(true)

    }
    const ClickToClose = () => {
        Setrender(false)

    }


//  bonus pay-
  
      const dynamicChange = (event) => {
        setbonusDuration(event.target.value);
      };

//  variable pay
      const dynamicChangeVariable = (event) => {
        setfreqVariable(event.target.value);
      };


    // hooks
    const { CreateSalary, updateSalary } = useSalary()



    // all value will be submit in form varible
    const HandleChange = (e) => {
        const salaryInfo = salaryDetails?.data?.data;
        console.log(salaryInfo[0]?.displayText);
        let values = {};
        // if (e.target?.name === 'offerCTC') {
            values.basicYearlyWithPf = Math.trunc(Number(e.target.value * 0.50));
            values.GrossSalaryYearWithPf = Math.trunc(Number((e.target.value)))
            // values.basicYearlyWithPf = Math.trunc(Number(e.target.value * 0.50))
        // }

        if (e.target?.name === 'variablepay') {
            // values.basicYearlyWithPf = Math.trunc(Number(values.GrossSalaryYearWithPf * 0.50));
            // values.basicYearlyWithPf = Math.trunc(Number(values.GrossSalaryYearWithPf * 0.50));
        }
        

        values.basicYearlyWithPf = eval(salaryInfo[0]?.displayText?.basicYearlyWithPf);
        values.basicMonthlyWithPf = eval(salaryInfo[0]?.displayText?.basicMonthlyWithPf)
        values.hraWithPFYearly = eval(salaryInfo[0]?.displayText?.hraWithPFYearly)
        values.hraWithPFMonthly =eval(salaryInfo[0].displayText?.hraWithPFMonthly)

        values.GrossSalaryYearWithPf = eval(salaryInfo[0]?.displayText?.GrossSalaryYearWithPf) 
        
         
        values.basicMonthlyWithoutPf= eval(salaryInfo[0].displayText.basicMonthlyWithoutPf)
        values.basicYearlyWithoutPf= eval(salaryInfo[0].displayText.basicYearlyWithoutPf)
        values.hraWithoutPFYearly= eval(salaryInfo[0].displayText.hraWithoutPFYearly)
        values.hraWithoutPFMonthly =eval(salaryInfo[0].displayText.hraWithoutPFMonthly)
        // Math.trunc(Number((form.offerCTC - e.target.value)));

        if (e.target?.name === 'variablepay' || e.target?.name === 'offerCTC') {
            // {"basicYearlyWithPf": "values.GrossSalaryYearWithPf * 0.50", "basicMonthlyWithPf": "values.basicYearlyWithPf / 12", "GrossSalaryYearWithPf": "e.target?.name === 'variablepay' ? form.offerCTC - e.target.value : e.target.value"}

            // {"hraWithPFYearly":"values.basicYearlyWithPf * 0.40"}

            // {"hraWithPFMonthly":"values.hraWithPFYearly /12}
            // {"basicMonthlyWithPf":"values.basicYearlyWithPf / 12"}
            
            //  {"basicMonthlyWithoutPf":"values.basicYearlyWithoutPf / 12"}
            // {"basicYearlyWithoutPf":"values.GrossSalaryYearWithPf * 0.50"}
             

            //  {"hraWithoutPFMonthly":"values.hraWithoutPFYearly / 12"}
             // {"hraWithoutPFYearly":"values.basicYearlyWithoutPf * 0.40"}

             // {"employerContributionPFMonth":"form.employerContributionPFMonth" }

             // {"employerContributionPFYearly":"form.employerContributionPFMonth*12" }
            
            //  {"specialAllowancewithPfYearly":"values.GrossSalaryYearWithPf - values.basicYearlyWithPf - values.hraWithPFYearly - form.employerContributionPFYearly"}

        //  {"specialAllowancewithPfMonthly":"values.GrossSalaryYearWithPf / 12 - values.basicMonthlyWithPf - values.hraWithPFMonthly - form.employerContributionPFMonth"}

        // {"netPayTaxwithPfMonth":"values.GrossSalaryMonthWithPf - form.employerContributionPFMonth - values.employeeContributionwithPfMonth"}

        // {"netPayTaxwithoutPfMonth":"values.GrossSalaryMonthWithoutPf - form.employerContributionPfWithoutPfMonth - form.employeeContributionwithoutPfMonth"}
       






            values.basicMonthlyWithPf = Math.trunc(Number(values.basicYearlyWithPf / 12));
           
            values.hraWithPFMonthly = Math.trunc(Number(values.hraWithPFYearly / 12));
            // values.hraWithPFYearly = Math.trunc(Number(values.basicYearlyWithPf * 0.40));
            values.specialAllowancewithPfMonthly = Math.trunc(Number((values.GrossSalaryYearWithPf / 12 - values.basicMonthlyWithPf - values.hraWithPFMonthly - form.employerContributionPFMonth)))
            values.specialAllowancewithPfYearly = Math.trunc(Number((values.GrossSalaryYearWithPf - values.basicYearlyWithPf - values.hraWithPFYearly - form.employerContributionPFYearly)))

            values.GrossSalaryMonthWithPf = Math.trunc(Number((values.basicMonthlyWithPf + values.hraWithPFMonthly + form.employerContributionPFMonth + values.specialAllowancewithPfMonthly)))


            // gross salary  offerctc - variable pay
          


            values.GrossSalaryYearWithPf = Math.trunc(Number((values.basicYearlyWithPf + values.hraWithPFYearly + form.employerContributionPFYearly + values.specialAllowancewithPfYearly)))


            //  without pf 
            // values.basicYearlyWithoutPf = Math.trunc(Number(values.GrossSalaryYearWithPf * 0.50));
            values.basicMonthlyWithoutPf = Math.trunc(Number(values.basicYearlyWithoutPf / 12));
         
            values.hraWithoutPFYearly = Math.trunc(Number(values.basicYearlyWithoutPf * 0.40));
            values.hraWithoutPFMonthly = Math.trunc(Number(values.hraWithoutPFYearly / 12));
            values.specialAllowancewithoutPfMonthly = Math.trunc(Number((values.GrossSalaryYearWithPf / 12 - values.basicMonthlyWithoutPf - values.hraWithoutPFMonthly - form.employerContributionPfWithoutPfMonth)))

            values.specialAllowancewithoutPfYearly = Math.trunc(Number((values.GrossSalaryYearWithPf - values.basicYearlyWithoutPf - values.hraWithoutPFYearly - form.employerContributionPfWithoutPfYear)))

            values.employeeContributionwithPfMonth = Math.trunc(Number((form.employeeContributionwithPfYear / 12)))


            values.GrossSalaryMonthWithoutPf = Math.trunc(Number((values.basicMonthlyWithoutPf + values.hraWithoutPFMonthly + form.employerContributionPfWithoutPfMonth + values.specialAllowancewithoutPfMonthly)))

            values.GrossSalaryYearWithoutPf = Math.trunc(Number((values.basicYearlyWithoutPf + values.hraWithoutPFYearly + form.employerContributionPfWithoutPfYear + values.specialAllowancewithoutPfYearly)))


            // Net pay taxes

            values.netPayTaxwithPfMonth = Math.trunc(Number((values.GrossSalaryMonthWithPf - form.employerContributionPFMonth - values.employeeContributionwithPfMonth)))

            values.netPayTaxwithoutPfMonth = Math.trunc(Number((values.GrossSalaryMonthWithoutPf - form.employerContributionPfWithoutPfMonth - form.employeeContributionwithoutPfMonth)))
        }

        setform({
            ...form,
            ...values,
            [e.target.name]: Number(e.target.value)
        });
    }

    // form submit values
    const handleSubmit = (e) => {
        e.preventDefault()
        // const formData = new FormData()
        console.log(form)

        CreateSalary.mutate(form);
        updateSalary.mutate(form)
        // updateSalary.mutate({formData:form})
        //   Object.keys(form).forEach(key=>{
        //     formData.append(key,form[key])
        // })

        console.log(updateSalary)
    }



    return (
        <>
            <Box sx={{ flexGrow: 1, marginTop: '7%', margin: '80px',marginLeft:"20px" }}>

                <div
                >
                    <form style={{margin:"50px"}}>
                        <Grid container
                            m={2} gap={20}
                            spacing={2}
                        >
                            <Grid Item xs='auto'>
                                <FormControl variant="standard"
                                    
                                    size="small">
                                    <h3>Offer CTC</h3>
                                    <TextField
                                        required
                                        id="offerCTCid"
                                        placeholder='Enter Offer CTC'
                                        size='small'
                                        margin='normal'
                                        name='offerCTC'
                                        type='number'
                                        variant="filled"
                                        onChange={HandleChange}
                                    value={form?.costToCompany}

                                    />
                                </FormControl>
                            </Grid>

                            <Grid Item xs='auto'>
                                <FormControl variant="standard" size="small"
                                 sx={{right:80}}
                                >
                                    <h4 style={{ fontSize: "20px" }}>Does there any Variable Pay ?</h4>
                                    <RadioGroup
                                        row
                                        required
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radioButtonsForVp"
                                    >
                                        <FormControlLabel value="true" control={<Radio required={true} onClick={(e) => setVariablePayVisibility(true)} />} label="Yes" />
                                        <FormControlLabel value="false" control={<Radio required={true} onClick={(e) => setVariablePayVisibility(false)} />} label="No" />
                                        {
                                            variablePayVisibility === true ?
                                                <>
                                                    <Grid container 
                                                   
                                                    >
                                                        <TextField type="number"
                                                          sx={{  marginRight: "10px",width:"150px" }} 
                                                            id='vp' name="variablepay" placeholder='variable Pay Amount'
                                                           onChange={HandleChange}
                                                           value={form?.variablePay}

                                                            />

                                                        <FormControl fullWidth
                                                            style={{ paddingRight: "20px", width: "170px" }}
                                                  
                                                        >
                                                            <Select
                                                                id="demo-simple-select"
                                                                name='variablePayduration'
                                                                onChange={dynamicChangeVariable}
                                                                value={freqVariable}
                                                               
                                                            >
                                                                <MenuItem value={30}>6 Month</MenuItem>
                                                                <MenuItem value={40}>12 Month</MenuItem>

                                                            </Select>
                                                        </FormControl>

                                                    </Grid>
                                                </>
                                                :
                                                <>
                                                </>
                                        }

                                    </RadioGroup>
                                </FormControl>

                            </Grid>


                            <Grid Item xs='auto '
                             spacing={2}

                            >

                                <FormControl variant="standard" size="small"
                                sx={{right:190}}
                                >
                             
                                    <h4 style={{ fontSize: "20px" }}
                                    >Is there any Bonus Pay ?</h4>
                                    <RadioGroup
                                        row
                                        required
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        name="radioButtonsForBonus"
                                    >


                                        <FormControlLabel value="true" control={<Radio required={true} onClick={(e) => setBonusPay(true)} />} label="Yes" />
                                        <FormControlLabel value="false" control={<Radio required={true} onClick={(e) => setBonusPay(false)} />} label="No" />

                                        {
                                            bonusPay === true ?
                                                <>  
                                              
                                                    <Grid container  >
                                                   
                                                        <TextField type="number" 
                                                          
                                                            sx={{  marginRight: "10px",width:"150px" }} 
                                                            
                                                            id='vp' name="bonusAmount" placeholder='Bonus Pay Amount'  />
                                                        <FormControl fullWidth 
                                                            style={{ paddingRight: "20px", width: "170px" }}
                                                          
                                                        >
                                                  
                                                            <Select
                                                                
                                                                id="demo-simple-select"
                                                                name='bonusPayDuration'
                                                                onChange={dynamicChange}
                                                                value={bonusDuration}
                                                               
                                                             
                                                            >
                                                                <MenuItem value={10}>6 Month</MenuItem> 
                                                                <MenuItem value={20}>12 Month</MenuItem>

                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </>
                                                :
                                                <>
                                                </>
                                        }
                                        
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        </form>
                </div>
            </Box>
                            <Button
                                onClick={ClickToOpen}
                                value={render}
                                variant="contained"
                                endIcon={<PaddingIcon />}
                                style={{width:"170px",height:"50px",marginLeft:"1850px",marginTop:"40px"}}
                            
                            > Salary </Button>





            <Box>
                <div>
                    <Dialog open={render} fullWidth={true} maxWidth={'xl'} fullScreen={fullScreen} onClose={ClickToClose}>
                        <DialogContent style={{ height: '1400px' }}

                        >
                            <Box overflow="hidden">
                                <h2 style={{
                                    padding: '10px', backgroundColor: "cornflowerblue",
                                    fontWeight: 700, fontSize: "20px", textAlign: "center"

                                }}>Employee Salary</h2>

                                {render === true ?
                                    <>

                                        <form onSubmit={handleSubmit}>
                                            <Box margin={1} sx={{
                                                boxShadow: 1,
                                                padding: "6px",
                                                display: 'grid',
                                                gap: 3,
                                                gridTemplateColumns: 'repeat(4,4fr)',
                                                border: '#4774ce',
                                                marginTop: "1",
                                                // border: "1px solid black"

                                            }}>

                                                <body style={{ border: "1px solid black;" }}>
                                                    <table class="center" >

                                                        <tr>

                                                            <th>&nbsp;</th>
                                                            <th >With PF</th>
                                                            <th>&nbsp;</th>
                                                            <th>Without PF</th>
                                                        </tr>

                                                        <tr>
                                                            <th style={{ fontSize: "20px" }}><b>Particular</b></th>
                                                            <th>Monthly</th>
                                                            <th>Yearly</th>
                                                            <th>Monthly</th>
                                                            <th>Yearly</th>
                                                        </tr>


                                                        <tr>

                                                            <td><b>Basic</b></td>
                                                            <td>
                                                                <input name='basicMonth' onChange={HandleChange} value={form?.basicMonthlyWithPf} />
                                                            </td>

                                                            <td>
                                                                <input name='basicYearly' onChange={HandleChange} value={form?.basicYearlyWithPf} />
                                                            </td>
                                                            <td>
                                                                <input name='Basic Monthly without pf'
                                                                    onChange={HandleChange} value={form.basicMonthlyWithoutPf}>
                                                                </input>
                                                            </td>

                                                            <td>
                                                                <input name='Basic Yearly without pf'
                                                                    onChange={HandleChange} value={form.basicYearlyWithoutPf}>
                                                                </input>
                                                            </td>
                                                        </tr>
                                                        <tr>

                                                            <td><b>HRA</b></td>

                                                            <td>
                                                                <input name=''
                                                                    onChange={HandleChange} value={form?.hraWithPFMonthly}>
                                                                </input>
                                                            </td>

                                                            <td>
                                                                <input name=''
                                                                    onChange={HandleChange} value={form?.hraWithPFYearly}>
                                                                </input>
                                                            </td>


                                                            <td>
                                                                <input name='HRA Monthly without pf'
                                                                    onChange={HandleChange} value={form.hraWithoutPFMonthly}>
                                                                </input>
                                                            </td>

                                                            <td>
                                                                <input name='HRA Yearly with PF' onChange={HandleChange} value={form.hraWithoutPFYearly}>
                                                                </input>
                                                            </td>
                                                        </tr>



                                                        <tr>

                                                            <td><b>Employer Contribution to PF</b></td>

                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.employerContributionPFMonth}>
                                                                </input>
                                                            </td>


                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.employerContributionPFYearly}>
                                                                </input>
                                                            </td>


                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.employerContributionPfWithoutPfMonth}>
                                                                </input>
                                                            </td>


                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.employerContributionPfWithoutPfYear}>
                                                                </input>
                                                            </td>
                                                        </tr>




                                                        <tr>

                                                            <td><b>Special Allowance</b></td>


                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.specialAllowancewithPfMonthly}>
                                                                </input>
                                                            </td>


                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.specialAllowancewithPfYearly}>
                                                                </input>
                                                            </td>


                                                            <td>
                                                                <input name=''
                                                                    onChange={HandleChange} value={form.specialAllowancewithoutPfMonthly}>
                                                                </input>
                                                            </td>


                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.specialAllowancewithoutPfYearly}>
                                                                </input>
                                                            </td>
                                                        </tr>

                                                        <tr>

                                                            <td><b>Gross Salary</b></td>

                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.GrossSalaryMonthWithPf}>
                                                                </input>
                                                            </td>

                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.GrossSalaryYearWithPf}>
                                                                </input>
                                                            </td>

                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.GrossSalaryMonthWithoutPf}>
                                                                </input>
                                                            </td>


                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.GrossSalaryYearWithoutPf}>
                                                                </input>
                                                            </td>

                                                        </tr>

                                                        <tr>
                                                            <td style={{ backgroundColor: "cornflowerblue" }}>Less :</td>
                                                        </tr>

                                                        <tr>
                                                            <td > <b>Employer Contribution to PF </b></td>

                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.employerContributionPFMonth}>
                                                                </input>
                                                            </td>

                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.employerContributionPFYearly}>
                                                                </input>
                                                            </td>


                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.employerContributionPfWithoutPfMonth}>
                                                                </input>
                                                            </td>


                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.employerContributionPfWithoutPfYear}>
                                                                </input>
                                                            </td>



                                                        </tr>

                                                        <tr>
                                                            <td> <b>Employee Contribution to PF </b></td>

                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.employeeContributionwithPfMonth}>
                                                                </input>
                                                            </td>

                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.employeeContributionwithPfYear}>
                                                                </input>
                                                            </td>


                                                            <td>
                                                                <input name='' onChange={HandleChange} value={0}>
                                                                </input>
                                                            </td>

                                                            <td>
                                                                <input name='' onChange={HandleChange} value={0}>
                                                                </input>
                                                            </td>

                                                        </tr>


                                                        <tr>
                                                            <td><b>Net Pay before Taxes </b></td>

                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.netPayTaxwithPfMonth}>
                                                                </input>
                                                            </td>

                                                            <td>&nbsp;</td>

                                                            <td>
                                                                <input name='' onChange={HandleChange} value={form.netPayTaxwithoutPfMonth}>
                                                                </input>
                                                            </td>
                                                            <td onChange={HandleChange}>&nbsp;</td>
                                                        </tr>



                                                        <tr>
                                                            <td><b>Variable Pay  </b></td>
                                                            <td><b>&nbsp;</b></td>
                                                            <td>
                                                                <input onChange={HandleChange} value={form?.variablepay}></input>
                                                            </td>
                                                            <td><b>&nbsp;  </b></td>
                                                            <td>
                                                                <input name="variablepay" onChange={HandleChange} value={form?.variablepay}></input>
                                                            </td>

                                                        </tr>

                                                        <tr>
                                                            <td><b>Total CTC </b></td>
                                                            <td><b>&nbsp; </b></td>
                                                            <td onChange={HandleChange}>{form?.offerCTC}</td>
                                                            <td><b>&nbsp; </b></td>

                                                            <td>

                                                                <input name='costToCompany' onChange={HandleChange} 
                                                                value={form?.offerCTC}>
                                                                </input>
                                                            </td>

                                                        </tr>


                                                    </table>

                                                    <Button size="small" variant="contained" color="success" type='submit' sx={{ ml: '10px', mt: '10px', width: "100px", height: "40px" }} >
                                                        Submit
                                                        
                                                    </Button>
                                                    
                                                    <Button size="small" sx={{ ml: '10px', mt: '10px', width: "100px", height: "40px" }}
                                                        endIcon={<CloseIcon />}
                                                        variant="contained" color="primary"
                                                        type='button' onClick={ClickToClose}>Close</Button>

                                                </body>

                                            </Box>
                                        </form>
                                      
                                    </>
                                    :
                                    <h1>
                                        hello
                                    </h1>
                                }
                            </Box>
                        </DialogContent>
                    </Dialog>
                </div>
            </Box>
        </>
    )
}

export default Offerletter;