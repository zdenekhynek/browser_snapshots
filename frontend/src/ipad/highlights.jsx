import React from 'react';
import PropTypes from 'prop-types';

const Highlights = ({ className }) => {
  return (
    <div>
      <h1>Ipad Highlights page</h1>
    </div>
  );
};

Highlights.propTypes = {
  className: PropTypes.string,
};

Highlights.defaultProps = {
  className: '',
};

export default Highlights;
