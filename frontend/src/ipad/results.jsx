import React from 'react';
import PropTypes from 'prop-types';

const Results = ({ className }) => {
  return (
    <div>
      <h1>Ipad Results page</h1>
    </div>
  );
};

Results.propTypes = {
  className: PropTypes.string,
};

Results.defaultProps = {
  className: '',
};

export default Results;
