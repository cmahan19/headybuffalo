import { login } from "../actions";

const messages: Record<string, string> = {
  password: "Incorrect password.",
  rate: "Too many attempts. Try again in 15 minutes.",
};

export default function LoginForm({ next, error }: { next: string; error?: string }) {
  return (
    <form action={login} className="mt-5 space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "login-error" : undefined}
          className="field mt-1"
        />
      </div>
      {error && messages[error] && (
        <p id="login-error" role="alert" className="text-sm text-hb-error">
          {messages[error]}
        </p>
      )}
      <button type="submit" className="btn-primary w-full">
        Sign in
      </button>
    </form>
  );
}
