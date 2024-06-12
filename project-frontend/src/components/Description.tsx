import { Config } from '../types/configTypes';
import { LangCode } from '../types/languageTypes';

import { Link } from './CustomLink';

interface Props {
    config: Config;
}
const Description = ({ config }: Props) => {
    return config.language.code === LangCode.FI ? (
        <>
            Tämä on{' '}
            <Link to='https://fullstackopen.com/' blank={true}>
                Full Stack Open
            </Link>{' '}
            -kurssin harjoitustyönä kehitetty verkkokauppa-alusta.
        </>
    ) : (
        <>
            This is an e-commerce platform developed as a project work for the{' '}
            <a href='https://fullstackopen.com/' target='_blank' className='u'>
                Full Stack Open
            </a>{' '}
            course.
        </>
    );
};

export default Description;
