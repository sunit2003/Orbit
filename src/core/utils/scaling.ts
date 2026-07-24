import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device (iPhone 11/X/8 etc or similar Android)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Scale horizontal logic (Width, Margins, Paddings, Horizontal bounds)
 */
export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Scale vertical logic (Height, Margins, Paddings, Vertical Bounds)
 */
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Scale font size based on device pixel ratio to maintain proportion
 */
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

/**
 * Scale font reliably
 */
export function normalizeFont(size: number) {
  const newSize = size * (SCREEN_WIDTH / guidelineBaseWidth);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    // Android fonts formerly -2 but that can make small text tiny
    const androidSize = Math.round(PixelRatio.roundToNearestPixel(newSize));
    return androidSize > 12 ? androidSize - 1 : androidSize;
  }
}

export const deviceWidth = SCREEN_WIDTH;
export const deviceHeight = SCREEN_HEIGHT;
