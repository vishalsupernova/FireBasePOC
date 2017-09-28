/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Button,
  TouchableHighlight, TouchableOpacity
} from 'react-native';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCv262Xt6FwaoE0NuhQ-42THeNDKf5d7_E",
  authDomain: "reteriveitems.firebaseapp.com",
  databaseURL: "https://reteriveitems.firebaseio.com",
  projectId: "reteriveitems",
  storageBucket: "reteriveitems.appspot.com"
};

firebase.initializeApp(config);

const itemsRef = firebase.database().ref('Cars');

export default class FireBaseProject extends Component {

  constructor() {
    super();
    this.state = {
      dataSource: []
    }
    this.showdata = this.showdata.bind(this);
    this.sendData = this.sendData.bind(this);
  }

  componentDidMount() {
    this.getValues()
  }

  getValues() {
    itemsRef.on('value', (snapshot) => {
      let cars = snapshot.val();
      this.setState({
        dataSource: cars,
        showDetails: null
      })

    })
  }

  showdata(item) {
    this.setState({
      showDetails: this.state.dataSource[item]
    })
  }

  sendData(index, value) {
    let currentObject = this.state.dataSource[index];
    if (value === "approve") {
      let cliam = currentObject['cliam'];
      if (cliam == false) {
        currentObject['cliam'] = !currentObject['cliam']
        var approveRef = itemsRef.child(index).child('cliam')
        approveRef.transaction((newValue) => { return newValue ? false : true })
      }
    }
    else {
      var approveRef = itemsRef.child(index).child(value)
      approveRef.transaction((newValue) => { return newValue ? false : true })
      currentObject[value] = !currentObject[value];
    }
    this.setState({
      showDetails: currentObject,
    })
  }

  render() {
    const { dataSource, showDetails } = this.state;
    console.log(showDetails)
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const rowData = dataSource.length > 0 ? ds.cloneWithRows(dataSource.map(item => item.name)) : null
    return (
      <View>
        <Text style={styles.welcome}>List View</Text>
        <TouchableHighlight >
          <View  >
            {dataSource.length > 0 ?
              dataSource.map((item, index) => <Text style={styles.instructions} key={item.index} onPress={() => this.showdata(index)}>{item.name}</Text>)
              : null}
          </View>
        </TouchableHighlight>

        <View>
          <Text style={{fontSize: 20,textAlign: 'center',color: 'black', fontWeight: 'bold'}}>{showDetails && showDetails.name}</Text>
          {showDetails ?
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
              <Button
                styles={styles.button}
                onPress={() => this.sendData(dataSource.findIndex(item => item.name === showDetails.name), 'cliam')}
                title="Claim"
                color="#68D158"
                accessibilityLabel="Claim"
                disabled={!showDetails.cliam}
              />
              <Button
                onPress={() => this.sendData(dataSource.findIndex(item => item.name === showDetails.name), 'approve')}
                title="Reset"
                color="#FC5304"
                accessibilityLabel="Approve"
                disabled={!showDetails.approve}
              />
            </View>
            : null}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    padding: 15,
    marginBottom: 2,
    backgroundColor: '#ADECEA',
    fontWeight: 'bold',
    fontFamily: 'times',
    borderWidth: 0.5
  },
  instructions: {
    fontSize: 15,
    // textAlign: 'center',
    backgroundColor: '#D5E5F1',
    padding: 15,
    borderWidth: 0.5,
    fontFamily: 'arial'
  },
  b: {
    marginTop: 10
  }
});

AppRegistry.registerComponent('FireBaseProject', () => FireBaseProject);
