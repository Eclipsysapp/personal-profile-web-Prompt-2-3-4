"use client";

import Link from "next/link";
import {
  FormEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { firebaseAuth } from "@/lib/firebase";

type Step =
  | "details"
  | "verification"
  | "request"
  | "pending";

type FormData = {
  fullName: string;
  email: string;
  mobile: string;
  relation: string;
  purpose: string;
  howKnow: string;
  message: string;
};

type Visitor = {
  id: number;
  full_name: string;
  email: string;
  mobile: string;
  mobile_verified?: boolean | number;
  status?: string;
};

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

type SecurityContext = Record<
  string,
  string | number | null
>;

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

export default function AccessRequestDemo() {
  const [step, setStep] =
    useState<Step>("details");

  const [visitor, setVisitor] =
    useState<Visitor | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [otpCode, setOtpCode] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [otpStatus, setOtpStatus] =
    useState("");

  const confirmationResultRef =
    useRef<ConfirmationResult | null>(
      null,
    );

  const recaptchaVerifierRef =
    useRef<RecaptchaVerifier | null>(
      null,
    );

  const [form, setForm] =
    useState<FormData>({
      fullName: "Aarav Shah",
      email: "aarav.shah@example.com",
      mobile: "9876543210",

      relation:
        "Professional Contact",

      purpose:
        "Portfolio Review",

      howKnow:
        "We connected through a professional networking platform.",

      message:
        "I would like to review your professional experience, technical skills and selected projects.",
    });

  const stepIndex = {
    details: 1,
    verification: 2,
    request: 3,
    pending: 4,
  }[step];

  /*
  |--------------------------------------------------------------------------
  | Cleanup Firebase reCAPTCHA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      try {
        recaptchaVerifierRef.current?.clear();
      } catch {
        //
      }

      recaptchaVerifierRef.current =
        null;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Register Visitor
  |--------------------------------------------------------------------------
  */

  async function registerVisitor() {
    setLoading(true);
    setError("");

    try {
      const securityContext =
        await getSecurityContext();

      const response = await fetch(
        `${API_URL}/api/visitors`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            full_name:
              form.fullName.trim(),

            email:
              form.email.trim(),

            mobile:
              form.mobile.trim(),

            ...securityContext,
          }),
        },
      );

      const data =
        (await response.json()) as {
          success?: boolean;
          message?: string;
          visitor?: Visitor;
          errors?: Record<
            string,
            string[]
          >;
        };

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(data),
        );
      }

      if (!data.visitor?.id) {
        throw new Error(
          "Visitor was created but visitor ID was not returned.",
        );
      }

      setVisitor(data.visitor);

      setStep("verification");

      setOtpCode("");

      setOtpSent(false);

      setOtpStatus("");
    } catch (caughtError) {
      setError(
        getCaughtErrorMessage(
          caughtError,
          "Unable to register visitor.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Setup Firebase reCAPTCHA
  |--------------------------------------------------------------------------
  */

  async function setupRecaptcha() {
    if (
      recaptchaVerifierRef.current
    ) {
      return recaptchaVerifierRef.current;
    }

    const container =
      document.getElementById(
        "recaptcha-container",
      );

    if (!container) {
      throw new Error(
        "reCAPTCHA container is not available.",
      );
    }

    const verifier =
      new RecaptchaVerifier(
        firebaseAuth,
        "recaptcha-container",
        {
          size: "normal",

          callback: () => {
            setOtpStatus(
              "reCAPTCHA verified. Sending OTP...",
            );
          },

          "expired-callback": () => {
            setOtpStatus(
              "reCAPTCHA expired. Please send OTP again.",
            );
          },
        },
      );

    recaptchaVerifierRef.current =
      verifier;

    await verifier.render();

    return verifier;
  }

  /*
  |--------------------------------------------------------------------------
  | Send Firebase OTP
  |--------------------------------------------------------------------------
  */

  async function sendOtp() {
    if (!visitor) {
      setError(
        "Register the visitor first.",
      );

      return;
    }

    setLoading(true);
    setError("");
    setOtpStatus(
      "Preparing Firebase verification...",
    );

    try {
      const verifier =
        await setupRecaptcha();

      const phoneNumber =
        normalizePhoneForFirebase(
          visitor.mobile,
        );

      const confirmation =
        await signInWithPhoneNumber(
          firebaseAuth,
          phoneNumber,
          verifier,
        );

      confirmationResultRef.current =
        confirmation;

      setOtpSent(true);

      setOtpStatus(
        "OTP sent successfully. Enter the 6-digit code.",
      );
    } catch (caughtError) {
      console.error(
        "Firebase send OTP error:",
        caughtError,
      );

      setError(
        getFirebaseErrorMessage(
          caughtError,
        ),
      );

      setOtpStatus("");

      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Verify Firebase OTP + Laravel
  |--------------------------------------------------------------------------
  */

  async function verifyOtp() {
    if (!visitor) {
      setError(
        "Visitor information is missing.",
      );

      return;
    }

    if (
      !confirmationResultRef.current
    ) {
      setError(
        "Please send OTP first.",
      );

      return;
    }

    const cleanOtp =
      otpCode.replace(/\D/g, "");

    if (cleanOtp.length !== 6) {
      setError(
        "Please enter the complete 6-digit OTP.",
      );

      return;
    }

    setLoading(true);
    setError("");

    setOtpStatus(
      "Verifying Firebase OTP...",
    );

    try {
      /*
       * Firebase confirms the SMS OTP.
       */
      const credentialResult =
        await confirmationResultRef.current.confirm(
          cleanOtp,
        );

      /*
       * Firebase signed-in user now provides
       * the ID token Laravel verifies.
       */
      const idToken =
        await credentialResult.user.getIdToken(
          true,
        );

      setOtpStatus(
        "Firebase verified. Confirming with Laravel...",
      );

      const securityContext =
        await getSecurityContext();

      const response = await fetch(
        `${API_URL}/api/firebase-otp/verify`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            visitor_id:
              visitor.id,

            id_token:
              idToken,

            ...securityContext,
          }),
        },
      );

      const data =
        (await response.json()) as {
          success?: boolean;
          message?: string;
          visitor?: Visitor;
          errors?: Record<
            string,
            string[]
          >;
        };

      if (!response.ok) {
        throw new Error(
          getApiErrorMessage(data),
        );
      }

      if (
        !data.success ||
        !data.visitor
      ) {
        throw new Error(
          data.message ??
            "Laravel OTP verification failed.",
        );
      }

      setVisitor(data.visitor);

      setOtpStatus(
        "Mobile verified successfully.",
      );

      /*
       * Move to real access-request form.
       */
      setStep("request");
    } catch (caughtError) {
      console.error(
        "OTP verification error:",
        caughtError,
      );

      setError(
        getFirebaseErrorMessage(
          caughtError,
        ),
      );

      setOtpStatus("");
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Main Form Submit
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (step === "details") {
      await registerVisitor();

      return;
    }

    if (step === "verification") {
      await verifyOtp();

      return;
    }

    /*
     * /api/access-requests will be
     * connected in the next step.
     */
    if (step === "request") {
      setStep("pending");
    }
  }

  function resetRecaptcha() {
    try {
      recaptchaVerifierRef.current?.clear();
    } catch {
      //
    }

    recaptchaVerifierRef.current =
      null;

    confirmationResultRef.current =
      null;

    setOtpSent(false);
  }

  return (
    <main className="min-h-screen bg-[#f4f6f9] text-[#0b1728]">
      <header className="border-b border-[#e1e6ed] bg-white">
        <div className="mx-auto flex min-h-[78px] w-[min(calc(100%-32px),1180px)] items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#071526] text-sm font-bold text-white shadow-lg shadow-slate-300">
              P
            </span>

            <span>
              <strong className="block text-sm font-bold tracking-[-0.02em]">
                Professional Profile
              </strong>

              <small className="text-[11px] font-medium text-slate-500">
                Secure visitor access
              </small>
            </span>
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
          >
            ← Back to website
          </Link>
        </div>
      </header>

      <div className="border-b border-amber-200 bg-amber-50">
        <div className="mx-auto flex w-[min(calc(100%-32px),1180px)] flex-wrap items-center gap-3 py-2.5 text-xs text-amber-800">
          <span className="rounded bg-amber-100 px-2 py-1 font-bold uppercase tracking-[0.08em]">
            Development
          </span>

          <span>
            Registration and Firebase mobile
            verification use the real backend.
            Access-request submission is the next
            integration step.
          </span>
        </div>
      </div>

      <section className="mx-auto grid w-[min(calc(100%-32px),1180px)] gap-8 py-12 lg:grid-cols-[320px_minmax(0,1fr)] lg:py-16">
        <aside>
          <div className="lg:sticky lg:top-8">
            <span className="text-[10px] font-extrabold tracking-[0.15em] text-blue-600">
              SECURE ACCESS
            </span>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[#071526] lg:text-[44px] lg:leading-[1.06]">
              Request access to the private
              profile.
            </h1>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              Verify your identity and explain
              why you need access. Protected
              profile information becomes
              available only after approval.
            </p>

            <div className="mt-9 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <ProgressItem
                number="01"
                title="Visitor details"
                text="Basic contact information"
                active={stepIndex === 1}
                complete={stepIndex > 1}
              />

              <ProgressItem
                number="02"
                title="Mobile verification"
                text="Firebase phone verification"
                active={stepIndex === 2}
                complete={stepIndex > 2}
              />

              <ProgressItem
                number="03"
                title="Access purpose"
                text="Explain your request"
                active={stepIndex === 3}
                complete={stepIndex > 3}
              />

              <ProgressItem
                number="04"
                title="Review"
                text="Waiting for approval"
                active={stepIndex === 4}
                complete={false}
                last
              />
            </div>

            {visitor && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-emerald-700">
                  Backend visitor
                </p>

                <strong className="mt-2 block text-sm text-emerald-950">
                  Visitor #{visitor.id}
                </strong>

                <p className="mt-1 break-all text-[11px] leading-5 text-emerald-700">
                  {visitor.email}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      Boolean(
                        visitor.mobile_verified,
                      )
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  />

                  {Boolean(
                    visitor.mobile_verified,
                  )
                    ? "Mobile verified"
                    : "Mobile verification pending"}
                </div>
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-[#071526] p-5 text-white">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-[#9fc0ff]">
                  <ShieldIcon />
                </span>

                <div>
                  <strong className="text-xs font-semibold">
                    Privacy protected
                  </strong>

                  <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
                    Access is linked to verified
                    identity, device authorization
                    and time-limited sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,35,60,0.08)]">
            <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold tracking-[0.14em] text-blue-600">
                    VISITOR ACCESS REQUEST
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                    {step === "details" &&
                      "Tell us who you are"}

                    {step === "verification" &&
                      "Verify your mobile number"}

                    {step === "request" &&
                      "Why do you need access?"}

                    {step === "pending" &&
                      "Request submitted"}
                  </h2>
                </div>

                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-500">
                  Step {stepIndex} of 4
                </div>
              </div>
            </div>

            {step !== "pending" ? (
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-8 sm:px-8">
                  {error && (
                    <ErrorBox
                      message={error}
                    />
                  )}

                  {step === "details" && (
                    <VisitorDetails
                      form={form}
                      setForm={setForm}
                    />
                  )}

                  {step ===
                    "verification" && (
                    <MobileVerification
                      visitor={visitor}
                      otpCode={otpCode}
                      setOtpCode={setOtpCode}
                      otpSent={otpSent}
                      otpStatus={otpStatus}
                      loading={loading}
                      onSendOtp={sendOtp}
                    />
                  )}

                  {step === "request" && (
                    <AccessPurpose
                      form={form}
                      setForm={setForm}
                      visitor={visitor}
                    />
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  {step === "details" ? (
                    <p className="text-[11px] leading-5 text-slate-500">
                      Your information will be
                      saved before mobile
                      verification begins.
                    </p>
                  ) : (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => {
                        setError("");

                        if (
                          step ===
                          "verification"
                        ) {
                          setStep("details");
                        } else {
                          setStep(
                            "verification",
                          );
                        }
                      }}
                      className="rounded-lg px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
                    >
                      ← Previous step
                    </button>
                  )}

                  {step === "details" && (
                    <PrimaryButton
                      loading={loading}
                      loadingText="Creating visitor..."
                    >
                      Register & continue
                    </PrimaryButton>
                  )}

                  {step ===
                    "verification" && (
                    <PrimaryButton
                      loading={loading}
                      loadingText="Verifying OTP..."
                      disabled={!otpSent}
                    >
                      Verify OTP & continue
                    </PrimaryButton>
                  )}

                  {step === "request" && (
                    <PrimaryButton
                      loading={loading}
                      loadingText="Submitting..."
                    >
                      Submit access request
                    </PrimaryButton>
                  )}
                </div>
              </form>
            ) : (
              <PendingState
                form={form}
                visitor={visitor}
              />
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniSecurityCard
              title="Mobile verified"
              text="Firebase authentication"
            />

            <MiniSecurityCard
              title="Admin reviewed"
              text="Manual approval"
            />

            <MiniSecurityCard
              title="Time limited"
              text="Secure sessions"
            />
          </div>
        </section>
      </section>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Visitor Details
|--------------------------------------------------------------------------
*/

function VisitorDetails({
  form,
  setForm,
}: {
  form: FormData;

  setForm: React.Dispatch<
    React.SetStateAction<FormData>
  >;
}) {
  return (
    <div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full name"
          required
        >
          <input
            required
            value={form.fullName}
            onChange={(event) =>
              setForm({
                ...form,
                fullName:
                  event.target.value,
              })
            }
            className={inputClass}
            placeholder="Your full name"
          />
        </Field>

        <Field
          label="Email address"
          required
        >
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({
                ...form,
                email:
                  event.target.value,
              })
            }
            className={inputClass}
            placeholder="name@example.com"
          />
        </Field>

        <Field
          label="Mobile number"
          required
        >
          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
            <span className="grid min-w-[62px] place-items-center border-r border-slate-200 bg-slate-50 text-sm font-semibold text-slate-600">
              +91
            </span>

            <input
              required
              inputMode="numeric"
              value={form.mobile}
              onChange={(event) =>
                setForm({
                  ...form,
                  mobile:
                    event.target.value,
                })
              }
              className="min-h-[52px] w-full bg-transparent px-4 text-sm text-slate-900 outline-none"
              placeholder="9876543210"
            />
          </div>
        </Field>

        <Field label="Country">
          <div className="flex min-h-[52px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600">
            <span className="font-semibold">
              IN
            </span>

            India
          </div>
        </Field>
      </div>

      <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-100 font-bold text-blue-600">
            i
          </span>

          <div>
            <strong className="text-xs font-semibold text-slate-900">
              Mobile verification required
            </strong>

            <p className="mt-1 text-[11px] leading-5 text-slate-600">
              After registration, Firebase will
              send an OTP to the exact mobile
              number registered here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Firebase Mobile Verification
|--------------------------------------------------------------------------
*/

function MobileVerification({
  visitor,
  otpCode,
  setOtpCode,
  otpSent,
  otpStatus,
  loading,
  onSendOtp,
}: {
  visitor: Visitor | null;

  otpCode: string;

  setOtpCode:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  otpSent: boolean;

  otpStatus: string;

  loading: boolean;

  onSendOtp: () => Promise<void>;
}) {
  return (
    <div className="mx-auto max-w-xl py-2 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        <PhoneIcon />
      </div>

      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-700">
        ✓ Registration saved
      </div>

      <h3 className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
        Verify {visitor?.mobile}
      </h3>

      {visitor && (
        <p className="mt-2 text-xs font-semibold text-blue-600">
          Visitor #{visitor.id}
        </p>
      )}

      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">
        Firebase Phone Authentication will send
        a six-digit SMS verification code to
        this number.
      </p>

      <div className="mt-7 flex justify-center">
        <button
          type="button"
          disabled={loading}
          onClick={onSendOtp}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-6 text-xs font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && !otpSent
            ? "Preparing OTP..."
            : otpSent
              ? "Resend OTP"
              : "Send OTP"}
        </button>
      </div>

      <div
        id="recaptcha-container"
        className="mt-6 flex min-h-[10px] justify-center"
      />

      {otpStatus && (
        <div className="mx-auto mt-5 max-w-md rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-medium leading-5 text-blue-700">
          {otpStatus}
        </div>
      )}

      <div className="mx-auto mt-7 max-w-md text-left">
        <Field
          label="6-digit verification code"
          required
        >
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            disabled={!otpSent}
            value={otpCode}
            onChange={(event) => {
              setOtpCode(
                event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6),
              );
            }}
            className={`${inputClass} text-center text-xl font-bold tracking-[0.35em] disabled:bg-slate-50 disabled:text-slate-400`}
            placeholder="••••••"
          />
        </Field>
      </div>

      <p className="mt-5 text-[11px] leading-5 text-slate-400">
        OTP verification must match the mobile
        number stored for this visitor.
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Access Purpose
|--------------------------------------------------------------------------
*/

function AccessPurpose({
  form,
  setForm,
  visitor,
}: {
  form: FormData;

  setForm: React.Dispatch<
    React.SetStateAction<FormData>
  >;

  visitor: Visitor | null;
}) {
  return (
    <div className="grid gap-5">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <strong className="text-xs text-emerald-800">
              Mobile verification complete
            </strong>

            <p className="mt-1 text-[11px] text-emerald-700">
              {visitor?.full_name} —{" "}
              {visitor?.mobile}
            </p>
          </div>

          <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
            VERIFIED
          </span>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Your relationship"
          required
        >
          <select
            value={form.relation}
            onChange={(event) =>
              setForm({
                ...form,
                relation:
                  event.target.value,
              })
            }
            className={inputClass}
          >
            <option>
              Professional Contact
            </option>

            <option>
              Recruiter
            </option>

            <option>
              Client
            </option>

            <option>
              Business Contact
            </option>

            <option>
              Friend
            </option>

            <option>
              Other
            </option>
          </select>
        </Field>

        <Field
          label="Purpose of access"
          required
        >
          <select
            value={form.purpose}
            onChange={(event) =>
              setForm({
                ...form,
                purpose:
                  event.target.value,
              })
            }
            className={inputClass}
          >
            <option>
              Portfolio Review
            </option>

            <option>
              Employment Opportunity
            </option>

            <option>
              Business Opportunity
            </option>

            <option>
              Professional Networking
            </option>

            <option>
              Project Discussion
            </option>

            <option>
              Other
            </option>
          </select>
        </Field>
      </div>

      <Field
        label="How do you know me?"
        required
      >
        <textarea
          required
          rows={3}
          value={form.howKnow}
          onChange={(event) =>
            setForm({
              ...form,
              howKnow:
                event.target.value,
            })
          }
          className={`${inputClass} resize-none py-4`}
        />
      </Field>

      <Field label="Additional message">
        <textarea
          rows={5}
          value={form.message}
          onChange={(event) =>
            setForm({
              ...form,
              message:
                event.target.value,
            })
          }
          className={`${inputClass} resize-none py-4`}
        />
      </Field>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs leading-6 text-amber-800">
        Access-request submission is still
        preview-only. Next we will load the real
        relation/purpose categories from Laravel
        and submit this step to{" "}
        <strong>/api/access-requests</strong>.
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Pending Preview
|--------------------------------------------------------------------------
*/

function PendingState({
  form,
  visitor,
}: {
  form: FormData;
  visitor: Visitor | null;
}) {
  return (
    <div className="px-6 py-12 sm:px-8">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-[22px] bg-amber-50 text-amber-600">
          <ClockIcon />
        </div>

        <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-[11px] font-bold text-amber-700">
          Preview only
        </span>

        <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
          Access request preview
        </h3>

        <p className="mt-4 text-sm leading-7 text-slate-500">
          Visitor registration and mobile OTP
          verification are real. Access request
          API integration comes next.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-xl overflow-hidden rounded-2xl border border-slate-200">
        <SummaryRow
          label="Visitor ID"
          value={
            visitor
              ? String(visitor.id)
              : "—"
          }
        />

        <SummaryRow
          label="Visitor"
          value={form.fullName}
        />

        <SummaryRow
          label="Mobile"
          value={
            visitor?.mobile ?? "—"
          }
        />

        <SummaryRow
          label="Mobile status"
          value="Verified"
        />

        <SummaryRow
          label="Purpose"
          value={form.purpose}
          last
        />
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Shared UI
|--------------------------------------------------------------------------
*/

function ProgressItem({
  number,
  title,
  text,
  active,
  complete,
  last = false,
}: {
  number: string;
  title: string;
  text: string;
  active: boolean;
  complete: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[38px_1fr] gap-3 px-5 py-4 ${
        last
          ? ""
          : "border-b border-slate-100"
      } ${
        active
          ? "bg-blue-50/60"
          : ""
      }`}
    >
      <span
        className={`grid h-8 w-8 place-items-center rounded-lg text-[10px] font-bold ${
          complete
            ? "bg-emerald-100 text-emerald-700"
            : active
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {complete
          ? "✓"
          : number}
      </span>

      <div>
        <strong className="block text-xs text-slate-700">
          {title}
        </strong>

        <p className="mt-1 text-[10px] text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold text-slate-600">
        {label}

        {required && (
          <span className="ml-1 text-blue-600">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

function ErrorBox({
  message,
}: {
  message: string;
}) {
  return (
    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
      <strong className="block">
        Something went wrong
      </strong>

      <span className="mt-1 block">
        {message}
      </span>
    </div>
  );
}

function PrimaryButton({
  children,
  loading,
  loadingText,
  disabled = false,
}: {
  children: ReactNode;
  loading: boolean;
  loadingText: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={
        loading || disabled
      }
      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#071526] px-6 text-xs font-bold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-[#122a45] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
    >
      {loading
        ? loadingText
        : children}

      {!loading && (
        <span className="text-base">
          →
        </span>
      )}
    </button>
  );
}

function MiniSecurityCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-600">
        ✓
      </span>

      <div>
        <strong className="block text-[11px] font-semibold text-slate-700">
          {title}
        </strong>

        <span className="text-[10px] text-slate-400">
          {text}
        </span>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-6 bg-white px-5 py-4 text-xs ${
        last
          ? ""
          : "border-b border-slate-100"
      }`}
    >
      <span className="text-slate-400">
        {label}
      </span>

      <strong className="text-right font-semibold text-slate-700">
        {value}
      </strong>
    </div>
  );
}

const inputClass =
  "min-h-[52px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

/*
|--------------------------------------------------------------------------
| Browser / Device / GPS Context
|--------------------------------------------------------------------------
*/

async function getSecurityContext():
  Promise<SecurityContext> {
  const context:
    SecurityContext = {
    browser_name:
      getBrowserName(),

    browser_version:
      getBrowserVersion(),

    device_type:
      getDeviceType(),

    device_os:
      getOperatingSystem(),

    device_fingerprint:
      getDeviceFingerprint(),

    browser_fingerprint:
      getBrowserFingerprint(),

    screen_width:
      window.screen.width,

    screen_height:
      window.screen.height,

    browser_language:
      navigator.language,

    referrer:
      document.referrer || null,

    gps_permission:
      "unknown",

    gps_latitude:
      null,

    gps_longitude:
      null,

    gps_accuracy:
      null,
  };

  if (!navigator.geolocation) {
    context.gps_permission =
      "unsupported";

    return context;
  }

  try {
    if (navigator.permissions) {
      const permission =
        await navigator.permissions.query(
          {
            name: "geolocation",
          },
        );

      context.gps_permission =
        permission.state;
    }
  } catch {
    context.gps_permission =
      "unknown";
  }

  try {
    const position =
      await getCurrentPosition();

    context.gps_latitude =
      position.coords.latitude;

    context.gps_longitude =
      position.coords.longitude;

    context.gps_accuracy =
      position.coords.accuracy;

    context.gps_permission =
      "granted";
  } catch (caughtError) {
    const geolocationError =
      caughtError as GeolocationPositionError;

    if (
      geolocationError?.code === 1
    ) {
      context.gps_permission =
        "denied";
    } else if (
      context.gps_permission ===
      "unknown"
    ) {
      context.gps_permission =
        "unavailable";
    }
  }

  return context;
}

function getCurrentPosition():
  Promise<GeolocationPosition> {
  return new Promise(
    (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy:
            true,

          timeout:
            7000,

          maximumAge:
            60000,
        },
      );
    },
  );
}

function getBrowserName() {
  const ua =
    navigator.userAgent;

  if (ua.includes("Edg/")) {
    return "Edge";
  }

  if (ua.includes("Chrome/")) {
    return "Chrome";
  }

  if (ua.includes("Firefox/")) {
    return "Firefox";
  }

  if (
    ua.includes("Safari/") &&
    !ua.includes("Chrome/")
  ) {
    return "Safari";
  }

  return "Unknown";
}

function getBrowserVersion() {
  const ua =
    navigator.userAgent;

  const match =
    ua.match(
      /(?:Edg|Chrome|Firefox)\/([\d.]+)/,
    ) ??
    ua.match(
      /Version\/([\d.]+).*Safari/,
    );

  return (
    match?.[1] ??
    "Unknown"
  );
}

function getOperatingSystem() {
  const ua =
    navigator.userAgent;

  if (
    ua.includes("Windows")
  ) {
    return "Windows";
  }

  if (
    ua.includes("Android")
  ) {
    return "Android";
  }

  if (
    /iPhone|iPad|iPod/.test(
      ua,
    )
  ) {
    return "iOS";
  }

  if (
    ua.includes("Mac OS")
  ) {
    return "macOS";
  }

  if (
    ua.includes("Linux")
  ) {
    return "Linux";
  }

  return "Unknown";
}

function getDeviceType() {
  return /Mobi|Android|iPhone|iPad/i.test(
    navigator.userAgent,
  )
    ? "mobile"
    : "desktop";
}

function getDeviceFingerprint() {
  return [
    navigator.platform ||
      "unknown",

    window.screen.width,

    window.screen.height,

    window.screen.colorDepth,
  ].join("|");
}

function getBrowserFingerprint() {
  return [
    navigator.userAgent,

    navigator.language,

    navigator.hardwareConcurrency ??
      "unknown",
  ].join("|");
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function normalizePhoneForFirebase(
  mobile: string,
) {
  const digits =
    mobile.replace(/\D/g, "");

  if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    return `+${digits}`;
  }

  if (
    digits.length === 10
  ) {
    return `+91${digits}`;
  }

  if (
    mobile.startsWith("+")
  ) {
    return mobile;
  }

  return `+${digits}`;
}

function getApiErrorMessage(
  data: ApiErrorResponse,
) {
  if (data.errors) {
    const allErrors = Object.values(
      data.errors,
    )
      .flat()
      .filter(Boolean);

    if (allErrors.length > 0) {
      return allErrors.join(" • ");
    }
  }

  return (
    data.message ??
    "Unable to complete the request."
  );
}

function getCaughtErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return fallback;
}

function getFirebaseErrorMessage(
  error: unknown,
) {
  if (
    error instanceof Error
  ) {
    const message =
      error.message;

    if (
      message.includes(
        "auth/invalid-verification-code",
      )
    ) {
      return "The OTP code is incorrect. Please check the code and try again.";
    }

    if (
      message.includes(
        "auth/code-expired",
      )
    ) {
      return "The OTP has expired. Please request a new code.";
    }

    if (
      message.includes(
        "auth/too-many-requests",
      )
    ) {
      return "Too many OTP attempts. Please wait before trying again.";
    }

    if (
      message.includes(
        "auth/invalid-phone-number",
      )
    ) {
      return "Firebase rejected the mobile number format.";
    }

    if (
      message.includes(
        "auth/quota-exceeded",
      )
    ) {
      return "Firebase SMS quota has been exceeded.";
    }

    return message;
  }

  return "Firebase verification failed.";
}

/*
|--------------------------------------------------------------------------
| Icons
|--------------------------------------------------------------------------
*/

function ShieldIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m12 3 7 3v5c0 4.6-2.8 8.2-7 10-4.2-1.8-7-5.4-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="7"
        y="2.5"
        width="10"
        height="19"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M10 18.5h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}