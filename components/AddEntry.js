import React ,{ Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import UdaciSliders  from './UdaciSliders'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue
} from '../utils/helpers'

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}>
        <Text>SUBMIT</Text>
    </TouchableOpacity>
  )
}

export default class AddEntry extends Component {

  state = {
    run:0,
    bike:0,
    swim:0,
    sleep:0,
    eat:0
  }

  increment = (metric) =>{
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state)=>{
      const count = state[metric] + step
      return{
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = (metric) =>{
    this.setState((state)=>{
      const count = state[metric] - getMetricMetaInfo(metric).step
      return{
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, value) => {
    this.setState(()=>({
      [metric]: value,
    }))
  }

submit = () => {
  const key = timeToString()
  const entry = this.state

  // Update Redux
  this.props.dispatch(addEntry({
    [key]: entry
  }))
  this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }))

  // Navigate to home

  // Save to "DB"
   submitEntry({ key, entry })

  // Clear local notification
}

reset = () => {
  const key = timeToString()

  // Update Redux
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }))

  // Route to Home
  removeEntry(key)
}

  render(){
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
     return (
       <View>
         <Ionicons
           name={'ios-happy-outline'}
           size={100}
         />
         <Text>You already logged your information for today.</Text>
         <TextButton onPress={this.reset}>
           Reset
         </TextButton>
       </View>
     )
   }

    return(
        <View>
            <DateHeader date={(new Date()).toLocaleDateString()} />
              {Object.keys(metaInfo).map((key)=> {
                  const { getIcon, type, ...rest } = metaInfo[key]
                  const value = this.state[key]

                  return (
                    <View key={key}>
                        {getIcon()}
                        {type === 'slider'
                            ? <UdaciSliders
                                  value={value}
                                  onChange={(value) => this.slide(key, value)}
                                  {...rest}
                                />
                                : <UdaciSteppers
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                  {...rest}
                                  />}
                    </View>
                  )
              })}
              <SubmitBtn onPress={this.submit} />
        </View>
    )
  }
}

function mapStateToProps (state) {
  const key = timeToString()
if (typeof state !== 'undefined') {
  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}
return{}
}

export default connect(
  mapStateToProps
)(AddEntry)
