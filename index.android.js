/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Button,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import * as firebase from 'firebase'; // 4.5.0

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

  showdata(index) {
    this.setState({
      showDetails: this.state.dataSource[index]
    })
  }

  sendData(index, value) {
    let currentObject = this.state.dataSource[index];
    if (value === "cliam") {
      currentObject['cliam'] = !currentObject['cliam']
      var approveRef = itemsRef.child(index).child('cliam')
      approveRef.transaction((newValue) => { return newValue ? false : true })
      currentObject['approve'] = !currentObject['approve']
      var approveRef = itemsRef.child(index).child('approve')
      approveRef.transaction((newValue) => { return newValue ? false : true })
    }
    else {
      currentObject['approve'] = !currentObject['approve']
      var approveRef = itemsRef.child(index).child('approve')
      approveRef.transaction((newValue) => { return newValue ? false : true })
    }
    this.setState({
      showDetails: currentObject,
    })
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const rowData = this.state.dataSource.length > 0 ? ds.cloneWithRows(this.state.dataSource.map(item => item.name)) : null
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>List View</Text>
        <TouchableHighlight style={{ flex: 4 }} underlayColor="white">
          <View>
            {this.state.dataSource.length > 0 ?
              this.state.dataSource.map((item, index) => <Text style={styles.instructions} key={item.key} onPress={() => this.showdata(index)}>{item.name}</Text>)
              : null}
          </View>
        </TouchableHighlight>
        <View style={{ flex: 1.5 }}>
          <Text style={{ fontSize: 20, textAlign: 'center', color: 'black', fontWeight: 'bold' }}>{this.state.showDetails && this.state.showDetails.name}</Text>
          {this.state.showDetails ?
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
              <Button
                onPress={() => this.sendData(this.state.dataSource.findIndex(item => item.name === this.state.showDetails.name), 'cliam')}
                title="Claim"
                color="#68D158"
                accessibilityLabel="Claim"
                disabled={!this.state.showDetails.cliam}
              />
              {!this.state.showDetails.cliam ? <TouchableHighlight
                onPress={() => Alert.alert('Lot Details', alertMessage = this.state.showDetails.name + ' has been delivered by ' + this.state.showDetails.userid)}>
                <View>
                  <Button
                    onPress={() => this.sendData(this.state.dataSource.findIndex(item => item.name === this.state.showDetails.name), 'approve')}
                    title="Deliver"
                    color="#FC5304"
                    accessibilityLabel="Approve"
                    disabled={!this.state.showDetails.approve}
                  />
                </View>
              </TouchableHighlight> :
                <View>
                  <Button
                    onPress={() => this.sendData(this.state.dataSource.findIndex(item => item.name === this.state.showDetails.name), 'approve')}
                    title="Deliver"
                    color="#FC5304"
                    accessibilityLabel="Approve"
                    disabled={!this.state.showDetails.approve}
                  />
                </View>}
                { !this.state.showDetails.cliam && !this.state.showDetails.approve ? 
                <View><Text>{this.state.showDetails.name + ' has been delivered by ' + this.state.showDetails.userid}</Text></View> : true }
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
    borderWidth: 0.5,
  },
  instructions: {
    fontSize: 15,
    // textAlign: 'center',
    backgroundColor: '#D5E5F1',
    padding: 15,
    borderWidth: 0.5,
    fontFamily: 'arial'
  },
  container: {
    // paddingTop: 60,
    // alignItems: 'center',
    flex: 1
  },
  // b: {
  //   marginTop: 10
  // }
});

AppRegistry.registerComponent('FireBaseProject', () => FireBaseProject);
