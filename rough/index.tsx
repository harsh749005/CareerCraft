// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   StatusBar,
//   Modal,
//   Animated,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useState, useRef as useRefReact, useEffect as useEffectReact } from "react";
// import { router } from "expo-router";
// import { useAuth, useUser } from "@clerk/clerk-expo";
// import { v4 as uuidv4 } from "uuid";
// import "react-native-get-random-values"; // must be imported before uuid
// import { useRouter } from "expo-router";

// import { ResumeDraft } from "../../types/resume";
// const { width, height } = Dimensions.get("window");
// const DRAWER_WIDTH = width * 0.78;

// const resumeTemplates: any[] = [];

// export default function Dashboard() {
  
//   const { signOut } = useAuth();
//   const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
//   const [drawerVisible, setDrawerVisible] = useState(false);
//   const slideAnim = useRefReact(new Animated.Value(DRAWER_WIDTH)).current;
//   const backdropAnim = useRefReact(new Animated.Value(0)).current;
//   const { user } = useUser();
  
//   const router = useRouter();
//   const handleCreateResume = () => {
//     const resume_id = uuidv4(); // e.g "a3f9-12bc-..."
//     router.push({
//       pathname: "/BuildResume",
//       params: { resume_id },
//     });
//     console.log("resume_id", resume_id);
//   }
//   // For continuing an existing draft
//   const handleContinueDraft = (draft: ResumeDraft) => {
//     router.push({pathname:"/(root)/BuildResume", params:{ resume_id: draft.resume_id} });
//   };

//   const openDrawer = () => {
//     setDrawerVisible(true);
//     Animated.parallel([
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(backdropAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   const closeDrawer = () => {
//     Animated.parallel([
//       Animated.timing(slideAnim, {
//         toValue: DRAWER_WIDTH,
//         duration: 250,
//         useNativeDriver: true,
//       }),
//       Animated.timing(backdropAnim, {
//         toValue: 0,
//         duration: 250,
//         useNativeDriver: true,
//       }),
//     ]).start(() => setDrawerVisible(false));
//   };

//   const handleSignOut = async () => {
//     closeDrawer();
//     setTimeout(async () => {
//       await signOut();
//       router.replace("/(auth)/OnBoardingScreen");
//     }, 300);
//   };

//   // Get greeting based on time
//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good morning ☀️";
//     if (hour < 17) return "Good afternoon 👋";
//     return "Good evening 🌙";
//   };

//   // Get initials from email or name
//   const getInitials = () => {
//     if (user?.firstName) {
//       return `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase();
//     }
//     if (user?.emailAddresses[0].emailAddress) {
//       return user.emailAddresses[0].emailAddress.slice(0, 2).toUpperCase();
//     }
//     return "CC";
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F4F1DE" />

//       {/* ── Header ── */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.greeting}>{getGreeting()}</Text>
//           <Text style={styles.heading}>My Resumes</Text>
//         </View>
//         {/* ✅ Profile button opens drawer */}
//         <TouchableOpacity style={styles.avatarBtn} onPress={openDrawer}>
//           {user?.firstName === "" ? (
//             <Text style={styles.avatarInitials}>CC</Text>
//           ) : (
//             <Text style={styles.avatarInitials}>{getInitials()}</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* ── Stats row ── */}
//       <View style={styles.statsRow}>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>{resumeTemplates.length}</Text>
//           <Text style={styles.statLabel}>Resumes</Text>
//         </View>
//         <View style={[styles.statCard, { backgroundColor: "#e8f5f2" }]}>
//           <Text style={[styles.statNumber, { color: "#3BBFAD" }]}>0</Text>
//           <Text style={styles.statLabel}>Downloads</Text>
//         </View>
//         <View style={styles.statCard}>
//           <Text style={styles.statNumber}>—</Text>
//           <Text style={styles.statLabel}>Last Edit</Text>
//         </View>
//       </View>

//       {/* ── Section label ── */}
//       <View style={styles.sectionRow}>
//         <Text style={styles.sectionTitle}>Your Documents</Text>
//         {resumeTemplates.length > 0 && (
//           <TouchableOpacity>
//             <Text style={styles.sectionAction}>See all</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* ── Content ── */}
//       <View style={styles.contentArea}>
//         {resumeTemplates.length === 0 ? (
//           <View style={styles.emptyWrapper}>
//             <View style={styles.emptyIllustration}>
//               <View style={styles.emptyDocBig}>
//                 <View style={styles.emptyLine} />
//                 <View style={[styles.emptyLine, { width: "60%" }]} />
//                 <View style={[styles.emptyLine, { width: "80%" }]} />
//                 <View style={[styles.emptyLine, { width: "50%" }]} />
//               </View>
//               <View style={styles.emptyDocSmall}>
//                 <View style={styles.emptyLine} />
//                 <View style={[styles.emptyLine, { width: "70%" }]} />
//               </View>
//               <View style={styles.emptyPlusBadge}>
//                 <Ionicons name="add" size={20} color="#fff" />
//               </View>
//             </View>

//             <Text style={styles.emptyTitle}>No resumes yet</Text>
//             <Text style={styles.emptySubtitle}>
//               Create your first professional resume{"\n"}in just a few minutes
//             </Text>

//             <TouchableOpacity
//               style={styles.emptyCreateBtn}
//               onPress={handleCreateResume}
//               activeOpacity={0.85}
//             >
//               <Ionicons name="add" size={18} color="#fff" style={{ marginRight: 8 }} />
//               <Text style={styles.emptyCreateText}>Create New Resume</Text>
//             </TouchableOpacity>

//             <View style={styles.tipsRow}>
//               {["ATS Friendly", "PDF Export", "AI Powered"].map((tip, i) => (
//                 <View key={i} style={styles.tipChip}>
//                   <Ionicons
//                     name={i === 0 ? "checkmark-circle-outline" : i === 1 ? "document-outline" : "flash-outline"}
//                     size={13}
//                     color="#3BBFAD"
//                   />
//                   <Text style={styles.tipChipText}>{tip}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         ) : (
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             decelerationRate="fast"
//             snapToInterval={width * 0.72 + 20}
//             snapToAlignment="start"
//             contentContainerStyle={styles.scrollContainer}
//           >
//             {resumeTemplates.map((template, index) => {
//               const isSelected = selectedTemplate === index;
//               return (
//                 <TouchableOpacity
//                   key={index}
//                   style={[styles.resumeCard, isSelected && styles.resumeCardSelected]}
//                   onPress={() => setSelectedTemplate(index)}
//                   activeOpacity={0.9}
//                 >
//                   <View style={styles.imageWrapper}>
//                     <Image source={template.image} style={styles.resumeImage} resizeMode="cover" />
//                     <View style={styles.imageOverlay}>
//                       <TouchableOpacity style={styles.overlayBtn}>
//                         <Ionicons name="download-outline" size={18} color="#fff" />
//                       </TouchableOpacity>
//                       <TouchableOpacity style={styles.overlayBtn}>
//                         <Ionicons name="eye-outline" size={18} color="#fff" />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                   <View style={styles.cardFooter}>
//                     <View style={{ flex: 1 }}>
//                       <Text style={styles.cvName} numberOfLines={1}>{template.name}</Text>
//                       <Text style={styles.cvTime}>{template.time}</Text>
//                     </View>
//                     <TouchableOpacity style={styles.moreBtn}>
//                       <Ionicons name="ellipsis-vertical" size={18} color="#888" />
//                     </TouchableOpacity>
//                   </View>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         )}
//       </View>

//       {/* ── Create Button ── */}
//       <TouchableOpacity
//         style={styles.createBtn}
//         onPress={handleCreateResume}
//         activeOpacity={0.88}
//       >
//         <View style={styles.createBtnIcon}>
//           <Ionicons name="add" size={20} color="#3BBFAD" />
//         </View>
//         <Text style={styles.createBtnText}>Create a new resume</Text>
//         <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: "auto" }} />
//       </TouchableOpacity>

//       {/* ── Profile Drawer Modal ── */}
//       <Modal
//         visible={drawerVisible}
//         transparent
//         animationType="none"
//         statusBarTranslucent
//         onRequestClose={closeDrawer}
//       >
//         <View style={styles.modalRoot}>
//           {/* Backdrop */}
//           <Animated.View
//             style={[styles.backdrop, { opacity: backdropAnim }]}
//           >
//             <TouchableOpacity style={{ flex: 1 }} onPress={closeDrawer} />
//           </Animated.View>

//           {/* Drawer sliding from right */}
//           <Animated.View
//             style={[
//               styles.drawer,
//               { transform: [{ translateX: slideAnim }] },
//             ]}
//           >
//             {/* Drawer Header */}
//             <View style={styles.drawerHeader}>
//               <TouchableOpacity onPress={closeDrawer} style={styles.drawerClose}>
//                 <Ionicons name="close" size={22} color="#3D405B" />
//               </TouchableOpacity>
//             </View>

//             {/* Profile Section */}
//             <View style={styles.profileSection}>
//               <View style={styles.profileAvatarLarge}>
//                 {user?.firstName === "" ? (
//                   <Text style={styles.profileAvatarInitials}>CC</Text>
//                 ) : (
//                   <Text style={styles.profileAvatarInitials}>{getInitials()}</Text>
//               )}
//               </View>
//               <Text style={styles.profileName}>
//                 {user?.firstName?.toUpperCase() || "CareerCraft User"}
//               </Text>
//               <Text style={styles.profileEmail}>
//                 {user?.emailAddresses[0].emailAddress || ""}
//               </Text>

//               {/* Verified badge */}
//               {user?.emailAddresses[0].emailAddress && (
//                 <View style={styles.verifiedBadge}>
//                   <Ionicons name="checkmark-circle" size={13} color="#3BBFAD" />
//                   <Text style={styles.verifiedText}>Verified account</Text>
//                 </View>
//               )}
//             </View>

//             {/* Divider */}
//             <View style={styles.drawerDivider} />

//             {/* Stats inside drawer */}
//             <View style={styles.drawerStats}>
//               <View style={styles.drawerStat}>
//                 <Text style={styles.drawerStatNum}>{resumeTemplates.length}</Text>
//                 <Text style={styles.drawerStatLabel}>Resumes</Text>
//               </View>
//               <View style={styles.drawerStatDivider} />
//               <View style={styles.drawerStat}>
//                 <Text style={styles.drawerStatNum}>0</Text>
//                 <Text style={styles.drawerStatLabel}>Downloads</Text>
//               </View>
//             </View>

//             <View style={styles.drawerDivider} />

//             {/* Menu Items */}
//             <View style={styles.menuItems}>
//               {[
//                 { icon: "person-outline",         label: "My Profile",       onPress: () => {} },
//                 { icon: "document-text-outline",  label: "My Resumes",       onPress: closeDrawer },
//                 { icon: "settings-outline",       label: "Settings",         onPress: () => {} },
//                 { icon: "help-circle-outline",    label: "Help & Support",   onPress: () => {} },
//                 { icon: "star-outline",           label: "Rate the App",     onPress: () => {} },
//               ].map((item, i) => (
//                 <TouchableOpacity
//                   key={i}
//                   style={styles.menuItem}
//                   onPress={item.onPress}
//                   activeOpacity={0.7}
//                 >
//                   <View style={styles.menuItemIcon}>
//                     <Ionicons name={item.icon as any} size={18} color="#3D405B" />
//                   </View>
//                   <Text style={styles.menuItemLabel}>{item.label}</Text>
//                   <Ionicons name="chevron-forward" size={16} color="#ccc" style={{ marginLeft: "auto" }} />
//                 </TouchableOpacity>
//               ))}
//             </View>

//             {/* ✅ Sign Out Button */}
//             {user?(
              
//             <View style={styles.drawerFooter}>
//               <TouchableOpacity
//                 style={styles.signOutBtn}
//                 onPress={handleSignOut}
//                 activeOpacity={0.85}
//               >
//                 <View style={styles.signOutIconBox}>
//                   <Ionicons name="log-out-outline" size={18} color="#e07070" />
//                 </View>
//                 <Text style={styles.signOutText}>Sign Out</Text>
//               </TouchableOpacity>

//               {/* App version */}
//               <View style={styles.drawerVersionRow}>
//                 <View style={styles.logoDot} />
//                 <Text style={styles.drawerLogoText}>
//                   Career<Text style={styles.drawerLogoAccent}>Craft</Text>
//                 </Text>
//               </View>
//             </View>
//             ):(<View style={styles.drawerVersionRow}>
//               <View style={styles.logoDot} />
//               <Text style={styles.drawerLogoText}>
//                 Career<Text style={styles.drawerLogoAccent}>Craft</Text>
//               </Text>
//             </View>)}
//           </Animated.View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F4F1DE",
//     paddingTop: 56,
//     paddingHorizontal: 20,
//   },

//   // Header
//   header: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   greeting: {
//     fontSize: 13,
//     color: "#888",
//     fontFamily: "WorkSansRegular",
//     marginBottom: 2,
//   },
//   heading: {
//     fontSize: 28,
//     fontFamily: "PlayfairDisplayBold",
//     color: "#3D405B",
//     lineHeight: 34,
//   },
//   avatarBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: "#3BBFAD",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#fff",
//     shadowColor: "#3BBFAD",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   avatarImage: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//   },
//   avatarInitials: {
//     fontSize: 15,
//     fontFamily: "WorkSansBold",
//     color: "#fff",
//   },

//   // Stats
//   statsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
//   statCard: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     padding: 14,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#e8e4d0",
//   },
//   statNumber: { fontSize: 22, fontFamily: "WorkSansBold", color: "#3D405B", marginBottom: 2 },
//   statLabel:  { fontSize: 11, color: "#888", fontFamily: "WorkSansRegular" },

//   // Section
//   sectionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle:  { fontSize: 15, fontFamily: "WorkSansSemiBold", color: "#3D405B" },
//   sectionAction: { fontSize: 13, color: "#3BBFAD", fontFamily: "WorkSansSemiBold" },

//   contentArea: { flex: 1 },

//   // Empty state
//   emptyWrapper: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 40 },
//   emptyIllustration: { position: "relative", width: 140, height: 140, marginBottom: 28 },
//   emptyDocBig: {
//     position: "absolute", left: 10, top: 10,
//     width: 90, height: 110, backgroundColor: "#fff",
//     borderRadius: 10, padding: 12, gap: 8,
//     borderWidth: 1, borderColor: "#e8e4d0",
//     shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
//   },
//   emptyDocSmall: {
//     position: "absolute", right: 0, bottom: 10,
//     width: 65, height: 75, backgroundColor: "#e8f5f2",
//     borderRadius: 8, padding: 10, gap: 7,
//     borderWidth: 1, borderColor: "#c8e8e0",
//   },
//   emptyLine: { height: 7, width: "100%", backgroundColor: "#f0ede0", borderRadius: 4 },
//   emptyPlusBadge: {
//     position: "absolute", right: 6, top: 6,
//     width: 32, height: 32, borderRadius: 16,
//     backgroundColor: "#3BBFAD", justifyContent: "center", alignItems: "center",
//     shadowColor: "#3BBFAD", shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
//   },
//   emptyTitle:    { fontSize: 22, fontFamily: "PlayfairDisplayBold", color: "#3D405B", marginBottom: 8, textAlign: "center" },
//   emptySubtitle: { fontSize: 14, color: "#888", fontFamily: "WorkSansRegular", textAlign: "center", lineHeight: 22, marginBottom: 28 },
//   emptyCreateBtn: {
//     flexDirection: "row", alignItems: "center",
//     backgroundColor: "#3BBFAD", paddingVertical: 14,
//     paddingHorizontal: 28, borderRadius: 32, marginBottom: 20,
//   },
//   emptyCreateText: { color: "#fff", fontSize: 15, fontFamily: "WorkSansBold" },
//   tipsRow: { flexDirection: "row", gap: 8 },
//   tipChip: {
//     flexDirection: "row", alignItems: "center", gap: 5,
//     backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 6,
//     borderRadius: 20, borderWidth: 1, borderColor: "#e8e4d0",
//   },
//   tipChipText: { fontSize: 11, color: "#3D405B", fontFamily: "WorkSansSemiBold" },

//   // Resume cards
//   scrollContainer:   { paddingBottom: 10, paddingRight: 20, gap: 20 },
//   resumeCard: {
//     width: width * 0.68, backgroundColor: "#fff", borderRadius: 16,
//     overflow: "hidden", borderWidth: 2, borderColor: "transparent",
//     shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
//   },
//   resumeCardSelected: { borderColor: "#3BBFAD" },
//   imageWrapper:  { position: "relative" },
//   resumeImage:   { width: "100%", height: 340 },
//   imageOverlay:  { position: "absolute", bottom: 10, right: 10, flexDirection: "row", gap: 8 },
//   overlayBtn: {
//     width: 36, height: 36, borderRadius: 18,
//     backgroundColor: "rgba(61,64,91,0.75)",
//     justifyContent: "center", alignItems: "center",
//   },
//   cardFooter: {
//     flexDirection: "row", alignItems: "center",
//     padding: 14, borderTopWidth: 1, borderTopColor: "#f0f0f0",
//   },
//   cvName:  { fontSize: 15, fontFamily: "WorkSansSemiBold", color: "#3D405B" },
//   cvTime:  { fontSize: 12, color: "#888", fontFamily: "WorkSansRegular", marginTop: 2 },
//   moreBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#f5f5f5", justifyContent: "center", alignItems: "center" },

//   // Create button
//   createBtn: {
//     flexDirection: "row", alignItems: "center",
//     backgroundColor: "#3BBFAD", paddingVertical: 16,
//     paddingHorizontal: 20, borderRadius: 32, marginBottom: 24, gap: 12,
//   },
//   createBtnIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
//   createBtnText: { color: "#fff", fontSize: 16, fontFamily: "WorkSansBold" },

//   // ── Drawer Modal ──
//   modalRoot: { flex: 1, flexDirection: "row", justifyContent: "flex-end" },

//   backdrop: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.45)",
//   },

//   drawer: {
//     width: DRAWER_WIDTH,
//     height: "100%",
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOffset: { width: -4, height: 0 },
//     shadowOpacity: 0.15,
//     shadowRadius: 20,
//     elevation: 20,
//   },

//   drawerHeader: {
//     height: 56,
//     backgroundColor: "#F4F1DE",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     paddingHorizontal: 20,
//     paddingTop: 8,
//   },
//   drawerClose: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   // Profile section
//   profileSection: {
//     alignItems: "center",
//     paddingVertical: 28,
//     paddingHorizontal: 20,
//     backgroundColor: "#F4F1DE",
//   },
//   profileAvatarLarge: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     backgroundColor: "#3BBFAD",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//     borderWidth: 3,
//     borderColor: "#fff",
//     shadowColor: "#3BBFAD",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   profileAvatarImage: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//   },
//   profileAvatarInitials: {
//     fontSize: 24,
//     fontFamily: "WorkSansBold",
//     color: "#fff",
//   },
//   profileName: {
//     fontSize: 17,
//     fontFamily: "WorkSansBold",
//     color: "#3D405B",
//     marginBottom: 4,
//   },
//   profileEmail: {
//     fontSize: 13,
//     fontFamily: "WorkSansRegular",
//     color: "#888",
//     marginBottom: 8,
//   },
//   verifiedBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     backgroundColor: "#e8f5f2",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 20,
//   },
//   verifiedText: {
//     fontSize: 11,
//     color: "#3BBFAD",
//     fontFamily: "WorkSansSemiBold",
//   },

//   drawerDivider: { height: 1, backgroundColor: "#f0f0f0" },

//   // Drawer stats
//   drawerStats: {
//     flexDirection: "row",
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//   },
//   drawerStat: { flex: 1, alignItems: "center" },
//   drawerStatNum: { fontSize: 20, fontFamily: "WorkSansBold", color: "#3D405B", marginBottom: 2 },
//   drawerStatLabel: { fontSize: 11, color: "#888", fontFamily: "WorkSansRegular" },
//   drawerStatDivider: { width: 1, backgroundColor: "#eee", marginVertical: 4 },

//   // Menu items
//   menuItems: { paddingTop: 8, paddingHorizontal: 16 },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 13,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//     marginBottom: 2,
//     gap: 12,
//   },
//   menuItemIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: "#F4F1DE",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   menuItemLabel: {
//     fontSize: 14,
//     fontFamily: "WorkSansSemiBold",
//     color: "#3D405B",
//   },

//   // Footer
//   drawerFooter: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//     backgroundColor: "#fff",
//   },
//   signOutBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff5f5",
//     borderWidth: 1,
//     borderColor: "#fdd",
//     borderRadius: 14,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     gap: 12,
//     marginBottom: 16,
//   },
//   signOutIconBox: {
//     width: 34,
//     height: 34,
//     borderRadius: 10,
//     backgroundColor: "#ffe8e8",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   signOutText: {
//     fontSize: 15,
//     fontFamily: "WorkSansSemiBold",
//     color: "#e07070",
//   },
//   drawerVersionRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//   },
//   logoDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#3BBFAD",
//   },
//   drawerLogoText: {
//     fontSize: 16,
//     fontFamily: "PlayfairDisplayBold",
//     color: "#3D405B",
//   },
//   drawerLogoAccent: {
//     color: "#3BBFAD",
//     fontFamily: "PlayfairDisplayBold",
//   },
// });