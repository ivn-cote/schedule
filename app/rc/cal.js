import React from "react";
import _ from "lodash";
import {calcPositions} from "./util.js"
require('./cal.styl');

let Loader = React.createClass({
  // TBD
  // Make it cool

  render() {
    return (
      <div className="loader">
        Loading...
      </div>
    );
  },
});

let Event = React.createClass({
  // here we suppose container is 600x720, so that 1min = 1px
  getDefaultProps() {
    return {
      col: 1,
      disc: 1,
      start: 0, // the number of minutes since 9am
      end: 0
    }
  },
  render() {
    let
      contWidth = 600,
      position = {
        top: this.props.start,
        left: this.props.col > 1 ? (contWidth / this.props.disc * (this.props.col - 1)) : 0,
        width: this.props.disc > 1 ? (contWidth / this.props.disc) : '100%',
        height: this.props.end - this.props.start
      };

    return (
      <div className="event" style={position}>
        <div className="event-title">Sample Item</div>
        <div className="event-location">Sample location</div>
      </div>
    );
  },
});

export default React.createClass({
  getDefaultProps() {
    return {
      events: []
    }
  },
  getInitialState() {
    return {
      events: this.props.events,
      loader: true
    }
  },
  componentWillMount() {
    // setTimeout(this.calcGrid, 0);
  },
  componentWillReceiveProps(nextProps) {
    if (!_.toArray(nextProps.events).length) return;

    setTimeout(this.calcGrid, 0);
  },

  calcGrid() {
    if (this.props.events.length)
      this.setState({ events: calcPositions(this.props.events), loader: false });
    else
      this.setState({ loader: false });
  },

  render() {
    let
      hours = _.range(9, 13).map(x => `${x}a`).concat(_.range(1, 10).map(x => `${x}p`)),
      timeGrid = hours.map((hour, ind) =>
        <div className="timing" key={ind}>
          <div className="timing-digit">
            {hour.replace(/a|p/, '')}:00

            <span className="timing-apm">
            {~hour.indexOf('a') ? ' AM' : ''}
            {~hour.indexOf('p') ? ' PM' : ''}
            </span>
            <div className="timing-half">
            {hour.replace(/a|p/, '')}:30
            </div>
          </div>
        </div>
      ),
      eventCubes = this.state.events.map((item, ind) => <Event key={ind} {...item} />);

    return (
      <div className="calendarPage">
        <div className="calendarPage-timeline">
          {timeGrid}
        </div>
        <div className="calendarPage-events">
          {this.state.loader
            ? <Loader />
            : <div>
                {eventCubes}
              </div>
          }
        </div>
      </div>
    );
  },
});
