// App.tsx
import { useEffect, useState } from 'react';
import Axios from 'axios';
import Select, { Option } from 'rc-select'; // If you're using rc-select, keep this import
import { HiSwitchHorizontal } from 'react-icons/hi';
import './App.css';

interface CurrencyInfo {
  [currencyCode: string]: number;
}

function App() {
  const [info, setInfo] = useState<CurrencyInfo>({});
  const [input, setInput] = useState<number>(0);
  const [from, setFrom] = useState<string>('usd');
  const [to, setTo] = useState<string>('inr');
  const [options, setOptions] = useState<string[]>([]);
  const [output, setOutput] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`
        );
        setInfo(res.data[from]);
      } catch (error) {
        console.error('Error fetching currency data:', error);
        // Handle error, e.g., display an error message
      }
    };

    fetchData();
  }, [from]);

  useEffect(() => {
    if (Object.keys(info).length > 0) {
      // Check if info is not empty
      setOptions(Object.keys(info));
      convert();
    }
  }, [info]);

  function convert() {
    if (info && info[to]) {
      // Check if info and info[to] exist
      const rate = info[to];
      setOutput(input * rate);
    } else {
      console.error('Conversion rate not available.');
      // Handle the error, e.g., display a message to the user
      setOutput(0); // Or some default value
    }
  }

  function flip() {
    const temp = from;
    setFrom(to);
    setTo(temp);
  }

  // Replace Dropdown with a suitable component.  Here's an example with rc-select:
  const CurrencyDropdown = ({
    value,
    onChange,
    options,
  }: {
    value: string;
    onChange: (value: string) => void;
    options: string[];
  }) => (
    <Select value={value} onChange={onChange}>
      {options.map((option) => (
        <Option key={option} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  );

  return (
    <div className="App">
      <div className="heading">
        <h1>Currency converter</h1>
      </div>
      <div className="container">
        <div className="left">
          <h3>Amount</h3>
          <input
            type="number" // Use type="number" for numeric input
            placeholder="Enter the amount"
            onChange={(e) => setInput(Number(e.target.value) || 0)} // Handle potential NaN
            value={input === 0 ? '' : input} // Display empty string if input is 0
          />
        </div>
        {/* <div> */}
          <div className="middle">
            <h3>From</h3>
            <CurrencyDropdown
              options={options}
              onChange={(value) => setFrom(value)}
              value={from}
            />
          </div>
          <div className="switch">
            <HiSwitchHorizontal size="30px" onClick={flip} />
          </div>
          <div className="right">
            <h3>To</h3>
            <CurrencyDropdown
              options={options}
              onChange={(value) => setTo(value)}
              value={to}
            />
          </div>
        {/* </div> */}
      </div>
      <div className="result">
        <button onClick={convert}>Convert</button>
        <h2>Converted Amount:</h2>
        <p>{`${input} ${from} = ${output.toFixed(2)} ${to}`}</p>{' '}
        {/* Template literals */}
      </div>
    </div>
  );
}

export default App;
