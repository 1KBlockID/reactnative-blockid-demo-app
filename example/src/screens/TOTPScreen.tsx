import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import HomeViewModel from '../HomeViewModel';

const CircularProgress: React.FC<{ progress: number }> = ({ progress }) => {
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <Svg width={size} height={size}>
      <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#000000"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          strokeLinecap="round"
          fill="none"
        />
      </G>
      <SvgText
        x="50%"
        y="50%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="30"
        fontWeight="bold"
      >
        {Math.ceil(progress * 30)}s
      </SvgText>
    </Svg>
  );
};

const TOTPScreen: React.FC = () => {
  const [progress, setProgress] = useState(1.0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [otp, setOtp] = useState('');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    const viewModel = HomeViewModel.getInstance();
    let totp = await viewModel.totp();
    console.log('TOTP', totp?.totp, totp?.getRemainingSecs);
    setRemainingTime(totp?.getRemainingSecs ?? 0);
    setOtp(totp?.totp ?? '');
    setProgress(1.0);
  };

  useEffect(() => {
    fetchData();

    // Cleanup function to clear the interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            fetchData(); // Fetch new data when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup interval when remainingTime changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [remainingTime]);

  useEffect(() => {
    setProgress(remainingTime / 30);
  }, [remainingTime]);

  return (
    <View style={styles.container}>
      <CircularProgress progress={progress} />
      <View style={styles.otpContainer}>
        <Text style={styles.otpText}>{otp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  otpContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
  },
  otpText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default TOTPScreen;
