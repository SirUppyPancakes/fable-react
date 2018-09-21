import { withScriptjs, withGoogleMap, GoogleMap, TrafficLayer, Marker } from "react-google-maps";
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
import React, {Component, Children} from 'react';

const TrafficMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={props.defaultZoom}
    onZoomChanged={props.onZoomChanged}
    onIdle={props.onIdle}
    defaultCenter={props.defaultCenter}
    center={props.center}
    ref={props.onMapMounted} >
    {props.showSearchBox && <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder={props.searchBoxText}
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `30px`,
          marginTop: `10px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 1px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>}
    {props.showTrafficLayer &&  <TrafficLayer autoUpdate /> }
    {props.markers}
  </GoogleMap>
));

export class GoogleMapComponent extends React.PureComponent {
    refs = {}
    searchBoxRef = {}
    state = {
      isMarkerShown: false,
    }

    componentDidMount() {
      this.delayedShowMarker()
    }

    delayedShowMarker = () => {
      setTimeout(() => {
        this.setState({ isMarkerShown: true })
      }, 3000)
    }

    render() {
      return (
        <TrafficMapComponent
          key="map"
          isMarkerShown={this.state.isMarkerShown}
          defaultZoom={this.props.defaultZoom}
          onZoomChanged={this.props.onZoomChanged}
          defaultCenter={this.props.defaultCenter}
          searchBoxText={this.props.searchBoxText}
          showSearchBox={this.props.showSearchBox}
          showTrafficLayer={this.props.showTrafficLayer}
          center={this.props.center}
          onPlacesChanged={() => {
            this.props.onPlacesChanged(this.searchBoxRef.getPlaces())
          }}
          onIdle={this.props.onIdle}
          onMapMounted={this.props.setRef}
          onSearchBoxMounted={ref => {
            this.searchBoxRef = ref;
          }}
          markers={this.props.markers}
          onMarkerClick={() => {
            this.setState({ isMarkerShown: false })
            this.delayedShowMarker()
          }}
          googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + this.props.apiKey + "&v=3.exp&libraries=geometry,drawing,places"}
          loadingElement={<div className={this.props.mapLoadingContainer} style={{ width: `100%` }} >Loading</div>}
          containerElement={<div className={this.props.mapContainer} style={{ width: `100%` }} /> }
          mapElement={<div style={{ height: `100%` }} />}
        />
      )
    }
  }