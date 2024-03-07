import { Config } from '../types/configTypes';
import { ContentID } from '../content';

import { contentToText } from '../types/languageFunctions';

interface Props {
    config: Config;
    text?: string | null;
}
const Loading = ({ config, text = null }: Props) => <div className='loading'>{text != null ? text : contentToText(ContentID.miscLoading, config)}</div>;

export default Loading;
