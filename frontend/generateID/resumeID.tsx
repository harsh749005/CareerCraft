// // Dashboard.tsx
// import { v4 as uuidv4 } from "uuid";
// import "react-native-get-random-values"; // must be imported before uuid
// import { useNavigation } from "@react-navigation/native";
// const navigation = useNavigation();

// const handleCreateResume = () => {
//   const resume_id = uuidv4(); // e.g "a3f9-12bc-..."
//   navigation.navigate("BuildResume", { resume_id });
// };

// // For continuing an existing draft
// const handleContinueDraft = (draft: ResumeDraft) => {
//   navigation.navigate("BuildResume", { resume_id: draft.resume_id });
// };