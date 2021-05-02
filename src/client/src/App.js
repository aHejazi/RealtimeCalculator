import React from "react";

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/styles';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import _ from 'lodash';

import { io } from "socket.io-client";
const SERVER = "http://127.0.0.1:3030";

const styles = theme => ({
  root: {
    flexGrow: 1,
    alignContent: "center",
    marginInline: "auto",
    marginTop: 40
  },
  calculatorKeys: {
    flexGrow: 1,
    alignContent: "center",
    marginInline: "auto",
    marginTop: 40,
    maxWidth: "40%",
  },
  calRow: {
    flexFlow: "nowrap",
  },
  display: {
    flexGrow: 1,
    alignContent: "center",
    marginInline: "auto",
    textAlign: "center",
    textAlignLast: "center",
    backgroundColor: "gainsboro",
    padding: 2
  }
});

class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      calcResult: "",
      operation: "",
      x: "",
      y: "",
      display: "",
      history: []
    };

    this.socket = io(SERVER, {
        reconnectionDelay: 1000,
        reconnection: true,
        reconnectionAttemps: 10,
        transports: ['websocket'],
        agent: false,
        upgrade: false,
        rejectUnauthorized: false
    });
  }

  componentDidMount() {
    this.socket.on("history_update", (newHistory) => {
      console.log("New History: ", newHistory);

      if(_.isArray(newHistory.history)) {
        this.setState(
          prevState => ({
            history: newHistory.history
          })
        );
      }
    });

    this.socket.on("connection", (data) => {
      console.log(data);
    });
  }

  handleNumber(value) {
    console.log(`${value}`);

    if(!this.state.operation) {
      this.setState(
        prevState => ({
          x: `${prevState.x}${value}`,
          display: `${prevState.x}${value}`
        })
      );
      console.log('Adding to X');
    } else if(this.state.calcResult) {
      this.setState(prevState => ({
          x: `${value}`,
          display: `${value}`,
          y: "",
          operation: "",
          calcResult: "",
        })
      );
      console.log('Adding to Y');
    } else {
      this.setState(prevState => ({
          y: `${prevState.y}${value}`,
          display: `${prevState.x} ${prevState.operation} ${prevState.y}${value}`
        })
      );
      console.log('Adding to Y');
    }
  }

  handleOp(value) {
    console.log(`${value}`);
    
    if(!this.state.operation) {
      this.setState(prevState => ({
          operation: `${value}`,
          display: `${prevState.x} ${value}`
        })
      );
    } else {
      let this_equation_result = this.state.calcResult ? this.state.calcResult + '' : this.evaluateCalculation();

      this.setState(prevState => ({
          x: this_equation_result,
          y: "",
          operation: `${value}`,
          calcResult: "",
          display: `${this_equation_result} ${value}`
        })
      );
    }
  }

  clearCalc() {
    this.setState(prevState => ({
        x: "",
        y: "",
        operation: "",
        calcResult: "",
        display: "0"
      })
    );
    console.log("Clearing all");
  }

  validate_equation() {
    let op = this.state.operation || "";
    let x = this.state.x || "";
    let y = this.state.y || "";

    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    if (isNumeric(x) && isNumeric(y) && _.includes('/*-+', op)) {
      return true;
    }

    return false;
  }

  evaluateCalculation() {
    if(!this.validate_equation()) {
      return false;
    }

    let op = this.state.operation || "";
    let x = _.toNumber(this.state.x);
    let y = _.toNumber(this.state.y);

    // TODO: send this to the backend for calculations
    let result = NaN;

    if (_.isEqual("+",op)) {
      result = x + y;
    } else if (_.isEqual("-",op)) {
      result = x - y;
    } else if (_.isEqual("*",op)) {
      result = x * y;
    } else if (_.isEqual("/",op)) {
      result = x / y;
    }

    if (!_.isNaN(result)) {
      this.setState(prevState => ({
          calcResult: `${result}`,
          display: `${prevState.x} ${prevState.operation} ${prevState.y} = ${result}`
        })
      );

      this.socket.emit("new_operation", { 
        op: op,
        x: x,
        y: y,
        result: result
      });

      return result;
    }

    return false;
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid className={classes.calculatorKeys} container spacing={1}>
          <Grid container item xs={12} spacing={1}>
            <React.Fragment>
                <Typography className={classes.display}>
                  {this.state.display || 0}
                </Typography>
            </React.Fragment>
          </Grid>
          <Grid className={classes.calRow} container item xs={12} spacing={1}>
            <React.Fragment>
                <Button color="primary" onClick={() => this.handleNumber('1')}>1</Button>
                <Button color="primary" onClick={() => this.handleNumber('2')}>2</Button>
                <Button color="primary" onClick={() => this.handleNumber('3')}>3</Button>
                <Button color="primary" onClick={() => this.handleOp('-')}>-</Button>
            </React.Fragment>
          </Grid>
          <Grid className={classes.calRow} container item xs={12} spacing={1}>
            <React.Fragment>
                <Button color="primary" onClick={() => this.handleNumber('4')}>4</Button>
                <Button color="primary" onClick={() => this.handleNumber('5')}>5</Button>
                <Button color="primary" onClick={() => this.handleNumber('6')}>6</Button>
                <Button color="primary" onClick={() => this.handleOp('+')}>+</Button>
            </React.Fragment>
          </Grid>
          <Grid className={classes.calRow} container item xs={12} spacing={1}>
            <React.Fragment>
                <Button color="primary" onClick={() => this.handleNumber('7')}>7</Button>
                <Button color="primary" onClick={() => this.handleNumber('8')}>8</Button>
                <Button color="primary" onClick={() => this.handleNumber('9')}>9</Button>
                <Button color="primary" onClick={() => this.handleOp('*')}>*</Button>
            </React.Fragment>
          </Grid>
          <Grid className={classes.calRow} container item xs={12} spacing={1}>
            <React.Fragment>
                <Button color="primary" onClick={() => this.handleNumber('0')}>0</Button>
                <Button color="primary" onClick={() => this.clearCalc()}>C</Button>
                <Button color="primary" onClick={() => this.evaluateCalculation()}>=</Button>
                <Button color="primary" onClick={() => this.handleOp('/')}>/</Button>
            </React.Fragment>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={1}>
            <React.Fragment>
              <Grid item xs={12}>
              <Card>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      History
                    </Typography>
                    {/* <Typography variant="body2" color="textSecondary" component="p">
                      {this.state.history.join('\r\n')}
                    </Typography> */}
                    <TextareaAutosize
                      rowsMax={11}
                      aria-label="maximum height"
                      placeholder="History"
                      value={this.state.history.join('\r\n')}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
              </Grid>
            </React.Fragment>
          </Grid>
      </div>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
// export default App;
