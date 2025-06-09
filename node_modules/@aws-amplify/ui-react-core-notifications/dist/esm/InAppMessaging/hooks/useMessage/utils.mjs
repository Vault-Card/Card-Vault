import { ConsoleLogger } from 'aws-amplify/utils';

const logger = new ConsoleLogger('InAppMessaging');
const positions = {
    BOTTOM_BANNER: 'bottom',
    MIDDLE_BANNER: 'middle',
    TOP_BANNER: 'top',
};
const getPositionProp = (layout) => positions[layout];
const getActionHandler = (actionParams, onMessageAction, onActionCallback) => ({
    onAction() {
        try {
            onMessageAction(actionParams);
        }
        catch (e) {
            logger.error(`Message action failure: ${e}`);
        }
        finally {
            onActionCallback();
        }
    },
});
const getButtonProps = ({ action, url, ...baseButtonProps }, onMessageAction, onActionCallback) => ({
    ...baseButtonProps,
    ...getActionHandler({ action, url }, onMessageAction, onActionCallback),
});
const getContentProps = (content, onMessageAction, onActionCallback) => {
    const props = {};
    if (!content) {
        return props;
    }
    const { primaryButton, secondaryButton, ...restContent } = content;
    if (primaryButton) {
        props.primaryButton = getButtonProps(primaryButton, onMessageAction, onActionCallback);
    }
    if (secondaryButton) {
        props.secondaryButton = getButtonProps(secondaryButton, onMessageAction, onActionCallback);
    }
    return { ...props, ...restContent };
};

export { getActionHandler, getContentProps, getPositionProp };
