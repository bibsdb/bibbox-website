/**
 * @file
 * Component for starting a login session.
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Bubble from './components/bubble';
import HelpBox from './components/help-box';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import {
    ChangeLoginMethodPickLoginMethodHeader,
    ChangeLoginMethodTimeoutMessage,
    ChangeLoginMethodHelpBoxHeader,
    ChangeLoginMethodHelpBoxMainText,
    ChangeLoginMethodStartHere,
    ChangeLoginMethodUsernamePassword,
    ChangeLoginMethodUsername
} from './utils/formatted-messages';
import MachineStateContext from './utils/machine-state-context';
import Header from './components/header';

/**
 * Change login method.
 *
 * Component for starting a login session.
 *
 * @return {*}
 * @constructor
 */
function ChangeLoginMethod({ actionHandler }) {
    const context = useContext(MachineStateContext);
    const { loginSessionMethods, loginSessionTimeout } = context.boxConfig.get;
    const components = [];

    if (loginSessionMethods.includes('login_barcode_password')) {
        components.push({
            type: 'loginScanUsernamePassword',
            label: loginSessionMethods.length > 1 ? ChangeLoginMethodUsernamePassword : ChangeLoginMethodStartHere
        });
    }

    if (loginSessionMethods.includes('login_barcode')) {
        components.push({
            type: 'loginScanUsername',
            label: loginSessionMethods.length > 1 ? ChangeLoginMethodUsername : ChangeLoginMethodStartHere
        });
    }

    /**
     * Handle scanned items.
     *
     * @param loginMethod
     */
    function handleChangeLoginMethod(loginMethod) {
        actionHandler('selectLoginMethod', {
            loginMethod: loginMethod
        });
    }

    const styling = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "100%",
        margin: "2em"
    };

    const getHelpBoxText = () => {
        return (
            <>
                {ChangeLoginMethodTimeoutMessage(loginSessionTimeout)}
                <br/>
                <br/>
                <b>{ChangeLoginMethodHelpBoxMainText}</b>
            </>
        );
    }

    return (
        <>
            <Header
                header={ChangeLoginMethodPickLoginMethodHeader}
                type='login'
                icon={faSignInAlt}
            />
            <div style={styling}>
                <HelpBox header={ChangeLoginMethodHelpBoxHeader} text={getHelpBoxText()} style={{marginLeft: "2em"}}/>
                {components.map((component) => (
                    <div key={component.type} style={{minWidth: "300px", margin: "3em"}}>
                        <Bubble
                            type={component.type}
                            label={component.label}
                            onlyText={true}
                            disabled={component.disabled}
                            onClick={() => {
                                handleChangeLoginMethod(component.type);
                            }}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

ChangeLoginMethod.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ChangeLoginMethod;
