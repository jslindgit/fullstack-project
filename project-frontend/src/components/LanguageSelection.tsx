import { useDispatch, useSelector } from 'react-redux';

import { Language } from '../types/languageTypes';
import { RootState } from '../reducers/rootReducer';

import { setLanguage } from '../reducers/configReducer';

import { availableLanguages } from '../constants';

const LanguageSelection = () => {
    const dispatch = useDispatch();
    const configState = useSelector((state: RootState) => state.config);

    const isSelected = (lang: Language) => {
        return configState.language.code === lang.code;
    };

    const setLang = (newLang: Language) => {
        dispatch(setLanguage(newLang));
    };

    return (
        <>
            <div className='grid-container' data-cols='auto'>
                {availableLanguages.map((lang) => (
                    <div key={lang.code} className={'languageSelection' + (isSelected(lang) ? ' languageSelected' : '')} onClick={() => setLang(lang)}>
                        {lang.code}
                    </div>
                ))}
            </div>
        </>
    );
};

export default LanguageSelection;
