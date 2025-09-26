import React from 'react';
import { Pressable, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const ArrowRight = ({ size = 24, color = 'black', strokeWidth = 2 }) => {
    const scale = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 1.2,
            useNativeDriver: true,
            friction: 5,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 5,
        }).start();
    };

    return (
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View style={{ transform: [{ scale }] }}>
                <Svg
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <AnimatedPath
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </Animated.View>
        </Pressable>
    );
};

export default ArrowRight;
