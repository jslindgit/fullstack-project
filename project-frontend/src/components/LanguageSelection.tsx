import { useDispatch, useSelector } from 'react-redux';

import { LangCode, Language } from '../types/language';
import { RootState } from '../reducers/rootReducer';

import { setConfig } from '../reducers/configReducer';

const LanguageSelection = () => {
    const dispatch = useDispatch();
    const configState = useSelector((state: RootState) => state.config);

    const availableLangs: Language[] = [
        {
            code: LangCode.EN,
            name: 'English',
            paytrailValue: 'EN',
        },
        {
            code: LangCode.FI,
            name: 'Suomi',
            paytrailValue: 'FI',
        },
    ];

    const setLang = (newLang: Language) => {
        dispatch(setConfig({ ...configState, language: newLang }));
    };

    return (
        <table>
            <tbody>
                <tr>
                    <td colSpan={availableLangs.length}>{configState.language.name}</td>
                </tr>
                <tr>
                    {availableLangs.map((lang) => (
                        <td key={lang.code}>
                            <a onClick={() => setLang(lang)}>{lang.code}</a>
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    );
};

export default LanguageSelection;
