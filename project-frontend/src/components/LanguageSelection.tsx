import { useDispatch, useSelector } from 'react-redux';

import { Language } from '../types/languageTypes';
import { RootState } from '../reducers/rootReducer';

import { setLanguage } from '../reducers/configReducer';

import { availableLangs } from '../types/languageTypes';

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
        <table>
            <tbody>
                <tr>
                    {availableLangs.map((lang) => (
                        <td key={lang.code} className={'languageSelection' + (isSelected(lang) ? ' languageSelected' : '')} onClick={() => setLang(lang)}>
                            {lang.code}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    );
};

export default LanguageSelection;
