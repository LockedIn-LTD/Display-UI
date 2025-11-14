export type DriverAPI = {
  id: string;
  fullName: string;
  avatarUrl?: string;
};

export type FirestoreDriver = {
  name?: string;
  profilePic?: string;
  phone_number?: string;
  productId?: number;
  userId?: string | null;
};

export type UserAPI = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
};

export type FirestoreUser = {
  name?: string;
  email?: string;
  password?: string; 
  phoneNumber?: string;
  userId?: string;   
};

export type EventAPI = {
  id: string;
  driverId: string;
  status?: string;
  heartRate?: number;
  bloodOxygenLevel?: number;
  vehicleSpeed?: number;
  date?: string;       
  time?: string;     
  timestampMs?: number; 
  videoUrl?: string;
};

export type FirestoreEvent = {
  driverId?: string;
  eventId?: string;
  status?: string;
  heartRate?: number;
  bloodOxygenLevel?: number;
  vehicleSpeed?: number;
  date?: string;       
  timeStamp?: string; 
  videoLink?: string;
};
