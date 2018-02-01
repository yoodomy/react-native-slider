'use strict';

import PropTypes from 'prop-types';

import React, { Component } from "react";

import {
  Animated,
  Dimensions,
  StyleSheet,
  PanResponder,
  Text,
  View,
  Easing,
  ViewPropTypes,
} from "react-native";

const shallowCompare = require('react-addons-shallow-compare'),
  styleEqual = require('style-equal');

var TRACK_SIZE = 4;
var THUMB_SIZE = 20;
var GRADUATION_HEIGHT = 10;
var GRADUATION_WIDTH = 3;
var GRADUATION_LABEL_OFFSET = -37;

function Rect(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Rect.prototype.containsPoint = function(x, y) {
  return (x >= this.x
    && y >= this.y
    && x <= this.x + this.width
    && y <= this.y + this.height);
};

var DEFAULT_ANIMATION_CONFIGS = {
  spring : {
    friction : 7,
    tension  : 100
  },
  timing : {
    duration : 150,
    easing   : Easing.inOut(Easing.ease),
    delay    : 0
  },
  // decay : { // This has a serious bug
  //   velocity     : 1,
  //   deceleration : 0.997
  // }
};

class Slider extends React.Component {
  static propTypes = {
    /**
     * Initial value of the slider. The value should be between minimumValue
     * and maximumValue, which default to 0 and 1 respectively.
     * Default value is 0.
     *
     * *This is not a controlled component*, e.g. if you don't update
     * the value, the component won't be reset to its inital value.
     */
    value: PropTypes.number,

    /**
     * If true the user won't be able to move the slider.
     * Default value is false.
     */
    disabled: PropTypes.bool,

    /**
     * Initial minimum value of the slider. Default value is 0.
     */
    minimumValue: PropTypes.number,

    /**
     * Initial maximum value of the slider. Default value is 1.
     */
    maximumValue: PropTypes.number,

    /**
     * Step value of the slider. The value should be between 0 and
     * (maximumValue - minimumValue). Default value is 0.
     */
    step: PropTypes.number,

    /**
     * Graduation value of the slider to display a reguliar vertical tick.
     * The value should be between 0 and (maximumValue - minimumValue).
     * Default value is 0
     */
    graduation: PropTypes.number,

    /**
     * The color used for the track to the left of the button. Overrides the
     * default blue gradient image.
     */
    minimumTrackTintColor: PropTypes.string,

    /**
     * The color used for the track to the right of the button. Overrides the
     * default blue gradient image.
     */
    maximumTrackTintColor: PropTypes.string,

    /**
     * The color used for the thumb.
     */
    thumbTintColor: PropTypes.string,

    /**
     * The function which given the graduation index returns the wanted label
     * placed above.
     */
    graduationLabel: PropTypes.func,

    /**
     * The size of the touch area that allows moving the thumb.
     * The touch area has the same center has the visible thumb.
     * This allows to have a visually small thumb while still allowing the user
     * to move it easily.
     * The default is {width: 40, height: 40}.
     */
    thumbTouchSize: PropTypes.shape(
      {width: PropTypes.number, height: PropTypes.number}
    ),

    /**
     * Callback continuously called while the user is dragging the slider.
     */
    onValueChange: PropTypes.func,

    /**
     * Callback called when the user starts changing the value (e.g. when
     * the slider is pressed).
     */
    onSlidingStart: PropTypes.func,

    /**
     * Callback called when the user finishes changing the value (e.g. when
     * the slider is released).
     */
    onSlidingComplete: PropTypes.func,

    /**
     * The style applied to the slider container.
     */
    style: ViewPropTypes.style,

    /**
     * The style applied to the track.
     */
    trackStyle: ViewPropTypes.style,

    /**
     * The style applied to the thumb.
     */
    thumbStyle: ViewPropTypes.style,

    /**
     * The style applied to the graduation.
     */
    graduationStyle: ViewPropTypes.style,
    graduationLabelStyle: Text.propTypes.style,
    graduationLabelContainerStyle: ViewPropTypes.style,

    /**
     * Set this to true to visually see the thumb touch rect in green.
     */
    debugTouchArea: PropTypes.bool,

    /**
     * Set to true to animate values with default 'timing' animation type
     */
    animateTransitions : PropTypes.bool,

    /**
     * Custom Animation type. 'spring' or 'timing'.
     */
    animationType : PropTypes.oneOf(['spring', 'timing']),

    /**
     * Used to configure the animation parameters.  These are the same parameters in the Animated library.
     */
    animationConfig : PropTypes.object,
  };

  static defaultProps = {
    value: 0,
    minimumValue: 0,
    maximumValue: 1,
    step: 0,
    graduation: 0,
    minimumTrackTintColor: '#3f3f3f',
    maximumTrackTintColor: '#b3b3b3',
    thumbTintColor: '#343434',
    thumbTouchSize: {width: 40, height: 40},
    debugTouchArea: false,
    animationType: 'timing',
  };

  constructor(props) {
    super(props);

    this.state = this.getInitialState(props);
  }

  getInitialState(props) {
    const {
      graduation,
      maximumValue,
      minimumValue,
    } = props;

    const numberOfGraduations = graduation ? (maximumValue-minimumValue) / graduation + 1 : 0;

    // We provide an initial legend width big enough (150) to contain usual texts
    // to be provided above the graduation marks
    return {
      containerSize: {width: 0, height: 0},
      trackSize: {width: 0, height: 0},
      thumbSize: {width: 0, height: 0},
      currentValueBubbleSize: {width: 0, height: 0},
      legendWidth: Array.from(new Array(numberOfGraduations), () => 150),
      allMeasured: false,
      value: new Animated.Value(this.props.value),
    };
  };

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderStart: this._handlePanResponderStart,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderRelease,
      onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
      onPanResponderTerminate: this._handlePanResponderTerminate,
    });
  };

  componentWillReceiveProps = function(nextProps) {
    var newValue = nextProps.value;
    if (this._getCurrentValue() !== newValue) {
      if (this.props.animateTransitions) {
        this._setCurrentValueAnimated(newValue);
      }
      else {
        this._setCurrentValue(newValue);
      }
    }
  }

  shouldComponentUpdate = function(nextProps, nextState) {
    // We don't want to re-render in the following cases:
    // - when only the 'value' prop changes as it's already handled with the Animated.Value
    // - when the event handlers change (rendering doesn't depend on them)
    // - when the style props haven't actually change
    return shallowCompare(
      { props: this._getPropsForComponentUpdate(this.props), state: this.state },
      this._getPropsForComponentUpdate(nextProps),
      nextState
      ) || !styleEqual(this.props.style, nextProps.style)
      || !styleEqual(this.props.trackStyle, nextProps.trackStyle)
      || !styleEqual(this.props.thumbStyle, nextProps.thumbStyle)
      || !styleEqual(this.props.graduationStyle, nextProps.graduationStyle)
      || !styleEqual(this.props.graduationLabelContainerStyle, nextProps.graduationLabelContainerStyle)
      || !styleEqual(this.props.graduationLabelStyle, nextProps.graduationLabelStyle);
  }

  render() {
    var {
      graduation,
      minimumValue,
      maximumValue,
      minimumTrackTintColor,
      maximumTrackTintColor,
      thumbTintColor,
      styles,
      style,
      trackStyle,
      thumbStyle,
      currentValueBubbleContainerStyle,
      currentValueBubbleTextStyle,
      ignoredGraduations,
      graduationStyle,
      graduationLabelContainerStyle,
      debugTouchArea,
      ...other
    } = this.props;
    var {value, containerSize, trackSize, thumbSize, currentValueBubbleSize, allMeasured} = this.state;
    var mainStyles = styles || defaultStyles;
    var thumbLeft =  value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [0, containerSize.width - thumbSize.width],
      //extrapolate: 'clamp',
    });
    const currentValueBubbleLeft = !!this.props.currentValueBubble && value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [-thumbSize.width / 2 + 4, containerSize.width - currentValueBubbleSize.width + thumbSize.width / 2 - 4],
    });

    var valueVisibleStyle = {};
    if (!allMeasured) {
      valueVisibleStyle.opacity = 0;
    }

    var minimumTrackStyle = {
      position: 'absolute',
      width: Animated.add(thumbLeft, thumbSize.width / 2),
      marginTop: -trackSize.height,
      backgroundColor: minimumTrackTintColor,
      ...valueVisibleStyle
    };

    var touchOverflowStyle = this._getTouchOverflowStyle();

    var numberOfGraduations = graduation ? (maximumValue-minimumValue) / graduation + 1 : 0;

    // ES6 Array.prototype.keys is broken in Android as 08/2017
    let graduationArray = [];
    Array(numberOfGraduations).fill(0).forEach((value, index) => graduationArray.push(index));

    return (
      <View style={this.props.containerStyle}>
        <View {...other} style={[mainStyles.container, style]} onLayout={this._measureContainer}>
          <View
            style={[{backgroundColor: maximumTrackTintColor,}, mainStyles.track, trackStyle]}
            onLayout={this._measureTrack} />
          <Animated.View style={[mainStyles.track, trackStyle, minimumTrackStyle]} />

          <Animated.View
            onLayout={this._measureThumb}
            style={[
              {backgroundColor: thumbTintColor, marginTop: -(trackSize.height + thumbSize.height) / 2},
              mainStyles.thumb, thumbStyle, {left: thumbLeft, ...valueVisibleStyle}
            ]}
          />
          <View
            style={[defaultStyles.touchArea, touchOverflowStyle]}
            {...this._panResponder.panHandlers}>
            {debugTouchArea === true && this._renderDebugThumbTouchRect(thumbLeft)}
          </View>
        </View>
        {graduationArray.filter(i => !ignoredGraduations || !ignoredGraduations.includes(i+1)).map(i =>
            <View key={i} style={{top: containerSize.height / 2 + trackSize.height / 2, position:'absolute'}}>
              <View
                style={[
                  {backgroundColor: maximumTrackTintColor, marginTop: -(trackSize.height + GRADUATION_HEIGHT) / 2},
                  mainStyles.graduation, graduationStyle, {left: this._getGraduationOffset(i), ...valueVisibleStyle}
                ]}/>
              <Animated.View
                onLayout={(event) => this._measureLegend(event, i)}
                style={[mainStyles.graduationLabel, graduationLabelContainerStyle,
                  {width: this.state.legendWidth[i], left: this._getGraduationOffset(i)-this.state.legendWidth[i]/2}]}>
                {this._renderGraduationLabel(i)}
              </Animated.View>
            </View>
          )}
        {!!this.props.currentValueBubble && !!this.props.graduationLabel &&
        <Animated.View
          onLayout={this._measureCurrentValueBubble}
          style={[{top: containerSize.height / 2  - trackSize.height - thumbSize.height - 4}, mainStyles.currentValueBubbleContainer, currentValueBubbleContainerStyle, { left: currentValueBubbleLeft, ...valueVisibleStyle }]}>
          <Text style={[mainStyles.currentValueBubble, currentValueBubbleTextStyle]}>{this.props.graduationLabel(this.props.value)}</Text>
        </Animated.View>
        }
      </View>
    );
  }

  _getPropsForComponentUpdate = (props) => {
    var {
      onValueChange,
      onSlidingStart,
      onSlidingComplete,
      style,
      trackStyle,
      thumbStyle,
      graduationStyle,
      ...otherProps,
    } = props;

    if (!this.props.currentValueBubble) {
      otherProps.value = undefined;
    }

    return otherProps;
  };

  _getGraduationOffset = (index: number) => {
    var {
      graduation,
      graduationStyle,
      thumbStyle,
      minimumValue,
      maximumValue,
    } = this.props;
    var {
      containerSize,
      thumbSize,
    } = this.state;

    var graduationOffset = thumbSize.width / 2;

    graduationOffset += (minimumValue+graduation*index) * (containerSize.width-thumbSize.width) / maximumValue;

    if (thumbStyle.borderWidth) {
      graduationOffset -= 2*thumbStyle.borderWidth;
    }

    const graduationStyleObject = graduationStyle && StyleSheet.flatten(graduationStyle);
    graduationOffset -= graduationStyleObject && graduationStyleObject.width ? graduationStyleObject.width / 2 : GRADUATION_WIDTH / 2;

    return graduationOffset;
  };

  _handleStartShouldSetPanResponder = (e: Object, /*gestureState: Object*/): boolean => {
    // Should we become active when the user presses down on the thumb?
    this.setState({
      moving: this._thumbHitTest(e),
    });
    return true;
  };

  _handleMoveShouldSetPanResponder = (/*e: Object, gestureState: Object*/): boolean => {
    // Should we become active when the user moves a touch over the thumb?
    return false;
  };

  _handlePanResponderGrant = (e: Object, gestureState: Object) => {
    this._previousLeft = this._getThumbLeft(this._getCurrentValue());
    this._fireChangeEvent('onSlidingStart');
  };
  _handlePanResponderStart = (e: Object, gestureState: Object) => {};
  _handlePanResponderMove = (e: Object, gestureState: Object) => {
    if (this.props.disabled
      || !this.state.moving
      || Math.abs(gestureState.dy) > this.state.containerSize.height) {
      return;
    }

    this._setCurrentValue(this._getValue(gestureState, true));
    this._fireChangeEvent('onValueChange');
  };
  _handlePanResponderRequestEnd = (e: Object, gestureState: Object) => {
    // Should we allow another component to take over this pan?
    return Math.abs(gestureState.dy) > this.state.containerSize.height;
  };
  _handlePanResponderRelease = (e: Object, gestureState: Object) => {
    this.setState({
      moving: false,
    });
    if (this.props.disabled) {
      return;
    }

    if (!this._thumbHitTest(e)
      && Math.abs(gestureState.dx) < this.state.thumbSize.width
      && Math.abs(gestureState.dy) < this.state.thumbSize.height) {
      this._setCurrentValue(this._getValue(gestureState, false));
      this._fireChangeEvent('onValueChange');
    }

    this._fireChangeEvent('onSlidingComplete');
  };
  _handlePanResponderTerminate = (e: Object, gestureState: Object) => {
    this.setState({
      moving: false,
    });
  };

  _measureContainer = (x: Object) => {
    this._handleMeasure('containerSize', x);
  };

  _measureTrack = (x: Object) => {
    this._handleMeasure('trackSize', x);
  };

  _measureThumb = (x: Object) => {
    this._handleMeasure('thumbSize', x);
  };

  _measureCurrentValueBubble = (x: Object) => {
    this._handleMeasure('currentValueBubbleSize', x);
  };

  _measureLegend = (x: Object, index: number) => {
    const legendWidth = this.state.legendWidth;
    legendWidth[index] = x.nativeEvent.layout.width;
    this.setState({legendWidth});
  };

  _handleMeasure = (name: string, x: Object) => {
    var {width, height} = x.nativeEvent.layout;
    var size = {width: width, height: height};

    var storeName = `_${name}`;
    var currentSize = this[storeName];
    if (currentSize && width === currentSize.width && height === currentSize.height) {
      return;
    }
    this[storeName] = size;

    if (this._containerSize
      && this._trackSize
      && this._thumbSize
      && (this.props.currentValueBubble && this._currentValueBubbleSize || !this.props.currentValueBubble)
    ) {
      this.setState({
        containerSize: this._containerSize,
        trackSize: this._trackSize,
        thumbSize: this._thumbSize,
        currentValueBubbleSize: this._currentValueBubbleSize,
        allMeasured: true,
      })
    }
  };

  _getRatio = (value: number) => {
    return (value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue);
  };

  _getThumbLeft = (value: number) => {
    var ratio = this._getRatio(value);
    return ratio * (this.state.containerSize.width - this.state.thumbSize.width);
  };

  _getValue = (gestureState: Object, move: boolean) => {
    var length = this.state.containerSize.width - this.state.thumbSize.width;
    var thumbLeft;
    if (move) {
      thumbLeft = this._previousLeft + gestureState.dx;
    } else {
      var offset = (Dimensions.get('window').width - length) / 2;
      thumbLeft = gestureState.x0 - offset;
    }

    var ratio = thumbLeft / length;

    if (this.props.step) {
      return Math.max(this.props.minimumValue,
        Math.min(this.props.maximumValue,
          this.props.minimumValue + Math.round(ratio * (this.props.maximumValue - this.props.minimumValue) / this.props.step) * this.props.step
        )
      );
    } else {
      return Math.max(this.props.minimumValue,
        Math.min(this.props.maximumValue,
          ratio * (this.props.maximumValue - this.props.minimumValue) + this.props.minimumValue
        )
      );
    }
  };

  _getCurrentValue = () => {
    return this.state.value.__getValue();
  };

  _setCurrentValue = (value: number) => {
    this.state.value.setValue(value);
  };

  _setCurrentValueAnimated = (value: number) => {
    var animationType   = this.props.animationType;
    var animationConfig = Object.assign(
      {},
      DEFAULT_ANIMATION_CONFIGS[animationType],
      this.props.animationConfig,
      {toValue : value}
    );

    Animated[animationType](this.state.value, animationConfig).start();
  };

  _fireChangeEvent = (event) => {
    if (this.props[event]) {
      this.props[event](this._getCurrentValue());
    }
  };

  _getTouchOverflowSize = () => {
    var state = this.state;
    var props = this.props;

    var size = {};
    if (state.allMeasured === true) {
      size.width = Math.max(0, props.thumbTouchSize.width - state.thumbSize.width);
      size.height = Math.max(0, props.thumbTouchSize.height - state.containerSize.height);
    }

    return size;
  };

  _getTouchOverflowStyle = () => {
    var {width, height} = this._getTouchOverflowSize();

    var touchOverflowStyle = {};
    if (width !== undefined && height !== undefined) {
      var verticalMargin = -height / 2;
      touchOverflowStyle.marginTop = verticalMargin;
      touchOverflowStyle.marginBottom = verticalMargin;

      var horizontalMargin = -width / 2;
      touchOverflowStyle.marginLeft = horizontalMargin;
      touchOverflowStyle.marginRight = horizontalMargin;
    }

    if (this.props.debugTouchArea === true) {
      touchOverflowStyle.backgroundColor = 'orange';
      touchOverflowStyle.opacity = 0.5;
    }

    return touchOverflowStyle;
  };

  _thumbHitTest = (e: Object) => {
    var nativeEvent = e.nativeEvent;
    var thumbTouchRect = this._getThumbTouchRect();
    return thumbTouchRect.containsPoint(nativeEvent.locationX, nativeEvent.locationY);
  };

  _getThumbTouchRect = () => {
    var state = this.state;
    var props = this.props;
    var touchOverflowSize = this._getTouchOverflowSize();

    return new Rect(
      touchOverflowSize.width / 2 + this._getThumbLeft(this._getCurrentValue()) + (state.thumbSize.width - props.thumbTouchSize.width) / 2,
      touchOverflowSize.height / 2 + (state.containerSize.height - props.thumbTouchSize.height) / 2,
      props.thumbTouchSize.width,
      props.thumbTouchSize.height
    );
  };

  _renderGraduationLabel = (index: Number) => {
    if (this.props.graduationLabel) {
      return (
        <Text style={[{textAlign: 'center'}, this.props.graduationLabelStyle]}>
          {this.props.graduationLabel(index)}
        </Text>
      )
    }
    return <View />;
  };

  _renderDebugThumbTouchRect = (thumbLeft) => {
    var thumbTouchRect = this._getThumbTouchRect();
    var positionStyle = {
      left: thumbLeft,
      top: thumbTouchRect.y,
      width: thumbTouchRect.width,
      height: thumbTouchRect.height,
    };

    return (
      <Animated.View
        style={[defaultStyles.debugThumbTouchArea, positionStyle]}
        pointerEvents='none'
      />
    );
  };
}


var defaultStyles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2,
    marginLeft: THUMB_SIZE / 2,
    marginRight: THUMB_SIZE / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  graduation: {
    position: 'absolute',
    height: GRADUATION_HEIGHT,
    width: GRADUATION_WIDTH,
  },
  graduationLabel: {
    position: 'absolute',
    top: GRADUATION_LABEL_OFFSET,
    backgroundColor: 'transparent',
  },
  touchArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  debugThumbTouchArea: {
    position: 'absolute',
    backgroundColor: 'green',
    opacity: 0.5,
  },
  currentValueBubbleContainer: {
    position: 'absolute',
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  currentValueBubble: {
    textAlign: 'center',
  },
});

module.exports = Slider;
