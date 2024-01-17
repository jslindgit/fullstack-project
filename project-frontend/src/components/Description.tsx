import { Config } from '../types/configTypes';
import { LangCode } from '../types/languageTypes';

interface Props {
    config: Config;
}
const Description = ({ config }: Props) => {
    return config.language.code === LangCode.FI ? (
        <>
            Tämä on{' '}
            <a href='https://fullstackopen.com/' target='_blank' className='u'>
                Full Stack Open
            </a>{' '}
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
