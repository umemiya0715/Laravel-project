import React from 'react';
import { createRoot } from 'react-dom/client';
import Calendar from './Calendar';

const container = document.getElementById('app');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(
  // <React.StrictMode>
    <div className="text-red">
        <Calendar />
    </div>
// </React.StrictMode>,
);
