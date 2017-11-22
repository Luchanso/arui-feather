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
    util;

    render(cn) {
        return (
            <div className={ cn() }>
                <Input />
                <Select />
            </div>
        );
    }
}

export default IntlPhoneInput;
