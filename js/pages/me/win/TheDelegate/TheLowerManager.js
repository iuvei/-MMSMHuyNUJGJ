import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    Alert,
    StatusBar,
    Platform,
    Button,
    FlatList,
    Animated,
    Easing,
    Dimensions,
    ListView,
    ActivityIndicator,
    DeviceEventEmitter,//引入监听事件
} from 'react-native';

import DrawalSelectBankList from '../../drawalCenter/DrawalSelectBankList';
import Adaption from "../../../../skframework/tools/Adaption";
import BaseNetwork from "../../../../skframework/component/BaseNetwork"; //网络请求
import {PullList} from 'react-native-pull';
import DialogSelected from './DateTimePicker';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view';
import ListBanKFandian from './PopStateMent'


const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
const blankWidth = 45*KAdaptionWith;
const circleWidth = 60*KAdaptionWith;

let array = ['账号', '类型', '登陆时间','下级人数']; //头部数组


let val_3d='';
let val_11x5='';
let val_k3='';
let val_lhc='';
let val_pcdd='';
let val_pk10='';
let val_ssc='';
let  usernameArray='';
let alertName='';
let userUid = '';


export default class TheLowerManager extends React.Component {
  static navigationOptions = ({ navigation }) => ({

      header: (
          <CustomNavBar
              centerText = {navigation.state.params.title}
              leftClick={() =>  navigation.goBack() }
          />
      ),

  });

      constructor(props) {   //在状态这里定义数组和值调用
        super(props);
        this.state = {
        
          mangerListArr: [],//购彩记录数据
          refreshState: RefreshState.Idle,
          isNoData: false,
          isLoading: false,
          };
           this.moreTime = 0;//页码
          //  this.requestDataNum = 20;  // 请求数据条数
           this.numMark = 0; 

             //点击Cell 弹出底部弹出框选择状态
             this.showAlertSelected = this.showAlertSelected.bind(this);
             this.callbackSelected = this.callbackSelected.bind(this);
    }

            componentDidMount() {   //通知用来返回重新刷新数据的

              this.subscription = PushNotification.addListener('TheLowerManager', () => {
                this._fetchPreferentialData(true);
              });

              this.setState({
                isLoading:true,
                isNoData:false,
              });
               this._fetchPreferentialData(true);
            }

            //移除通知
              componentWillUnmount(){

                if (typeof (this.subscription) == 'object') {
                    this.subscription && this.subscription.remove();
                }
              }
            //头部刷新
              onHeaderRefresh = () => {
                this.setState({refreshState: RefreshState.HeaderRefreshing,
                    isLoading:true,
                    isNoData:false,
                })

                this.moreTime = 0;
                this._fetchPreferentialData(true);
             
              }

                //尾部刷新
          onFooterRefresh = () => {
            this.setState({refreshState: RefreshState.FooterRefreshing})
            this.moreTime ++;
            this._fetchPreferentialData(false);
        }


        //获取下级管理的数据
        _fetchPreferentialData(isReload) {
            let requesMask = this.numMark;
            //请求参数
                let params = new FormData();
                params.append("ac", "getChlidStatic");   //请求类型
                params.append("uid",global.UserLoginObject.Uid);
                params.append("token",global.UserLoginObject.Token);
                params.append('sessionkey',global.UserLoginObject.session_key);
                params.append("pageid", String(this.moreTime));
                var promise = BaseNetwork.sendNetworkRequest(params);
                promise.then(response => {

                    if(requesMask!=this.numMark){
                        return;
                      }

                        if ( response.msg == 0) {
                           
                            let jSonArr = response.data;

                             if (jSonArr && jSonArr.length>0){

                                let dataBlog = [];
                                let i = 0;
                                jSonArr.map(dict => {
                                    dataBlog.push({ key: i, value: dict });
                                    i++;
                                });

                                let dataList = isReload ? dataBlog : [...this.state.mangerListArr, ...dataBlog]
                                for (let i = 0; i < dataList.length; i++) {
                                    dataList[i].id = i
                                }
                            
                                if((dataList.length/(this.moreTime+1))<20){
                                   
                                    this.setState({
                                        mangerListArr:dataList,
                                        refreshState:RefreshState.Idle,
                                       })
                                     }else{
                                       this.setState({
                                        mangerListArr:dataList,
                                        refreshState:RefreshState.Idle,
                                       });
                                     }  
                                }else{
                                    if(this.state.mangerListArr.length>0){
                                        this.setState({
                                          refreshState:RefreshState.NoMoreData,
                                        });
                                      }else{
                                        this.setState({
                                          isLoading:false,
                                          isNoData:true,
                                          refreshState:RefreshState.Idle,
                                        });
                                      }
                                    }   
                        }else {
                            
                            this.setState({
                              isLoading:false,
                              isNoData:true,
                              refreshState:RefreshState.Idle,
                            });
                            // Alert.alert(response.param)
                        }

                    })
                    .catch(err => {
                        
                    });
 
        }
     
           //无数据页面
        listEmptyComponent() {
            if (this.state.isLoading == true) {
            return (
                <View style = {{width:width,height:height-150,justifyContent:'center',alignItems:'center'}}>
                    <CusBaseText style={{textAlign:'center',marginTop:5}}>数据加载中...</CusBaseText>
                </View>
            );
            }else  if(this.state.isNoData == true){
            return (
                <View style = {{width:width,height:height-150,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:60*KAdaptionWith,height:50*KAdaptionHeight}} source = {require('./img/ic_wushuju.png')}></Image>
                    <CusBaseText style={{textAlign:'center',marginTop:5}}>暂无数据^_^</CusBaseText>
                </View>
            );
            }
        
        }
        renderCell = (item) => {
           const { navigate } = this.props.navigation;
           return (
            <TouchableOpacity  activeOpacity={1}  style={styles.cellStyle}
                     onPress={() => {
                       this.showAlertSelected(item)
                     }}>
                   <View style={{flexDirection:'row',alignItems:'center'}}>
                   <CusBaseText allowFontScaling={false} style={{color:'#5CACEE',width:100*KAdaptionWith,textAlign:'center',backgroundColor:'white'}}>{item.item.value.username}</CusBaseText>
                   <CusBaseText allowFontScaling={false} style={{marginLeft:5,width:80*KAdaptionWith,textAlign:'center',backgroundColor:'white'}}>{item.item.value.actype}</CusBaseText>
                   <CusBaseText allowFontScaling={false} style={{marginLeft:12,color:'orange',width:110*KAdaptionWith,textAlign:'center',backgroundColor:'white'}}>{item.item.value.last_login_time}</CusBaseText>
                   <CusBaseText allowFontScaling={false} style={{marginLeft:10,color:'orange',width:80*KAdaptionWith,textAlign:'center',backgroundColor:'white'}}>{item.item.value.next_count}</CusBaseText>
                   </View>
          </TouchableOpacity>
         )
     }

      
           //点击Cell
           showAlertSelected(item){
            usernameArray=item.item.value.username;
            userUid = item.item.value.uid;
            val_3d=item.item.value.val_3d;
            val_11x5=item.item.value.val_11x5;
            val_k3=item.item.value.val_k3;
            val_lhc=item.item.value.val_lhc;
            val_pcdd=item.item.value.val_pcdd;
            val_pk10=item.item.value.val_pk10;
            val_ssc=item.item.value.val_ssc;

            let selectedArr = []
            if (item.item.value.next_count !=0) {  
             selectedArr = [item.item.value.username,"查看返点","查看下级"];
            }else {
            
              selectedArr = [item.item.value.username,"查看返点"]; 
            }
              this.dialog.show('请选择',selectedArr, '#696969', this.callbackSelected);
            }
        
             // 回调
            callbackSelected(i,item){
              const { navigate,goBack} = this.props.navigation;
             switch (i){
               case 0:
                 break;
               case 1:
                this._setModalVisible();
                 break;
               case 2:
               navigate('TheSeenManagement',{callback: () => {this.onHeaderRefresh()},searchId:usernameArray,next_uidName:userUid})
                 break;
             }
           }

           _setModalVisible(){
             let selectedArr1 = []
               selectedArr1 = [val_11x5,val_pk10,val_k3,val_lhc,val_pcdd,val_ssc,val_k3];
              this.dialogFandian.showFandian('返点详情',selectedArr1, '#434343', this.callbackFandianSelected);
             }
           callbackFandianSelected(){
        }

    keyExtractor = (item, index) => {
          return item.id
    }


  render() {
      return (
       <View style ={styles.container}>
       <View style={{backgroundColor:'rgb(240,240,240)',flexDirection:'row',height:40,justifyContent:'center',alignItems:'center'}}>
           {this._views(array)}
           {/* 加UI渲染Cell */}
          </View>
          <RefreshListView
            automaticallyAdjustContentInsets={false}
            alwaysBounceHorizontal = {false}
              data={this.state.mangerListArr}
              renderItem={this.renderCell}
              refreshState={this.state.refreshState}
              onHeaderRefresh={this.onHeaderRefresh}
              keyExtractor={this.keyExtractor}
              ListEmptyComponent={this.listEmptyComponent(this)} // 没有数据时显示的界面
              onFooterRefresh={this.onFooterRefresh}
          />
           <DialogSelected ref={(dialog)=>{
          this.dialog = dialog;
          }} />
          <ListBanKFandian ref={(dialogFandian)=>{
          this.dialogFandian = dialogFandian;
          }} />

      </View>
    );}

       _views(array) {
           var viewArr = [];
           for (var i = 0; i < array.length; i++) {
               viewArr.push(
                 <View key = {i} style = {styles.circleView}>
                   <CusBaseText allowFontScaling={false} style = {styles.circleText}>
                   {array[i]}
                   </CusBaseText>
                   <View style = {styles.blankView}/>
                 </View>
                );
               }
               return viewArr;
             }
  }

const styles = StyleSheet.create({
  container:{
   flex:1,
   backgroundColor:'rgb(240,240,240)',
   // flexDirection:'row',
  },

  container_TaskView_Left: {
   flex:0.3,
   height:80*KAdaptionWith,
   alignItems:'center',
   justifyContent:'center'
  },

  container_TaskView_Right:{
   flex:0.7,
   flexDirection:'column',
   height:80*KAdaptionWith,
   justifyContent:'center'
  },

  container_TaskView_Title: {
   fontSize:Adaption.Font(18,16),
   color:'black',
  },

  container_TaskView_Content: {
   fontSize:Adaption.Font(15,13),
   color:'lightgrey',
   marginTop:5,
  },
  countView:{
   height:44*KAdaptionWith,
   marginLeft:20,
   marginRight:20,
   flexDirection: 'row',
   alignItems: 'center',
   borderBottomWidth:1,
   borderColor:'#ccc',
  },

  prex:{
   // fontSize:15,
   fontSize: Adaption.Font(15, 13),
   color:'rgb(51,51,51)',
  },


  selectBank:{
   flex:1,
   justifyContent: 'center',
  },


  circleView: {
  flexDirection: 'row',
  width: circleWidth + blankWidth,
  height: 25*KAdaptionWith,
  marginTop:10,
  },

  circleText: {
  // fontSize: 18,
  fontSize: Adaption.Font(18, 16),
  textAlign: 'center',
  width: circleWidth+20,
  height: 25*KAdaptionWith,
  backgroundColor:'rgba(1,1,1,0)'
  },

  blankView: {
  width: blankWidth,
  height: circleWidth,
  },


  textItemLeft:{
  flex:2,
  // fontSize: 16,
  fontSize: Adaption.Font(16, 14),
  paddingLeft:20,
  textAlignVertical: 'center',
  color: '#cccccc',
  },

  textItemRight:{
  flex:1,
  // fontSize: 16,
  fontSize: Adaption.Font(16, 14),
  textAlign: 'center',
  textAlignVertical: 'center',
  color: '#5a9558',
  },

  cellStyle: {
  flexDirection:'row',
  flex:1,
  height:50*KAdaptionWith,
  backgroundColor:'white',
  borderBottomWidth:1,
  borderColor:'#d3d3d3',
  },

 });
