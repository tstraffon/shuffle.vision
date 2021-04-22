import React, { useEffect, useState } from 'react';
import '../../App.css';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listPlaylists } from '../../graphql/queries';

import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import theme from '../../theme';
import { isMobile, isTablet } from 'react-device-detect';

const cardHeaderStyle = { backgroundColor: theme.palette.primary.main, float:'left', color:'white', fontSize:'16px', width:'100%' };

const Profile = () => {

  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [showUpdateEmail, setShowUpdateEmail] = React.useState(false);
  const [showChangePassword, setShowChangePassword] = React.useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [emailMatch, setEmailMatch] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [playlistCount, setPlaylistCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [passwordMatch, setPasswordMatch] = React.useState(true);
  const [incorrectPassword, setIncorrectPassword] = React.useState(false);
  const [loadingChangePassword, setLoadingChangePassword] = React.useState(false);
  const [loadingUpdateEmail, setLoadingUpdateEmail] = React.useState(false);
  const [loadingSignOut, setLoadingSignOut] = React.useState(false);

  useEffect( () => {
    async function fetchData (){
      await fetchProfileData();
      setLoadingProfile(false);
    }
    fetchData();
  }, [])


  const fetchProfileData = async () => {
    try {
      const { username, attributes } = await Auth.currentUserInfo();
      const { email } = attributes;
      const  { data } = await API.graphql(graphqlOperation(listPlaylists, { filter: { owner:  { eq: username }}}));
      const playlistCount = data.listPlaylists.items.length;
      let itemCount = 0;
      for(const p of data.listPlaylists.items){
        itemCount = itemCount + p.items.items.length;
      }
      setUsername(username);
      setEmail(email);
      setPlaylistCount(playlistCount);
      setItemCount(itemCount);

    } catch(error) {
      console.error('[profile] error', { error });
    }
  }

  const toggleShowUpdateEmail = () => {
    setShowUpdateEmail(!showUpdateEmail);
    setEmailMatch(true);
    setNewEmail('');
    setConfirmEmail('');
  }

  const updateEmail = async () => {
    setLoadingUpdateEmail(true);
    if(newEmail !== confirmEmail){
      setEmailMatch(false);
      return;
    }
    try{
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, {
        'email': newEmail
      });
      setShowUpdateEmail(false);
      setEmail(newEmail);
    } catch(error){
      console.error('[profile] updateEmail error', error);
    }
  }

  const toggleShowChangePassword = () => {
    setShowChangePassword(!showChangePassword);
    setPasswordMatch(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }


  const signOut = async () => {
    try {
        setLoadingSignOut(true)
        await Auth.signOut();
        window.location.replace("https://shuffle.vision");
    } catch (error) {
        console.error('error signing out: ', error);
    }
  }

  const changePassword = async () => {
    try {
      setLoadingChangePassword(true);
      if(newPassword !== confirmPassword){
        setPasswordMatch(false);
        return;
      }
      setPasswordMatch(true);
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, oldPassword, newPassword);
      setLoadingChangePassword(false);
      setShowChangePassword(false);
    } catch (error) {
        if(error.message === "Incorrect username or password."){
          setIncorrectPassword(true);
        }
        setLoadingChangePassword(false);
        console.error('error change password: ', error);
    }
  }


  return (
    <div className={ !isMobile && !isTablet ? 'view-container' : 'mobile-view-container'}>
      <Grid container spacing={4} justify="center" >
        <Grid item xs={12} md={6}>
          <Card position="fixed" >
            { !showChangePassword && !showUpdateEmail ?
              <CardHeader
                avatar={<AccountCircleIcon size='large' style={{marginTop:'5px'}}/>}
                title={<span style={{float: 'left', fontSize:'24px'}}>Your Profile</span>}
                style={cardHeaderStyle}
              />
            :
              <React.Fragment>
                { showChangePassword ?
                  <CardHeader
                    avatar={<RotateLeftIcon size='large' style={{marginTop:'5px'}} />}
                    title={<span style={{float: 'left', fontSize:'24px'}}>Update Password</span>}
                    style={cardHeaderStyle}
                  />
                :
                  <CardHeader
                    avatar={<RotateLeftIcon size='large' style={{marginTop:'5px'}} />}
                    title={<span style={{float: 'left', fontSize:'24px'}}>Update Email</span>}
                    style={cardHeaderStyle}
                  />
                }
              </React.Fragment>
            }
          { loadingProfile ?
            <CardContent style={{height: '75vh'}}>
              <div className="loading-container"> 
                <CircularProgress />
              </div>
            </CardContent >
          : 
            <React.Fragment>
              { !showChangePassword && !showUpdateEmail ?
                <CardContent >
                  <Grid container spacing={4} direction="row" justify="flex-start" alignItems="center" >
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Username: </TableCell>
                          <TableCell >{username}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Email: </TableCell>
                          <TableCell>{email}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Playlist Count:</TableCell>
                          <TableCell>{playlistCount}</TableCell>                      
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Item Count:</TableCell>
                          <TableCell>{itemCount}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <Grid item xs={12} />
                    <Grid item key={"change-password"} xs={12} >
                      <Button onClick={() => toggleShowChangePassword()} variant="contained" color="primary" style={{width:'100%', height:'100%'}}>Update Password</Button>
                    </Grid>
                    <Grid item key={"change-email"} xs={12} >
                      <Button onClick={() => toggleShowUpdateEmail()} variant="contained" color="primary" style={{width:'100%', height:'100%'}}>Update Email</Button>
                    </Grid>
                    <Grid item key={"sign-out"} xs={12} >
                      {loadingSignOut ?
                        <div className="loading-container">   
                          <CircularProgress />
                        </div>
                      :
                        <Button onClick={() => signOut()} variant="outlined" color="primary" style={{width:'100%', height:'200%'}}>Sign Out</Button>
                      }
                    </Grid>
                  </Grid>
                </CardContent> 
              :
               <React.Fragment>
                  {showChangePassword ?
                    <CardContent >
                      <Grid container spacing={4} direction="row" justify="flex-start" alignItems="center" >
                        <Grid item xs={12}>
                          { !incorrectPassword ?
                            <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              name="password"
                              label="Old Password"
                              type="password"
                              id="old-password"
                              autoComplete="current-password"
                              onChange={e => setOldPassword(e.target.value)}
                              value={oldPassword}
                            />
                          :
                            <TextField
                              error
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              name="password"
                              label="Incorrect Password"
                              type="password"
                              id="old-password"
                              autoComplete="current-password"
                              onChange={e => setOldPassword(e.target.value)}
                              value={oldPassword}
                            />
                          }
    
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="New Password"
                            type="password"
                            id="new-password"
                            autoComplete="current-password"
                            onChange={e => setNewPassword(e.target.value)}
                            value={newPassword}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          {passwordMatch ?
                            <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              name="password"
                              label="Confirm New Password"
                              type="password"
                              id="new-password-confirm"
                              autoComplete="current-password"
                              style={{ paddingBottom:'24px'}}
                              onChange={e => setConfirmPassword(e.target.value)}
                              value={confirmPassword}
                            />
                          :
                            <TextField
                              error
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              name="password"
                              label="Passwords Did Not Match"
                              type="password"
                              id="new-password-confirm"
                              autoComplete="current-password"
                              style={{ paddingBottom:'24px'}}
                              onChange={e => setConfirmPassword(e.target.value)}
                              value={confirmPassword}
                            />
                          }
                        </Grid>
                        <Grid item key={"sign-out"} xs={12} >
                          { loadingChangePassword ?
                            <div className="loading-container">   
                              <CircularProgress />
                            </div>
                          :
                            <Button onClick={() => changePassword()} startIcon={<RotateLeftIcon />} variant="contained" color="primary" style={{width:'100%', height:'100%'}}>Update Password</Button>
                          }
                        </Grid>
                        <Grid item key={"change-password"} xs={12} >
                            <Button onClick={() => toggleShowChangePassword()} startIcon={<CancelOutlinedIcon />} variant="outlined" style={{width:'100%', height:'100%'}}>Cancel</Button>
                        </Grid>
                      </Grid>
                    </CardContent> 
                  :
                    <CardContent >
                      <Grid container spacing={4} direction="row" justify="flex-start" alignItems="center" >
                        <Grid item xs={12}>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            disabled
                            name="current email"
                            label="Current Email"
                            id="current-email"
                            autoComplete="current-email"
                            value={email}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="new email"
                            label="New Email"
                            id="new-email"
                            autoComplete="new-email"
                            onChange={e => setNewEmail(e.target.value)}
                            value={newEmail}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          {emailMatch ?
                            <TextField
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              name="confirm-new-email"
                              label="Confirm New Email"
                              id="confirm-new-email"
                              autoComplete="confirm-new-email"
                              style={{ paddingBottom:'24px'}}
                              onChange={e => setConfirmEmail(e.target.value)}
                              value={confirmEmail}
                            />
                          :
                            <TextField
                              error
                              variant="outlined"
                              margin="normal"
                              required
                              fullWidth
                              name="confirm-email-no-match"
                              label="Emails Did Not Match"
                              id="confirm-email-no-match"
                              autoComplete="confirm-email-no-match"
                              style={{ paddingBottom:'24px'}}
                              onChange={e => setConfirmEmail(e.target.value)}
                              value={confirmEmail}
                            />
                          }
                        </Grid>
                        <Grid item key={"sign-out"} xs={12} >
                          { loadingUpdateEmail ?
                            <div className="loading-container">   
                              <CircularProgress />
                            </div>
                          :
                            <Button onClick={() => updateEmail()} startIcon={<RotateLeftIcon />} variant="contained" color="primary" style={{width:'100%', height:'100%'}}>Update Email</Button>
                          }
                        </Grid>
                        <Grid item key={"change-password"} xs={12} >
                            <Button onClick={() => toggleShowUpdateEmail()} startIcon={<CancelOutlinedIcon />} variant="outlined" style={{width:'100%', height:'100%'}}>Cancel</Button>
                        </Grid>
                      </Grid>
                    </CardContent> 
                  }
                </React.Fragment>
              }

            </React.Fragment>
          }
        </Card>
      </Grid>
    </Grid>
  </div>
  );

}

export default Profile; 