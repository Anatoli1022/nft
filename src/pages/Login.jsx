import { useState } from 'react';

import FormIssuer from '../components/pages/login/formIssuer/FormIssuer';
import FormVerifier from '../components/pages/login/formVerifier/FormVerifier';
import FormConsumer from '../components/pages/login/formConsumer/FormConsumer';
import ButtonsList from '../components/pages/login/buttonsList/ButtonsList';
import SearchToken from '../components/pages/login/searchToken/SearchToken';

const Login = () => {
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

export default Login;
