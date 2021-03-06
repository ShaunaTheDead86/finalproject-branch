import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useDebounce from "../hooks/useDebounce";

export default function SearchPane (props) {
  
  const {searchFilter} = props;

  const [severities, setSeverities] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [types, setTypes] = useState([]);
  const [milestones, setMilestones] = useState([]);
  
  const [criteria, setCriteria] = useState({DESC:"", SEVERITY: "All", PRIORITY: "All", TYPE: "All", MILESTONE: "All"});
  const [searchInput, setSearchInput] = useState("");

  const delayedInput = useDebounce(searchInput, 500);

  const DESC = "DESC"
  const SEVERITY = "SEVERITY"
  const PRIORITY = "PRIORITY"
  const TYPE = "TYPE"
  const MILESTONE = "MILESTONE"

  useEffect(() => {
    criteria[DESC] = delayedInput;
    searchFilter({...criteria})
  },[delayedInput, criteria])


  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + '/severities')
      .then(res => {
        setSeverities(res.data)
      })
      .catch(function (error) {
        console.log(error.message)
        })
    
    axios.get(process.env.REACT_APP_BACKEND_URL + '/priorities')
      .then(res => {
        setPriorities(res.data)
      })
      .catch(function (error) {
        console.log(error.message)
        })
    
    axios.get(process.env.REACT_APP_BACKEND_URL + '/types')
    .then(res => {
      setTypes(res.data)
    })
    .catch(function (error) {
      console.log(error.message)
      })

    axios.get(process.env.REACT_APP_BACKEND_URL + '/milestones')
    .then(res => {
      setMilestones(res.data)
    })
    .catch(function (error) {
      console.log(error.message)
      })

  }, [])
  
  const severitiesMenu = severities.map(severity => <MenuItem key={severity.id} value={severity.name}>{severity.name}</MenuItem>)
  const prioritiesMenu = priorities.map(priority => <MenuItem key={priority.id} value={priority.name}>{priority.name}</MenuItem>)
  const typesMenu = types.map(type => <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>)
  const milestonesMenu = milestones.map(milestone => <MenuItem key={milestone.id} value={milestone.name}>{milestone.name}</MenuItem>)

  return (
    <Box sx={{ m: 3, display: 'flex' }}>
      <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Search ticket"
          fullWidth
          variant="outlined"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ManageSearchIcon />
              </InputAdornment>
            ),
          }}
        />

      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="SeverityLabel">Severity</InputLabel>
        <Select
          labelId="SeverityLabel"
          label="Severity"
          id="Severity"
          value={criteria[SEVERITY]}
          onChange={e => setCriteria({...criteria, SEVERITY: e.target.value})}
        >
          <MenuItem value="All"><em>All Severities</em></MenuItem>
          {severitiesMenu}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 150 }}>
      <InputLabel id="PriorityLabel">Priority</InputLabel>
        <Select
          labelId="PriorityLabel"
          label="Priority"
          id="Priority"
          value={criteria[PRIORITY]}
          onChange={e => setCriteria({...criteria, PRIORITY: e.target.value})}
        >
          <MenuItem value="All"><em>All Priorities</em></MenuItem>
          {prioritiesMenu}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="TypeLabel">Type</InputLabel>
        <Select
          labelId="TypeLabel"
          label="Type"
          id="Type"
          value={criteria[TYPE]}
          onChange={e => setCriteria({...criteria, TYPE: e.target.value})}
        >
          <MenuItem value="All"><em>All Types</em></MenuItem>
          {typesMenu}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="MilestoneLabel">Severity</InputLabel>
        <Select
          labelId="MilestoneLabel"
          label="Milestone"
          id="Milestone"
          value={criteria[MILESTONE]}
          onChange={e => setCriteria({...criteria, MILESTONE: e.target.value})}
        >
          <MenuItem value="All"><em>All Milestones</em></MenuItem>
          {milestonesMenu}
        </Select>
      </FormControl>

    </Box>
  )
}
