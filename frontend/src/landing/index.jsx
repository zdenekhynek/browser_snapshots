import React from 'react';
import PropTypes from 'prop-types';

const Landing = ({ className }) => {
  return (
    <div>
      <h1>Landing page</h1>
    </div>
  );
};

Landing.propTypes = {
  className: PropTypes.string,
};

Landing.defaultProps = {
  className: '',
};

export default Landing;
