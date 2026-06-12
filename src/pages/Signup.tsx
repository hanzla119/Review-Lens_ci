import { FormEvent, useCallback, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Lock, Mail, ShieldCheck, User } from "lucide-react";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/authApi";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password: string) => {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must include one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must include one lowercase letter.";
  if (!/\d/.test(password)) return "Password must include one number.";
  return "";
};

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, isAuthenticated, isInitializing } = useAuth();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validateDetails = () => {
    if (form.name.trim().length < 2) return "Name must be at least 2 characters.";
    if (!isValidEmail(form.email)) return "Please enter a valid email address.";

    const passwordError = validatePassword(form.password);
    if (passwordError) return passwordError;

    if (form.password !== form.confirmPassword) return "Password and confirm password do not match.";

    return "";
  };

  const handleSendOtp = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const validationError = validateDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await authApi.sendOtp(form.email);
      setMessage(response.message);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send verification code.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const validationError = validateDetails();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!/^\d{6}$/.test(form.otp)) {
      setError("Verification code must be exactly 6 digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.verifyOtp(form.email, form.otp);
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setError("");
      setMessage("");
      setIsSubmitting(true);

      try {
        await loginWithGoogle(credential);
        navigate("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google signup failed.");
      } finally {
        setIsSubmitting(false);
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
        <div className="container mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <Card variant="default" className="order-2 shadow-2xl shadow-primary/10 lg:order-1">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6">
                <h1 className="font-display text-3xl font-bold">Create your account</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Signup requires an email verification code before the account is created.
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4" />
                  {error}
                </div>
              )}

              {message && (
                <div className="mb-4 flex items-start gap-2 rounded-2xl border border-primary/20 bg-secondary p-3 text-sm text-primary">
                  <CheckCircle2 className="mt-0.5 h-4 w-4" />
                  <div>
                    <p>{message}</p>
                  </div>
                </div>
              )}

              <div className="mb-6 grid grid-cols-2 gap-3 text-sm font-semibold">
                <div className={`rounded-2xl p-3 ${step === "details" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  1. Account details
                </div>
                <div className={`rounded-2xl p-3 ${step === "otp" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  2. OTP verification
                </div>
              </div>

              <form onSubmit={step === "details" ? handleSendOtp : handleSignup} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold" htmlFor="signup-name">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="M Ahmad Rasheed"
                      className="pl-10"
                      autoComplete="name"
                      disabled={step === "otp"}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold" htmlFor="signup-email">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="you@example.com"
                      className="pl-10"
                      autoComplete="email"
                      disabled={step === "otp"}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold" htmlFor="signup-password">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        value={form.password}
                        onChange={(event) => updateField("password", event.target.value)}
                        placeholder="Strong password"
                        className="pl-10"
                        autoComplete="new-password"
                        disabled={step === "otp"}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold" htmlFor="signup-confirm-password">
                      Confirm password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        value={form.confirmPassword}
                        onChange={(event) => updateField("confirmPassword", event.target.value)}
                        placeholder="Repeat password"
                        className="pl-10"
                        autoComplete="new-password"
                        disabled={step === "otp"}
                      />
                    </div>
                  </div>
                </div>

                {step === "otp" && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold" htmlFor="signup-otp">
                      6-digit verification code
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="signup-otp"
                        value={form.otp}
                        onChange={(event) => updateField("otp", event.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="123456"
                        className="pl-10 tracking-[0.5em]"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  {step === "otp" && (
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("details")}>
                      Edit details
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="flex-1"
                    disabled={isSendingOtp || isSubmitting}
                  >
                    {step === "details"
                      ? isSendingOtp
                        ? "Sending code..."
                        : "Send verification code"
                      : isSubmitting
                        ? "Creating account..."
                        : "Verify & create account"}
                  </Button>
                </div>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold uppercase text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <GoogleAuthButton onCredential={handleGoogleCredential} onError={setError} />

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Login
                </Link>
              </p>
            </CardContent>
          </Card>

          <div className="order-1 lg:order-2">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-primary">Verified signup</p>
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
              Secure user accounts for smarter shopping insights.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              New users verify email with OTP before signup. Google users are checked
              by email first, preventing duplicate accounts while allowing fast Gmail login.
            </p>
            <div className="mt-8 rounded-[2rem] border border-border bg-white p-5 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                {["Duplicate email protection", "Verified Google accounts", "OTP expiry and attempt limits", "JWT-based sessions"].map(
                  (item) => (
                    <div key={item} className="rounded-2xl bg-muted/70 p-4 text-sm font-semibold">
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
