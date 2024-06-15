import { useState } from 'react';

import FormIssuer from '../components/pages/tokens/formIssuer/FormIssuer';
import FormVerifier from '../components/pages/tokens/formVerifier/FormVerifier';
import FormConsumer from '../components/pages/tokens/formConsumer/FormConsumer';
import ButtonsList from '../components/pages/tokens/buttonsList/ButtonsList';
import SearchToken from '../components/pages/tokens/searchToken/SearchToken';

const Tokens = () => {
  const [showForm, setShowForm] = useState('issuer');

  const toggleForm = (form) => {
    setShowForm(form);
  };
  return (
    <div className={'container'}>
      <ButtonsList toggleForm={toggleForm} showForm={showForm} />
      {showForm === 'issuer' ? <FormIssuer /> : null}
      {showForm === 'verifier' ? <FormVerifier /> : null}
      {showForm === 'consumer' ? <FormConsumer /> : null}
      {showForm === 'searchToken' ? <SearchToken /> : null}
    </div>
  );
};

export default Tokens;
