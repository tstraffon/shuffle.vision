import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';


const colorPalettes = [ 
  {primary: '#233044', secondary: '#f50057'}, // navy blue / bright red/pink
  {primary: '#3A5C55', secondary: '#DB8465'}, // forest green / orange
  {primary: '#344B5C', secondary: '#DBAB65'}, // navy blue / orange/gold
  {primary: '#0B678F', secondary: '#DBA465'}, // ocean blue / orange/gold
  {primary: '#574056', secondary: '#EAECB3'}, // burgandy / mint green
  {primary: '#A9565A', secondary: '#56A9A5'}, // deep pink / turqoise  
  {primary: '#639C7A', secondary: '#9C6385'}, // faded green / purple
  {primary: '#AC6153', secondary: '#539EAC'}, // faded red / turqoise
  {primary: '#666666', secondary: '#CE9821'}, // black / gold
  {primary: '#1f2916', secondary: '#568CA0'}, // black / blue
  {primary: '#1d2f36', secondary: '#edec7c'}, // black / yellow
  {primary: '#090e10', secondary: '#e9987c'}, // black / orange
  {primary: '#5B5FA4', secondary: '#A45B83'}, // purple / salmon
  {primary: '#5F90A0', secondary: '#905FA0'}, // sea blue / barney
  {primary: '#5F77A0', secondary: '#5FA067'}, // sea blue /  the grinch
  {primary: '#9C637E', secondary: '#639C81'}, // purple/pink / watermelon green
  {primary: '#7B906F', secondary: '#846F90'}, // moss green /  purple
  {primary: '#6D7692', secondary: '#6D9277'}, // cool blue / soft green
  {primary: '#946E6B', secondary: '#6B9194'}, // pink dirt / cool blue
  {primary: '#758A7F', secondary: '#8A7580'}, // forest green / purple soda
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
