// components/ResumeActionModal.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ── Rename Modal ──────────────────────────────────────────────────────────────
interface RenameModalProps {
  visible: boolean;
  currentName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function RenameModal({
  visible,
  currentName,
  onSave,
  onCancel,
}: RenameModalProps) {
  // Use a ref for the input value to avoid re-render on every keystroke
  const [value, setValue] = useState("");
  const inputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Only set value when modal opens — not on every render
  useEffect(() => {
    if (visible) {
      setValue(currentName);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 250,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Focus AFTER animation to prevent flicker
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    } else {
      scaleAnim.setValue(0.92);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    inputRef.current?.blur();
    onSave(trimmed);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={onCancel}>
          <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.cardTitle}>Rename</Text>
          <Text style={styles.cardSub}>
            {`Use your name and the job title{"\n"}you're applying to.`}
          </Text>

          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>CV NAME</Text>
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={value}
                onChangeText={setValue}
                // NO autoFocus here — we focus manually after animation
                selectTextOnFocus
                returnKeyType="done"
                onSubmitEditing={handleSave}
                blurOnSubmit={false}
              />
              {value.trim().length > 0 && (
                <Ionicons name="checkmark" size={18} color="#3BBFAD" />
              )}
            </View>
            <View style={styles.inputUnderline} />
          </View>

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              !value.trim() && styles.primaryBtnDisabled,
            ]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={!value.trim()}
          >
            <Text style={styles.primaryBtnText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textBtn}
            onPress={onCancel}
            activeOpacity={0.6}
          >
            <Text style={styles.textBtnText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
interface DeleteModalProps {
  visible: boolean;
  resumeName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({
  visible,
  resumeName,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 250,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.92);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onCancel}>
          <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.deleteIconBox}>
            <Ionicons name="trash-outline" size={28} color="#e07070" />
          </View>

          <Text style={styles.cardTitle}>Delete Resume</Text>
          <Text style={styles.cardSub}>
            Are you sure you want to delete{"\n"}
            <Text style={styles.cardSubBold}>{`"${resumeName}"`}</Text>
            {"?\n"}This cannot be undone.
          </Text>

          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={onConfirm}
            activeOpacity={0.85}
          >
            <Ionicons
              name="trash-outline"
              size={16}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.dangerBtnText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textBtn}
            onPress={onCancel}
            activeOpacity={0.6}
          >
            <Text style={styles.textBtnText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 16,
  },
  deleteIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ffe8e8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "PlayfairDisplayBold",
    color: "#3D405B",
    marginBottom: 10,
    textAlign: "center",
  },
  cardSub: {
    fontSize: 14,
    fontFamily: "WorkSansRegular",
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  cardSubBold: {
    fontFamily: "WorkSansSemiBold",
    color: "#3D405B",
  },
  inputBlock: {
    width: "100%",
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 10,
    fontFamily: "WorkSansBold",
    color: "#aaa",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#3D405B",
    paddingVertical: 4,
  },
  inputUnderline: {
    height: 1.5,
    backgroundColor: "#3BBFAD",
    marginTop: 8,
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: "#3BBFAD",
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnDisabled: {
    backgroundColor: "#a8ddd7",
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "WorkSansBold",
    color: "#fff",
  },
  dangerBtn: {
    width: "100%",
    backgroundColor: "#e07070",
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  dangerBtnText: {
    fontSize: 16,
    fontFamily: "WorkSansBold",
    color: "#fff",
  },
  textBtn: {
    paddingVertical: 10,
  },
  textBtnText: {
    fontSize: 15,
    fontFamily: "WorkSansRegular",
    color: "#aaa",
  },
});