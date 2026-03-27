// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   FlatList,
//   StatusBar,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { ResumeDraft } from "@/types/resume";
// interface Props {
//   data: ResumeDraft | null;
//   addEducation: (edu: any) => void;
//   updateEducation: (index: number, field: string, value: string | boolean) => void;
//   activeEduExperienceIndex: number;
//   removeEducationExperience: (index: number) => void;
//   nextStep: () => void;
//   prevStep: () => void;
//   step: number;
//   totalSteps: number;
// }

// const months = [
//   { label: "Jan", value: "01" },
//   { label: "Feb", value: "02" },
//   { label: "Mar", value: "03" },
//   { label: "Apr", value: "04" },
//   { label: "May", value: "05" },
//   { label: "Jun", value: "06" },
//   { label: "Jul", value: "07" },
//   { label: "Aug", value: "08" },
//   { label: "Sep", value: "09" },
//   { label: "Oct", value: "10" },
//   { label: "Nov", value: "11" },
//   { label: "Dec", value: "12" },
// ];
// const years = Array.from({ length: 30 }, (_, i) => (2025 - i).toString());

// // ─── Date Picker Modal ───────────────────────────────────────────
// interface DatePickerModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onConfirm: (month: string, year: string) => void;
//   initialMonth?: string;
//   initialYear?: string;
//   title: string;
// }

// const DatePickerModal: React.FC<DatePickerModalProps> = ({
//   visible,
//   onClose,
//   onConfirm,
//   initialMonth = "",
//   initialYear = "",
//   title,
// }) => {
//   const [tab, setTab] = useState<"month" | "year">("month");
//   const [selMonth, setSelMonth] = useState(initialMonth);
//   const [selYear, setSelYear] = useState(initialYear);

//   useEffect(() => {
//     if (visible) {
//       setSelMonth(initialMonth);
//       setSelYear(initialYear);
//       setTab("month");
//     }
//   }, [visible]);

//   const preview =
//     selMonth && selYear
//       ? `${months.find((m) => m.value === selMonth)?.label} ${selYear}`
//       : selMonth
//         ? `${months.find((m) => m.value === selMonth)?.label} —`
//         : selYear
//           ? `— ${selYear}`
//           : "Select month and year";

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={dateStyles.overlay}>
//         <View style={dateStyles.sheet}>
//           <Text style={dateStyles.title}>{title}</Text>

//           {/* Tabs */}
//           <View style={dateStyles.tabRow}>
//             {(["month", "year"] as const).map((t) => (
//               <TouchableOpacity
//                 key={t}
//                 style={[dateStyles.tab, tab === t && dateStyles.tabActive]}
//                 onPress={() => setTab(t)}
//               >
//                 <Text
//                   style={[
//                     dateStyles.tabText,
//                     tab === t && dateStyles.tabTextActive,
//                   ]}
//                 >
//                   {t === "month" ? "Month" : "Year"}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Month Grid */}
//           {tab === "month" && (
//             <View style={dateStyles.grid}>
//               {months.map((m) => (
//                 <TouchableOpacity
//                   key={m.value}
//                   style={[
//                     dateStyles.gridItem,
//                     selMonth === m.value && dateStyles.gridItemActive,
//                   ]}
//                   onPress={() => {
//                     setSelMonth(m.value);
//                     setTab("year");
//                   }}
//                 >
//                   <Text
//                     style={[
//                       dateStyles.gridText,
//                       selMonth === m.value && dateStyles.gridTextActive,
//                     ]}
//                   >
//                     {m.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}

//           {/* Year List */}
//           {tab === "year" && (
//             <ScrollView
//               style={{ maxHeight: 220 }}
//               showsVerticalScrollIndicator={false}
//             >
//               <View style={dateStyles.grid}>
//                 {years.map((item) => (
//                   <TouchableOpacity
//                     key={item}
//                     style={[
//                       dateStyles.gridItem,
//                       selYear === item && dateStyles.gridItemActive,
//                     ]}
//                     onPress={() => setSelYear(item)}
//                   >
//                     <Text
//                       style={[
//                         dateStyles.gridText,
//                         selYear === item && dateStyles.gridTextActive,
//                       ]}
//                     >
//                       {item}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </ScrollView>
//           )}

//           {/* Preview */}
//           <Text style={dateStyles.preview}>{preview}</Text>

//           {/* Buttons */}
//           <View style={dateStyles.btnRow}>
//             <TouchableOpacity style={dateStyles.cancelBtn} onPress={onClose}>
//               <Text style={dateStyles.cancelText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 dateStyles.confirmBtn,
//                 (!selMonth || !selYear) && { opacity: 0.5 },
//               ]}
//               onPress={() => {
//                 onConfirm(selMonth, selYear);
//                 onClose();
//               }}
//               disabled={!selMonth || !selYear}
//             >
//               <Text style={dateStyles.confirmText}>Confirm</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// // ─── Main Component ──────────────────────────────────────────────
// const EducationStep: React.FC<Props> = ({
//   data, addEducation, updateEducation, activeEduExperienceIndex,
//   removeEducationExperience, nextStep, prevStep, step, totalSteps,
// }) => {
//   const edu = data?.education ?? [];

//   useEffect(() => {
//     if (edu.length === 0) {
//       addEducation({
//         institution: "",
//         degree: "",
//         result: "",
//         start_month: "",
//         start_year: "",
//         end_month: "",
//         end_year: "",
//         is_present: false,
//       });
//     }
//   }, []);
//   const safeIndex = Math.min(
//     Math.max(0, activeEduExperienceIndex),
//     Math.max(0, edu.length - 1)
//   );
//   const eduexp = edu[safeIndex] || {};
//   const [localFields, setLocalFields] = useState({
//     institution: eduexp.institution || "",
//     degree: eduexp.degree || "",
//     result: eduexp.result || "",
//   });


//   // Local date state for immediate display
//   // Add local state for immediate display
// // console.log("Eduexp start month",eduexp.start_month);
// // console.log("Eduexp start year",eduexp.start_year);
//   const [startMonth, setStartMonth] = useState(eduexp.start_month || "");
//   const [startYear, setStartYear] = useState(eduexp.start_year || "");
//   const [endMonth, setEndMonth] = useState(eduexp.end_month || "");
//   const [endYear, setEndYear] = useState(eduexp.end_year || "");

// // console.log("Start month state value",startMonth);


//   const getDateLabel = (month: string, year: string) => {
//     if (!month || !year) return "";
//     const monthObj = months.find((m) => m.value === month);
//     return monthObj ? `${monthObj.label} ${year}` : `${month}/${year}`;
//   };

//   const startLabel = getDateLabel(startMonth, startYear);
//   const endLabel = getDateLabel(endMonth, endYear);

//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [isPresent, setIsPresent] = useState<boolean>(eduexp.is_present || false);

//   // When switching which entry we edit, sync date fields from form data
//   // useEffect(() => {
//   //   const e = edu[safeIndex];
//   //   if (!e) return;
//   //   setStartMonth(e.start_month || "");
//   //   setStartYear(e.start_year || "");
//   //   setEndMonth(e.end_month || "");
//   //   setEndYear(e.end_year || "");
//   //   setIsPresent(Boolean(e.is_present));
//   // }, [safeIndex, edu.length]); //  ONLY safeIndex — remove JSON.stringify
//   useEffect(() => {
//     const e = edu[safeIndex];
//     if (!e) return;
//     setLocalFields({
//       institution: e.institution || "",
//       degree: e.degree || "",
//       result: e.result || "",
//     });
//     setStartMonth(e.start_month || "");
//     setStartYear(e.start_year || "");
//     setEndMonth(e.end_month || "");
//     setEndYear(e.end_year || "");
//     setIsPresent(Boolean(e.is_present));
//   }, [safeIndex, edu.length]);

//   const [showStartDate, setShowStartDate] = useState(false);
//   const [showEndDate, setShowEndDate] = useState(false);

//   const update = (field: string, value: string | boolean) =>
//     updateEducation(safeIndex, field, value);
// // console.log(startLabel);
//   // ── Field renderer ──
//   const renderField = (label: string, key: string) => {
//     const value = localFields[key as keyof typeof localFields] ?? "";
//     const isFocused = focusedField === key;
  
//     return (
//       <View style={styles.fieldContainer}>
//         {(value || isFocused) && (
//           <Text style={styles.floatingLabel}>{label.toUpperCase()}</Text>
//         )}
//         <View style={styles.fieldRow}>
//           <TextInput
//             style={styles.fieldInput}
//             placeholder={label}
//             placeholderTextColor="#aaa"
//             value={value}
//             onFocus={() => setFocusedField(key)}
//             onBlur={() => {
//               setFocusedField(null);
//               update(key, value); // ✅ save to draft only on blur
//             }}
//             onChangeText={(val) => {
//               setLocalFields((prev) => ({ ...prev, [key]: val })); // ✅ local update (no re-render from draft)
//             }}
//           />
//           {value && (
//             <Ionicons name="checkmark-circle" size={20} color="#3BBFAD" />
//           )}
//         </View>
//         <View style={[styles.underline, isFocused && styles.underlineFocused]} />
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />

//       {/* ── Navbar ── */}
//       <View style={styles.navbar}>
//         <TouchableOpacity onPress={prevStep} style={styles.leftIcon}>
//           <Ionicons name="arrow-back" size={22} color="#3D405B" />
//         </TouchableOpacity>
//         <View style={styles.centerContent}>
//           <Text style={styles.stepText}>Step {step} of {totalSteps}</Text>
//           <Text style={styles.navTitle}>EDUCATION</Text>
//         </View>
//         <TouchableOpacity style={styles.rightBtn}>
//           <Text style={styles.previewText}>Preview</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Heading */}
//         <Text style={styles.mainHeading}>Tell us about your education</Text>
//         <Text style={styles.subHeading}>
//           {`Include every school, even if you're still there or didn't graduate`}
//         </Text>

//         {/* Fields */}
//         <View style={styles.fieldsBlock}>
//           {renderField("Institution", "institution")}
//           {renderField("Degree", "degree")}
//           {renderField("Result / CGPA", "result")}
//         </View>

//         {/* ── Start Date ── full-width top/bottom borders */}
//         <View style={styles.dateSectionWrapper}>
//           <Text style={styles.dateSectionTitle}>START DATE</Text>
//           <TouchableOpacity
//             style={styles.datePickerRow}
//             onPress={() => setShowStartDate(true)}
//           >
//             <View style={styles.dateValueBlock}>
//               {startLabel ? (
//                 <Text style={styles.dateValue}>{startLabel}</Text>
//               ) : (
//                 <Text style={styles.datePlaceholder}>Select start Date</Text>
//               )}
//             </View>
//             <Ionicons
//               name={startLabel ? "checkmark-circle" : "calendar-outline"}
//               size={20}
//               color={startLabel ? "#3BBFAD" : "#aaa"}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* ── Graduation Date ── */}
//         <View style={[styles.dateSectionWrapper, isPresent && styles.dateSectionDisabled]}>
//           <Text style={styles.dateSectionTitle}>GRADUATION DATE</Text>
//           <TouchableOpacity
//             style={styles.datePickerRow}
//             onPress={() => !isPresent && setShowEndDate(true)}
//             disabled={isPresent}
//           >
//             <View style={styles.dateValueBlock}>
//               {isPresent ? (
//                 <Text style={styles.datePresent}>Present</Text>
//               ) : endLabel ? (
//                 <Text style={styles.dateValue}>{endLabel}</Text>
//               ) : (
//                 <Text style={styles.datePlaceholder}>Select graduation date</Text>
//               )}
//             </View>
//             <Ionicons
//               name={endLabel && !isPresent ? "checkmark-circle" : "calendar-outline"}
//               size={20}
//               color={endLabel && !isPresent ? "#3BBFAD" : "#aaa"}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* ── Present Checkbox ── */}
//         <View style={styles.presentRow}>
//           <TouchableOpacity
//             style={[styles.checkbox, isPresent && styles.checkboxActive]}
//             onPress={() => {
//               const next = !isPresent;
//               setIsPresent(next);
//               if (next) {
//                 setEndMonth("");
//                 setEndYear("");
//                 update("end_month", "");
//                 update("end_year", "");
//               }
//             }}
//           >
//             {isPresent && <Ionicons name="checkmark" size={14} color="#fff" />}
//           </TouchableOpacity>
//           <Text style={styles.presentText}>Currently studying here</Text>
//         </View>

//         <View style={{ height: 100 }} />
//       </ScrollView>

//       {/* ── Continue ── */}
//       <TouchableOpacity style={styles.continueBtn} onPress={nextStep}>
//         <Text style={styles.continueText}>CONTINUE</Text>
//       </TouchableOpacity>

//       {/* ── Date Pickers ── */}

//       <DatePickerModal
//         visible={showStartDate}
//         onClose={() => setShowStartDate(false)}
//         onConfirm={(m, y) => {
//           setStartMonth(m); //  local state updates immediately for display
//           setStartYear(y);
//           update("start_month", m); //  also persist to formData
//           update("start_year", y);
//         }}
//         initialMonth={startMonth}
//         initialYear={startYear}
//         title="Select Start Date"
//       />

//       <DatePickerModal
//         visible={showEndDate}
//         onClose={() => setShowEndDate(false)}
//         onConfirm={(m, y) => {
//           setEndMonth(m); //  local state updates immediately for display
//           setEndYear(y);
//           update("end_month", m);
//           update("end_year", y);
//         }}
//         initialMonth={endMonth}
//         initialYear={endYear}
//         title="Select End Date"
//       />
//     </View>
//   );
// };

// export default EducationStep;

// // ─── Styles ─────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },

//   navbar: {
//     height: 56,
//     backgroundColor: "#F4F1DE",
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   leftIcon: { position: "absolute", left: 20 },
//   rightBtn: { position: "absolute", right: 20 },
//   centerContent: { flex: 1, alignItems: "center" },
//   stepText: { fontSize: 11, color: "#3D405B", fontFamily: "WorkSansRegular" },
//   navTitle: { fontSize: 14, letterSpacing: 1, color: "#3D405B", fontFamily: "WorkSansBold" },
//   previewText: { color: "#3BBFAD", fontSize: 15, fontFamily: "WorkSansSemiBold" },

//   scrollContent: { paddingBottom: 100 },

//   mainHeading: {
//     marginTop: 24,
//     fontSize: 30,
//     color: "#3D405B",
//     fontFamily: "PlayfairDisplayBold",
//     lineHeight: 38,
//     paddingHorizontal: 20,
//   },
//   subHeading: {
//     marginTop: 8,
//     fontSize: 14,
//     color: "#888",
//     fontFamily: "WorkSansRegular",
//     lineHeight: 22,
//     paddingHorizontal: 20,
//     marginBottom: 24,
//   },

//   // Fields block
//   fieldsBlock: { paddingHorizontal: 20 },
//   fieldContainer: { marginBottom: 20 },
//   floatingLabel: {
//     fontSize: 10,
//     fontWeight: "bold",
//     color: "#3D405B",
//     letterSpacing: 0.5,
//     marginBottom: 2,
//     fontFamily: "WorkSansSemiBold",
//   },
//   fieldRow: { flexDirection: "row", alignItems: "center" },
//   fieldInput: { flex: 1, fontSize: 16, color: "#3D405B", paddingVertical: 8, fontFamily: "WorkSansRegular" },
//   underline: { height: 1, backgroundColor: "#ddd", marginTop: 2 },
//   underlineFocused: { height: 1.5, backgroundColor: "#3BBFAD" },

//   // ── Date sections — full width top/bottom borders ──
//   dateSectionWrapper: {
//     borderTopWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: "#eee",
//     backgroundColor: "#fafafa",
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//     marginBottom: 2,
//   },
//   dateSectionDisabled: { opacity: 0.4 },
//   dateSectionTitle: {
//     fontSize: 10,
//     fontFamily: "WorkSansBold",
//     color: "#3D405B",
//     letterSpacing: 1,
//     marginBottom: 8,
//   },
//   datePickerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   dateValueBlock: { flex: 1 },
//   dateValue: { fontSize: 16, color: "#3D405B", fontFamily: "WorkSansRegular" },
//   datePlaceholder: { fontSize: 16, color: "#bbb", fontFamily: "WorkSansRegular" },
//   datePresent: { fontSize: 16, color: "#3BBFAD", fontFamily: "WorkSansSemiBold" },

//   // Present checkbox
//   presentRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     paddingHorizontal: 20,
//     marginTop: 14,
//     gap: 10,
//   },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderWidth: 1.5,
//     borderColor: "#ccc",
//     borderRadius: 4,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   checkboxActive: {
//     backgroundColor: "#3BBFAD",
//     borderColor: "#3BBFAD",
//   },
//   presentText: {
//     fontSize: 14,
//     color: "#3D405B",
//     fontFamily: "WorkSansRegular",
//   },

//   // Continue
//   continueBtn: {
//     position: "absolute",
//     bottom: 24,
//     left: 20,
//     right: 20,
//     backgroundColor: "#3BBFAD",
//     paddingVertical: 18,
//     borderRadius: 32,
//     alignItems: "center",
//   },
//   continueText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//     letterSpacing: 1.5,
//     fontFamily: "WorkSansBold",
//   },
// });

// // ─── DatePicker Styles ───────────────────────────────────────────
// const dateStyles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "flex-end",
//   },
//   sheet: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 24,
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: "bold",
//     color: "#3D405B",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   tabRow: {
//     flexDirection: "row",
//     marginBottom: 16,
//     borderRadius: 8,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   tabActive: { backgroundColor: "#3BBFAD" },
//   tabText: { color: "#888", fontFamily: "WorkSansRegular" },
//   tabTextActive: { color: "#fff", fontFamily: "WorkSansBold" },
//   grid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     justifyContent: "space-between",
//   },
//   gridItem: {
//     width: "30%",
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//     marginBottom: 8,
//   },
//   gridItemActive: { backgroundColor: "#3BBFAD" },
//   gridText: { fontSize: 15, color: "#555" },
//   gridTextActive: { color: "#fff", fontWeight: "bold" },
//   preview: {
//     textAlign: "center",
//     marginTop: 12,
//     fontSize: 14,
//     color: "#3D405B",
//   },
//   btnRow: { flexDirection: "row", gap: 12, marginTop: 20 },
//   cancelBtn: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 30,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     alignItems: "center",
//   },
//   cancelText: { color: "#888" },
//   confirmBtn: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 30,
//     backgroundColor: "#3BBFAD",
//     alignItems: "center",
//   },
//   confirmText: { color: "#fff", fontWeight: "bold" },
// });