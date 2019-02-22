'use strict';var _jsxFileName='src/Slider.js';var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();

var _propTypes=require('prop-types');var _propTypes2=_interopRequireDefault(_propTypes);

var _react=require('react');var _react2=_interopRequireDefault(_react);

var _reactNative=require('react-native');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _objectWithoutProperties(obj,keys){var target={};for(var i in obj){if(keys.indexOf(i)>=0)continue;if(!Object.prototype.hasOwnProperty.call(obj,i))continue;target[i]=obj[i];}return target;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}










var shallowCompare=require('react-addons-shallow-compare'),
styleEqual=require('style-equal');

var TRACK_SIZE=4;
var THUMB_SIZE=20;
var GRADUATION_HEIGHT=10;
var GRADUATION_WIDTH=3;
var GRADUATION_LABEL_OFFSET=-37;

function Rect(x,y,width,height){
this.x=x;
this.y=y;
this.width=width;
this.height=height;
}

Rect.prototype.containsPoint=function(x,y){
return x>=this.x&&
y>=this.y&&
x<=this.x+this.width&&
y<=this.y+this.height;
};

var DEFAULT_ANIMATION_CONFIGS={
spring:{
friction:7,
tension:100},

timing:{
duration:150,
easing:_reactNative.Easing.inOut(_reactNative.Easing.ease),
delay:0}};var







Slider=function(_React$Component){_inherits(Slider,_React$Component);




















































































































































function Slider(props){_classCallCheck(this,Slider);var _this=_possibleConstructorReturn(this,(Slider.__proto__||Object.getPrototypeOf(Slider)).call(this,
props));_initialiseProps.call(_this);

_this.state=_this.getInitialState(props);return _this;
}_createClass(Slider,[{key:'getInitialState',value:function getInitialState(

props){var

graduation=


props.graduation,maximumValue=props.maximumValue,minimumValue=props.minimumValue;

var numberOfGraduations=graduation?(maximumValue-minimumValue)/graduation+1:0;



return{
containerSize:{width:0,height:0},
trackSize:{width:0,height:0},
thumbSize:{width:0,height:0},
currentValueBubbleSize:{width:0,height:0},
legendWidth:Array.from(new Array(numberOfGraduations),function(){return 150;}),
allMeasured:false,
value:new _reactNative.Animated.Value(this.props.value)};

}},{key:'componentWillMount',value:function componentWillMount()

{
this._panResponder=_reactNative.PanResponder.create({
onStartShouldSetPanResponder:this._handleStartShouldSetPanResponder,
onMoveShouldSetPanResponder:this._handleMoveShouldSetPanResponder,
onPanResponderGrant:this._handlePanResponderGrant,
onPanResponderStart:this._handlePanResponderStart,
onPanResponderMove:this._handlePanResponderMove,
onPanResponderRelease:this._handlePanResponderRelease,
onPanResponderTerminationRequest:this._handlePanResponderRequestEnd,
onPanResponderTerminate:this._handlePanResponderTerminate});

}},{key:'render',value:function render()






























{var _this2=this;var _props=



















this.props,graduation=_props.graduation,minimumValue=_props.minimumValue,maximumValue=_props.maximumValue,minimumTrackTintColor=_props.minimumTrackTintColor,maximumTrackTintColor=_props.maximumTrackTintColor,thumbTintColor=_props.thumbTintColor,styles=_props.styles,style=_props.style,trackStyle=_props.trackStyle,thumbStyle=_props.thumbStyle,currentValueBubbleContainerStyle=_props.currentValueBubbleContainerStyle,currentValueBubbleTextStyle=_props.currentValueBubbleTextStyle,ignoredGraduations=_props.ignoredGraduations,showBarAtIgnoredGraduation=_props.showBarAtIgnoredGraduation,graduationStyle=_props.graduationStyle,graduationLabelContainerStyle=_props.graduationLabelContainerStyle,debugTouchArea=_props.debugTouchArea,other=_objectWithoutProperties(_props,['graduation','minimumValue','maximumValue','minimumTrackTintColor','maximumTrackTintColor','thumbTintColor','styles','style','trackStyle','thumbStyle','currentValueBubbleContainerStyle','currentValueBubbleTextStyle','ignoredGraduations','showBarAtIgnoredGraduation','graduationStyle','graduationLabelContainerStyle','debugTouchArea']);var _state=
this.state,value=_state.value,containerSize=_state.containerSize,trackSize=_state.trackSize,thumbSize=_state.thumbSize,currentValueBubbleSize=_state.currentValueBubbleSize,allMeasured=_state.allMeasured;
var mainStyles=styles||defaultStyles;
var thumbLeft=value.interpolate({
inputRange:[minimumValue,maximumValue],
outputRange:[0,containerSize.width-thumbSize.width]});



var currentValueBubbleOverflow=currentValueBubbleSize.width/2-thumbSize.width/2;
var outputRangeMin=-currentValueBubbleOverflow;
var outputRangeMax=containerSize.width-(currentValueBubbleSize.width-currentValueBubbleOverflow);

var currentValueBubbleLeft=!!this.props.currentValueBubble&&value.interpolate({
inputRange:[minimumValue,maximumValue],
outputRange:[outputRangeMin,outputRangeMax]});


var valueVisibleStyle={};
if(!allMeasured){
valueVisibleStyle.opacity=0;
}

var minimumTrackStyle=_extends({
position:'absolute',
width:_reactNative.Animated.add(thumbLeft,thumbSize.width/2),
marginTop:-trackSize.height,
backgroundColor:minimumTrackTintColor},
valueVisibleStyle);


var touchOverflowStyle=this._getTouchOverflowStyle();

var numberOfGraduations=graduation?(maximumValue-minimumValue)/graduation+1:0;


var graduationArray=[];
Array(numberOfGraduations).fill(0).forEach(function(value,index){return graduationArray.push(index);});

return(
_react2.default.createElement(_reactNative.View,{style:this.props.containerStyle,__source:{fileName:_jsxFileName,lineNumber:336}},
_react2.default.createElement(_reactNative.View,_extends({},other,{style:[mainStyles.container,style],onLayout:this._measureContainer,__source:{fileName:_jsxFileName,lineNumber:337}}),
_react2.default.createElement(_reactNative.View,{
style:[{backgroundColor:maximumTrackTintColor},mainStyles.track,trackStyle],
onLayout:this._measureTrack,__source:{fileName:_jsxFileName,lineNumber:338}}),
_react2.default.createElement(_reactNative.Animated.View,{style:[mainStyles.track,trackStyle,minimumTrackStyle],__source:{fileName:_jsxFileName,lineNumber:341}}),

_react2.default.createElement(_reactNative.Animated.View,{
onLayout:this._measureThumb,
style:[
{backgroundColor:thumbTintColor,marginTop:-(trackSize.height+thumbSize.height)/2},
mainStyles.thumb,thumbStyle,_extends({left:thumbLeft},valueVisibleStyle)],__source:{fileName:_jsxFileName,lineNumber:343}}),


_react2.default.createElement(_reactNative.View,_extends({
style:[defaultStyles.touchArea,touchOverflowStyle]},
this._panResponder.panHandlers,{__source:{fileName:_jsxFileName,lineNumber:350}}),
debugTouchArea===true&&this._renderDebugThumbTouchRect(thumbLeft))),


graduationArray.map(function(i){return(
!ignoredGraduations||!ignoredGraduations.includes(i+1)?
_react2.default.createElement(_reactNative.View,{key:i,style:{top:containerSize.height/2+trackSize.height/2,position:'absolute'},__source:{fileName:_jsxFileName,lineNumber:358}},
_react2.default.createElement(_reactNative.View,{
style:[
{backgroundColor:maximumTrackTintColor,marginTop:-(trackSize.height+GRADUATION_HEIGHT)/2},
mainStyles.graduation,graduationStyle,_extends({left:_this2._getGraduationOffset(i)},valueVisibleStyle)],__source:{fileName:_jsxFileName,lineNumber:359}}),

_react2.default.createElement(_reactNative.Animated.View,{
onLayout:function onLayout(event){return _this2._measureLegend(event,i);},
style:[mainStyles.graduationLabel,graduationLabelContainerStyle,
{width:_this2.state.legendWidth[i],left:_this2._getGraduationOffset(i)-_this2.state.legendWidth[i]/2}],__source:{fileName:_jsxFileName,lineNumber:364}},
_this2._renderGraduationLabel(i))):

showBarAtIgnoredGraduation&&
_react2.default.createElement(_reactNative.View,{key:i,style:{top:containerSize.height/2+trackSize.height/2,position:'absolute'},__source:{fileName:_jsxFileName,lineNumber:371}},
_react2.default.createElement(_reactNative.View,{style:_extends({backgroundColor:maximumTrackTintColor,marginTop:-(trackSize.height+GRADUATION_HEIGHT-2)/2,width:2,height:GRADUATION_HEIGHT-2,left:_this2._getGraduationOffset(i)},valueVisibleStyle),__source:{fileName:_jsxFileName,lineNumber:372}})));}),



!!this.props.currentValueBubble&&!!this.props.graduationLabel&&
_react2.default.createElement(_reactNative.Animated.View,{
onLayout:this._measureCurrentValueBubble,
style:[{top:containerSize.height/2-trackSize.height-thumbSize.height-4},mainStyles.currentValueBubbleContainer,currentValueBubbleContainerStyle,_extends({left:currentValueBubbleLeft},valueVisibleStyle)],__source:{fileName:_jsxFileName,lineNumber:377}},
_react2.default.createElement(_reactNative.Text,{style:[mainStyles.currentValueBubble,currentValueBubbleTextStyle],__source:{fileName:_jsxFileName,lineNumber:380}},this.props.graduationLabel(this.props.value)))));




}}]);return Slider;}(_react2.default.Component);Slider.propTypes={value:_propTypes2.default.number,disabled:_propTypes2.default.bool,minimumValue:_propTypes2.default.number,maximumValue:_propTypes2.default.number,step:_propTypes2.default.number,graduation:_propTypes2.default.number,minimumTrackTintColor:_propTypes2.default.string,maximumTrackTintColor:_propTypes2.default.string,thumbTintColor:_propTypes2.default.string,graduationLabel:_propTypes2.default.func,thumbTouchSize:_propTypes2.default.shape({width:_propTypes2.default.number,height:_propTypes2.default.number}),onValueChange:_propTypes2.default.func,onSlidingStart:_propTypes2.default.func,onSlidingComplete:_propTypes2.default.func,style:_reactNative.ViewPropTypes.style,trackStyle:_reactNative.ViewPropTypes.style,thumbStyle:_reactNative.ViewPropTypes.style,graduationStyle:_reactNative.ViewPropTypes.style,graduationLabelStyle:_reactNative.Text.propTypes.style,graduationLabelContainerStyle:_reactNative.ViewPropTypes.style,debugTouchArea:_propTypes2.default.bool,animateTransitions:_propTypes2.default.bool,animationType:_propTypes2.default.oneOf(['spring','timing']),animationConfig:_propTypes2.default.object};Slider.defaultProps={value:0,minimumValue:0,maximumValue:1,step:0,graduation:0,minimumTrackTintColor:'#3f3f3f',maximumTrackTintColor:'#b3b3b3',thumbTintColor:'#343434',thumbTouchSize:{width:40,height:40},debugTouchArea:false,animationType:'timing'};var _initialiseProps=function _initialiseProps(){var _this3=this;this.componentWillReceiveProps=function(nextProps){var newValue=nextProps.value;if(this._getCurrentValue()!==newValue){if(this.props.animateTransitions){this._setCurrentValueAnimated(newValue);}else{this._setCurrentValue(newValue);}}};this.shouldComponentUpdate=function(nextProps,nextState){return shallowCompare({props:this._getPropsForComponentUpdate(this.props),state:this.state},this._getPropsForComponentUpdate(nextProps),nextState)||!styleEqual(this.props.style,nextProps.style)||!styleEqual(this.props.trackStyle,nextProps.trackStyle)||!styleEqual(this.props.thumbStyle,nextProps.thumbStyle)||!styleEqual(this.props.graduationStyle,nextProps.graduationStyle)||!styleEqual(this.props.graduationLabelContainerStyle,nextProps.graduationLabelContainerStyle)||!styleEqual(this.props.graduationLabelStyle,nextProps.graduationLabelStyle);};this.

_getPropsForComponentUpdate=function(props){var

onValueChange=







props.onValueChange,onSlidingStart=props.onSlidingStart,onSlidingComplete=props.onSlidingComplete,style=props.style,trackStyle=props.trackStyle,thumbStyle=props.thumbStyle,graduationStyle=props.graduationStyle,otherProps=_objectWithoutProperties(props,['onValueChange','onSlidingStart','onSlidingComplete','style','trackStyle','thumbStyle','graduationStyle']);

if(!_this3.props.currentValueBubble){
otherProps.value=undefined;
}

return otherProps;
};this.

_getGraduationOffset=function(index){var _props2=






_this3.props,graduation=_props2.graduation,graduationStyle=_props2.graduationStyle,thumbStyle=_props2.thumbStyle,minimumValue=_props2.minimumValue,maximumValue=_props2.maximumValue;var _state2=



_this3.state,containerSize=_state2.containerSize,thumbSize=_state2.thumbSize;

var graduationOffset=thumbSize.width/2;

graduationOffset+=(minimumValue+graduation*index)*(containerSize.width-thumbSize.width)/maximumValue;

if(thumbStyle.borderWidth){
graduationOffset-=2*thumbStyle.borderWidth;
}

var graduationStyleObject=graduationStyle&&_reactNative.StyleSheet.flatten(graduationStyle);
graduationOffset-=graduationStyleObject&&graduationStyleObject.width?graduationStyleObject.width/2:GRADUATION_WIDTH/2;

return graduationOffset;
};this.

_handleStartShouldSetPanResponder=function(e){

_this3.setState({
moving:_this3._thumbHitTest(e)});

return true;
};this.

_handleMoveShouldSetPanResponder=function(){

return false;
};this.

_handlePanResponderGrant=function(e,gestureState){
_this3._previousLeft=_this3._getThumbLeft(_this3._getCurrentValue());
_this3._fireChangeEvent('onSlidingStart');
};this.
_handlePanResponderStart=function(e,gestureState){};this.
_handlePanResponderMove=function(e,gestureState){
if(_this3.props.disabled||
!_this3.state.moving||
Math.abs(gestureState.dy)>_this3.state.containerSize.height){
return;
}

_this3._setCurrentValue(_this3._getValue(gestureState,true));
_this3._fireChangeEvent('onValueChange');
};this.
_handlePanResponderRequestEnd=function(e,gestureState){

return Math.abs(gestureState.dy)>_this3.state.containerSize.height;
};this.
_handlePanResponderRelease=function(e,gestureState){
_this3.setState({
moving:false});

if(_this3.props.disabled){
return;
}

if(!_this3._thumbHitTest(e)&&
Math.abs(gestureState.dx)<_this3.state.thumbSize.width&&
Math.abs(gestureState.dy)<_this3.state.thumbSize.height){
_this3._setCurrentValue(_this3._getValue(gestureState,false));
_this3._fireChangeEvent('onValueChange');
}

_this3._fireChangeEvent('onSlidingComplete');
};this.
_handlePanResponderTerminate=function(e,gestureState){
_this3.setState({
moving:false});

};this.

_measureContainer=function(x){
_this3._handleMeasure('containerSize',x);
};this.

_measureTrack=function(x){
_this3._handleMeasure('trackSize',x);
};this.

_measureThumb=function(x){
_this3._handleMeasure('thumbSize',x);
};this.

_measureCurrentValueBubble=function(x){
_this3._handleMeasure('currentValueBubbleSize',x);
};this.

_measureLegend=function(x,index){
var legendWidth=_this3.state.legendWidth;
legendWidth[index]=x.nativeEvent.layout.width;
_this3.setState({legendWidth:legendWidth});
};this.

_handleMeasure=function(name,x){var _x$nativeEvent$layout=
x.nativeEvent.layout,width=_x$nativeEvent$layout.width,height=_x$nativeEvent$layout.height;
var size={width:width,height:height};

var storeName='_'+name;
var currentSize=_this3[storeName];
if(currentSize&&width===currentSize.width&&height===currentSize.height){
return;
}
_this3[storeName]=size;

if(_this3._containerSize&&
_this3._trackSize&&
_this3._thumbSize&&(
_this3.props.currentValueBubble&&_this3._currentValueBubbleSize||!_this3.props.currentValueBubble))
{
_this3.setState({
containerSize:_this3._containerSize,
trackSize:_this3._trackSize,
thumbSize:_this3._thumbSize,
currentValueBubbleSize:_this3._currentValueBubbleSize,
allMeasured:true});

}
};this.

_getRatio=function(value){
return(value-_this3.props.minimumValue)/(_this3.props.maximumValue-_this3.props.minimumValue);
};this.

_getThumbLeft=function(value){
var ratio=_this3._getRatio(value);
return ratio*(_this3.state.containerSize.width-_this3.state.thumbSize.width);
};this.

_getValue=function(gestureState,move){
var length=_this3.state.containerSize.width-_this3.state.thumbSize.width;
var thumbLeft;
if(move){
thumbLeft=_this3._previousLeft+gestureState.dx;
}else{
var offset=(_reactNative.Dimensions.get('window').width-length)/2;
thumbLeft=gestureState.x0-offset;
}

var ratio=thumbLeft/length;

if(_this3.props.step){
return Math.max(_this3.props.minimumValue,
Math.min(_this3.props.maximumValue,
_this3.props.minimumValue+Math.round(ratio*(_this3.props.maximumValue-_this3.props.minimumValue)/_this3.props.step)*_this3.props.step));


}else{
return Math.max(_this3.props.minimumValue,
Math.min(_this3.props.maximumValue,
ratio*(_this3.props.maximumValue-_this3.props.minimumValue)+_this3.props.minimumValue));


}
};this.

_getCurrentValue=function(){
return _this3.state.value.__getValue();
};this.

_setCurrentValue=function(value){
_this3.state.value.setValue(value);
};this.

_setCurrentValueAnimated=function(value){
var animationType=_this3.props.animationType;
var animationConfig=_extends(
{},
DEFAULT_ANIMATION_CONFIGS[animationType],
_this3.props.animationConfig,
{toValue:value});


_reactNative.Animated[animationType](_this3.state.value,animationConfig).start();
};this.

_fireChangeEvent=function(event){
if(_this3.props[event]){
_this3.props[event](_this3._getCurrentValue());
}
};this.

_getTouchOverflowSize=function(){
var state=_this3.state;
var props=_this3.props;

var size={};
if(state.allMeasured===true){
size.width=Math.max(0,props.thumbTouchSize.width-state.thumbSize.width);
size.height=Math.max(0,props.thumbTouchSize.height-state.containerSize.height);
}

return size;
};this.

_getTouchOverflowStyle=function(){var _getTouchOverflowSize=
_this3._getTouchOverflowSize(),width=_getTouchOverflowSize.width,height=_getTouchOverflowSize.height;

var touchOverflowStyle={};
if(width!==undefined&&height!==undefined){
var verticalMargin=-height/2;
touchOverflowStyle.marginTop=verticalMargin;
touchOverflowStyle.marginBottom=verticalMargin;

var horizontalMargin=-width/2;
touchOverflowStyle.marginLeft=horizontalMargin;
touchOverflowStyle.marginRight=horizontalMargin;
}

if(_this3.props.debugTouchArea===true){
touchOverflowStyle.backgroundColor='orange';
touchOverflowStyle.opacity=0.5;
}

return touchOverflowStyle;
};this.

_thumbHitTest=function(e){
var nativeEvent=e.nativeEvent;
var thumbTouchRect=_this3._getThumbTouchRect();
return thumbTouchRect.containsPoint(nativeEvent.locationX,nativeEvent.locationY);
};this.

_getThumbTouchRect=function(){
var state=_this3.state;
var props=_this3.props;
var touchOverflowSize=_this3._getTouchOverflowSize();

return new Rect(
touchOverflowSize.width/2+_this3._getThumbLeft(_this3._getCurrentValue())+(state.thumbSize.width-props.thumbTouchSize.width)/2,
touchOverflowSize.height/2+(state.containerSize.height-props.thumbTouchSize.height)/2,
props.thumbTouchSize.width,
props.thumbTouchSize.height);

};this.

_renderGraduationLabel=function(index){
if(_this3.props.graduationLabel){
return(
_react2.default.createElement(_reactNative.Text,{style:[{textAlign:'center'},_this3.props.graduationLabelStyle],__source:{fileName:_jsxFileName,lineNumber:655}},
_this3.props.graduationLabel(index)));


}
return _react2.default.createElement(_reactNative.View,{__source:{fileName:_jsxFileName,lineNumber:660}});
};this.

_renderDebugThumbTouchRect=function(thumbLeft){
var thumbTouchRect=_this3._getThumbTouchRect();
var positionStyle={
left:thumbLeft,
top:thumbTouchRect.y,
width:thumbTouchRect.width,
height:thumbTouchRect.height};


return(
_react2.default.createElement(_reactNative.Animated.View,{
style:[defaultStyles.debugThumbTouchArea,positionStyle],
pointerEvents:'none',__source:{fileName:_jsxFileName,lineNumber:673}}));


};};



var defaultStyles=_reactNative.StyleSheet.create({
container:{
height:40,
justifyContent:'center'},

track:{
height:TRACK_SIZE,
borderRadius:TRACK_SIZE/2,
marginLeft:THUMB_SIZE/2,
marginRight:THUMB_SIZE/2},

thumb:{
position:'absolute',
width:THUMB_SIZE,
height:THUMB_SIZE,
borderRadius:THUMB_SIZE/2},

graduation:{
position:'absolute',
height:GRADUATION_HEIGHT,
width:GRADUATION_WIDTH},

graduationLabel:{
position:'absolute',
top:GRADUATION_LABEL_OFFSET,
backgroundColor:'transparent'},

touchArea:{
position:'absolute',
backgroundColor:'transparent',
top:0,
left:0,
right:0,
bottom:0},

debugThumbTouchArea:{
position:'absolute',
backgroundColor:'green',
opacity:0.5},

currentValueBubbleContainer:{
position:'absolute',
backgroundColor:'blue',
alignItems:'center',
justifyContent:'center',
width:40},

currentValueBubble:{
textAlign:'center'}});



module.exports=Slider;