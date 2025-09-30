// Fix: Import React to resolve 'Cannot find namespace 'React'' error.
import React from 'react';

export interface Category {
  id: string;
  name: string;
  prompt: string;
  icon: React.ReactNode;
}
