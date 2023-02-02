"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _lodash = _interopRequireDefault(require("lodash.get"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
class ConfigurableSteps extends _react.Component {
  constructor() {
    return super(...arguments), this.state = {
      current: 0
    }, this.reset = () => {
      this.setState({
        current: 0
      });
    }, this.next = async (command, payload) => {
      const {
        current: stateCurrent
      } = this.state;
      const response = (0, _lodash.default)(payload, 'value.data', {});
      const current = stateCurrent + 1;
      await this.setState({
        current
      });

      // conditionally show 2nd table depending on which step its coming from

      // disabled delete request on last step
      if (stateCurrent === 4) {
        window[window.sessionStorage?.tabId].shouldChangeBillCycleReset = false;
      }
      if (document.querySelector('.bc-confirm-change-table-confirmation') !== null) {
        document.querySelector('.bc-confirm-change-table-confirmation').style.display = 'none';
      }

      // const {dueAmount} = get(payload, 'value.data.dueAmount',)

      if (response.dueAmount !== undefined && response.dueAmount <= 0) {
        await this.setState({
          current: 4
        });
        if (document.querySelector('.bc-confirm-change-table-confirmation') !== null) {
          document.querySelector('.bc-confirm-change-table-confirmation').style.display = 'block';
        }
        window[window.sessionStorage?.tabId].shouldChangeBillCycleReset = false;
      } else if (response.dueAmount !== undefined && response.dueAmount > 0) {
        window[window.sessionStorage?.tabId]['bc-dueAmount'] = response.dueAmount;
      } else {
        window[window.sessionStorage?.tabId]['change-billing-date-due-amount-0'] = false;
      }
    }, this.prev = () => {
      const {
        current: stateCurrent
      } = this.state;
      const current = stateCurrent > 0 ? stateCurrent - 1 : 0;
      this.setState({
        current
      });
    }, this.componentDidMount = () => {
      const {
        component: {
          id
        }
      } = this.props;
      const {
        properties = {
          defaultIndex: 0
        }
      } = this.props;
      const {
        defaultIndex = 0
      } = properties;
      window[window.sessionStorage?.tabId][id] = this;
      window[window.sessionStorage?.tabId][`${id}--next`] = this.next;
      window[window.sessionStorage?.tabId][`${id}--prev`] = this.prev;
      window[window.sessionStorage?.tabId][`${id}--reset`] = this.reset;
      this.setState({
        current: defaultIndex
      });
    }, this.componentWillUnmount = () => {
      const {
        component: {
          id
        }
      } = this.props;
      delete window[window.sessionStorage?.tabId][id];
      delete window[window.sessionStorage?.tabId][`${id}--next`];
      delete window[window.sessionStorage?.tabId][`${id}--prev`];
      delete window[window.sessionStorage?.tabId][`${id}--reset`];
    }, this;
  }
  render() {
    const {
      current
    } = this.state;
    const {
      children,
      component: {
        id,
        params: {
          titles,
          styles = '',
          progressDot = true
        }
      }
    } = this.props;

    // Child components
    const childComponent = _react.default.Children.map(children, child => {
      return /*#__PURE__*/_react.default.cloneElement(child, {
        parentProps: this.props
      });
    });
    const steps = childComponent && childComponent.map((child, index) => {
      return {
        title: titles[index],
        content: child
      };
    }) || [];
    return /*#__PURE__*/_react.default.createElement("div", {
      className: `${id}--steps`
    }, styles ? /*#__PURE__*/_react.default.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: styles
      }
    }) : null, /*#__PURE__*/_react.default.createElement("div", {
      className: "steps-ui"
    }, /*#__PURE__*/_react.default.createElement(_antd.Steps, {
      progressDot: progressDot,
      current: current
    }, steps.map(_ref => {
      let {
        title
      } = _ref;
      return /*#__PURE__*/_react.default.createElement(_antd.Steps.Step, {
        key: title.html ? title.html : title,
        title: title.html ? /*#__PURE__*/_react.default.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: title.html
          }
        }) : title
      });
    }))), /*#__PURE__*/_react.default.createElement("div", {
      className: "steps-content"
    }, steps.map((step, index) => {
      const key = step.title || index;
      const displayValue = current === index ? 'block' : 'none';
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "step-container",
        style: {
          display: displayValue
        },
        key: key
      }, step.content);
    })));
  }
}
exports.default = ConfigurableSteps;
module.exports = exports.default;