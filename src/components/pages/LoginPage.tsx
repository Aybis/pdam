import LoginForm from '../organisms/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
