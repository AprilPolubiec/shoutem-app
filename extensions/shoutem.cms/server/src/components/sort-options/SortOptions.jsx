import React, { PureComponent } from 'react';
import { MenuItem } from 'react-bootstrap';
import autoBindReact from 'auto-bind/react';
import classNames from 'classnames';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Dropdown, FontIcon, IconLabel } from '@shoutem/react-web-ui';
import { SORT_OPTIONS } from '../../const';
import LOCALIZATION from './localization';
import './style.scss';

const UNSUPPORTED_FORMATS = [
  'array',
  'object',
  'multi-line',
  'attachment',
  'html',
  'location',
  'uri',
  'entity-reference',
  'entity-reference-array',
];

export function getAlwaysAvailableSortFormats() {
  return [
    { name: SORT_OPTIONS.MANUAL, title: i18next.t(LOCALIZATION.SORT_MANUALLY) },
    {
      name: SORT_OPTIONS.CREATED_TIME,
      title: i18next.t(LOCALIZATION.SORT_CREATED_TIME),
    },
    {
      name: SORT_OPTIONS.UPDATED_TIME,
      title: i18next.t(LOCALIZATION.SORT_UPDATED_TIME),
    },
  ];
}

const resolveDisplayOrderIcon = currentOrder =>
  currentOrder === 'ascending' ? 'order-ascending' : 'order-descending';

export default class SortOptions extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      currentField: null,
      currentOrder: null,
      displayFields: [],
    };
  }

  UNSAFE_componentWillMount() {
    const { schema, sortOptions } = this.props;

    this.calculateDisplayProperties(schema, sortOptions);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { schema, sortOptions } = nextProps;

    this.calculateDisplayProperties(schema, sortOptions);
  }

  handleFieldChange(field) {
    const { onSortOptionsChange } = this.props;
    const { currentOrder } = this.state;

    this.setState({ currentField: field });

    onSortOptionsChange({
      sortField: field,
      sortOrder: currentOrder,
    });
  }

  handleOrderingChange(order) {
    const { onSortOptionsChange } = this.props;
    const { currentField } = this.state;

    this.setState({ currentOrder: order });

    onSortOptionsChange({
      sortField: currentField.name,
      sortOrder: order,
    });
  }

  calculateDisplayProperties(schema, sortOptions) {
    const properties = _.get(schema, 'properties');
    if (_.isEmpty(properties)) {
      return;
    }

    const fields = _.map(properties, (field, name) => ({
      ...field,
      name,
    }));

    const schemaDisplayFields = _.filter(
      fields,
      property => !_.includes(UNSUPPORTED_FORMATS, property.format),
    );

    const displayFields = [
      ...schemaDisplayFields,
      ...getAlwaysAvailableSortFormats(),
    ];

    // resolve field and order or set defaults
    const field = _.get(sortOptions, 'field', 'name');
    const order = _.get(sortOptions, 'order', 'ascending');

    const currentField = _.find(displayFields, { name: field });

    this.setState({
      displayFields,
      currentField,
      currentOrder: order,
    });
  }

  render() {
    const {
      className,
      sortFieldOptionsDisabled,
      sortOrderOptionsDisabled,
    } = this.props;
    const { currentField, currentOrder, displayFields } = this.state;

    const classes = classNames('sort-options', className);

    const displayOrder = _.upperFirst(currentOrder);
    const displayFieldTitle = _.get(currentField, 'title');
    const displayFieldLabel = displayFieldTitle
      ? i18next.t(LOCALIZATION.SORT_BY, { displayFieldTitle })
      : i18next.t(LOCALIZATION.SELECT_SORT_FIELD);

    return (
      <div className={classes}>
        <Dropdown
          className="sort-options__field-selector"
          disabled={sortFieldOptionsDisabled}
          dropup={false}
          onSelect={this.handleFieldChange}
        >
          <Dropdown.Toggle>{displayFieldLabel}</Dropdown.Toggle>
          <Dropdown.Menu className="sort-options__field-menu">
            {displayFieldTitle && <MenuItem>{displayFieldTitle}</MenuItem>}
            {displayFieldTitle && <MenuItem divider />}
            {displayFields.map(field => (
              <MenuItem eventKey={field.name} key={field.name}>
                {field.title}
              </MenuItem>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown
          className="sort-options__order-selector"
          disabled={sortOrderOptionsDisabled}
          onSelect={this.handleOrderingChange}
        >
          <Dropdown.Toggle>
            <FontIcon
              name={resolveDisplayOrderIcon(currentOrder)}
              size="24px"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem>
              <IconLabel
                className="sort-options__order-icon"
                iconName={resolveDisplayOrderIcon(currentOrder)}
                size="24px"
              />
              {displayOrder}
            </MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="ascending">
              <IconLabel iconName="order-ascending" size="24px">
                {i18next.t(LOCALIZATION.ORDER_ASCENDING)}
              </IconLabel>
            </MenuItem>
            <MenuItem eventKey="descending">
              <IconLabel iconName="order-descending" size="24px">
                {i18next.t(LOCALIZATION.ORDER_DESCENDING)}
              </IconLabel>
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

SortOptions.propTypes = {
  schema: PropTypes.object.isRequired,
  sortOptions: PropTypes.object.isRequired,
  onSortOptionsChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  sortFieldOptionsDisabled: PropTypes.bool,
  sortOrderOptionsDisabled: PropTypes.bool,
};

SortOptions.defaultProps = {
  className: '',
  sortFieldOptionsDisabled: false,
  sortOrderOptionsDisabled: false,
};
