/**
 * @file
 * For users that scans username and types password to login.
 */

import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/header';
import Input from '../components/input';
import HelpBox from '../components/help-box';
import Button from '../components/button';
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons';
import PropTypes from 'prop-types';
import { faSignInAlt, faBarcode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BarcodeScanner from '../utils/barcode-scanner';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_LENGTH
} from '../../constants';
import MachineStateContext from '../../context/machine-state-context';
import { FormattedMessage } from 'react-intl';
import QwertyKeyboard from '../utils/qwerty-keyboard';


/**
 * ScanPasswordLogin.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 *
 * @return {*}
 * @constructor
 */
function ScanPasswordLogin({ actionHandler }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [subheader, setSubheader] = useState('Scan dit bibliotekskort');
    const [helpboxText, setHelpboxText] = useState(
        <FormattedMessage id='scan-login-password-usename-help-box-text' defaultMessage='Use the hand scanner to scan the barcode of your library card.' />
    );
    const inputLabel = <FormattedMessage id='scan-login-password-input-label' defaultMessage='Password' />;
    const [usernameScanned, setUsernameScanned] = useState(false);
    const context = useContext(MachineStateContext);
    /**
     * Setup component.
     *
     * Starts barcode scanner listener.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);

        const barcodeCallback = (code) => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_FINISH) {
                    actionHandler('reset');
                }
            } else {
                handleUsernameInput(code);
                setUsername(code);
                setUsernameScanned(true);
                setHelpboxText(<FormattedMessage id='scan-login-password-password-help-box-text' defaultMessage='If you have forgotten your PIN code, you can contact a librarian to get a new one' />);
                setSubheader('Tast dit password');
            }
        };

        barcodeScanner.start(barcodeCallback);

        // Stop scanning when component is unmounted.
        return () => barcodeScanner.stop();
    }, [actionHandler]);

    /**
       * For setting the username
       *
       * @param key
       *   The username.
       */
    function handleUsernameInput(username) {
        setUsername(username);
        setUsernameScanned(true);
        setHelpboxText(<FormattedMessage id='scan-login-password-password-help-box-text' defaultMessage='If you have forgotten your PIN code, you can contact a librarian to get a new one' />);
        setSubheader(<FormattedMessage id='scan-login-password-password-subheader' defaultMessage='Enter your PIN code' />);
    }

    /**
       * Handles numpad  presses.
       *
       * @param key
       *   The pressed button.
       */
    function onInput(key) {
        if (key === '{enter}') {
            login();
        } else {
            key === '{bksp}'
                ? setPassword(password.slice(0, -1))
                : setPassword(`${password}${key}`);
        }
    }

    /**
     * Function to handle when keydown is enter.
     */
    function enterFunction(event) {
        if (event.key === 'Enter' && usernameScanned) {
            return login();
        }
    }

    /**
     * Set up keydown listener.
     */
    useEffect(() => {
        window.addEventListener('keydown', enterFunction);
        return () => window.removeEventListener('keydown', enterFunction);
    }, [password]);

    /**
     * Handles keyboard inputs.
     *
     * @param target
     *    The pressed target.
     */
    function onKeyboardInput({ target }) {
        setPassword(target.value);
    }


    /**
     * Handles login
     *
     * @param target
     *    The pressed target.
     */
    function login() {
        actionHandler('login', {
            username: username,
            password: password
        });
    }

    return (
        <>
            <Header
                header='Login'
                subheader={subheader}
                which='login'
                icon={faSignInAlt}
            />
            <div className='col-md-3'>
                {!usernameScanned && <HelpBox text={helpboxText} />}
            </div>
            <div className='col-md-1' />
            <div className='col-md-6' >
                {!usernameScanned && (
                    <div className='content'>
                        <FontAwesomeIcon icon={faBarcode}/>
                    </div>
                )}
                {usernameScanned && (
                    <Input
                        name='password'
                        label={inputLabel}
                        value={password}
                        onChange={onKeyboardInput}
                        type={password}
                    />
                )}
            </div>
            <div className='col-md-5'>
                {usernameScanned && (context.boxConfig.get.debugEnabled || context.boxConfig.get.hasTouch) &&
                    <QwertyKeyboard
                        handleKeyPress={onInput}
                    />
                }
            </div>
            {context.boxConfig.get.debugEnabled && (
                <div className='col-md'>
                    <Button
                        label={'indtast brugernavn'}
                        icon={faArrowAltCircleRight}
                        handleButtonPress={() => handleUsernameInput('C023648674')} />
                    <Button
                        label={'Snydelogin'}
                        icon={faArrowAltCircleRight}
                        handleButtonPress={() =>
                            actionHandler('login', {
                                username: 'C023648674',
                                password: ''
                            })}
                    />
                </div>
            )}
        </>
    );
}

ScanPasswordLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ScanPasswordLogin;
