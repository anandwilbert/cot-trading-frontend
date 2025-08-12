import * as React from 'react';
import Typography from '@mui/material/Typography';
import { auth } from '../../auth';

export default async function HomePage() {
  const session = await auth();

  return <Typography variant="h6">Welcome to Traders Club, {session?.user?.name || 'User'}!</Typography>;
}
