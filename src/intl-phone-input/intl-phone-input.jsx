/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { autobind } from 'core-decorators';
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
                            options={ this.getOptions(cn) }
                            popupSecondaryOffset={ this.getSelectPopupOffset() }
                            size={ this.props.size }
                            onClick={ this.handleSelectClick }
                        />
                    }
                    noValidate={ true }
                    type='tel'
                    value={ this.getValue() }
                    onChange={ this.handleInputChange }
                />
            </div>
        );
    }

    @autobind
    handleSelectClick() {
        // Set focus to input on select closing by it's button toggle
        if (this.state.selectFocused) {
            this.input.focus();
            this.input.setSelectionRange(-1);
        }
    }

    @autobind
    handleInputChange(value) {
        this.setState({
            inputValue: value.length === 1 && value !== '+' ? `+${value}` : value
        }, this.setCountry);
    }

    @autobind
    getOptions(cn) {
        return [];
    }

    getSelectPopupOffset() {
        switch (this.props.size) {
            case 's': return -22;
            case 'm': return -28;
            case 'l': return -33;
            case 'xl': return -38;
        }

        return 0;
    }

    getValue() {
        // Use value from state not props, cause of some formatting steps in component
        // Sync props.value with state.inputValue in componentWillUpdate
        return this.state.inputValue;
    }

    loadUtil() {
        return import(/* webpackChunkName: "libphonenumber" */ 'libphonenumber-js/bundle/libphonenumber-js.min')
            .then((util) => { this.util = util; })
            .catch(error => `An error occurred while loading libphonenumber-js:\n${error}`);
    }

    setCountry() {
        let inputValue = this.getValue().replace(/ /g, '');

        this.countries.forEach((country) => {
            if (new RegExp(`^\\+${country.dialCode}`).test(inputValue)) {
                // Handle countries with priority field
                if (country.priority !== undefined) {
                    // Check max dial code length to allow country change
                    // For countries with identical dial codes or North American Numbering Plan (NANP)
                    if (inputValue.length < MAX_DIAL_CODE_LENGTH) {
                        // Handle country change with input change & set highest by priority
                        if (this.state.countryIso2 !== country.iso2 && country.priority === 0) {
                            this.setValue(country.iso2, inputValue);
                        }
                    // Otherwise don't change already selected country, just set value
                    } else if (this.state.countryIso2 === country.iso2) {
                        this.setValue(country.iso2, inputValue);
                    }
                // Handle all other countries
                } else {
                    this.setValue(country.iso2, inputValue);
                }
            }
        });
    }

    setValue(countryIso2, inputValue) {
        let resultValue = this.util
            ? new this.util.asYouType(countryIso2.toUpperCase()).input(inputValue) // eslint-disable-line new-cap
            : inputValue;

        this.setState({
            inputValue: resultValue,
            countryIso2
        });
    }
    //
    // /**
    //  * Возвращает ссылку на HTMLElement инпута.
    //  *
    //  * @public
    //  * @returns {HTMLInputElement}
    //  */
    // getControl() {
    //     return this.input.getControl();
    // }
    //
    // /**
    //  * Устанавливает фокус на поле ввода.
    //  *
    //  * @public
    //  */
    // focus() {
    //     this.input.focus();
    // }
    //
    // /**
    //  * Убирает фокус с поля ввода.
    //  *
    //  * @public
    //  */
    // blur() {
    //     this.input.blur();
    // }
    //
    // /**
    //  * Скроллит страницу до поля ввода.
    //  *
    //  * @public
    //  */
    // scrollTo() {
    //     this.input.scrollTo();
    // }
}

export default IntlPhoneInput;
