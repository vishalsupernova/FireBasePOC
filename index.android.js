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
  Button
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
    this.senddata = this.senddata.bind(this);
  }

  componentDidMount() {
    this.getValues()
  }

  getValues(){
    itemsRef.on('value', (snapshot) => {
      let cars = snapshot.val();
      this.setState({
        dataSource: cars,
        showDetails: null
      })

    })
  }

  showdata(item){
    this.setState({
      showDetails: this.state.dataSource[item]
    })
  }

  senddata(index, value){
   var approveRef = itemsRef.child(index).child(value)
   approveRef.transaction( (newValue) => { return newValue ? false : true} )
   let currentObject = this.state.dataSource[index];
   currentObject[value] = !currentObject[value];
   this.setState({
    showDetails: currentObject,
   })
  }

  render() {
    const {dataSource, showDetails} = this.state;
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const rowData = dataSource.length > 0 ? ds.cloneWithRows(dataSource.map(item=>item.name)) : null
    return (
      <View>
        <Text style={styles.welcome}>List View</Text>
        <View>
        {dataSource.length > 0 ?
          dataSource.map((item, index)=> <Text key={item.index} onPress={() => this.showdata(index)}>{item.name}</Text>)
        : null}
        </View>
        <View>
          {showDetails ?
          <View>
          <Button
          style={styles.welcome}
          onPress={() => this.senddata(dataSource.findIndex(i => i.name === showDetails.name), 'cliam')}
          title="Claim"
          color="#841584"
          accessibilityLabel="Claim"
          disabled={!showDetails.cliam}
        />
          <Button
          style={styles.welcome}
          onPress={() => this.senddata(dataSource.findIndex(i => i.name === showDetails.name), 'approve')}
          title="Approve"
          color="#841584"
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('FireBaseProject', () => FireBaseProject);
