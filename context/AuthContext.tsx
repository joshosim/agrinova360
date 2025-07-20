import { RootStackParamList } from '@/app/(tabs)/inventory';
import { supabase } from '@/lib/supabase';
import { generateFarmCode } from '@/utils/helpers';
import paths from '@/utils/paths';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  role: 'Manager' | 'Farmer';
  phone: string;
  fullname: string;
  organization_id?: string;
  organization_name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signupAsManager: (email: string, password: string, fullname: string, orgName: string, phone: string, farmAddress: string) => Promise<void>;
  signupAsFarmer: (email: string, password: string, fullname: string, farmCode: string, phone: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()


  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await AsyncStorage.getItem('user_profile');
        if (profile) {
          setUser(JSON.parse(profile));
        }
      }

      setLoading(false);
    };

    loadUser();

    // Optional: Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        AsyncStorage.removeItem('user_profile');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);


  const signupAsManager = async (email: string, password: string, fullname: string, farmName: string, phone: string, farmAddress: string) => {
    setLoading(true)
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;
    const userId = authData.user?.id;
    if (!userId) throw new Error("Failed to get user ID after sign-up");

    // 1. Create organization
    const farmCode = generateFarmCode();
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: farmName, farm_code: farmCode, address: farmAddress })
      .select()
      .single();

    if (orgError) throw orgError;

    // 2. Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      email,
      fullname,
      phone,
      role: 'Manager',
      organization_id: orgData.id,
    });

    if (profileError) throw profileError;

    const userData: User = {
      id: userId,
      email,
      fullname,
      phone,
      role: 'Manager',
      organization_id: orgData.id,
      organization_name: orgData.name,
    };

    await AsyncStorage.setItem('user_profile', JSON.stringify(userData));
    setLoading(false)
    setUser(userData);

  };

  const signupAsFarmer = async (
    email: string,
    password: string,
    fullname: string,
    phone: string,
    farmCode: string,
  ) => {
    // 1. Find the organization by farm_code
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('farm_code', farmCode)
      .single();

    if (orgError || !orgData) throw new Error('Invalid farm code');

    // 2. Create auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    const userId = authData.user?.id;
    if (!userId) throw new Error('User ID not returned after sign-up');

    // 3. Create profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      email,
      fullname,
      phone,
      role: 'Farmer',
      organization_id: orgData.id,
    });

    if (profileError) throw profileError;

    const userData: User = {
      id: userId,
      email,
      fullname,
      phone,
      role: 'Farmer',
      organization_id: orgData.id,
      organization_name: orgData.name,
    };

    await AsyncStorage.setItem('user_profile', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const userId = data.user.id;

    // Fetch user profile from your DB
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    const userData: User = {
      id: userId,
      email,
      role: profileData.role,
      fullname: profileData.fullname,
      phone: profileData.phone,
      organization_id: profileData.organization_id
    };

    await AsyncStorage.setItem('user_profile', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user_profile');
    await supabase.auth.signOut();
    console.log(paths.auth.login)
    navigation.navigate(paths.auth.login as never)
    console.log("user_profile removed", user)
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signupAsFarmer, signupAsManager, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
