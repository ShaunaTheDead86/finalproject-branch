import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {List, ListItem, Divider, ListItemText} from '@mui/material'


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, backgroundColor: 'primary.main',  color: 'background.default'}} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ShowTicketDetails(props) {

  const {dialogOpen, setDialogOpen, ticketId, tickets} = props

  const ticketDetails = tickets.filter(ticket => ticket.id === ticketId)[0]

  const handleClose = () => {
   
    setDialogOpen(false);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={dialogOpen}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {ticketDetails.title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <List
            sx={{
              width: '100%',
             
              bgcolor: 'background.paper',
            }}
          >
            <ListItem>
             
              <ListItemText primary="Description:" secondary={ticketDetails.description} />
            </ListItem>
            <Divider variant="inset" component="li" />

            <ListItem>
             
              <ListItemText primary="Created at:" secondary={ticketDetails.created_at} />
            </ListItem>
          </List>

        </DialogContent>
  
      </BootstrapDialog>
    </div>
  );
}