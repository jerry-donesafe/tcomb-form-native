// native datepicker view ---

import React from 'react';
import PropTypes from 'prop-types'
import { requireNativeComponent, ViewPropTypes, View, Text } from 'react-native';

const datePickerIface = {
  name: 'DatePickerView',
  propTypes: {
    selectedDate: PropTypes.object,
    ...ViewPropTypes // include the default view properties
  },
};

const RCTDatePicker = requireNativeComponent('RCTDatePicker', datePickerIface, {
  nativeOnly: { onSelectionChange: true }
});

const timePickerIface = {
  name: 'TimePickerView',
  propTypes: {
    selectedDate: PropTypes.object,
    ...ViewPropTypes // include the default view properties
  },
};

const RCTTimePicker = requireNativeComponent('RCTTimePicker', timePickerIface, {
  nativeOnly: { onSelectionChange: true }
});

// ---

// tcom-form-native windows datepicker template

function datepicker(locals) {
  if (locals.hidden) {
    return null;
  }

  const stylesheet = locals.stylesheet;
  let formGroupStyle = stylesheet.formGroup.normal;
  let controlLabelStyle = stylesheet.controlLabel.normal;
  let datepickerStyle = stylesheet.datepicker.normal;
  let helpBlockStyle = stylesheet.helpBlock.normal;
  let errorBlockStyle = stylesheet.errorBlock;
  let dateValueStyle = stylesheet.dateValue.normal;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    datepickerStyle = stylesheet.datepicker.error;
    helpBlockStyle = stylesheet.helpBlock.error;
    dateValueStyle = stylesheet.dateValue.error;
  }

  // Setup the picker mode
  let datePickerMode = 'date';
  if (locals.mode === 'date' || locals.mode === 'datetime') {
    datePickerMode = locals.mode;
  }

  /**
   * Check config locals for Windows datepicker.
   * ``locals.config.format``: Date format function
   */
  let formattedValue = String(locals.value);
  if (locals.config) {
    if (locals.config.format) {
      formattedValue = locals.config.format(locals.value);
    }
  }

  const label = locals.label ? <Text style={controlLabelStyle}>{locals.label}</Text> : null;
  const help = locals.help ? <Text style={helpBlockStyle}>{locals.help}</Text> : null;
  const error = locals.hasError && locals.error ? <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>{locals.error}</Text> : null;

  const _onDateSelectionChange = (event: Event) => {
    locals.onChange(new Date(event.nativeEvent.date))
  }

  const _onTimeSelectionChange = (event: Event) => {
    let timeParts = event.nativeEvent.time.split(':')

    locals.value.setHours(timeParts[0])
    locals.value.setMinutes(timeParts[1])
    locals.value.setSeconds(timeParts[2])

    locals.onChange(new Date(locals.value))
  }

  return (
    <View style={formGroupStyle}>
      <View>
        {label}
        {
          locals.mode === 'datetime' ? 
          (
            <View>
              <RCTDatePicker selectedDate={locals.value} onSelectionChange={_onDateSelectionChange} />
              <RCTTimePicker selectedDate={locals.value} onSelectionChange={_onTimeSelectionChange} />
            </View>
          ): null
        }
        {
          locals.mode === 'date' ? <RCTDatePicker selectedDate={locals.value} onSelectionChange={_onDateSelectionChange} /> : null
        }
      </View>
      {help}
      {error}
    </View>
  );
}

module.exports = datepicker;
