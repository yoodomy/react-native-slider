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
props));_this.propTypes={value:_propTypes2.default.number,disabled:_propTypes2.default.bool,enableDirectTouch:_propTypes2.default.bool,minimumValue:_propTypes2.default.number,maximumValue:_propTypes2.default.number,step:_propTypes2.default.number,graduation:_propTypes2.default.number,minimumTrackTintColor:_propTypes2.default.string,maximumTrackTintColor:_propTypes2.default.string,thumbTintColor:_propTypes2.default.string,graduationLabel:_propTypes2.default.func,thumbTouchSize:_propTypes2.default.shape({width:_propTypes2.default.number,height:_propTypes2.default.number}),onValueChange:_propTypes2.default.func,onSlidingStart:_propTypes2.default.func,onSlidingComplete:_propTypes2.default.func,style:_reactNative.View.propTypes.style,trackStyle:_reactNative.View.propTypes.style,thumbStyle:_reactNative.View.propTypes.style,graduationStyle:_reactNative.View.propTypes.style,graduationLabelStyle:_reactNative.Text.propTypes.style,graduationLabelContainerStyle:_reactNative.View.propTypes.style,debugTouchArea:_propTypes2.default.bool,animateTransitions:_propTypes2.default.bool,animationType:_propTypes2.default.oneOf(['spring','timing']),animationConfig:_propTypes2.default.object};_this.






















































componentWillReceiveProps=function(nextProps){
var newValue=nextProps.value;
if(this._getCurrentValue()!==newValue){
if(this.props.animateTransitions){
this._setCurrentValueAnimated(newValue);
}else
{
this._setCurrentValue(newValue);
}
}
};_this.

shouldComponentUpdate=function(nextProps,nextState){




return shallowCompare(
{props:this._getPropsForComponentUpdate(this.props),state:this.state},
this._getPropsForComponentUpdate(nextProps),
nextState)||
!styleEqual(this.props.style,nextProps.style)||
!styleEqual(this.props.trackStyle,nextProps.trackStyle)||
!styleEqual(this.props.thumbStyle,nextProps.thumbStyle)||
!styleEqual(this.props.graduationStyle,nextProps.graduationStyle)||
!styleEqual(this.props.graduationLabelContainerStyle,nextProps.graduationLabelContainerStyle)||
!styleEqual(this.props.graduationLabelStyle,nextProps.graduationLabelStyle);
};_this.


















































































































































_handleStartShouldSetPanResponder=function(e){

this.setState({
moving:this._thumbHitTest(e)});

return true;
};_this.

_handleMoveShouldSetPanResponder=function(){

return false;
};_this.

_handlePanResponderGrant=function(e,gestureState){
this._previousLeft=this._getThumbLeft(this._getCurrentValue());
this._fireChangeEvent('onSlidingStart');
};_this.
_handlePanResponderStart=function(e,gestureState){
if(this._thumbHitTest(e)||!this.props.enableDirectTouch){
return;
}

this._setCurrentValue(this._getValue(gestureState,false));
this._fireChangeEvent('onValueChange');
this._fireChangeEvent('onSlidingComplete');
};_this.
_handlePanResponderMove=function(e,gestureState){
if(this.props.disabled||!this.state.moving){
return;
}

this._setCurrentValue(this._getValue(gestureState,true));
this._fireChangeEvent('onValueChange');
};_this.
_handlePanResponderRequestEnd=function(e,gestureState){

return false;
};_this.
_handlePanResponderEnd=function(e,gestureState){
this.setState({
moving:false});

if(this.props.disabled){
return;
}

this._fireChangeEvent('onSlidingComplete');
};_this.state=getInitialState(props);return _this;}_createClass(Slider,[{key:'getInitialState',value:function getInitialState(props){var graduation=props.graduation,maximumValue=props.maximumValue,minimumValue=props.minimumValue;var numberOfGraduations=graduation?(maximumValue-minimumValue)/graduation+1:0;return{containerSize:{width:0,height:0},trackSize:{width:0,height:0},thumbSize:{width:0,height:0},currentValueBubbleSize:{width:0,height:0},legendWidth:Array.from(new Array(numberOfGraduations),function(){return 150;}),allMeasured:false,value:new _reactNative.Animated.Value(this.props.value)};}},{key:'getDefaultProps',value:function getDefaultProps(){return{value:0,minimumValue:0,maximumValue:1,step:0,graduation:0,minimumTrackTintColor:'#3f3f3f',maximumTrackTintColor:'#b3b3b3',thumbTintColor:'#343434',thumbTouchSize:{width:40,height:40},debugTouchArea:false,animationType:'timing'};}},{key:'componentWillMount',value:function componentWillMount(){this._panResponder=_reactNative.PanResponder.create({onStartShouldSetPanResponder:this._handleStartShouldSetPanResponder,onMoveShouldSetPanResponder:this._handleMoveShouldSetPanResponder,onPanResponderGrant:this._handlePanResponderGrant,onPanResponderStart:this._handlePanResponderStart,onPanResponderMove:this._handlePanResponderMove,onPanResponderRelease:this._handlePanResponderEnd,onPanResponderTerminationRequest:this._handlePanResponderRequestEnd,onPanResponderTerminate:this._handlePanResponderEnd});}},{key:'render',value:function render(){var _this2=this;var _props=this.props,graduation=_props.graduation,minimumValue=_props.minimumValue,maximumValue=_props.maximumValue,minimumTrackTintColor=_props.minimumTrackTintColor,maximumTrackTintColor=_props.maximumTrackTintColor,thumbTintColor=_props.thumbTintColor,styles=_props.styles,style=_props.style,trackStyle=_props.trackStyle,thumbStyle=_props.thumbStyle,currentValueBubbleContainerStyle=_props.currentValueBubbleContainerStyle,currentValueBubbleTextStyle=_props.currentValueBubbleTextStyle,ignoredGraduations=_props.ignoredGraduations,graduationStyle=_props.graduationStyle,graduationLabelContainerStyle=_props.graduationLabelContainerStyle,debugTouchArea=_props.debugTouchArea,other=_objectWithoutProperties(_props,['graduation','minimumValue','maximumValue','minimumTrackTintColor','maximumTrackTintColor','thumbTintColor','styles','style','trackStyle','thumbStyle','currentValueBubbleContainerStyle','currentValueBubbleTextStyle','ignoredGraduations','graduationStyle','graduationLabelContainerStyle','debugTouchArea']);var _state=this.state,value=_state.value,containerSize=_state.containerSize,trackSize=_state.trackSize,thumbSize=_state.thumbSize,currentValueBubbleSize=_state.currentValueBubbleSize,allMeasured=_state.allMeasured;var mainStyles=styles||defaultStyles;var thumbLeft=value.interpolate({inputRange:[minimumValue,maximumValue],outputRange:[0,containerSize.width-thumbSize.width]});var currentValueBubbleLeft=!!this.props.currentValueBubble&&value.interpolate({inputRange:[minimumValue,maximumValue],outputRange:[-thumbSize.width/2+4,containerSize.width-currentValueBubbleSize.width+thumbSize.width/2-4]});var valueVisibleStyle={};if(!allMeasured){valueVisibleStyle.opacity=0;}var minimumTrackStyle=_extends({position:'absolute',width:_reactNative.Animated.add(thumbLeft,thumbSize.width/2),marginTop:-trackSize.height,backgroundColor:minimumTrackTintColor},valueVisibleStyle);var touchOverflowStyle=this._getTouchOverflowStyle();var numberOfGraduations=graduation?(maximumValue-minimumValue)/graduation+1:0;var graduationArray=[];Array(numberOfGraduations).fill(0).forEach(function(value,index){return graduationArray.push(index);});return _react2.default.createElement(_reactNative.View,{style:this.props.containerStyle,__source:{fileName:_jsxFileName,lineNumber:338}},_react2.default.createElement(_reactNative.View,_extends({},other,{style:[mainStyles.container,style],onLayout:this._measureContainer,__source:{fileName:_jsxFileName,lineNumber:339}}),_react2.default.createElement(_reactNative.View,{style:[{backgroundColor:maximumTrackTintColor},mainStyles.track,trackStyle],onLayout:this._measureTrack,__source:{fileName:_jsxFileName,lineNumber:340}}),_react2.default.createElement(_reactNative.Animated.View,{style:[mainStyles.track,trackStyle,minimumTrackStyle],__source:{fileName:_jsxFileName,lineNumber:343}}),graduationArray.filter(function(i){return!ignoredGraduations||!ignoredGraduations.includes(i+1);}).map(function(i){return _react2.default.createElement(_reactNative.View,{key:i,__source:{fileName:_jsxFileName,lineNumber:345}},_react2.default.createElement(_reactNative.View,{style:[{backgroundColor:maximumTrackTintColor,marginTop:-(trackSize.height+GRADUATION_HEIGHT)/2},mainStyles.graduation,graduationStyle,_extends({left:_this2._getGraduationOffset(i)},valueVisibleStyle)],__source:{fileName:_jsxFileName,lineNumber:346}}),_react2.default.createElement(_reactNative.Animated.View,{onLayout:function onLayout(event){return _this2._measureLegend(event,i);},style:[mainStyles.graduationLabel,graduationLabelContainerStyle,{width:_this2.state.legendWidth[i],left:_this2._getGraduationOffset(i)-_this2.state.legendWidth[i]/2}],__source:{fileName:_jsxFileName,lineNumber:351}},_this2._renderGraduationLabel(i)));}),_react2.default.createElement(_reactNative.Animated.View,{onLayout:this._measureThumb,style:[{backgroundColor:thumbTintColor,marginTop:-(trackSize.height+thumbSize.height)/2},mainStyles.thumb,thumbStyle,_extends({left:thumbLeft},valueVisibleStyle)],__source:{fileName:_jsxFileName,lineNumber:359}}),_react2.default.createElement(_reactNative.View,_extends({style:[defaultStyles.touchArea,touchOverflowStyle]},this._panResponder.panHandlers,{__source:{fileName:_jsxFileName,lineNumber:366}}),debugTouchArea===true&&this._renderDebugThumbTouchRect(thumbLeft))),!!this.props.currentValueBubble&&!!this.props.graduationLabel&&_react2.default.createElement(_reactNative.Animated.View,{onLayout:this._measureCurrentValueBubble,style:[{top:containerSize.height/2-trackSize.height-thumbSize.height-4},mainStyles.currentValueBubbleContainer,currentValueBubbleContainerStyle,_extends({left:currentValueBubbleLeft},valueVisibleStyle)],__source:{fileName:_jsxFileName,lineNumber:373}},_react2.default.createElement(_reactNative.Text,{style:[mainStyles.currentValueBubble,currentValueBubbleTextStyle],__source:{fileName:_jsxFileName,lineNumber:376}},this.props.graduationLabel(this.props.value))));}},{key:'_getPropsForComponentUpdate',value:function _getPropsForComponentUpdate(props){var onValueChange=props.onValueChange,onSlidingStart=props.onSlidingStart,onSlidingComplete=props.onSlidingComplete,style=props.style,trackStyle=props.trackStyle,thumbStyle=props.thumbStyle,graduationStyle=props.graduationStyle,otherProps=_objectWithoutProperties(props,['onValueChange','onSlidingStart','onSlidingComplete','style','trackStyle','thumbStyle','graduationStyle']);if(!this.props.currentValueBubble){otherProps.value=undefined;}return otherProps;}},{key:'_getGraduationOffset',value:function _getGraduationOffset(index){var _props2=this.props,graduation=_props2.graduation,graduationStyle=_props2.graduationStyle,thumbStyle=_props2.thumbStyle,minimumValue=_props2.minimumValue,maximumValue=_props2.maximumValue;var _state2=this.state,containerSize=_state2.containerSize,thumbSize=_state2.thumbSize;var graduationOffset=thumbSize.width/2;graduationOffset+=(minimumValue+graduation*index)*(containerSize.width-thumbSize.width)/maximumValue;if(thumbStyle.borderWidth){graduationOffset-=2*thumbStyle.borderWidth;}var graduationStyleObject=graduationStyle&&_reactNative.StyleSheet.flatten(graduationStyle);graduationOffset-=graduationStyleObject&&graduationStyleObject.width?graduationStyleObject.width/2:GRADUATION_WIDTH/2;return graduationOffset;}},{key:'_measureContainer',value:function _measureContainer(

x){
this._handleMeasure('containerSize',x);
}},{key:'_measureTrack',value:function _measureTrack(

x){
this._handleMeasure('trackSize',x);
}},{key:'_measureThumb',value:function _measureThumb(

x){
this._handleMeasure('thumbSize',x);
}},{key:'_measureCurrentValueBubble',value:function _measureCurrentValueBubble(

x){
this._handleMeasure('currentValueBubbleSize',x);
}},{key:'_measureLegend',value:function _measureLegend(

x,index){
var legendWidth=this.state.legendWidth;
legendWidth[index]=x.nativeEvent.layout.width;
this.setState({legendWidth:legendWidth});
}},{key:'_handleMeasure',value:function _handleMeasure(

name,x){var _x$nativeEvent$layout=
x.nativeEvent.layout,width=_x$nativeEvent$layout.width,height=_x$nativeEvent$layout.height;
var size={width:width,height:height};

var storeName='_'+name;
var currentSize=this[storeName];
if(currentSize&&width===currentSize.width&&height===currentSize.height){
return;
}
this[storeName]=size;

if(this._containerSize&&
this._trackSize&&
this._thumbSize&&(
this.props.currentValueBubble&&this._currentValueBubbleSize||!this.props.currentValueBubble))
{
this.setState({
containerSize:this._containerSize,
trackSize:this._trackSize,
thumbSize:this._thumbSize,
currentValueBubbleSize:this._currentValueBubbleSize,
allMeasured:true});

}
}},{key:'_getRatio',value:function _getRatio(

value){
return(value-this.props.minimumValue)/(this.props.maximumValue-this.props.minimumValue);
}},{key:'_getThumbLeft',value:function _getThumbLeft(

value){
var ratio=this._getRatio(value);
return ratio*(this.state.containerSize.width-this.state.thumbSize.width);
}},{key:'_getValue',value:function _getValue(

gestureState,move){
var length=this.state.containerSize.width-this.state.thumbSize.width;
var thumbLeft;
if(move){
thumbLeft=this._previousLeft+gestureState.dx;
}else{
var offset=(_reactNative.Dimensions.get('window').width-length)/2;
thumbLeft=gestureState.x0-offset;
}

var ratio=thumbLeft/length;

if(this.props.step){
return Math.max(this.props.minimumValue,
Math.min(this.props.maximumValue,
this.props.minimumValue+Math.round(ratio*(this.props.maximumValue-this.props.minimumValue)/this.props.step)*this.props.step));


}else{
return Math.max(this.props.minimumValue,
Math.min(this.props.maximumValue,
ratio*(this.props.maximumValue-this.props.minimumValue)+this.props.minimumValue));


}
}},{key:'_getCurrentValue',value:function _getCurrentValue()

{
return this.state.value.__getValue();
}},{key:'_setCurrentValue',value:function _setCurrentValue(

value){
this.state.value.setValue(value);
}},{key:'_setCurrentValueAnimated',value:function _setCurrentValueAnimated(

value){
var animationType=this.props.animationType;
var animationConfig=_extends(
{},
DEFAULT_ANIMATION_CONFIGS[animationType],
this.props.animationConfig,
{toValue:value});


_reactNative.Animated[animationType](this.state.value,animationConfig).start();
}},{key:'_fireChangeEvent',value:function _fireChangeEvent(

event){
if(this.props[event]){
this.props[event](this._getCurrentValue());
}
}},{key:'_getTouchOverflowSize',value:function _getTouchOverflowSize()

{
var state=this.state;
var props=this.props;

var size={};
if(state.allMeasured===true){
size.width=Math.max(0,props.thumbTouchSize.width-state.thumbSize.width);
size.height=Math.max(0,props.thumbTouchSize.height-state.containerSize.height);
}

return size;
}},{key:'_getTouchOverflowStyle',value:function _getTouchOverflowStyle()

{var _getTouchOverflowSize2=
this._getTouchOverflowSize(),width=_getTouchOverflowSize2.width,height=_getTouchOverflowSize2.height;

var touchOverflowStyle={};
if(width!==undefined&&height!==undefined){
var verticalMargin=-height/2;
touchOverflowStyle.marginTop=verticalMargin;
touchOverflowStyle.marginBottom=verticalMargin;

var horizontalMargin=-width/2;
touchOverflowStyle.marginLeft=horizontalMargin;
touchOverflowStyle.marginRight=horizontalMargin;
}

if(this.props.debugTouchArea===true){
touchOverflowStyle.backgroundColor='orange';
touchOverflowStyle.opacity=0.5;
}

return touchOverflowStyle;
}},{key:'_thumbHitTest',value:function _thumbHitTest(

e){
var nativeEvent=e.nativeEvent;
var thumbTouchRect=this._getThumbTouchRect();
return thumbTouchRect.containsPoint(nativeEvent.locationX,nativeEvent.locationY);
}},{key:'_getThumbTouchRect',value:function _getThumbTouchRect()

{
var state=this.state;
var props=this.props;
var touchOverflowSize=this._getTouchOverflowSize();

return new Rect(
touchOverflowSize.width/2+this._getThumbLeft(this._getCurrentValue())+(state.thumbSize.width-props.thumbTouchSize.width)/2,
touchOverflowSize.height/2+(state.containerSize.height-props.thumbTouchSize.height)/2,
props.thumbTouchSize.width,
props.thumbTouchSize.height);

}},{key:'_renderGraduationLabel',value:function _renderGraduationLabel(

index){
if(this.props.graduationLabel){
return(
_react2.default.createElement(_reactNative.Text,{style:[{textAlign:'center'},this.props.graduationLabelStyle],__source:{fileName:_jsxFileName,lineNumber:645}},
this.props.graduationLabel(index)));


}
return _react2.default.createElement(_reactNative.View,{__source:{fileName:_jsxFileName,lineNumber:650}});
}},{key:'_renderDebugThumbTouchRect',value:function _renderDebugThumbTouchRect(

thumbLeft){
var thumbTouchRect=this._getThumbTouchRect();
var positionStyle={
left:thumbLeft,
top:thumbTouchRect.y,
width:thumbTouchRect.width,
height:thumbTouchRect.height};


return(
_react2.default.createElement(_reactNative.Animated.View,{
style:[defaultStyles.debugThumbTouchArea,positionStyle],
pointerEvents:'none',__source:{fileName:_jsxFileName,lineNumber:663}}));


}}]);return Slider;}(_react2.default.Component);
;


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