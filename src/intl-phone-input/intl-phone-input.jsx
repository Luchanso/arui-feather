/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';

import Input from '../input/input';
import Select from '../select/select';

import cn from '../cn';
import performance from '../performance';

const MAX_DIAL_CODE_LENGTH = 4;

/**
 * Компонент ввода международного телефона по маске.
 *
 */
@cn('intl-phone-input', Input, Select)
@performance()
class IntlPhoneInput extends React.Component {
    static propTypes = {
        ...Input.propTypes
    };

    static defaultProps = {
        size: 'm',
        value: '+7'
    };

    state = {
        countryIso2: 'ru',
        inputFocused: false,
        inputValue: this.props.value,
        selectFocused: false,
        onceOpened: false
    }

    countries;
    input;
    select;
    timeoutId;
    util;

    render(cn, Input, Select) {
        return (
            <div className={ cn() }>
                <Input
                    className={ cn('input') }
                    ref={ (input) => { this.input = input; } }
                    { ...this.props }
                    focused={ this.state.inputFocused || this.state.selectFocused }
                    leftAddons={
                        <Select
                            className={ cn('select') }
                            ref={ (select) => { this.select = select; } }
                            disabled={ this.props.disabled }
                            mode='radio'
                            size={ this.props.size }
                        />
                    }
                    noValidate={ true }
                    type='tel'
                />
            </div>
        );
    }

    loadUtil() {
        return import(/* webpackChunkName: "libphonenumber" */ 'libphonenumber-js/bundle/libphonenumber-js.min')
            .then((util) => { this.util = util; })
            .catch(error => `An error occurred while loading libphonenumber-js:\n${error}`);
    }
}

export default IntlPhoneInput;
