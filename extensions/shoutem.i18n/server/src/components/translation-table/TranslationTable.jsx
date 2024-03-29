import React from 'react';
import { Col, ControlLabel, Row } from 'react-bootstrap';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { isBusy, isInitialized } from '@shoutem/redux-io';
import { DEFAULT_LOCALE } from '../../const';
import TranslationRow from '../translation-row';
import './style.scss';

function flattenShortcuts(shortcuts) {
  return _.reduce(
    shortcuts,
    (result, shortcut) => {
      result.push({
        id: shortcut.id,
        key: shortcut.key,
        title: shortcut.title,
      });

      if (!_.isEmpty(shortcut.children)) {
        const childShortcuts = flattenShortcuts(shortcut.children);
        return _.concat(result, childShortcuts);
      }

      return result;
    },
    [],
  );
}

export default function TranslationTable({
  shortcuts,
  translations,
  translateTo,
  onChange,
}) {
  if (!translateTo) {
    return null;
  }

  const isLoading = !isInitialized(shortcuts) || isBusy(shortcuts);
  const flattenedShortcuts = flattenShortcuts(shortcuts);
  const translatedShortcuts = _.map(flattenedShortcuts, shortcut => ({
    ...shortcut,
    translation: _.get(
      translations,
      `${shortcut.key}.${translateTo.value}`,
      '',
    ),
  }));

  return (
    <LoaderContainer
      isLoading={isLoading}
      className="translate-table__container"
    >
      <Row>
        <Col xs={7} className="translate-table__padding">
          <ControlLabel>{DEFAULT_LOCALE.label}</ControlLabel>
        </Col>
        <Col xs={5} className="translate-table__no-padding">
          <ControlLabel>{translateTo.title}</ControlLabel>
        </Col>
      </Row>
      {_.map(translatedShortcuts, shortcut => (
        <TranslationRow
          key={shortcut.id}
          shortcut={shortcut}
          translateTo={translateTo}
          onTranslationChanged={onChange}
        />
      ))}
    </LoaderContainer>
  );
}

TranslationTable.propTypes = {
  translateTo: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  shortcuts: PropTypes.array,
  translations: PropTypes.array,
};

TranslationTable.defaultProps = {
  shortcuts: [],
  translations: [],
};
