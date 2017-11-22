/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import React from 'react';

import Input from '../input/input';
import Select from '../select/select';

import cn from '../cn';
import performance from '../performance';

/**
 * Компонент ввода международного телефона по маске.
 *
 */
@cn('intl-phone-input')
@performance()
class IntlPhoneInput extends React.Component {
    static defaultProps = {
        size: 'm',
        value: '+7'
    };

    state = {
        countryIso2: 'ru',
        inputFocused: false,
        selectFocused: false,
        onceOpened: false
    }

    input;
    select;
    util;

    render(cn) {
        const options = [
            { value: '01', text: 'ИП Фридман М.М.' },
            { value: '02', text: 'ООО «Виктори»' },
            { value: '03', text: 'ФГУП НПП ВНИИЭМ' }
        ];

        return (
            <div className={ cn() }>
                <Input
                    className={ cn('input') }
                />
                <Select
                    className={ cn('select') }
                    options={ options }
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
