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
    .from('inventory')
    .select('fullname')
    .eq('id', created_by)
    .single();

  if (error) throw error;
  return data.fullname

}
