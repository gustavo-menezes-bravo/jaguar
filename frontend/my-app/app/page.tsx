import { redirect } from 'next/navigation';

export default function Page() {
  // Redirects the root URL "/" to "/home"
  redirect('/home');
}
