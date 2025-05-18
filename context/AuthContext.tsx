import { RootStackParamList } from '@/app/(tabs)/inventory';
import { supabase } from '@/lib/supabase';
import paths from '@/utils/paths';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  role: string;
  fullname: string;
  farm_name?: string;
  farm_address?: string;
  farm_code?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
  }, [user]);



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
      farm_name: profileData.farm_name || '',
      farm_address: profileData.farm_address || '',
      farm_code: profileData.farm_code || '',
    };

    await AsyncStorage.setItem('user_profile', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user_profile');
    await supabase.auth.signOut();
    navigation.navigate(paths.auth.login as never)
    console.log("user_profile removed")
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
