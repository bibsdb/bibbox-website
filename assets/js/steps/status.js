/**
 * @file
 * The status component displays the status from the machinestate for the user.
 */

import React, { useContext, useEffect } from 'react';
import BannerList from './components/banner-list';
import Header from './components/header';
import MachineStateContext from './utils/machine-state-context';
import BarcodeScanner from './utils/barcode-scanner';
import PropTypes from 'prop-types';
import {
    adaptListOfBooksWithMessage,
    adaptListOfBooksWithSuccess,
    adaptListOfBooks
} from './utils/banner-adapter';
import {
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import {
    StatusHeader,
    StatusSubheader,
    StatusHeaderCurrentLoans,
    StatusHeaderReservations,
    StatusHeaderReadyForPickup,
    StatusBannerHeaderFinedBook,
    StatusBannerHeaderOverdueBook,
    StatusHeaderPrint
} from './utils/formattedMessages';
import BarcodeHandler from './utils/barcode-handler';
import { ACTION_CHANGE_FLOW_CHECKIN, ACTION_CHANGE_FLOW_CHECKOUT, ACTION_PRINT, ACTION_RESET } from '../constants';

/**
 * Status.
 *
 * @param actionHandler
 *   As the state can only be changed by the state machine, the actionHandler
 *   calls the state machine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function Status({ actionHandler }) {
    const context = useContext(MachineStateContext);

    /**
     * Set up barcode scanner listener.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner();
        const barcodeCallback = (new BarcodeHandler([
            ACTION_CHANGE_FLOW_CHECKIN, ACTION_CHANGE_FLOW_CHECKOUT, ACTION_RESET, ACTION_PRINT
        ], actionHandler)).createCallback();

        barcodeScanner.start(barcodeCallback);
        return () => { barcodeScanner.stop(); };
    }, [actionHandler]);

    const loanedItems = [
        ...adaptListOfBooksWithMessage(
            context.machineState.get.fineItems,
            StatusBannerHeaderFinedBook
        ),
        ...adaptListOfBooksWithMessage(
            context.machineState.get.overdueItems,
            StatusBannerHeaderOverdueBook
        ),
        ...adaptListOfBooksWithMessage(
            context.machineState.get.recallItems,
            StatusBannerHeaderOverdueBook
        ),
        ...adaptListOfBooks(context.machineState.get.chargedItems)
    ];

    const holdItems = adaptListOfBooksWithSuccess(
        context.machineState.get.holdItems
    );

    const unavailableHoldItems = adaptListOfBooks(
        context.machineState.get.unavailableHoldItems
    );

    return (
        <>
            <Header
                header={StatusHeader}
                subheader={StatusSubheader}
                type='status'
                icon={faInfoCircle}
            />
            <div className='status-container'>
                <h1>{StatusHeaderPrint}</h1>
                <div className='col-md-4 mt-4'>
                    <BannerList title={StatusHeaderCurrentLoans} items={loanedItems} visibleOnPrint={true} />
                </div>
                <div className='col-md-4 mt-4'>
                    <BannerList
                        title={StatusHeaderReservations}
                        items={unavailableHoldItems}
                        visibleOnPrint={true}
                    />
                </div>
                <div className='col-md-4 mt-4'>
                    <BannerList
                        title={StatusHeaderReadyForPickup}
                        items={holdItems}
                        visibleOnPrint={true}
                    />
                </div>
            </div>
        </>
    );
}

Status.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default Status;
