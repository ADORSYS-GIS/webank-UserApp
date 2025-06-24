import React from 'react';

export const TestComponent: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', margin: '10px' }}>
      <h3>Test Component</h3>
      <p>This component is imported using the @shared alias</p>
    </div>
  );
};

export default TestComponent;
