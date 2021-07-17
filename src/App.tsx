import React, { useEffect, useState } from "react";
import "./index.css";

export default () => {
  var foo: number = 0;
  const [count, setCount] = useState(foo);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times you beast</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
};
