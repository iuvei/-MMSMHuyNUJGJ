'use strict';

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
} from 'react-native';

import RechargeAmountView from './RechargeAmountView';
import Regex from '../../../skframework/component/Regex';

// 微信支付界面 支付宝 QQ支付 银联快捷
export default class PayModelList extends Component {

    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText={navigation.state.params.title}
                leftClick={() => navigation.goBack()}
            />
        ),

    });

    constructor(props) {
        super(props);

        this.state = {
            renderAmount: 0,
            dataSource: [],
            totalMoney: '',
        };

        this.recharNumber = '';//充值金额
    }

    componentWillMount() {
        this.paytype = this.props.navigation.state.params.paytype;
        this.defaultTips = this.props.navigation.state.params.defaultTips;
        this.defaultSteps = this.props.navigation.state.params.defaultSteps;
    }

    componentDidMount() {
        this.loginObject = global.UserLoginObject;
        if (this.loginObject) {
            this._getPayDataByType();
            this._onRershRMB();
        }
    }

    //刷新金额
    _onRershRMB() {

        let params = new FormData();
        params.append("ac", "flushPrice");
        params.append("uid", this.loginObject.Uid);
        params.append("token", this.loginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);
        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then(response => {

                if (response.msg == 0) {

                    this.setState({
                        totalMoney: response.data.price,
                    });

                    this.loginObject.TotalMoney = response.data.price;
                    let loginStringValue = JSON.stringify(this.loginObject);
                    UserDefalts.setItem('userInfo', loginStringValue, (error) => { });
                }

            })
            .catch(err => { });
    }

    //获取相应支付接口的数据
    _getPayDataByType() {

        this.refs.LoadingView && this.refs.LoadingView.showLoading('loading');

        let params = new FormData();
        params.append("ac", "getPayDataByUtype");
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);
        params.append("type", this.paytype);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {
                console.log('response--->', response);

                if (response.msg != 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
                    return;
                }

                this.setState({
                    dataSource: response.data,
                });

            })
            .catch((err) => {
                if (err && typeof (err) === 'string' && err.length > 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                }
            });
    }

    render() {

        return (
            <View style={styles.container}>

                <View style={styles.accountInfo}>
                    <View style={styles.account}>
                        <CusBaseText style={styles.namePrefix}>账号：</CusBaseText>
                        <CusBaseText style={styles.name}>{this.loginObject ? this.loginObject.UserName : null}</CusBaseText>
                    </View>
                    <View style={styles.balance}>
                        <CusBaseText style={styles.namePrefix}>余额：</CusBaseText>
                        <CusBaseText style={styles.name}>{this.state.totalMoney}</CusBaseText>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                // this._onRershRMB()
                                this.refs.LoadingView && this.refs.LoadingView.showSuccess('刷新金额成功!');
                            }}
                        >
                            <Image
                                style={{height:30,width:30,marginLeft:15}}
                                source={require('./img/ic_shuaxin.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.rechaAmount}>
                    <View style={styles.inputAmount}>
                        <CusBaseText style={styles.namePrefix}>充值金额：</CusBaseText>
                        <TextInput
                            returnKeyType="done"
                            underlineColorAndroid='transparent'
                            style={styles.inputText}
                            placeholder='请输入充值金额'
                            maxLength={10}
                            keyboardType='numeric'
                            defaultValue={this.state.renderAmount.toString()}
                            onChangeText={(text) => {
                                this.recharNumber = text;
                            }}
                        />
                        <CusBaseText style={[styles.namePrefix, { marginRight: 15 }]}>元</CusBaseText>
                    </View>
                    <RechargeAmountView
                        style={styles.rechaAmountSelect}
                        selecteIndex={this.selecteIndex}
                        onPress={(value, rowID) => {
                            this.selecteIndex = rowID;
                            if (this.state.renderAmount == value) {
                                return;
                            }
                            this.recharNumber = value;
                            this.setState({
                                renderAmount: value,
                            });
                        }}
                        dataSource={[10,100,300,500,1000,3000,5000,10000]}
                    />
                </View>

                <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                    <Image source={require('./img/ic_recharge_circle.png')} style={{ width: 20, height: 20 }} />
                    <CusBaseText style={{ color: '#565656', fontSize: 17, marginLeft: 10 }}>请选择支付渠道</CusBaseText>
                </View>

                <FlatList
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    data={this.state.dataSource}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                    keyExtractor={this._keyExtractor}
                    showsVerticalScrollIndicator={false}
                    //extraData={this.state}
                />

                <LoadingView ref="LoadingView" />

            </View>
        );

    }


    _renderItem = (info) => {

        return (
            <PayModelCell
                paytype={this.paytype}
                style={styles.itemStyle}
                item={info.item}
                defaultTips={this.defaultTips}
                onPress={this._onPress}
            />
        );
    }

    //    _getItemLayout = (data, index) => {
    //    	return {length: rowHeight, offset: (rowHeight+1)*index, index: index};
    // }

    _renderSeparator = () => {
        return (<View style={styles.itemSeparator} />);
    }

    _keyExtractor = (item, index) => {
        return String(index);
    }

    // 检查输入金额
    _inspectInputAmount = () => {

        if (this.recharNumber.length <= 0) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入充值金额');
            return false;
        }

        if (!Regex(this.recharNumber, "money")) {
            this.refs.LoadingView && this.refs.LoadingView.showFaile('请输入合法金额');
            return false;
        }
    }

    _onPress = (item) => {

        if (this._inspectInputAmount() == false) {
            return;
        }

        if (item.man == 1){ //直接跳

            this.props.navigation.navigate('RechargeInfo',
                {
                    payObject: item,
                    recharNumber: this.recharNumber,
                    defaultSteps:this.defaultSteps,
                    loginObject: this.loginObject,
                });

        }else {
            //第三方
            this._getThridData(item);

        }

    }

    _getThridData = (item) => {

        this.refs.LoadingView && this.refs.LoadingView.showLoading('loading');

        let params = new FormData();
        params.append("ac", "submitPayThrid");
        params.append("uid", this.loginObject.Uid);
        params.append('token', this.loginObject.Token);
        params.append('sessionkey', this.loginObject.session_key);
        params.append("price", this.recharNumber);
        params.append("thrid_id", item.id);
        params.append("type", item.type);

        console.log('params--->', params);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((response) => {

                if (response.msg != 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(response.param);
                    return;
                }

                this.refs.LoadingView && this.refs.LoadingView.cancer();

                let data = response.data;

                if (data.qrcode == 1) { //跳到webview

                    let urlString = '';

                    if (data.method === 'post') {

                        urlString = data.url;
                        let body = data.data.replace(/>/g, '');

                        this.props.navigation.navigate('ThridWebPay', { webUrl: urlString, method: data.method, body: body });

                    } else { //get

                        if (data.data && data.data.length != 0) {
                            urlString = data.url + '?' + data.data.replace(/>/g, '');
                        } else {
                            urlString = data.url;
                        }

                        this.props.navigation.navigate('ThridWebPay', { webUrl: urlString, method: data.method });
                    }

                } else { //跳到本地页

                    item.orderNumber = data.dingdan;//订单号
                    item.qrcode = data.url;//二维码链接

                    this.props.navigation.navigate('RechargeInfo',
                        {
                            payObject: item,
                            recharNumber: this.recharNumber,
                            defaultSteps:this.defaultSteps,
                            loginObject: this.loginObject,
                        });
                }
            })
            .catch((err) => {
                if (err && typeof (err) === 'string' && err.length > 0) {
                    this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
                }
            })
    }

}

class PayModelCell extends Component {

    constructor(props) {
        super(props);

        this.dictImage = {
            "alipay.png": require('./img/ic_alipay.png'),
            "man_bank.png": require('./img/ic_man_bank.png'),
            "online_bank.png": require('./img/ic_online_bank.png'),
            "pay_icon_alipay.png": require('./img/ic_pay_icon_alipay.png'),
            "pay_icon_alipay2.png": require('./img/ic_pay_icon_alipay2.png'),
            "pay_icon_bankq.png": require('./img/ic_pay_icon_bankq.png'),
            "pay_icon_qq.png": require('./img/ic_pay_icon_qq.png'),
            "pay_icon_qq2.png": require('./img/ic_pay_icon_qq2.png'),
            "pay_icon_weixin.png": require('./img/ic_pay_icon_weixin.png'),
            "pay_icon_weixin2.png": require('./img/ic_pay_icon_weixin2.png'),
            "qq.png": require('./img/ic_qq.png'),
            "quick_bank.png": require('./img/ic_quick_bank.png'),
            "weixin.png": require('./img/ic_weixin.png'),

            "baidu.png": require('./img/ic_baidu.png'),
            "jd.png": require('./img/ic_jd.png'),
            "pay_icon_baidu.png": require('./img/ic_pay_icon_baidu.png'),
            "pay_icon_baidu2.png": require('./img/ic_pay_icon_baidu2.png'),
            "pay_icon_jd.png": require('./img/ic_pay_icon_jd.png'),
            "pay_icon_jd2.png": require('./img/ic_pay_icon_jd2.png'),
        };

    }

    render() {

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.payModelCell}
                onPress={() => {
                    this.props.onPress ? this.props.onPress(this.props.item) : null;
                }}
            >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>

                    <Image
                        style={styles.payModelImg}
                        source={this.dictImage[this.props.item.icon]}
                    />

                    <View style={styles.cellLef}>
                        <CusBaseText style={styles.modelName} numberOfLines={2}>{this.props.item.name ? this.props.item.name : ''}</CusBaseText>
                        <CusBaseText style={styles.modelDesc} numberOfLines={2}>{this._modelDesc(this.props.item)}</CusBaseText>
                    </View>

                </View>
                <Image
                    style={styles.payNextImg}
                    source={require('./img/ic_recharge_next.png')}
                />
            </TouchableOpacity>

        );
    }

    _modelDesc = (item) => {

        if (item.qrcode) { //main
            return item.tips ? item.tips : '';
        }

        //auto
        if (this.props.paytype == 3) {
            return item.tips ? item.tips : this.props.defaultTips.wx;
        } else if (this.props.paytype == 11) {
            return item.tips ? item.tips : this.props.defaultTips.qq;
        } else if (this.props.paytype == 5) {
            return item.tips ? item.tips : this.props.defaultTips.ali;
        }else if (this.props.paytype == 13) {
            return item.tips ? item.tips : this.props.defaultTips.bank;
        }

    }

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    //账户信息
    accountInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: 40,
        backgroundColor: 'rgb(240,240,245)',
    },

    account: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },

    namePrefix: {
        fontSize: 15,
        color: 'rgb(110,110,110)',
    },

    name: {
        fontSize: 15,
        color: 'red',
    },

    balance: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },

    //充值金额
    rechaAmount: {
        backgroundColor: 'white',
    },

    rechaAmountSelect: {
        paddingTop: 10,
        paddingBottom: 10,
    },

    inputAmount: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingLeft: 10,
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: 40,
    },

    inputText: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#f1f1f1',
        marginRight: 10,
        padding: 0,
        paddingLeft: 5,
        height: 28,
        textAlign: 'center',
    },

    itemStyle: {
        backgroundColor: 'white',
    },

    itemSeparator: {
        backgroundColor: '#cccccc',
        width: SCREEN_WIDTH,
        height: 1,
    },

    payModelCell: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: SCREEN_WIDTH,
        height: 55,
    },

    cellLef: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 15,
        marginRight:5,
    },

    modelName: {
        fontSize:Adaption.Font(16,8),
        marginBottom: 2,
        color: '#000000',
    },

    modelDesc: {
        marginTop:5,
        fontSize:Adaption.Font(14,8),
        color: 'rgb(163,163,163)',
    },

    payModelImg: {
        marginLeft: 15,
        width: 30,
        height: 30,
    },

    payNextImg: {
        marginRight: 15,
        width: 15,
        height: 15,
    },
});