import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Stethoscope, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) navigate("/");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) navigate("/");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Account created! You can now log in.");
      }
    } catch (error: any) {
      if (error.message?.includes("already registered")) {
        toast.error("This email is already registered. Try logging in.");
      } else if (error.message?.includes("Invalid login")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <h1 className="sr-only">NEET 2026 Login</h1>

      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-3 rounded-xl gradient-primary shadow-glow w-fit">
            <Stethoscope className="h-8 w-8 text-primary-foreground" />
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-foreground">
              {isLogin ? "NEET 2026 Login" : "Create NEET Tracker Account"}
            </div>
            <CardDescription>
              {isLogin
                ? "Sign in to sync your NEET study tracker across devices and keep your daily routine consistent."
                : "Create an account to save your NEET daily tasks, study hours, coaching attendance, and revision plan."}
            </CardDescription>
            <p className="text-xs text-muted-foreground">
              This page helps NEET aspirants stay consistent by securely saving progress and keeping preparation organized.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-primary hover:underline font-medium"
                disabled={loading}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          <p className="mt-4 text-xs text-center text-muted-foreground">Sign in to sync your data across devices</p>
        </CardContent>
      </Card>
    </main>
  );
};

export default Auth;
