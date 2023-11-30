import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { User } from '../../types/types';

import { pageWidth } from '../../constants';
import { contentToText } from '../../types/languageFunctions';
import userService from '../../services/userService';

import BackButton from '../BackButton';
import UserBasicInfo from '../UserBasicInfo';
import UserContactInfo from '../UserContactInfo';
import UserOrderHistory from '../UserOrderHistory';

const AdminUserInfo = () => {
    const config = useSelector((state: RootState) => state.config);

    const [fetched, setFetched] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const id = Number(useParams().id);

    useEffect(() => {
        setFetched(true);
        const fetch = async () => {
            const fetchedUser = await userService.getById(id);
            if (fetchedUser) {
                setUser(fetchedUser);
            }
        };

        fetch();
    }, [id]);

    if (!user) {
        return <>{contentToText(ContentID.menuLogin, config)}</>;
    }

    if (!user) {
        return <div className='semiBold sizeLarge'>{fetched ? 'Something went wrong :(' : 'Loading...'}</div>;
    }

    return (
        <>
            <table align='center' width={pageWidth} className='valignTop'>
                <tbody>
                    <tr>
                        <td className='pageHeader'>{contentToText(ContentID.adminUserInfoHeader, config)}</td>
                        <td className='alignRight'>
                            <BackButton type='button' />
                        </td>
                    </tr>
                </tbody>
            </table>
            <UserBasicInfo config={config} user={user} width={pageWidth} />
            <br />
            <br />
            <UserContactInfo config={config} user={user} width={pageWidth} />
            <br />
            <br />
            <UserOrderHistory config={config} user={user} width={pageWidth} />
            <br />
            <br />
            <table align='center' width={pageWidth} className='infoBox'>
                <tbody>
                    <tr>
                        <td>
                            {user.disabled ? (
                                <button type='button'>
                                    {contentToText(ContentID.buttonEnable, config)} {contentToText(ContentID.menuAccount, config)}
                                </button>
                            ) : (
                                <button type='button' className='red'>
                                    {contentToText(ContentID.buttonDisable, config)} {contentToText(ContentID.menuAccount, config)}
                                </button>
                            )}
                            &emsp; &emsp;
                            <button type='button' className='red'>
                                {contentToText(ContentID.buttonRemove, config)} {contentToText(ContentID.menuAccount, config)}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td>
                            <BackButton type='button' />
                        </td>
                    </tr>
                </tbody>
            </table>
            <br />
        </>
    );
};

export default AdminUserInfo;
