"use client";

import {
  Alert,
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  type TextFieldRootProps,
} from "@heroui/react";
import { useActionState } from "react";
import { login, register, requestOtp, verifyOtp, type FormState } from "./actions";

const initial: FormState = {};
const formClass = "flex flex-col gap-4";

function Field({
  label,
  ltr,
  ...props
}: { label: string; ltr?: boolean } & TextFieldRootProps) {
  return (
    // The key remounts the field so a value returned by the action shows up after React clears the form.
    <TextField key={props.defaultValue} isRequired fullWidth {...props}>
      <Label>{label}</Label>
      <Input dir={ltr ? "ltr" : undefined} />
      {/* The browser's own messages follow its language, which is often English. */}
      <FieldError>
        {({ validationDetails }) =>
          validationDetails.valueMissing
            ? "این فیلد را پر کن."
            : validationDetails.tooShort
              ? "مقدار واردشده کوتاه است."
              : "مقدار واردشده معتبر نیست."
        }
      </FieldError>
    </TextField>
  );
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" fullWidth isPending={pending}>
      {children}
    </Button>
  );
}

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Alert status="danger" role="alert">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Description>{message}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}

const identifierProps = {
  label: "ایمیل یا شماره موبایل",
  name: "identifier",
  autoComplete: "username",
  ltr: true,
};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);
  return (
    <Form action={action} className={formClass}>
      <Field {...identifierProps} defaultValue={state.values?.identifier} />
      <Field
        label="رمز عبور"
        name="password"
        type="password"
        autoComplete="current-password"
        ltr
      />
      <ErrorText message={state.error} />
      <Submit pending={pending}>ورود</Submit>
    </Form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, initial);
  return (
    <Form action={action} className={formClass}>
      <Field
        label="نام و نام خانوادگی"
        name="name"
        autoComplete="name"
        defaultValue={state.values?.name}
      />
      <Field {...identifierProps} defaultValue={state.values?.identifier} />
      <Field
        label="رمز عبور"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        ltr
      />
      <ErrorText message={state.error} />
      <Submit pending={pending}>ثبت‌نام</Submit>
    </Form>
  );
}

export function OtpForm() {
  const [requested, requestAction, requesting] = useActionState(requestOtp, initial);
  const [verified, verifyAction, verifying] = useActionState(verifyOtp, initial);
  const sentTo = verified.otpSentTo ?? requested.otpSentTo;

  if (!sentTo) {
    return (
      <Form action={requestAction} className={formClass}>
        <Field {...identifierProps} />
        <ErrorText message={requested.error} />
        <Submit pending={requesting}>دریافت کد</Submit>
      </Form>
    );
  }

  return (
    <Form action={verifyAction} className={formClass}>
      <input type="hidden" name="identifier" value={sentTo} />
      <p className="text-sm text-muted">اگر حسابی با این مشخصات باشد، کد برایش ارسال شد.</p>
      <Field
        label="کد یک‌بارمصرف"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        ltr
      />
      <ErrorText message={verified.error} />
      <Submit pending={verifying}>تأیید و ورود</Submit>
    </Form>
  );
}
