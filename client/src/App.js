import './App.css';

import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { io } from "socket.io-client";
const SERVER = "http://127.0.0.1:3030";

// const socket = io(SERVER);
const socket = io(SERVER, {
    reconnectionDelay: 1000,
    reconnection: true,
    reconnectionAttemps: 10,
    transports: ['websocket'],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    alignContent: "center",
    marginInline: "auto",
    maxWidth: "40%",
    marginTop: 40
  }
}));

function App() {
  const [history, setHistory] = useState("");

  useEffect(() => {
    socket.on("connection", (data) => {
      const connTS = new Date();
      console.log(data);
      setHistory(connTS.toLocaleString());
    });
  }, []);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={1}>
          <React.Fragment>
            <Grid item xs={4}>
              <Button>1</Button>
            </Grid>
            <Grid item xs={4}>
              <Button>2</Button>
            </Grid>
            <Grid item xs={4}>
              <Button>3</Button>
            </Grid>
          </React.Fragment>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <React.Fragment>
            <Grid item xs={4}>
              <Button>4</Button>
            </Grid>
            <Grid item xs={4}>
              <Button>5</Button>
            </Grid>
            <Grid item xs={4}>
              <Button>6</Button>
            </Grid>
          </React.Fragment>
        </Grid>
        <Grid container item xs={12} spacing={1}>
          <React.Fragment>
            <Grid item xs={4}>
              <Button>7</Button>
            </Grid>
            <Grid item xs={4}>
              <Button>8</Button>
            </Grid>
            <Grid item xs={4}>
              <Button>9</Button>
            </Grid>
          </React.Fragment>
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
                  <Typography variant="body2" color="textSecondary" component="p">
                    {history}
                    Connected 1
                    Connected 2
                    Connected 3
                    Connected 4
                    Connected 5
                    Connected 6
                    Connected 7
                    Connected 8
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            </Grid>
          </React.Fragment>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
