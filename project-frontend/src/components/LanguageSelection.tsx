import { useDispatch, useSelector } from 'react-redux';

import { Language } from '../types/language';
import { RootState } from '../reducers/rootReducer';

import { availableLangs } from '../types/language';
import localstorageHandler from '../util/localstorageHandler';
import { setConfig } from '../reducers/configReducer';

const LanguageSelection = () => {
    const dispatch = useDispatch();
    const configState = useSelector((state: RootState) => state.config);

    const isSelected = (lang: Language) => {
        return configState.language.code === lang.code;
    };

    const setLang = (newLang: Language) => {
        localstorageHandler.setLang(newLang);
        dispatch(setConfig({ ...configState, language: newLang }));
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
