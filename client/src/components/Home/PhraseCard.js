import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { AddToCart } from "../../actions/index.js";
import { connect } from 'react-redux';


const styles = theme => ({
  coverContainer:{
    position: 'relative',
    textAlign: 'center',
    color: '#333333',
    padding: 0,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
    paddingTop: 10,
    paddingBottom: 0,
    margin: 'auto',
  },
  label: {
    textAlign: 'center',
    opacity: 1,
    fontSize: '2em',
  },
});



class PhraseCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    this.setState({loading: false})
  }

  render() {
    const { classes, phrase, cartCount } = this.props;
    const { loading } = this.state;
    if(loading){
      return(<div></div>);
    }

    return (
      
      <React.Fragment>
        <CssBaseline />
            <Card className={classes.card}>
                {/* <CardContent className={classes.coverContainer} onMouseEnter={this.handleMouseHover} onMouseLeave={this.handleMouseHover} >
                <BeatCover beat={beat} showDetails={showDetails} playBeat={this.playBeat}/>
                </CardContent> */}
                <CardContent className={classes.cardContent}>
                <Typography className={classes.label}>
                    {phrase.phrase}
                </Typography>
                </CardContent>
                {/* <CardActions >
                <Button size="large" color="secondary" className={classes.addToCartButton} onClick={this.addToCartClick}>
                    Add To Cart
                </Button>
                </CardActions> */}
            </Card>
      </React.Fragment>
    );
  }
}

// // BeatCardContainer
// const mapStateToProps = state => ({
//     cart: state.cart,
//     cartCount: state.cartCount,
//   });

// const mapDispatchToProps = dispatch => {
//   return {
//     AddToCart: beatId => dispatch(AddToCart(beatId))
//   };
// }

// const PhraseCardContainer = connect(
//     mapStateToProps,
//     mapDispatchToProps,
// )(PhraseCard);

PhraseCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PhraseCard);
