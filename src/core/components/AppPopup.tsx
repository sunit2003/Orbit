import { Ionicons } from "@react-native-vector-icons/ionicons";
import { GlassView } from "expo-glass-effect";
import React from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { normalizeFont, scale, verticalScale } from "../utils/scaling";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export type PopupType = "success" | "error" | "info" | "warning";

interface AppPopupProps {
  isVisible: boolean;
  type?: PopupType;
  title: string;
  message: string;
  primaryButtonText?: string;
  onPrimaryPress: () => void;
  secondaryButtonText?: string;
  onSecondaryPress?: () => void;
  onClose: () => void;
  hideButtons?: boolean;
}

/**
 * AppPopup
 *
 * A premium, generic popup component designed to replace standard system alerts.
 * Features semantic color coding, smooth animations, and a polished UI.
 */
export const AppPopup: React.FC<AppPopupProps> = ({
  isVisible: isVisibleProp,
  type: typeProp = "info",
  title: titleProp,
  message: messageProp,
  primaryButtonText = "Okay",
  onPrimaryPress,
  secondaryButtonText,
  onSecondaryPress,
  onClose,
  hideButtons,
}) => {
  const isVisible = isVisibleProp;
  const type = typeProp;
  const title = titleProp;
  const message = messageProp;

  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [scaleAnim] = React.useState(new Animated.Value(0.95));

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 9,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();

      if (!secondaryButtonText) {
        timer = setTimeout(() => {
          onPrimaryPress();
        }, 2000);
      }
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, secondaryButtonText, onPrimaryPress]);

  const getTheme = () => {
    switch (type) {
      case "success":
        return {
          image: require("@/assets/images/successIcon.png"),
          color: "#10B981",
          // bg: "",
          accent: "#10B981",
        };
      case "error":
        return {
          image: require("@/assets/images/error_icon.png"),
          color: "#EF4444",
          // bg: "#FEF2F2",
          accent: "#EF4444",
        };
      case "warning":
        return {
          image: require("@/assets/images/warningIcon.png"),
          color: "#F59E0B",
          // bg: "#FFFBEB",
          accent: "#F59E0B",
        };
      default:
        return {
          name: "information-circle",
          color: "#3B82F6",
          bg: "#EFF6FF",
          accent: "#3B82F6",
        };
    }
  };

  const theme = getTheme();
  // Override: Hide buttons if it's an auto-dismissing popup (no secondary button)
  const isAutoDismiss = !secondaryButtonText;
  const showButtons = !hideButtons && !isAutoDismiss;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <GlassView style={StyleSheet.absoluteFill} />
        </Animated.View>

        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <GlassView style={StyleSheet.absoluteFill} />
          {/* Visual Top Accent Bar removed as per user request */}

          {/* Premium Icon Header */}
          <View style={[styles.iconWrapper, { backgroundColor: theme.bg }]}>
            {theme.image ? (
              <Image
                source={theme.image}
                style={[
                  { width: scale(80), height: scale(80) },
                  type === "error" && { width: scale(40), height: scale(40) },
                ]}
                resizeMode="contain"
              />
            ) : (
              <Ionicons
                name={theme.name as any}
                size={scale(36)}
                color={theme.color}
              />
            )}
          </View>

          {/* Content Hierarchy */}
          <View
            style={[
              styles.textSection,
              !showButtons && { marginBottom: verticalScale(16) },
            ]}
          >
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.messageText}>{message}</Text>
          </View>

          {/* Optimized Button Layout */}
          {showButtons && (
            <View style={styles.actionRow}>
              {secondaryButtonText && (
                <TouchableOpacity
                  style={[styles.btnBase, styles.btnSecondary]}
                  onPress={onSecondaryPress || onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.btnTextSecondary}>
                    {secondaryButtonText}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.btnBase, styles.btnPrimary]}
                onPress={onPrimaryPress}
                activeOpacity={0.8}
              >
                <Text style={styles.btnTextPrimary}>{primaryButtonText}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(24),
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(11, 9, 9, 0.8)", // Deep slate overlay for focus
  },
  container: {
    width: "100%",
    maxWidth: scale(340),
    backgroundColor: "rgba(30, 30, 30, 0.8)",
    borderRadius: scale(20),
    overflow: "hidden", // Required for accent bar
    alignItems: "center",
    paddingBottom: verticalScale(24),
    borderWidth: scale(1),
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
  accentBar: {
    width: "100%",
    height: verticalScale(4),
    position: "absolute",
    top: 0,
  },
  iconWrapper: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36),
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(32),
    marginBottom: verticalScale(16),
  },
  textSection: {
    paddingHorizontal: scale(24),
    alignItems: "center",
    marginBottom: verticalScale(32),
  },
  titleText: {
    fontSize: normalizeFont(20),
    fontFamily: "GilroyBold",
    color: "#FFFFFF", // Deep slate for hierarchy
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  messageText: {
    fontSize: normalizeFont(14),
    fontFamily: "GilroyMedium",
    color: "#CBCBCB", // Muted slate for comfort
    textAlign: "center",
    lineHeight: normalizeFont(22),
  },
  actionRow: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: scale(24),
    gap: scale(12),
  },
  btnBase: {
    flex: 1,
    height: verticalScale(48),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  btnPrimary: {
    backgroundColor: "#111418", // Primary brand color
  },
  btnTextPrimary: {
    fontSize: normalizeFont(16),
    fontFamily: "GilroyBold",
    color: "#FFFFFF",
  },
  btnSecondary: {
    backgroundColor: "#F1F5F9", // Ghost/Secondary slate
  },
  btnTextSecondary: {
    fontSize: normalizeFont(16),
    fontFamily: "GilroyBold",
    color: "#64748B",
  },
});
