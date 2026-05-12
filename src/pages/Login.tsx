import { FormEvent, useCallback, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AlertCircle, Lock, Mail } from "lucide-react";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isAuthenticated, isInitializing } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setError("");
      setMessage("");
      setIsLoading(true);

      try {
        await loginWithGoogle(credential);
        navigate("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google login failed.");
      } finally {
        setIsLoading(false);
      }
    },
    [loginWithGoogle, navigate],
  );

  if (!isInitializing && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="marketplace-surface px-4 pb-16 pt-32">
        <div className="container mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-primary">Secure access</p>
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
              Welcome back to Review Lens.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              Log in to continue comparing e-commerce products, saving insights, and
              using the AI assistant with your account context.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["JWT session handling", "Bcrypt password security", "Google Gmail login", "Verified user accounts"].map(
                (item) => (
                  <div key={item} className="rounded-2xl border border-border bg-white/80 p-4 text-sm font-semibold shadow-sm">
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <Card variant="default" className="shadow-2xl shadow-primary/10">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6">
                <h2 className="font-display text-3xl font-bold">Login</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use your email password or continue with your Google account.
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4" />
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 rounded-2xl border border-primary/20 bg-secondary p-3 text-sm text-primary">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold" htmlFor="login-email">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="pl-10"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-semibold" htmlFor="login-password">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-semibold text-primary hover:underline"
                      onClick={() => setMessage("Forgot password can be connected to the OTP reset flow when email delivery is configured.")}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="pl-10"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold uppercase text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <GoogleAuthButton onCredential={handleGoogleCredential} onError={setError} />

              <p className="mt-6 text-center text-sm text-muted-foreground">
                New to Review Lens?{" "}
                <Link to="/signup" className="font-semibold text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
