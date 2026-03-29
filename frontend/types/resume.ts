export interface Resume {
  id: string;
  name: string;
  time: string;       // e.g. "Edited 2 days ago"
  createdAt: number;  // timestamp
  data: any;          // your resume form data
  thumbnail?: string; // optional base64 or URI
}