import { FarmReportData } from "@/app/types/weather";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

export const useProfileName = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ["profileName", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();

      if (error) throw new Error(error.message);
      return data?.full_name ?? null;
    },
    enabled: !!userId, // only run if we have a userId
  });
};


export const generateFarmCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const addInventoryItem = async (payload: any) => {
  const { data, error } = await supabase
    .from('inventory')
    .insert([payload])
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const addFarmReport = async (report: FarmReportData & { organization_id: string }) => {
  const { data, error } = await supabase
    .from('reports')
    .insert([report])
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const fetchWorkerCount = async (organizationId: string) => {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true }) // head: true prevents returning actual rows
    .eq('organization_id', organizationId)
    .eq('role', 'Farmer'); // Filter by role

  if (error) {
    console.error('Error fetching worker count:', error.message);
    return null;
  }

  return count;
};

export const fetchOrganizationName = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', organizationId)
    .single();

  if (error) {
    console.error('Error fetching organization name:', error.message);
    return null;
  }

  return data.name;
};

export const fetchFarmCode = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('organizations')
    .select('farm_code')
    .eq('id', organizationId)
    .single();

  if (error) {
    console.error('Error fetching farm code:', error.message);
    return null;
  }

  return data.farm_code;
};

export const fetchUserThatUploadedInventory = async (created_by: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('fullname')
    .eq('id', created_by)
    .single();

  if (error) throw error;
  return data.fullname;
};

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = String(date.getFullYear()).slice(2); // Last two digits of year

  return `${day}/${month}/${year}`;
};

export const getProfilePhoto = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('profilePhoto')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data?.profilePhoto || null; // return null if no photo
};

export const fetchInventoryLength = async () => {
  const { count, error } = await supabase
    .from('inventory')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
};

export const fetchInventory = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('organization_id', organizationId)

  if (error) {
    console.error('Error fetching inventory:', error.message);
    return [];
  }

  return data;
};

export const fetchInventoryItems = async (organization_id: string) => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('organization_id', organization_id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const fetchFarmReports = async (organization_id: string) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('organization_id', organization_id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // Convert to 12-hour format

  return `${hours}:${minutes} ${ampm}`;
};

export const pickAndUploadProfilePhoto = async (userId: string) => {
  // 1. Pick an image
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled) return null;

  const uri = result.assets[0].uri;
  const fileExt = uri.split(".").pop();
  // const fileName = `${userId}.${fileExt}`;
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `photos/${fileName}`;

  // 2. Read the file as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // 3. Convert base64 to Uint8Array
  const uint8Array = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  // 4. Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("profile-picture") // 👈 make sure bucket name matches
    .upload(filePath, uint8Array, {
      contentType: `image/${fileExt}`,
      upsert: true,
    });

  if (uploadError) throw uploadError;

  // 5. Get public URL
  const { data } = supabase.storage
    .from("profile-picture")
    .getPublicUrl(filePath);

  // const publicUrl = data.publicUrl;
  const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

  // 6. Save URL to profiles table
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ profilePhoto: publicUrl })
    .eq("id", userId);

  if (updateError) throw updateError;

  return publicUrl;
};

export const getFullNameById = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("fullname")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }

    return data?.fullname || null;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};

