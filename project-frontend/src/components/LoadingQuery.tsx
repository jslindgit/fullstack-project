import { Config } from '../types/configTypes';
import { ContentID } from '../content';

import { contentToText } from '../types/languageFunctions';

import Loading from './Loading';

interface Props {
    query: { isLoading: boolean };
    config: Config;
}

const LoadingQuery = ({ query, config }: Props) => {
    return (
        <Loading
            config={config}
            text={contentToText(query.isLoading ? ContentID.miscLoading : ContentID.errorSomethingWentWrong, config)}
            isError={!query.isLoading}
        />
    );
};

export default LoadingQuery;
