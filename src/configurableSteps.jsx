import React, { Component } from 'react';
import { Steps } from 'antd';
import get from 'lodash.get';

export default class ConfigurableSteps extends Component {
    state = {
        current: 0,
    };

    reset = () => {
        this.setState({ current: 0 });
    };

    next = async (command, payload) => {
        const { current: stateCurrent } = this.state;
        const response = get(payload, 'value.data', {});

        const current = stateCurrent + 1;
        await this.setState({ current });

        // conditionally show 2nd table depending on which step its coming from

        // disabled delete request on last step
        if (stateCurrent === 4) {
            window[window.sessionStorage?.tabId].shouldChangeBillCycleReset = false;
        }
        if (
            document.querySelector('.bc-confirm-change-table-confirmation') !==
            null
        ) {
            document.querySelector(
                '.bc-confirm-change-table-confirmation'
            ).style.display = 'none';
        }

        // const {dueAmount} = get(payload, 'value.data.dueAmount',)

        if (response.dueAmount !== undefined && response.dueAmount <= 0) {
            await this.setState({ current: 4 });
            if (
                document.querySelector(
                    '.bc-confirm-change-table-confirmation'
                ) !== null
            ) {
                document.querySelector(
                    '.bc-confirm-change-table-confirmation'
                ).style.display = 'block';
            }
            window[window.sessionStorage?.tabId].shouldChangeBillCycleReset = false;
        } else if (response.dueAmount !== undefined && response.dueAmount > 0) {
            window[window.sessionStorage?.tabId]['bc-dueAmount'] = response.dueAmount;
        } else {
            window[window.sessionStorage?.tabId]['change-billing-date-due-amount-0'] = false;
        }
    };

    prev = () => {
        const { current: stateCurrent } = this.state;
        const current = stateCurrent > 0 ? stateCurrent - 1 : 0;
        this.setState({ current });
    };

    componentDidMount = () => {
        const {
            component: { id },
        } = this.props;
        const { properties = { defaultIndex: 0 } } = this.props;
        const { defaultIndex = 0 } = properties;
        window[window.sessionStorage?.tabId][id] = this;
        window[window.sessionStorage?.tabId][`${id}--next`] = this.next;
        window[window.sessionStorage?.tabId][`${id}--prev`] = this.prev;
        window[window.sessionStorage?.tabId][`${id}--reset`] = this.reset;
        this.setState({ current: defaultIndex });
    };

    componentWillUnmount = () => {
        const {
            component: { id },
        } = this.props;
        delete window[window.sessionStorage?.tabId][id];
        delete window[window.sessionStorage?.tabId][`${id}--next`];
        delete window[window.sessionStorage?.tabId][`${id}--prev`];
        delete window[window.sessionStorage?.tabId][`${id}--reset`];
    };

    render() {
        const { current } = this.state;

        const {
            children,
            component: {
                id,
                params: { titles, styles = '', progressDot = true },
            },
        } = this.props;

        // Child components
        const childComponent = React.Children.map(children, (child) => {
            return React.cloneElement(child, {
                parentProps: this.props,
            });
        });

        const steps =
            (childComponent &&
                childComponent.map((child, index) => {
                    return {
                        title: titles[index],
                        content: child,
                    };
                })) ||
            [];

        return (
            <div className={`${id}--steps`}>
                {styles ? (
                    <style dangerouslySetInnerHTML={{ __html: styles }} />
                ) : null}
                <div className="steps-ui">
                    <Steps progressDot={progressDot} current={current}>
                        {steps.map(({ title }) => (
                            <Steps.Step
                                key={title.html ? title.html : title}
                                title={
                                    title.html ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: title.html,
                                            }}
                                        />
                                    ) : (
                                        title
                                    )
                                }
                            />
                        ))}
                    </Steps>
                </div>
                <div className="steps-content">
                    {steps.map((step, index) => {
                        const key = step.title || index;
                        const displayValue =
                            current === index ? 'block' : 'none';
                        return (
                            <div
                                className="step-container"
                                style={{ display: displayValue }}
                                key={key}
                            >
                                {step.content}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
