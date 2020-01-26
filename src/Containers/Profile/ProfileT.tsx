import React, {Component} from 'react';
import {Button, Text, View} from 'react-native';
import Modal from 'react-native-modal';

export default class ModalTester extends Component {
  state = {
    isModalVisible: false,
  };

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Button
          title="Show sdfsdfsdfsdfsdfdfdsfdfsdfmodal"
          onPress={this.toggleModal}
        />
        <Modal
          isVisible={this.state.isModalVisible}
          coverScreen={false}
          style={{
            backgroundColor: '#fff',
            marginTop: 100,
            marginBottom: 100,
            marginLeft: 30,
            marginRight: 30,
            borderRadius: 10,
          }}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 5}}>
              <Text>Hello!</Text>

              <Text>Hello!</Text>
              <Text>Hello!</Text>
              <Text>Hello!</Text>
              <Text>Hello!</Text>

              <Text>Hello!</Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View style={{flex: 1}}></View>
              <View style={{width: '50%'}}>
                <Button title="Hide close" onPress={this.toggleModal} />
              </View>
              <View style={{flex: 1}}></View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
