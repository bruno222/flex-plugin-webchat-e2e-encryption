import React from 'react';
import PropTypes from 'prop-types';
import {encrypt, decrypt, generateKeyPair} from '../nacl'
import { box, randomBytes } from 'tweetnacl';

import { CustomTaskListComponentStyles } from './CustomTaskList.Styles';

// It is recommended to keep components stateless and use redux for managing states
const CustomTaskList = (props) => {
  if (!props.isOpen) {
    return null;
  }

  const obj = { hello: 'world' };
  const pairA = generateKeyPair();
  const pairB = generateKeyPair();
  const sharedA = box.before(pairB.publicKey, pairA.secretKey);
  const sharedB = box.before(pairA.publicKey, pairB.secretKey);
  const encrypted = encrypt(sharedA, obj);
  const decrypted = decrypt(sharedB, encrypted);
  console.log(obj, encrypted, decrypted);
  console.log(sharedA, sharedB)
  return (
    <CustomTaskListComponentStyles>
    This is a dismissible demo component
    <i className="accented" onClick={props.dismissBar} aria-hidden="true">
    close
    </i>
    </CustomTaskListComponentStyles>
  );
};

CustomTaskList.displayName = 'CustomTaskList';

CustomTaskList.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  dismissBar: PropTypes.func.isRequired,
};

export default CustomTaskList;
