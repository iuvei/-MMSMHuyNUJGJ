/**
 * Created by moneyZhang-Ward on 17/10/13.
 */
import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from 'react-native'

export default class DelegtLoading extends Component {

    constructor(props) {
      super(props);

      this.state = {
        isShow:this.props.isShow,
        showText:this.props.showText,
        status:-1,
        timer:30,
      };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isShow:nextProps.isShow,
            showText:nextProps.showText,
        });
    }

    componentWillMount() {
        this._endUnmount = false;
    }

    componentWillUnmount() {
       this._endUnmount = true;
       this.timer && clearInterval(this.timer);
       this.countdown && clearInterval(this.countdown);
    }

    render() {
        if (!this.state.isShow) return null;

        return (
            <TouchableOpacity activeOpacity={1} onPress = {() => {}} style={styles.container}>
                <View style={styles.loading}>
                    {this._statusView()}
                    {this._textView()}
                    {this._timerView()}
                </View>
            </TouchableOpacity>
        );
    }

    //倒计时view
    _timerView = () => {

        if (this.state.status === 0) {
            return <CusBaseText style={styles.loadingTitle} adjustFontSizeToFit={true}>{this.state.timer}S</CusBaseText>;
        }
        return null;

    }

    _textView = () => {

        if (this.state.showText && this.state.showText.length > 0) {
            return <CusBaseText style={styles.loadingTitle} adjustFontSizeToFit={true}>{this.state.showText}</CusBaseText>;
        }

        return null;
    }


    // status : -1失败 0加载中 1成功
    _statusView = () => {

        if (this.state.status == -1) {

            return <Image style={styles.statusImg} source={require('./img/ic_loading_fail.png')}/>;

        }else if (this.state.status == 0) {

            return <ActivityIndicator color="white" style={styles.indicator}/>;

        }else {

            return <Image style={styles.statusImg} source={require('./img/ic_loading)success.png')}/>;
        }
    }

    /**
     * 显示Loading
     * @param  {string} showText [显示加载状态的提示语]
     * @return {void}
     */
    showLoading = (showText) => {

        this.setState({
            isShow:true,
            showText:showText,
            status:0,
            timer:30,
        });

        if (this.countdown) {
        }else {
            this.countdown = setInterval(() => {
                if (this._endUnmount == true) {
                    return;
                }
                counttimer = this.state.timer - 1;
                this.setState({
                    timer:counttimer,
                });
            },1000);
        }

        //默认15秒消失，网络不好的情况
        this.cancer(30);
    }

    /**
     * 显示成功
     * @param  {string} showText [提示文本]
     * @param  {number} delay    [延迟的消失的秒数]
     * @return {void}
     */
    showSuccess = (showText,delay) => {
        if (delay == null || delay <= 0) {
            this.showMessage(1,showText,1);
        }else {
            this.showMessage(delay,showText,1);
        }
    }

    /**
     * 显示失败
     * @param  {string} showText [提示文本]
     * @param  {number} delay    [延迟的消失的秒数]
     * @return {void}
     */
    showFaile = (showText,delay) => {
        if (delay == null || delay == 0) {
            this.showMessage(1,showText,-1);
        }else {
            this.showMessage(delay,showText,-1);
        }
    }

    /**
     * 取消Loading
     * @param  {number} delay [延迟的消失的秒数]
     * @return {void}
     */
    cancer = (delay) => {
        if (delay == null || delay == 0) {
            this.cancerMessage(1);
        }else {
            this.cancerMessage(delay);
        }
    }

    showMessage = (delay,showText,status) => {
        this.setState({
            isShow:true,
            showText:showText,
            status:status,
        });
        this.cancerMessage(delay);
    }

    cancerMessage = (delay) => {

        this.timer = setTimeout(() => {
            if (this._endUnmount == true) {
                return;
            }
            this.setState({
                isShow:false,
                showText:'',
            });
        },delay*1000);

    }

}

const styles = StyleSheet.create({

    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems:'center',
        // justifyContent: 'center',
    },

    loading: {
        backgroundColor: 'gray',
        width: 100,
        borderRadius: 10,
        marginTop:200,
        justifyContent: 'center',
        alignItems: 'center',
    },

    indicator:{
        marginTop:10,
        marginBottom:10,
    },

    statusImg:{
        marginTop:10,
        marginBottom:10,
        width:30,
        height:30,
    },

    loadingTitle: {
        marginBottom:10,
        marginLeft:5,
        marginRight:5,
        fontSize:14,
        color:'white',
        textAlign: 'center',
    },

})
