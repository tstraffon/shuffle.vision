import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';


const colorPalettes = [ 
  {primary: '#233044', secondary: '#f50057'}, 
  {primary: '#3A5C55', secondary: '#DB8465'}, 
  {primary: '#344B5C', secondary: '#DBAB65'}, 
  {primary: '#0B678F', secondary: '#DBA465'}, 
  {primary: '#574056', secondary: '#EAECB3'},
  {primary: '#7080DB', secondary: '#A9D9B7'}, 
  {primary: '#DB6769', secondary: '#A0A2D9'}, 

]

const getPrimary = () =>{
  return colorPalettes[id].primary
}

const getSecondary = () =>{
  return colorPalettes[id].secondary
}

const id = Math.floor(Math.random() * Math.floor(colorPalettes.length));


const theme = createMuiTheme({
  palette: {
    background: {
      dark: '#F4F6F8',
      default: colors.common.white,
      paper: colors.common.white
    },
    primary: {
      main: getPrimary()
    },
    secondary: {
      main: getSecondary()
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    }
  },
  shadows,
  typography
});



export default theme;
