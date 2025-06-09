import { signOut } from 'aws-amplify/auth';

export default function signout() {
  async function handleSignOut() {
    await signOut()
  }

  handleSignOut();
}
