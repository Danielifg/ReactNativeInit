import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import AddEntry from './components/AddEntry'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'


export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
      <View>
          <Image style={style.img} source={{uri:'https://10363-2.s.cdn13.com/media/videos/tmb/000/005/834/big/23.jpg'}}/>
          <View style={{margin:30}}/>
          <AddEntry />
       </View>;

    </Provider>
    )
  }
}

const style = StyleSheet.create({
  img:{
    width:108,
    height:100,
    borderRadius:58
  }
})
