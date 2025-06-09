import { ConsoleLogger } from 'aws-amplify/utils';
import { isString } from '@aws-amplify/ui';

const logger = new ConsoleLogger('InAppMessaging');
const handleMessageAction = ({ action, handleMessageLinkAction, url, }) => {
    logger.info(`Handle action: ${action}`);
    if (action === 'LINK' || action === 'DEEP_LINK') {
        if (!isString(url)) {
            logger.warn(`url must be of type string. Received: ${url}`);
            return;
        }
        handleMessageLinkAction(url);
    }
};

export { handleMessageAction as default };
