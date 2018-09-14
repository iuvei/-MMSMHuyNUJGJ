/**
 Created by Ward on 2018/01/05
 新版官方信用选择视图
 */
import React, { Component } from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
} from 'react-native';

export default class NewSwitchGFXYView extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let topHeight = 0;
        if (global.Android) {
            topHeight = 58;

        } else {
            if (SCREEN_HEIGHT == 812) {
                topHeight = 88;
            } else {
                topHeight = 64;
            }
        }

        return(<Modal
            visible={this.props.isClose}
            animationType={'none'}
            transparent={true}
            onRequestClose={() => { }}
            style = {{flex:1}}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    this.props.close ? this.props.close() : null;
                }}>
                <View style={{ height: topHeight, width: SCREEN_WIDTH }}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={1}
                style={{ height: SCREEN_HEIGHT - topHeight, backgroundColor: 'rgba(0,0,0,0.4)' }}
                onPress={() => {

                    this.props.close ? this.props.close() : null;
                }}>
                <View style={{ width: SCREEN_WIDTH, height: Adaption.Width(80), backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity activeOpacity={1}
                                      style={{
                                          backgroundColor: this.props.slectIndex == 1 ? '#e03a38' : 'white',
                                          borderRadius: 5,
                                          borderWidth: this.props.slectIndex == 1 ? 0 : 1,
                                          borderColor: 'lightgray',
                                          width: Adaption.Width(120),
                                          height: Adaption.Width(40),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          marginRight: Adaption.Width(30),
                                      }}
                                      onPress={() => {

                                          if (this.props.slectIndex == 1) {
                                              this.props.close ? this.props.close() : null;
                                          } else {
                                              this.props.onChange ? this.props.onChange(1) : null;
                                          }

                                      }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(19, 15), color: this.props.slectIndex == 1 ? 'white' : 'black' }}>
                            双面玩法
                        </CusBaseText>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                                      style={{
                                          backgroundColor: this.props.slectIndex == 0 ? '#e03a38' : 'white',
                                          borderRadius: 5,
                                          borderWidth: this.props.slectIndex == 0 ? 0 : 1,
                                          borderColor: 'lightgray',
                                          width: Adaption.Width(120),
                                          height: Adaption.Width(40),
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                      }}
                                      onPress={() => {

                                          if (this.props.slectIndex == 0) {
                                              this.props.close ? this.props.close() : null;
                                          } else {
                                              this.props.onChange ? this.props.onChange(0) : null;
                                          }

                                      }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(19, 15), color: this.props.slectIndex == 0 ? 'white' : 'black' }}>
                            官方玩法
                        </CusBaseText>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>)
    }
}