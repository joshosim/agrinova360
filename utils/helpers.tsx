import { supabase } from "@/lib/supabase";

export const generateFarmCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
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

export const fetchInventoryLength = async () => {
  const { count, error } = await supabase
    .from('inventory')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  return count || 0;
};

// export const formatDateTime = (isoString: string): string => {
//   const date = new Date(isoString);

//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
//   const year = String(date.getFullYear()).slice(2); // Last two digits of year

//   let hours = date.getHours();
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   const ampm = hours >= 12 ? 'PM' : 'AM';

//   hours = hours % 12 || 12; // Convert to 12-hour format

//   return `${day}/${month}/${year} \n ${hours}:${minutes} ${ampm}`;
// };
