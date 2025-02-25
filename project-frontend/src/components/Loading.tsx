import { Config } from '../types/configTypes';
import { ContentID } from '../content';

import { contentToText } from '../types/languageFunctions';

interface Props {
    config: Config;
    text?: string | null;
    isError?: boolean;
}
const Loading = ({ config, text = null, isError = false }: Props) => (
    <div className='loading'>
        {!isError && (
            <>
                <div className='loadingSpinner'></div>
                <div className='loadingSpinner2'></div>
            </>
        )}
        <div className='loadingText'>{text != null ? text : contentToText(ContentID.miscLoading, config)}</div>
    </div>
);

export default Loading;
