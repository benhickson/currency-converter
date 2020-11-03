import { TextField, Card } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import currencyCodes from '../../lib/currencyCodes';
import getRate from '../../utils/getRate';
import './ConversionForm.scss';

const ConversionForm = () => {

  const [baseValue, setBaseValue] = useState(100);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetValue, setTargetValue] = useState(0);
  const [targetCurrency, setTargetCurrency] = useState('EUR');

  const handleBaseValueChange = evt => {
    setBaseValue(evt.target.value)
  };

  useEffect(() => {
    if (currencyCodes[baseCurrency] && currencyCodes[targetCurrency]) {
      getRate(baseCurrency, targetCurrency).then(rate => {
        setTargetValue((baseValue * rate).toFixed(2));
      });
    } else {
      setTargetValue(0);
    }
  }, [baseCurrency, targetCurrency, baseValue]);

  return (
    <div className="ConversionForm">
      <Card className="materialCard">
        <h2>Ben Hickson's Currency Converter</h2>
        <div>
          <TextField 
            label="Amount" 
            variant="outlined" 
            onChange={handleBaseValueChange}
            type="number"
            value={baseValue}
          />
          <Autocomplete
            value={baseCurrency}
            options={[...Object.keys(currencyCodes), '']}
            renderInput={(params) => <TextField {...params} label="Base Currency" variant="outlined" InputLabelProps={{ shrink: true }} />}
            onInputChange={(event, newInputValue) => setBaseCurrency(newInputValue)}
          />
        </div>
        <div>
          <TextField
            label="Converted Amount"
            variant="outlined"
            value={targetValue}
            InputLabelProps={{ shrink: true }}
          />
          <Autocomplete
            value={targetCurrency}
            options={[...Object.keys(currencyCodes), '']}
            renderInput={(params) => <TextField {...params} label="Target Currency" variant="outlined" InputLabelProps={{ shrink: true }} />}
            onInputChange={(event, newInputValue) => setTargetCurrency(newInputValue)}
          />
        </div>
      </Card>
    </div>
  );
};

export default ConversionForm;
